/**
 * Created by lixiansky on 2021/9/9
 */
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import ShowMore from '../ShowMore/ShowMore';
export default {
  name: 'ApprovalProcessNode',
  mixins: [request, variables],
  components: {ShowMore},
  data() {
    return {
      icons:[
        [
          require('./assets/jujue2x.png'),
          require('./assets/tongguo2x.png'),
        ]
      ],
      operatorData: [],
      currentTab: 'workflow',
    }
  },
  mounted() {
    this.uuid && (this.getWorkflowInstanceOperator(this.uuid));
  },
  methods: {
    // 获取流程实例操作信息
    getWorkflowInstanceOperator(workflowInsId){
      this.tableDataLoading = true;
      this.requestProcess(axiosInstance({
        url:'/api-global/wf/instance/operator',
        method:'get',
        params: {workflowInsId}
      })).then(res=>{
        this.tableData = res.data;
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    // 查询操作历史
    getOperatorHistory(tab){
     if(tab.name!=='approve'){
       return false;
     }
      this.dataLoading = true;
      this.requestProcess(axiosInstance({
        url:'/api-global/wf/instance/operator/history',
        method:'get',
        params: {workflowInsId: this.uuid}
      })).then(res=>{
        this.operatorData = res.data;
      }).finally(()=>{
        this.dataLoading = false;
      });
    },

    // 刷新
    refreshProcess(){
      this.getWorkflowInstanceOperator(this.uuid);
    }
  },
  watch: {
    uuid: {
      handler(newVal, oldVal) {
        (newVal) && (this.getWorkflowInstanceOperator(newVal));
      }
    },
  },
  props: {
    uuid: {
      type: String,
      required: false,
      default: '',
    },
  }
}
