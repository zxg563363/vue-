/**
 * Created by lixiansky on 2021/8/23
 */
import {axiosInstance} from '@/axios/request';
import {request} from '@/components/mixins/request';
import PullScroll from '@/components/PullScroll/PullScroll';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
export default {
  name: "MessageBox",
  mixins: [request],
  data() {
    return {
      dialogVisible: false,
      activeName: 'task',
      icon: {
        "gongdan": require('./icon/gongdan.png'),
        "xitong": require('./icon/xitong.png'),
        "renwu": require('./icon/renwu.png'),
      },
      vm: {
        notice:{
          collector_alarm: {
            key: 'collector_alarm',
            init: false,
            command: ()=>{
              this.vm.notice.collector_alarm.init = true;
            }
          },
          task: {
            key: 'plan_task',
            init: true,
            command: ()=>{
              this.vm.notice.task.init = true;
            }
          },
          order: {
            key: 'ops_repair',
            init: false,
            command: ()=>{
              this.vm.notice.order.init = true;
            }
          },
          power_switch: {
            key: 'power_switch',
            init: false,
            command: ()=>{
              this.vm.notice.power_switch.init = true;
            }
          },
        },

      },
      notice: {
        ops_repair:{
          unread: 0,
          total: 0,
        },
        plan_task:{
          unread: 0,
          total: 0,
        },
        collector_alarm:{
          unread: 0,
          total: 0,
        },
        power_switch:{
          unread: 0,
          total: 0,
        },
      },
    }
  },
  components: {PullScroll},
  mounted() {
  },
  destroyed(){

  },
  methods: {
    processParams(_params){
      return assign({
        typeCode : 'ops_repair',
        unread: false,
        page: 1,
        rows: 10,
      },_params);
    },

    // 获取通知概要信息
    getNoticeData(){
      this.requestProcess(axiosInstance({
        url: 'api-global/common/notice/fetch/all',
        method: 'get',
      })).then(res => {
        this.notice = res.data;
        // console.log(res);
      });
    },
    getOrderNotice (page) {
      // console.log(page);
      return axiosInstance({
        url: 'api-global/common/notice/search',
        method: 'get',
        params: (()=>{
          return this.processParams({typeCode: 'ops_repair',page: page.num});
        })()
      });
    },
    getTaskNotice(page){
      return axiosInstance({
        url: 'api-global/common/notice/search',
        method: 'get',
        params: (()=>{
          return this.processParams({typeCode: 'plan_task',page: page.num});
        })()
      });
    },

    getCollectorAlarmNotice(page){
      return axiosInstance({
        url: 'api-global/common/notice/search',
        method: 'get',
        params: (()=>{
          return this.processParams({typeCode: 'collector_alarm',page: page.num});
        })()
      });
    },

    getPowerSwitchNotice(page){
      return axiosInstance({
        url: 'api-global/common/notice/search',
        method: 'get',
        params: (()=>{
          return this.processParams({typeCode: 'power_switch',page: page.num});
        })(),
      });
    },

    // 设置消息已读
    readNotice(item, typeCode){
      let {uuId} = item;
      return this.requestProcess(axiosInstance({
        url: 'api-global/common/notice/read',
        method: 'get',
        params: {uuId, typeCode},
      })).then(res => {
        if(res.data){
          item['unread'] = false;
          return this.getNoticeData();
        }
        return true;
      })
    },

    // 跳转详情
    jumpToNextStep(item,typeCode,params){
      this.readNotice(item,typeCode).then(res=>{
        typeCode === 'ops_repair' && (this.$router.push({name: 'workOrder_detail',params}));
        typeCode === 'power_switch' && (this.$router.push({name: 'power_switch_detail',params}));
      });
    },
    // 打开弹出框
    openDialog(){
      this.dialogVisible = true;
    },

    // 关闭弹出框
    closeDialog(){
      this.dialogVisible = false;
    },

    // 设置已读
    readMark(){
      this.$confirm('确定要全部标记信息为读？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.requestProcess(axiosInstance({
          url: 'api-global/common/notice/read/all',
          method: 'get',
          params: {typeCode: this.vm.notice[this.activeName]['key']},
        }))
      }).then(res => {
        res.data && (this.$refs[this.activeName+'_scroll'].triggerDownScroll());
      }).finally(()=>{
        this.getNoticeData();
      });
    },
    // 清空消息
    cleanNotice(){
      this.$confirm('确定要清空信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.requestProcess(axiosInstance({
          url: 'api-global/common/notice/clear',
          method: 'get',
          params: {typeCode: this.vm.notice[this.activeName]['key']},
        }))
      }).then(res => {
        res.data && (this.$refs[this.activeName+'_scroll'].triggerDownScroll());
      }).finally(()=>{
        this.getNoticeData();
      });
    },
  },

}
