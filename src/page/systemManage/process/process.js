import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import DepToPerson from '../../../components/depToPerson/depToPerson';
import {processList, processAdd, processGet, processEdit, processDel,} from '../../../axios/systemManage/process';
import {getCatalogs} from '../../../axios/systemManage/service';
import {roleDatas} from '../../../axios/systemManage/station';
import {depGet} from '../../../axios/systemManage/department';
import moment from 'moment';
import {request} from '@/components/mixins/request';
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
export default {
  mixins: [request],
  data() {
    return {
      processDivs: [],
      breadcrumbList: [],
      catalogOption: [],
      catalogProps: {
        children: 'children',
        label: 'catalogName',
        value: 'id',
        expandTrigger: 'hover'
      },
      roleOption: [],
      roleProps: {
        children: 'child',
        label: 'name',
        value: 'uuId',
        multiple: true,
        checkStrictly: false
      },
      depOption: [],
      depProps: {
        children: 'children',
        label: 'departName',
        value: 'departId',
        multiple: true,
        checkStrictly: true
      },
      activeNum: 0,
      basicForm: {
        workflowName: '',
        filterId: '',
        publicStatus: '1',
        locking: '1',
        description: '',
        workflowDefine: {
          nodes:[
            {
              nodeName: '',
              countersignMode: '0',
              nodeId: 'node_' + moment().unix() * 1000,
              routeRule: {
                type: '',
                people: [],
                role: [],
                roleIds: [],
                dept: {type: null, data: []}
              }
            },
          ]
        },
      },
      basicRules: {
        workflowName: [
          {required: true, message: '请输入流程审批名称', trigger: 'blur'},
        ],
        // filterId: [
        //     { required: true, message: '请选择所属服务目录', trigger: 'change' }
        // ],
      },
      tableData: [],
      opens: false,
      peopleIndex: 0,
      currentPage: 1,
      total: 0,
      rows: 999,
      page: 1,
      vm: {
        dataLoading: false,
        processDataLoading: false,
      }
    }
  },
  mounted() {
    // console.log(moment().unix() * 1000);
    this.toBreadcrumb();  //面包屑
    this.getProcessList();
    this.getCatalogsList();  //服务目录列表
    this.getRoleDatas();  //角色列表
    this.getDepGet();  //部门列表
    // let str = '{"nodes":[{"nodeName":"节点名1","nodeId":"node_1621838501096","countersignMode":"1","routeRule":{"type":"people","people":[{"id":"6","name":"jyy","userName":"大鸡腿"}],"role":[],"dep":{"type":"1","data":[]}},"people":[{"id":"6","name":"jyy","userName":"大鸡腿"}],"role":[],"dep":{"type":"-1","data":[]}}],"workflowId":39}';
    // console.log(JSON.parse(str));
  },
  methods: {
    // 获取工作流程基本信息
    getProcessList() {
      let params = {
        "conditionConfig": {
          "logic": 1,
          "conditions": [
            {
              "opCode": "EQUAL",
              "paramsKey": "",
              "targetCode": ""
            }
          ]
        },
        "rows": this.rows,
        "page": this.page,
        "sidx": "",
        "sord": "asc"
      };
      this.vm.processDataLoading = true;
      this.requestProcess(processList(params)).then(res => {
        this.processDivs = res.data;
        this.total = res.page.recordCount;
        // 获取
        res.data.length > 0 && this.getWorkflow(res.data[0].workflowId);
      }).finally(()=>{
        this.vm.processDataLoading = false;
      })
    },
    getWorkflow(workflowId) {
      //根据id查询详细内容
      this.vm.dataLoading = true;
      this.requestProcess(processGet(workflowId)).then(res => {
        let {workflowName, publicStatus, filterId, description, locking} = res.data;
        this.basicForm = assign({workflowId, workflowName, publicStatus, filterId, description, locking},{
          workflowDefine: ((workflowDefine)=>{
            try {
              let _workflowDefine = JSON.parse(workflowDefine);
              // 兼容dept
              _workflowDefine.nodes = reduce(_workflowDefine.nodes,(results,value)=>{
                !value['routeRule']['dept'] && (value['routeRule']['dept'] = value['routeRule']['dep']);
                results.push(value);
                return results;
              },[]);
              return isArray(_workflowDefine) ? {nodes: _workflowDefine} : _workflowDefine;
            }catch (e) {
              return {nodes:[]};
            }
          })(res.data.workflowDefine),
          publicStatus: publicStatus.toString(),
          locking: locking.toString(),
        });
      }).finally(()=>{
        this.vm.dataLoading = false;
      })
    },
    getCatalogsList() {
      //服务目录列表
      this.requestProcess(getCatalogs()).then(res => {
        this.catalogOption = res.data;
      });
    },
    getRoleDatas() {
      //角色列表
      this.requestProcess(roleDatas()).then(res => {
        this.roleOption = res.dataList;
      });
    },
    getDepGet() {
      //部门列表
      let params = '';
      depGet(params).then(res => {
        this.depOption = res.dataList;
      });
    },
    addNode() {
      // 添加流程节点
      this.basicForm.workflowDefine.nodes.push({
        nodeName: '',
        countersignMode: '1',
        nodeId: 'node_' + moment().unix() * 1000,
        routeRule: {
          type: '',
          people: [],
          role: [],
          roleIds: [],
          dept: {type: null, data: []}
        }
      });
    },
    submitForm(formName) {
      // console.log(this.basicForm.filterId,this.$refs.serviceCascader.getCheckedNodes(true));
      this.$refs[formName].validate().then(()=>{
        (isArray(this.basicForm.filterId)&& this.basicForm.filterId.length > 0) && (
          this.basicForm.filterName = this.$refs.serviceCascader.getCheckedNodes(true)[0]['label'],
            this.basicForm.filterIds = this.basicForm.filterId.join(','),
          this.basicForm.filterId = this.basicForm.filterId[1]
        );
        let _postData =JSON.parse(JSON.stringify(this.basicForm));
        // 处理
        _postData.workflowDefine.nodes = reduce(_postData.workflowDefine.nodes,(results, node)=>{
          node['role'] && (delete node.role);
          node['people'] && (delete node.people);
          node['routeRule'].type === 'role' && (assign(node.routeRule,{
            role: ((nodes)=>{
              return reduce(nodes,(res,value)=>{
                res.push(assign(value.data,{id: value.data['uuId']}));
                return res;
              },[]);
            })(this.$refs.cascader[0].getCheckedNodes(true)),
          }));
          results.push(node);
          return results;
        },[]);
        // console.log(_postData);
        _postData.workflowDefine = JSON.stringify(_postData.workflowDefine);
        return this.requestProcess(this.basicForm.workflowId ? processEdit(_postData) : processAdd(_postData));
      }).then((res => {
        // console.log(res);
        this.$message({
          type: 'success',
          message: '操作成功！'
        });
        res['workflowId'] ? this.getWorkflow(this.workflowId) : this.getProcessList();
      }));
    },
    del(data) {
      //删除
      console.log(data);
      this.$confirm('此操作将删除【' + data.workflowName + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestProcess(processDel(data.workflowId)).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getProcessList();
        })
      });
    },
    clickProcess(item, index) {
      this.activeNum = index;
      this.getWorkflow(item.workflowId);
    },

    creatNew() {
      //点击新建流程
      this.basicForm = {
        workflowName: '',
        filterId: '',
        publicStatus: '1',
        locking: '1',
        description: '',
        workflowDefine: {
          nodes:[
            {
              nodeName: '',
              countersignMode: '0',
              nodeId: 'node_' + moment().unix() * 1000,
              routeRule: {
                type: '',
                people: [],
                role: [],
                roleIds: [],
                dept: {type: null, data: []}
              }
            },
          ]
        },
      };
    },
    openPerson(index) {
      this.peopleIndex = index;  //打开弹窗，明确index去修改哪条数据
      this.tableData = this.basicForm.workflowDefine.nodes[index].routeRule.people;
      this.opens = true;
    },

    removeUser(item, index) {
      item.routeRule.people.splice(index, 1);
    },
    getOpens(data) {
      this.opens = data;
    },
    getPersonParams(data, name) {
      // console.log(data,name,'传过来的保存人员ID');
      this.opens = false;
      this.basicForm.workflowDefine.nodes[this.peopleIndex].routeRule.people = [];
      for (let i = 0; i < data.userIdArr.length; i++) {
        this.basicForm.workflowDefine.nodes[this.peopleIndex].routeRule.people.push({
          id: data.userIdArr[i],
          realName: name.userNameArr[i],
        })
      }
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [
        {path: '/', name: '首页'},
        {name: '系统管理'},
        {name: '流程定制'}
      ]
    }
  },
  components: {
    Breadcrumb,
    DepToPerson
  },
}
