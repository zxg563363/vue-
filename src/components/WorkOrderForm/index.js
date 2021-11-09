/**
 * Created by lixiansky on 2021/7/26
 */
import {axiosInstance} from "@/axios/request";
export default {
  name: "WorkOrderForm",
  data() {
    return {
      dataLoading: false,
      addData: {
        extension: {
          formFields:{
            list: []
          }
        }
      }, //详情
    }
  },
  components: {},
  mounted() {
    this.detailWork(this.uuid);
  },
  methods: {

    // 获取工单详细
    detailWork(uuId){
      this.dataLoading = true;
      return axiosInstance({
        url:'/api-global/ops/repair/view/'+uuId,
        method:'get',
      }).then(data=>{
        let results = data.data;
        if(results.status && results.status === 200){
          return results;
        }
        // console.log(results);
        throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
      }).then(res => {
        this.addData = res.data;
        (this.addData.extension.formFields && this.addData.extension.formFields['list']) ? (this.addData.extension.formFields.list.forEach((item,i)=>{
          item['form_Value'] = this.addData.extension.formData[item.model];
        })) : (this.addData.extension.formFields = {list:[],config:{}});
        this.$props.completed(this.addData);
      }).catch(error => {
        this.$props.completed({});
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.dataLoading = false;
      });
    },
  },
  filters: {

  },
  props: {
    uuid: { // 父组件传来的id
      type: String,
      required: true,
    },
    // 完成后的回调
    completed: {
      type: Function,
      required: true,
    }
  }
}
