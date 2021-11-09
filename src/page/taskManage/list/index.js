/**
 * Created by lixiansky on 2021/7/6
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Task from '../index';
import find from 'lodash/find';
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new Task(),
      vm: {
        queryObj:{
          name: '',
        }
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '任务计划'}
    ]);

    // 获取任务计划列表
    this.getTableData(1,this.pageSizes[0]);
  },
  methods: {
    getTableData(pageNumber, pageSize, params) {
      this.instance.getData(pageNumber, pageSize, params).then((res) => {
        this.tableData = res.dataList;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
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
      this.getTableData(1,this.pageData['pageSize'],{name: this.vm.queryObj.name});
    },
    onReset(){
      this.vm.queryObj = {name: ''};
      this.getTableData(1,this.pageData['pageSize']);
    },
    removePlan(plan){
      this.instance.deletePlanDataById(plan['id']).then((res) => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
        this.getTableData(1,this.pageData['pageSize'],{name: this.vm.queryObj.name});
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 更新计划状态
    updatePlanValidity(plan){
      this.instance.updatePlanValidity(plan.id,(plan.validity===0 ? 1 : 0)).then((res) => {
        this.$message({
          message: '状态更新成功！',
          type: 'success'
        });
        this.getTableData(1,this.pageData['pageSize'],{name: this.vm.queryObj.name});
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    }
  },

  filters: {
    repeatTypeFormatter: (value)=> {
      let _map = {
        "1": "每天",
        "2": "每周",
        "3": "每月",
        "4": "每年",
      };
      return value ? _map[value]: '-';
    },
  }
}
