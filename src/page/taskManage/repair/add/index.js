/**
 * Created by lixiansky on 2021/7/6
 */
import DeviceListDialog from '@/components/DeviceListDialog/DeviceListDialog';
import { saveRepair, editRepair } from '../../../../axios/taskManage/repair'
import VueCookies from 'vue-cookies'
import Task from "../../index";
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import assign from 'lodash/assign';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
export default {
  name: '',
  data() {
    return {
      pageTitle:'',
      typeName:'',
      instance: new Task(),
      ruleForm:{
        planType: '',
        name:'',
        describe:'',
        // formType:'',
        repeatType:'',
        timeList:[{value:'',key: 'key_0'}],
        repeatScope:[],
        teamId: '',
        teamName: '',
        // 业务项
        forms:[
          {
            "formId" : "",
            "formName": "",
            equipments:[],
          }
        ],
      },
      rules:{
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
        ],
        planType: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        repeatType: [
          { required: true, message: '请选择循视周期', trigger: 'change' }
        ],
        teamId: [
          { required: true, message: '请选择班组', trigger: 'change' }
        ],
      },
      pickerOptions: {  //日期禁止选择今天之后的
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e7;
        },
      },
      showEndTime:false,
      isDisabled:false,
      isUpdate: ((name)=>{
        return name === 'task_plan_update';
      })(this.$router.currentRoute.name),


      vm: {
        // 班组信息
        workTeam: [],
        dialogVisible: false,
        chooseEquipments: [],
        // 设备数据
        equipmentData: [],
        // 转换map
        equipmentMapData:{},

        // 当前添加设备的索引
        currentEquipmentIndex: 0,

        // current的equipments
        currentEquipments: [],
        currentEquipmentValues: [],
        extensionForms: [],
        // planId
        planId: this.$route.params.id,
      }
    }
  },
  components: {
    DeviceListDialog
  },
  mounted() {
    this.isUpdate ? (this.getRepairInfo(),this.pageTitle = '编辑任务计划') : (this.pageTitle = '新增任务计划');

    // 获取班组信息
    this.instance.getWorkTeam().then(res => {
      this.vm.workTeam = res.data;
    }).catch(error => {
      this.$message.error((error.message || (error.status + ' ' + error.statusText)));
    });

    this.instance.getExtensionForm().then(res => {
      this.vm.extensionForms = res.data;
    }).catch(error => {
      this.$message.error((error.message || (error.status + ' ' + error.statusText)));
    });
  },
  methods: {
    buildTask(formName) {
      //点击保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm);
          if(this.ruleForm.timeList.length <= 0){
            this.$message({
              message: '请添加时间点',
              type: 'warning'
            });
            return false;
          }

          let repeatTimes = [];
          for(var i = 0; i < this.ruleForm.timeList.length; i++) {
            repeatTimes.push(this.ruleForm.timeList[i].value)
          }
          repeatTimes = this.sortKey(repeatTimes).reverse();
          let repeatScope = isArray(this.ruleForm.repeatScope) ? this.ruleForm.repeatScope.sort(function(a, b){return a - b}) : [];
          let params = assign(this.ruleForm,{
            repeatScope:repeatScope.join(','),
            repeatTimes:repeatTimes.join(','),
          });
          // 班组名称
          params['teamName'] = ((workTeam)=>{
            let _team = find(workTeam,{id: this.ruleForm.teamId});
            return _team ? _team['name'] : '';
          })(this.vm.workTeam);
          // console.log(params);
          if(!this.isUpdate) {
            saveRepair(params).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              setTimeout(()=> {
                this.$router.push({name: 'task_plan_list'});
              },800);
            }).catch(error => {
              // console.log(error);
              error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
            });

          } else {
            editRepair(params,this.vm.planId).then(res => {
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              setTimeout(()=> {
                this.$router.push({name: 'task_plan_list'});
              },800);

            }).catch(error => {
              error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
            });
          }

        } else {
          return false;
        }
      })
    },
    reList(value) {
      //每次切换巡视周期，清空之前选项值
      this.ruleForm.repeatScope = [];
      if(this.vm.isUpdate) {
        let repairData = VueCookies.get('repairData');
        if(this.ruleForm.repeatType == 2 || this.ruleForm.repeatType == 3) {
          if(value == repairData.repeatType) {
            //转数字
            let list = repairData.repeatScope.split(',');
            for(var i = 0; i < list.length; i++) {
              this.ruleForm.repeatScope.push(list[i] * 1)
            }
          }
        }
      }
    },
    addTimeList() {
      //新增时间点
      this.ruleForm.timeList.push({
        value: '',
        key: Date.now()
      });
    },
    removeTimeList(item,index) {
      //删除时间点
      this.ruleForm.timeList.splice(index, 1);
    },
    resetForm(formName) {
      //重置
      this.$refs[formName].resetFields();
    },
    //获取 修改数据详情
    getRepairInfo() {
      this.instance.getPlanDataById(this.vm.planId).then(res => {
        // console.log(res.data);
        let repairData = res.data;
        assign(repairData,{
          repeatType: repairData.repeatType + '',
          timeList:((timesArr)=>{
            return reduce(timesArr,(results, value,i)=>{
              results.push({
                key: 'key_'+i,
                value
              });
              return results;
            },[]);
          })(repairData.repeatTimes.split(',')),
          repeatScope: ((list)=>{
            return reduce(list,(results, value)=>{
              results.push(value * 1);
              return results;
            },[]);
          })(repairData.repeatScope.split(',')),
        });
        this.ruleForm = repairData;
      }).catch(error => {
        // console.log(error);
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });

    },
    sortKey(array) {
      //数组 时间类型排序
      return array.sort(function(a, b) {
        var x = a;
        var y = b;
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },

    goBack() {
      this.$router.push({
        name: 'task_plan_list'
      });
    },

    // 添加业务表单和设备
    addFormAndEquipment(){
      this.ruleForm.forms.push({
        "formId" : "",
        "formName": "",
        equipments:[],
      });
    },

    // 添加设备
    addEquipmentToPlan(index){
      this.vm.currentEquipmentIndex = index;
      this.vm.dialogVisible = true;
    },
    // 确认
    confirmAddEquipment(selectedEquipment){
      let _tempMap = reduce(this.ruleForm.forms[this.vm.currentEquipmentIndex].equipments,(results,value)=>{
        results[value['equipmentId']] = value;
        return results;
      },{});

      forEach(selectedEquipment,(value,i)=>{
        !_tempMap[value['id']] && (
          this.ruleForm.forms[this.vm.currentEquipmentIndex].equipments.push({
            equipmentId: value['id'],
            "equipmentName" : value.equipName,
            "equipmentCode" : value.equipCode,
            "equipmentTypeId" : value.typeId,
            "equipmentTypeName" : value.typeName,
            "spaceId": value['spaceId'],
            "spaceName": value['spaceName'],
        }));
      });

      this.vm.dialogVisible = false;
    },

    removeEquipment(index,i){
      this.ruleForm.forms[index].equipments.splice(i,1);
    },
  },
}
