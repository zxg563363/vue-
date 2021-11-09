/**
 * Created by lixiansky on 2021/7/9
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Task from '../index';
import moment from 'moment';
import reduce from 'lodash/reduce';
import {request, variables} from '@/components/mixins/request';
export default {
  mixins: [request, variables],
  data() {
    return {
      instance: new Task(),
      vm: {
        queryObj: {
          equipmentName: '',
          equipmentCode: '',
        },
        dialogVisible: false,
        task:{},
        taskForm: {list:[],config:{}},
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '任务查询'}
    ]);

    // 获取任务计划列表
    this.getTableData(1,this.pageSizes[1]);
  },
  methods: {
    getTableData(pageNumber, pageSize, params) {
      this.tableDataLoading = true;
      this.requestProcess(this.instance.findTaskJob(pageNumber, pageSize, params)).then((res) => {
        this.tableData = res.dataList;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.tableDataLoading = false;
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
      this.getTableData(1,this.pageData['pageSize'],{
        conditionConfig:{
          conditions: [
            {opCode: "EQUAL", paramsKey: "equipmentCode", targetCode: this.vm.queryObj.equipmentCode},
            {opCode: "LIKE", paramsKey: "equipmentName", targetCode: this.vm.queryObj.equipmentName},
            {opCode: "LIKE", paramsKey: "checkUserName", targetCode: this.vm.queryObj.checkUserName},
          ],
          logic: 1,
        }
      });
    },
    onReset(){
      this.vm.queryObj = {equipmentCode: '',equipmentName: '',checkUserName: ''};
      this.getTableData(1,this.pageData['pageSize']);
    },

    isTaskTimeout(opTime,endTime){
      return opTime ? moment(endTime).isBefore(opTime) : moment(endTime).isBefore() ;
    },

    // 显示任务填报信息
    showTaskFillInModal(task){
      this.vm.task = task;

      this.vm.dialogVisible = true;
      // 查询任务
      this.requestProcess(this.instance.findTaskById(task.id, task.startTime)).then((res) => {
        let _formList = res.data.extension.formFields ? JSON.parse(res.data.extension.formFields) : {list:[],config:{}};
        _formList.list = reduce(_formList.list,(results, value)=>{
          value['options']['disabled'] = true;
          results.push(value);
          return results;
        },[]);
        this.vm.taskForm = _formList;
        this.vm.taskFormData = ((formData)=>{
          try {
            return JSON.parse(formData);
          }catch (e) {
            return {};
          }
        })(res.data.extension.formData);
      }).catch(error => {
        this.vm.taskForm = {list:[],config:{}};
      }).finally(()=>{

      });
    }
  },
  filters: {
    taskTimeoutFormatter: (opTime,endTime)=> {
      // return opTime ? (moment(endTime).isAfter(opTime) ? '-' : '超时') : '';
      return true;
    }
  }
}
