/**
 * Created by lixiansky on 2021/7/26
 */
import WorkOrderOperationLog from '@/components/WorkOrderOperationLog/WorkOrderOperationLog';
import WorkOrderProgress from '@/components/WorkOrderProgress/WorkOrderProgress';
import WorkOrderForm from '@/components/WorkOrderForm/WorkOrderForm';
import {axiosInstance} from "@/axios/request";
import reduce from 'lodash/reduce';
import moment from 'moment';
import 'moment/locale/zh-cn';
require('moment-precise-range-plugin');
export default {
  name: "WorkOrderDetail",
  inject:['reload'],
  components: {
    WorkOrderOperationLog,
    WorkOrderProgress,
    WorkOrderForm,
  },
  data() {
    return {
      addData: {
        teams: [],
        extension: {
          formFields:{
            list: []
          }
        }
      }, //详情
      isPerpon:false,//展示人
      // 解决方案
      receiptData: {},
      opens:false,//选择人
      tableData:[],//选择人
      vm: {
        delayLoading: false,
        delayData: {},
      }
    }
  },
  mounted() {

  },
  methods: {
    // 回调方法
    initCompleted(results){
      if(!results){
        this.reload();
        // console.log(this.$router);
        return false;
      }

      this.addData = results;
      //调用props
      this.$props.completed(this.addData);
      this.vm.delayData = results.delayBean || {};
      let _reqPromise = (this.addData.status === 'OK') ? this.getReceipt(this.uuid) : null;
      _reqPromise && (_reqPromise.then(res=>{
        res && (this.receiptData = res.data);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }));
    },

    // 获取工单解决方案
    getReceipt(uuId){
      return axiosInstance({
        url:'/api-global/ops/repair/receipt/'+uuId,
        method:'get',
      }).then(data=>{
        let results = data.data;
        if(results.status && results.status === 200){
          return results;
        }
        throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
      });
    },
    synergicPer(){

    },
  },
  filters: {
    timeComparisonFormatter: (_date,_date2)=> {
      // console.log(_date,_date2);
      // 如果date2为空
      let timeComparison = (date,date2)=>{
        let _temp = {days: '天',hours: '小时','years': '年',months:'月','minutes':'分钟','seconds':'秒'};
        let _diff = moment.preciseDiff(date2, date,true);
        let _str = reduce([{key: 'years'},{key: 'months'},{key: 'days'},{key:'hours'},{key: 'minutes'},{key: 'seconds'}],(results,value)=>{
          _diff[value['key']] >0 && (results.push(_diff[value['key']]+''+_temp[value['key']]));
          return results;
        },[]);
        return {firstDateWasLater: _diff['firstDateWasLater'],timeArr:_str};
      };
      if(!_date2){
        // 判断当前时间是否大于既定时间
        _date2 = moment().isAfter(_date) ? moment().format('YYYY-MM-DD HH:mm:ss') : null;
      }
      if(!_date2){
        return '';
      }
      let {firstDateWasLater, timeArr} = timeComparison(_date,_date2);
      return (!firstDateWasLater ? `<span style="color: #00be04;">【提前${timeArr.join('')}】</span>`: `<span style="color: #FF4D51;">【超时${timeArr.join('')}】</span>`);
    },

    timeComparisonFormatter2: (_date,_date2)=> {
      let timeComparison = (date,date2)=>{
        let _temp = {days: '天',hours: '小时','years': '年',months:'月','minutes':'分钟','seconds':'秒'};
        let _diff = moment.preciseDiff(date2, date,true);
        let _str = reduce([{key: 'years'},{key: 'months'},{key: 'days'},{key:'hours'},{key: 'minutes'},{key: 'seconds'}],(results,value)=>{
          _diff[value['key']] >0 && (results.push(_diff[value['key']]+''+_temp[value['key']]));
          return results;
        },[]);
        return {firstDateWasLater: _diff['firstDateWasLater'],timeArr:_str};
      };
      let {timeArr} = timeComparison(_date,_date2);
      return timeArr.join('');
    }
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
