/**
 * Created by lixiansky on 2021/9/24
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Power from '../index';
import {request, variables} from '@/components/mixins/request';
import {datePicker} from '@/components/mixins/common';

export default {
  mixins: [request, variables, datePicker],
  components: {Breadcrumb,},
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
      {name: '指令日志'}
    ]);
    this.getData(1,this.pageSizes[1],{});
  },
  methods: {
    reset(){
      this.params.keyword = '';
      this.$refs['queryForm'].resetFields();
      this.getData(1,this.pageSizes[1],{});
    },
    search(){
      this.getData(1,this.pageData['pageSize'],{
        conditionConfig: {conditions: [], logic: 1},
        params: {keyword: this.params.keyword,}
      });
    },

    getData(pageNumber, pageSize, params){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getPowerCommandData(pageNumber, pageSize, params)).then(res => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    handleSizeChange(pageSize){
      this.getData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      this.getData(pageNumber,this.pageData['pageSize']);
    },
  },
}
