/**
 * Created by lixiansky on 2021/6/18
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import TaskService from '../index';
import Vue from 'vue';
import {taskService} from '../mixins';
import {datePicker} from '@/components/mixins/common';
export default {
  mixins: [taskService, datePicker],
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10,20,30,40,50,100],
      breadcrumbList: [],
      task: new TaskService(),
      dialogVisible: false,
      dataLoading: false,
      taskDetail: {},
      params: {
        date: '',
        taskType: '',
      }
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.task.installBreadcrumbList([
      {name: '任务列表'}
    ]);

    // 获取任务列表
    this.getTableData('',1,this.pageSizes[0]);
  },
  methods: {
    getTableData(taskId,pageNumber,pageSize,params){
      this.dataLoading = true;
      this.task.getTaskServiceData(taskId,pageNumber,pageSize, params).then((res)=>{
        this.tableData = res.dataList;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.dataLoading = false;
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      console.log(this.pageData);
      this.getTableData('',1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData('',pageNumber,this.pageData['pageSize']);
    },

    // 查看任务
    viewTask(task){
      this.dialogVisible = true;
      this.taskDetail = task;
    },

    // 重试任务
    retryTask(task){
      this.task.retryTaskService(task['id']).then((res)=>{
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 删除任务
    deleteTask(task){
      this.task.deleteTaskService(task['id']).then((res)=>{
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.getTableData('',1,this.pageData['pageSize']);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
    search(){
      this.getTableData('',1,this.pageSizes[0],{
        taskType: this.params.taskType,
      });
    },
    reset(){
      this.params = {
        date: '',
        taskType: '',
      };
      this.getTableData('',1,this.pageSizes[0]);
    }
  },
  components: {
    Breadcrumb,
    'task-type':{
      mixins: [taskService],
      props:{
        status: {
          type: String,
          required: true,
        },
      },
      render(createElement){
        return createElement(Vue.extend({
          template: ((status)=>{
            return `<el-link :underline="false" size="small">${status.label}</el-link>`
          })(this.taskType[this.status]),
        }))
      }
    }
  },
}
