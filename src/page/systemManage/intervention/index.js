/**
 * Created by lixiansky on 2021/8/3
 */
import {request} from '@/components/mixins/request';
import System from "../index";
import PowerSwitchDetailSingle from '@/components/PowerSwitchDetailSingle/PowerSwitchDetailSingle';
import WorkOrderDetail from '@/components/WorkOrderDetail/WorkOrderDetail';
import DepToPerson from '@/components/depToPerson/depToPerson';
import {axiosInstance} from "@/axios/request";
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import assign from 'lodash/assign';
import layer from "layui-layer";
export default {
  inject:['reload'],
  mixins: [request],
  components: {
    WorkOrderDetail,
    DepToPerson,
    PowerSwitchDetailSingle,
  },
  data() {
    return {
      //工单编号
      uuId: (()=>{
        return this.$router.history.current.params['uuId'];
      })(),
      scope: (()=>{
        return this.$router.history.current.query['scope'];
      })(),
      instance: new System(),
      interventionForm: {
        countersignMode: 0,
        nodeId: '',
        userId: '',
        userName: '',
      },
      opens:false,//选择人
      tableData:[],//选择人
      vm: {
        nodes: [],
        nodesDataLoading: false,
        users: [],
      }
    };
  },
  mounted() {
    this.getWorkFlowNodes();
  },
  methods: {
    getOpens(data) {
      this.tableData=[];
      this.opens = data;
    },
    getPersonParams(userIdArr,userNameArr) {
      this.opens = false;
      // console.log(userIdArr,userNameArr);
      this.vm.users = reduce(userIdArr['userIdArr'],(results, value, i)=>{
        (findIndex(this.vm.users,{userId: value}) < 0) && (results.push({userId: value, userName: userNameArr['userNameArr'][i]}));
        return results;
      },this.vm.users);
      // console.log(this.vm.users);
    },
    // 初始化
    init(results){
      // console.log(results);
    },


    handleClose(index){
      this.vm.users.splice(index, 1);
    },

    // 获取流程节点
    getWorkFlowNodes(){
      this.vm.nodesDataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-global/wf/instance/nodes',
        method: 'get',
        params: {workflowInsId: this.uuId},
      })).then(res => {
        this.vm.nodes = res.data;
      }).finally(()=>{
        this.vm.nodesDataLoading = false;
      });
    },

    // 提交保存
    submitIntervention(){
      this.vm.nodesDataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-global/wf/instance/intervene?workflowInsId='+this.uuId,
        method: 'post',
        data: ((interventionForm, users)=>{
          let {userId, userName} = reduce(users,(results, value)=>{
            results['userId'].push(value['userId']);
            results['userName'].push(value['userName']);
            return results;
          },{userId: [],userName: []});
          return assign(interventionForm,{userId: userId.join(','), userName: userName.join(',')});
        })(this.interventionForm,this.vm.users),
      })).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!',
          onClose: ()=>{
            window.parent.postMessage({type: 'extends', success: true, 'msg': '保存成功'}, '*');
          }
        });

      }).finally(()=>{
        this.vm.nodesDataLoading = false;
      });
    }
  }
}
