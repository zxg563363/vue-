/**
 * Created by lixiansky on 2021/9/17
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {request, variables} from '@/components/mixins/request';
import Power from '../index';
export default {
  mixins: [request, variables],
  components: {
    Breadcrumb
  },
  data() {
    return {
      instance: new Power(),
      params: {
        keyword: '',
      }
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '告警管理'}
    ]);
    this.getAlarmData(1,this.pageSizes[1],{});
  },
  methods: {
    reset(){
      this.params.keyword = '';
      this.$refs['queryForm'].resetFields();
    },
    search(){
      this.getAlarmData(1,this.pageData['pageSize'],{
        conditionConfig: {conditions: [], logic: 1},
        params: {keyword: this.params.keyword,}
      });
    },
    getAlarmData(pageNumber, pageSize, params){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getAlarmData(pageNumber, pageSize, params)).then(res => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    handleSizeChange(pageSize){
      this.getAlarmData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      this.getAlarmData(pageNumber,this.pageData['pageSize']);
    },

    viewDetail(id){

    },
  }
}
