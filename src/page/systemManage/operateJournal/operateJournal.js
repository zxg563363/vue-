import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import System from '../index';
import moment from 'moment';
import reduce from 'lodash/reduce';
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new System(),
      vm: {
        queryObj: {
          keyword: '',
        },
        tableDataLoading: false,

        codeStr: '',
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '操作日志'}
    ]);

    // 获取任务计划列表
    this.getTableData(1,this.pageSizes[0]);
  },
  methods: {
    getTableData(pageNumber, pageSize, params) {
      this.vm.tableDataLoading = true;
      this.instance.getSystemOperation(pageNumber, pageSize, params).then((res) => {
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
      this.getTableData(1,pageSize,{params: this.vm.queryObj});
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize'],{params: this.vm.queryObj});
    },
    onSubmit(){
      this.getTableData(1,this.pageData['pageSize'],{params: this.vm.queryObj});
    },
    onReset(){
      this.vm.queryObj = {keyword: ''};
      this.getTableData(1,this.pageData['pageSize']);
    },
    rowFormatter(row){
      try {
        this.vm.codeStr = Prism.highlight(JSON.parse(row.operationMsg), Prism.languages.json, 'json');
      }catch (e) {
        this.vm.codeStr = Prism.highlight(row.operationMsg, Prism.languages.json, 'json')
      }

    },
  },
  filters: {

  }
}
