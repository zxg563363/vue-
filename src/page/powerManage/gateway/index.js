/**
 * Created by lixiansky on 2021/7/21
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Power from '../index';
import last from 'lodash/last';
import assign from 'lodash/assign';
import find from 'lodash/find';
import {request} from '@/components/mixins/request';
import VueCookies from 'vue-cookies';
import layer from "layui-layer";
import reduce from 'lodash/reduce';
export default {
  mixins: [request],
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new Power(),
      vm:{
        filterText: '',
        treeData:[],
        treeLoading: false,
        currentNode: {},
        realData: [],
        realDataLoading: false,
        // 采集点模型
        model:[],
        modelMap:{},
        realDataTimer: null,
        // 网关数据
        addTransmitsDialogVisible: false,
        transmitForm: {},
        transmitRules: {
          transmitName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          transmitCode: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        addCollectorDialogVisible: false,
        collectorForm: {},
        collectorRules: {
          collectorCode: [
            {required: true, message: '请输入编码', trigger: 'blur'},
          ],
          collectorName: [
            {required: true, message: '请输入编码', trigger: 'blur'},
          ],
          spaceId: [
            {required: true, message: '请选择空间', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请输入总线地址', trigger: 'blur'},
          ],
          // equipmentId: [
          //   {required: true, message: '请关联设备', trigger: 'blur'},
          // ],
          externalTypeId: [
            {required: true, message: '请选择数据模型', trigger: 'blur'},
          ],
        },

        // 空间数据
        spaceData: [],
        spaceDataLoading: false,
        // 设备数据
        deviceData: [],
        // 模型数据
        modelsData: [],

        //
        gatewayRuleDialogVisible: false,
        gatewayRuleTableData: [],
        gatewayRuleDataLoading: false,
        currentGateway: {},
      }
    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '网关管理'}
    ]);

    this.getTreeData();

    this.initEventListener();
  },
  // 销毁后
  destroyed(){
    clearInterval(this.vm.realDataTimer);
  },
  methods: {
    getTreeData(){
      this.vm.treeLoading = true;
      this.instance.getCommunicationGateway(1,999).then(results=>{
        this.vm.treeData = results;
        results.length > 0 && (this.handleNodeClick(results[0]));
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.treeLoading = false;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleNodeClick(data) {
      this.vm.currentNode = data;
      // 获取数据模型
      this.vm.realDataLoading = true;
      this.vm.gatewayRuleDialogVisible = false;
      this.instance.getCollectorsByGatewayId(1,999,{
        conditionConfig:{
          "logic": 1,
          "conditions": [
            {
              "paramsKey": "transmitId",
              "opCode": "EQUAL",
              "targetCode": data['id'],
            }
          ]
        }
      }).then((results)=>{
        this.tableData = results;
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.realDataLoading = false;
      });
    },

    // 弹框打开后
    collectorDialogOpened(){
      this.vm.spaceDataLoading = true;
      this.instance.getSpaceData().then(res=>{
        this.vm.spaceData = res;
        return this.instance.getModelsData();
      }).then(res=>{
        this.vm.modelsData = res;
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.spaceDataLoading = false;
      });


    },

    // 通过空间获取设备数据
    getDeviceBySpaceId(spaceIds){
      this.vm.spaceDataLoading = true;
      this.instance.getDeviceBySpaceId(1,999,{
        conditionConfig:{
          "logic": 1,
          "conditions": [
            {
              "paramsKey": "spaceId",
              "opCode": "EQUAL",
              "targetCode": last(spaceIds),
            }
          ]
        }
      }).then(res=>{
        this.vm.deviceData = res;
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.spaceDataLoading = false;
      });
    },

    resetForm(formName) {
      this.vm.addTransmitsDialogVisible = false;
      this.vm.addCollectorDialogVisible = false;
      this.$refs[formName] && (this.$refs[formName].resetFields());
    },
    editGateway(item){
      this.vm.collectorForm = item;
      this.getDeviceBySpaceId([item['spaceId']]);
      this.vm.addCollectorDialogVisible = true;
    },
    // 添加终端
    addCollector(formName){
      // console.log(this.$refs['cascader'].getCheckedNodes());
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.vm.spaceDataLoading = true;
          let _space = this.$refs['cascader'].getCheckedNodes()[0];
          let _device = find(this.vm.deviceData,{id: this.vm.collectorForm.equipmentId});
          let _model = find(this.vm.modelsData,{id: this.vm.collectorForm.externalTypeId});
          let _postData = assign(this.vm.collectorForm,{
            spaceName: _space['label'],
            equipmentCode: _device ? _device['equipCode']: '',
            equipmentName: _device ? _device['equipName']: '',
            externalTypeCode: _model['externalTypeCode'],
            externalTypeName: _model['externalTypeName'],
            transmitId: this.vm.currentNode['id'],
          });
          !_device && (delete _postData.equipmentCode, delete _postData.equipmentName);
          _postData['spaceId'] = last(this.vm.collectorForm.spaceId);
          let _reqPromise = this.vm.collectorForm.id ? this.instance.updateCollectors(_postData) : this.instance.saveCollectors(_postData);
          _reqPromise.then(res=>{
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.vm.addCollectorDialogVisible = false;
            // 刷新
            this.handleNodeClick(this.vm.currentNode);
          }).catch(error => {
            this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
          }).finally(()=>{
            this.vm.spaceDataLoading = false;
          });
        }
      });
    },
    removeGateway(item){
      this.instance.removeCollectors(item['id']).then(res=>{
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        // 刷新
        this.handleNodeClick(this.vm.currentNode);
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      });
    },

    // 添加网关
    addTransmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.vm.spaceDataLoading = true;
            let _reqPromise = this.vm.transmitForm.id ? this.instance.updateTransmit(this.vm.transmitForm) : this.instance.saveTransmit(this.vm.transmitForm);
            _reqPromise.then(res=>{
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.vm.addTransmitsDialogVisible = false;
              // 刷新
              this.getTreeData();
            }).catch(error => {
              this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
            }).finally(()=>{
              this.vm.spaceDataLoading = false;
            });
          }
      });
    },

    // 删除网关
    removeTransmit(item){
      this.instance.removeTransmit(item['id']).then(res=>{
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        // 刷新
        this.getTreeData();
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3000});
      });
    },

    // 规则设置
    ruleSetting(row){
      this.vm.currentGateway = row;
      this.vm.gatewayRuleDataLoading = true;
      this.vm.gatewayRuleDialogVisible = true;
      this.requestProcess(this.instance.getRuleListByCollectorId(row['id'])).then(res=>{
        this.vm.gatewayRuleTableData = res.data;
      }).finally(()=>{
        this.vm.gatewayRuleDataLoading = false;
      });
    },

    // 添加规则
    addRuleModal(){
      layer.open({
        type: 2,
        title: ['添加报警规则', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        // 120.133.52.105:8009
        content: ['http://120.133.52.105:8009/alarm_rule_midway.html?token='+VueCookies.get('access_token')+'&collectorId='+this.vm.currentGateway['id'], 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          // this.init(1,10);
        },
      });
    },

    updateRuleModal(rule){
      layer.open({
        type: 2,
        title: ['编辑报警规则', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        // 120.133.52.105:8009
        content: ['http://120.133.52.105:8009/alarm_rule_midway.html?token='+VueCookies.get('access_token')+
        '&collectorId='+this.vm.currentGateway['id']+'&uuId='+rule['id'], 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          // this.init(1,10);
        },
      });
    },

    // 删除规则
    removeRule(rule){
      this.requestProcess(this.instance.removeRule(rule['id'])).then(res=>{
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
      }).finally(()=>{
        this.ruleSetting(this.vm.currentGateway);
      });
    },
    // 重载规则
    reloadRule(row){
      this.requestProcess(this.instance.reloadRule(row['id'])).then(res=>{
        this.$message({
          type: 'success',
          message: '操作成功！'
        });
      });
    },
    // 添加监听
    initEventListener(){
      window.addEventListener("message",(event)=> {
        // console.log(event);
        if(event.data['type'] === 'extends' && event.data['success']){
          layer.closeAll('iframe');
          // 刷新数据
          this.ruleSetting(this.vm.currentGateway);
        }
      });
    },
  },
  filters: {

  }
}
