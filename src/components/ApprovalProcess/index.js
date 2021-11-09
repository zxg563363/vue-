/**
 * Created by lixiansky on 2021/9/7
 */
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';
export default {
  name: 'ApprovalProcess',
  mixins: [request, variables],
  data() {
    return {
      approvalRules: {
        agree: [
          {required: true, message: '请选择审批', trigger: 'change'},
        ],
        remark: [
          {required: true, message: '请填写意见', trigger: 'blur'}
        ]
      },
      approval: {
        agree: true,
        remark: '',
      },
    }
  },
  mounted() {},
  methods: {
    processApproval(){
      isFunction(this.processFun) && (this.dataLoading = true, this.requestProcess(this.processFun(this.approval)).then(res=>{
        if(res.data){
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          });
          return true;
        }
        throw new Error('审批操作失败！');
      })).finally(()=>{
        this.dataLoading = false;
      });
    },
    openApproval(params){
      this.dialogVisible = true;
      this.approval = assign(this.approval,params);
    },
    closeApproval(){
      this.dialogVisible = false;
    }
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    processFun: {
      type: Function,
      required: true,
    }
  }
}
