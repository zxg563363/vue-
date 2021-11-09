/**
 * Created by lixiansky on 2021/9/7
 */
import ApprovalProcess from '@/components/ApprovalProcess/ApprovalProcess';
import DepToPerson from '@/components/depToPerson/depToPerson';
import ApprovalProcessNode from '@/components/ApprovalProcessNode/ApprovalProcessNode';
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import moment from "moment";
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import layer from "layui-layer";

export default {
    name: 'PowerSwitchDetail',
    mixins: [request, variables],
    components: {ApprovalProcess, DepToPerson, ApprovalProcessNode},
    data() {
        return {
            isInIframe: (() => {
                return window.self.frameElement && self.frameElement.tagName === "IFRAME";
            })(),
            currentUser: (() => {
                try {
                    return JSON.parse(this.$ls.get('userInfo'));
                } catch (e) {
                    return {};
                }
            })(),
            // 是否可以执行送电
            isGive: false,
            // 是否可以执行停送电操作
            isExecute: false,
            // 是否是操作的交班
            isHandover: false,
            //申请编号
            uuId: (() => {
                return this.$router.history.current.params['uuId'];
            })(),
            icons: [
                require('./assets/tingdian2x.png'),
                require('./assets/gongdian2x.png'),
            ],
            vm: {
                powerSwitchDialogVisible: false,
                currentTime: moment().format('HH:mm'),
                applyPower: {
                    specifyTime: moment().format('YYYY-MM-DD HH:mm'),
                    applyType: 1,
                    receiverId: '',
                },
                applyRules: {
                    specifyTime: [
                        {required: true, message: '请选择申请时间', trigger: 'blur'},
                    ],
                    receiverId: [
                        {required: false, message: '请选择送电人', trigger: 'blur'},
                    ],
                    useWorkflowId: [
                        {required: false, message: '请选择停送电流程', trigger: 'change'},
                    ],
                },
                dataLoading: false,
                equipments: [],
                // 流程定义
                workflowDefine: [],
                // 停送电人
                operatorDialogVisible: false,
                operatorDialogVisible2: false,
                receivers: [],
                // 指定停送电人
                appointStaffDialogVisible: false,
                appointStaffDialogVisible2: false,
                appointStaffForm: {
                    // 停电人
                    receiverId: '',
                    receiverName: '',
                    // 协作人
                    togetherId: '',
                    togetherName: '',
                },
                appointStaffRules: {
                    receiverId: [
                        {required: true, message: '请选择停送电人', trigger: 'blur'},
                    ],
                    togetherId: [
                        {required: true, message: '请选择协作人', trigger: 'blur'},
                    ],
                },
                currentChoosen: '',
            }
        }
    },
    mounted() {
        this.getDetailData(this.uuId);
    },
    methods: {
        // 获取数据
        getDetailData() {
            this.dataLoading = true;
            this.requestProcess(axiosInstance({
                url: '/api-electricity/power_switch',
                method: 'get',
                params: {id: this.uuId},
            })).then(res => {
                this.entityData = res.data;
                // 是否可以执行送电
                this.isGive = ((entityData, currentUser)=>{
                    return (entityData.createUserId === currentUser['id'] || entityData.modifyUserId === currentUser['id']);
                })(this.entityData,this.currentUser);

                this.isExecute = ((entityData, currentUser)=>{
                    return (entityData.receiverId === currentUser['id'] || entityData.togetherId === currentUser['id']);
                })(this.entityData,this.currentUser);
            }).finally(() => {
                this.dataLoading = false;
            });
        },

        // 审核
        approvePowerSwitch(agree) {
            agree = agree === 'true';
            this.$refs['approvalModal'].openApproval({orderId: this.entityData['id'], agree});
        },
        // 审核
        processApproval(data) {
            return this.requestProcess(axiosInstance({
                url: '/api-electricity/power_switch/approval?orderId=' + data['orderId'],
                method: 'post',
                data: data
            })).then(res => {
                res.data && (this.getDetailData(this.uuId), this.$refs['approvalModal'].closeApproval(), this.$refs['approvalProcessNode'].refreshProcess());
                return res;
            });
        },
        // 获取流程
        getProcess() {
            this.vm.dataLoading = true;
            return this.requestProcess(axiosInstance({
                url: '/api-global/wf/define/search',
                method: 'post',
                data: {page: 1, rows: 999}
            })).then(res => {
                this.vm.workflowDefine = res.data;
            }).finally(() => {
                this.vm.dataLoading = false;
            });
        },
        getPersonParams(data, name) {
            this.vm.receivers = reduce(data.userIdArr, (results, value, index) => {
                results.push({
                    receiverId: value,
                    receiverName: name.userNameArr[index],
                    id: value,
                    realName: name.userNameArr[index]
                });
                return results;
            }, []);
            this.vm.operatorDialogVisible = false;
        },
        deleteReceivers(index) {
            this.vm.receivers.splice(index, 1);
        },
        // 填写送电
        inputPowerSwitch(data) {
            this.vm.operatorDialogVisible2 = true;
            this.vm.applyPower = {
                specifyTime: moment().format('YYYY-MM-DD HH:mm'),
                applyType: 1,
            };
        },
        // 重置表单
        resetForm(formName) {
            this.vm.operatorDialogVisible2 = false;
            this.isHandover = false;
            this.vm.appointStaffDialogVisible2 = false;
            this.vm.appointStaffDialogVisible = false;
            this.$refs[formName] && (this.$refs[formName].resetFields());
        },

        // 送电申请
        addPowerSwitch(formName) {
            this.$refs[formName].validate().then(() => {
                this.vm.dataLoading = true;
                let _postData = ((applyPower) => {
                    return assign({pId: this.entityData['id']}, applyPower);
                })(this.vm.applyPower);
                assign(_postData, reduce(this.vm.receivers, (results, item) => {
                    results.receiverId.push(item.receiverId);
                    results.receiverName.push(item.receiverName);
                    return results;
                }, {receiverId: [], receiverName: []}));
                _postData['receiverId'] = _postData['receiverId'].join(',');
                _postData['receiverName'] = _postData['receiverName'].join(',');

                return this.requestProcess(axiosInstance({
                    url: '/api-electricity/power_switch',
                    method: 'post',
                    data: _postData,
                }));
            }).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    // 刷新
                    this.getDetailData();
                    // 隐藏弹出框
                    this.resetForm('applyForm2');
                    return true;
                }
                this.$message({
                    type: 'error',
                    message: '保存送电信息出错！'
                });
            }).finally(() => {
                this.vm.dataLoading = false;
            });
        },

        // 执行停送电
        executePowerSwitch(data) {
            this.$prompt('请输入配电柜号', '提示', {
                distinguishCancelAndClose: true,
                closeOnClickModal: false,
                showClose: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                inputErrorMessage: '配电柜号不能为空'
            }).then(({value}) => {
                return this.requestProcess(axiosInstance({
                    url: '/api-electricity/power_switch/execute',
                    method: 'post',
                    data: assign(pick(data, ['id']), {containerNo: value}),
                }));
            }).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    this.getDetailData(this.uuId);
                    return true;
                }
                this.$message({
                    type: 'error',
                    message: '执行停送电异常！'
                });
            });
        },
        // 查看详细
        viewDetail() {
            layer.open({
                type: 2,
                title: [`查看申请【${this.entityData.pId}】`, 'font-size:14px; font-weight:bold;'],
                shade: 0.3,
                shadeClose: false,
                maxmin: true, // 开启最大化最小化按钮
                area: ['1280px', '660px'],
                offset: 'auto', // 右下角弹出
                anim: 2,
                content: [`/index.html#/extends/power-switch/apply/detail/${this.entityData.pId}`, 'yes'], // iframe的url，no代表不显示滚动条
                end: () => {
                },
            });
        },
        // 指定停送电人
        appointStaff(formName){
            this.$refs[formName].validate().then(() => {
                this.vm.dataLoading = true;
                return this.requestProcess(axiosInstance({
                    url: '/api-electricity/power_switch/assign?orderId='+this.entityData['id'],
                    method: 'post',
                    data: this.vm.appointStaffForm,
                }));
            }).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    this.getDetailData(this.uuId);
                    return true;
                }
                this.$message({
                    type: 'error',
                    message: '指定人员错误！'
                });
            }).finally(()=>{
                this.vm.dataLoading = false;
                this.vm.operatorDialogVisible2 = false;
                this.vm.appointStaffDialogVisible = false;
            });
        },
        appointStaffPersonParams(data, name) {
            this.vm.appointStaffForm = reduce(data.userIdArr, (results, value, index) => {
                results[this.vm.currentChoosen+'Id'] = value;
                results[this.vm.currentChoosen+'Name'] = name.userNameArr[index];
                return results;
            }, assign({},this.vm.appointStaffForm));
            // console.log(this.vm.appointStaffForm);
            if(!this.isHandover){
                this.vm.appointStaffDialogVisible2 = false;
                return false;
            }
            // 交班操作
            (this.isHandover && data.userIdArr.length>0) ? (this.handover({
                receiverId: data.userIdArr[0],
                receiverName: name.userNameArr[0],
            })): (this.$message({
                type: 'warning',
                message: '请选择交班人员！'
            }));
        },
        // 接班
        handover(data={}){
            this.requestProcess(axiosInstance({
                url: '/api-electricity/power_switch/handover?orderId='+this.entityData['id'],
                method: 'post',
                data: data,
            })).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    this.getDetailData(this.uuId);
                    return true;
                }
                this.$message({
                    type: 'error',
                    message: '操作交班错误！'
                });
            }).finally(()=>{
                this.isHandover = false;
                this.vm.appointStaffDialogVisible2 = false;
            });
        },
      // 重新发起审批
      restartExecutePowerSwitch(entityData){

        this.$confirm('是否要重新发起审批？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataLoading = true;
          return this.requestProcess(axiosInstance({
            url: '/api-electricity/power_switch/restart',
            method: 'get',
            params: {
              orderId: entityData['id']
            }
          })).then(res=>{
            if (res.data) {
              this.$message({
                type: 'success',
                message: '操作成功！'
              });

              // 刷新数据
              this.getDetailData(this.uuId);
              // 刷新操作
              this.$refs['approvalProcessNode'].refreshProcess();
              return true;
            }
          })
        }).finally(()=>{
          this.dataLoading = false;
        });
      }
    },
    props: {
        isShowBack: {
            type: Boolean,
            required: false,
            default: false,
        },
    }
}

