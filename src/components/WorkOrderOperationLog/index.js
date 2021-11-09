/**
 * Created by lixiansky on 2021/7/26
 */
import {axiosInstance} from "@/axios/request";
import {common} from '@/components/mixins/common';
import range from 'lodash/range';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
export default {
  name: "WorkOrderOperationLog",
  data() {
    return {
      list: [],
      dataLoading: false,
      pageData: [],
      isExpand: false,
      currentPage: 1,
    }
  },
  components: {},
  mixins: [common],
  mounted() {
    this.getWorkOrderLogs(this.uuid);
  },
  methods: {
    getWorkOrderLogs(uuId){
      this.dataLoading = true;
      return axiosInstance({
        url:'/api-global/ops/repair/record/'+uuId,
        method:'get',
      }).then(data=>{
        let results = data.data;
        if(results.status && results.status === 200){
          return results;
        }
        throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
      }).then(res => {
        // this.list = res.dataList;

        // 组装分页数据
        this.pageData = reduce(range(0,this.totalPage(res.dataList.length,6)),(results, value)=>{
          results[value] = ((page)=>{
            let _arr = [];
            forEach(range(0,6),(_value)=>{
              res.dataList[page*6+_value] && (_arr.push(res.dataList[page*6+_value]));
            });
            return _arr;
          })(value);
          return results;
        },[]);
        this.pageData.length > 0 && (this.list = this.pageData[0]);
        // console.log(this.pageData);
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.dataLoading = false;
      });
    },
    expandContent(){
      this.currentPage++;
      this.isExpand = this.pageData.length === this.currentPage;
      if(this.pageData.length >= this.currentPage){
        this.list = concat(this.list, this.pageData[this.currentPage-1]);
        return true;
      }
      this.currentPage = 1;
      this.list = this.pageData[0];
    },
  },
  filters: {

  },
  props: {
    uuid: { // 父组件传来的id
      type: String,
      required: true,
    },
  }
}
