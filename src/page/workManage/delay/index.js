/**
 * Created by lixiansky on 2021/7/10
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import WorkOrder from '../index';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import layer from "layui-layer";
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new WorkOrder(),
      vm: {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        queryObj:{
          repairOrderId: '',
          disposeStatus: 'all',
          applyTime: '',
        },
        tableDataLoading: false,
        currentUser:(()=>{
          try {
            return JSON.parse(this.$ls.get('userInfo'));
          }catch (e) {
            return {};
          }

        })(),
        disposeStatus:[
          {
            label: '待审核',
            selected: true,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "disposeStatus",
                "targetCode": "0"
              }
            ],
          },
          {
            label: '审核通过',
            selected: false,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "disposeStatus",
                "targetCode": "1"
              }
            ],
          },
          {
            label: '审核未通过',
            selected: false,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "disposeStatus",
                "targetCode": "2"
              }
            ],
          },
          {
            label: '全部',
            selected: false,
            condition: [],
          },
        ],
        currentDelay: {},
        dialogVisible: false,
        delayForm: {
          agree: true,
          remark: '',
        },
        delayLoading: false,
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '延期审核列表'}
    ]);

    // 获取延期申请列表
    this.getTableData(1,this.pageSizes[0]);
  },
  methods: {

    getTableData(pageNumber, pageSize, params) {
      this.vm.tableDataLoading = true;
      this.instance.getDelayData(pageNumber, pageSize, params).then((res) => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.tableDataLoading = false;
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      // console.log(this.pageData);
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },
    onSubmit(){
      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },
    onReset(){
      this.vm.queryObj = {repairOrderId: '',disposeStatus: 'all'};
      this.getTableData(1,this.pageData['pageSize']);
    },

    // 组装查询条件
    installCondition(){
      let _conditions = [];

      // 组装状态查询条件
      forEach(this.vm.disposeStatus,(status)=>{
        status['selected'] && (_conditions = concat(_conditions, status.condition));
      });

      let _map = {
        'all': [],
        'reviewed': [
          {
            "opCode": "EQUAL",
            "paramsKey": "applyUserId",
            "targetCode": this.vm.currentUser.id
          }],
        'audited': [{
          "opCode": "EQUAL",
          "paramsKey": "applyUserId",
          "targetCode": this.vm.currentUser.id
        }],
      };
      _conditions = concat(_conditions, _map[this.vm.queryObj.disposeStatus]);

      if(this.vm.queryObj.repairOrderId){
        _conditions.push({
          "opCode": "LIKE",
          "paramsKey": "repairOrderId",
          "targetCode": this.vm.queryObj.repairOrderId,
        });
      }

      return {
        "conditionConfig": {
          "logic": 1,
          "conditions": _conditions ? _conditions : [],
        }
      };
    },
    // 改变状态
    changeStatus(item, index){
      // console.log(item);
      forEach(this.vm.disposeStatus,(status)=>{
        status['selected'] =  false;
      });
      item['selected'] = true;

      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },
    disposeStatusChange(){
      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },

    approved(item){
      this.vm.dialogVisible = true;
      this.vm.currentDelay = item;
    },
    submitDelay(){
      this.vm.delayLoading = true;
      this.instance.postDelayApproval(this.vm.delayForm,this.vm.currentDelay['repairOrderId']).then((results)=>{
        if(results.data){
          this.vm.dialogVisible = false;
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success',
            onClose:(message)=>{
              this.onSubmit();
            }
          });
          return true;
        }
        throw new Error(results.msg);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.delayLoading = false;
      });
    },

    // 跳转
    navigationOrder(uuId){
      layer.open({
        type: 2,
        title: [`查看工单【${uuId}】`, 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: [`/index.html#/extends/workorder/detail/${uuId}`, 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {

        },
      });
    }
  }
}
