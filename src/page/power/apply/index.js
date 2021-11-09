/**
 * Created by lixiansky on 2021/9/3
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import DepToPerson from '@/components/depToPerson/depToPerson';
import ApprovalProcessNode from '@/components/ApprovalProcessNode/ApprovalProcessNode';
import PowerSwitch from '../index';
import {request, variables} from '@/components/mixins/request';
import {datePicker} from '@/components/mixins/common';
import moment from 'moment';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
import filter from 'lodash/filter';

export default {
    mixins: [request, variables, datePicker],
    components: {Breadcrumb, DepToPerson, ApprovalProcessNode,},
    data() {
        return {
            instance: new PowerSwitch(),
            currentItemId: '0',
            currentUser: (() => {
                try {
                    return JSON.parse(this.$ls.get('userInfo'));
                } catch (e) {
                    return {};
                }
            })(),
            statusData: [
                {
                    value: '全部',
                    id: 0,
                    condition: (userInfo) => {
                        return [];
                    }
                }, {
                    value: '我创建的',
                    status: 'NEW',
                    id: 1,
                    condition: (userInfo) => {
                        return [
                            {
                                opCode: "EQUAL",
                                paramsKey: "createUserId",
                                targetCode: userInfo['id'],
                            }
                        ]
                    }
                }, {
                    value: '我负责的',
                    status: 'WAITING',
                    id: 2,
                    condition: (userInfo) => {
                        return [
                            {
                                opCode: "EQUAL",
                                paramsKey: "receiverId",
                                targetCode: userInfo['id'],
                            }
                        ]
                    }
                }, {
                    value: '我审批的',
                    status: 'DOING',
                    id: 3,
                    condition: (userInfo) => {
                        return {
                            params: {
                                searchType: 'approval'
                            }
                        }
                    }
                }
            ],
            searchData: '',
            vm: {
                powerSwitchDialogVisible: false,
                currentTime: moment().format('HH:mm'),
                applyPower: {
                    specifyTime: moment().format('YYYY-MM-DD HH:mm'),
                    applyType: 0,
                },
                applyRules: {
                    specifyTime: [
                        {required: true, message: '请选择申请时间', trigger: 'blur'},
                    ],
                    equipId: [
                        {required: true, message: '请选择设备', trigger: 'change'},
                    ],
                    containerNo: [
                        {required: true, message: '请输入配电柜号', trigger: 'blur'},
                    ],
                    reason: [
                        {required: true, message: '请输入原因', trigger: 'blur'},
                    ],
                    useWorkflowId: [
                        {required: true, message: '请选择停送电流程', trigger: 'change'},
                    ],
                },
                dataLoading: false,
                equipments: [],
                // 流程定义
                workflowDefine: [],
                // 停送电人
                operatorDialogVisible: false,

                // 送电
                operatorDialogVisible2: false,
                receivers: [],
                flag: '停',
                // 查询
                query: {
                    type: '',
                    typeValue: '',
                    dateType: '',
                    duration: ''
                },
                queryTypeMap: {
                    applyType: {
                        options: [
                            {value: '0', label: '停电'},
                            {value: '1', label: '送电'},
                        ],
                        condition: (value) => {
                            return value ? [{
                                "opCode": "EQUAL",
                                "paramsKey": "applyType",
                                "targetCode": value
                            }] : [];
                        }
                    },
                    status: {
                        options: [
                            {value: 'NEW', label: '审批中'},
                            {value: 'DOING', label: '执行中'},
                            {value: 'OK', label: '已完成'},
                            {value: 'CANCEL', label: '已取消'},
                        ],
                        condition: (value) => {
                            return value ? [{
                                "opCode": "EQUAL",
                                "paramsKey": "status",
                                "targetCode": value
                            }] : [];
                        }
                    },
                    specifyTime: {
                        condition: (value) => {
                            return this.vm.queryTypeMap.installDate(value);
                        }
                    },
                    executeTime: {
                        condition: (value) => {
                            return this.vm.queryTypeMap.installDate(value);
                        }
                    },
                    installDate(value) {
                        return isArray(value) ? [{
                            "opCode": "GTE",
                            "paramsKey": "specifyTime",
                            "targetCode": moment(value[0]).format('YYYY-MM-DD')
                        }, {
                            "opCode": "LTE",
                            "paramsKey": "specifyTime",
                            "targetCode": moment(value[1]).format('YYYY-MM-DD')
                        }] : [];
                    }
                }
            }
        };
    },
    mounted() {
        // 组装面包屑
        this.breadcrumbList = this.instance.installBreadcrumbList([
            {name: '停送电申请'}
        ]);
        this.getPowerSwitchApply(1, this.pageSizes[1], {});
    },

    methods: {
        getPowerSwitchApply(pageNumber, pageSize, params) {
            this.tableDataLoading = true;
            this.requestProcess(this.instance.getPowerSwitchApply(pageNumber, pageSize, params)).then(res => {
                this.tableData = res.data;
                this.pageData = res.page;
            }).finally(() => {
                this.tableDataLoading = false;
            });
        },
        changeStatus(item) {
            this.currentItemId = item.id;
            this.statusData[item.id] && (this.getPowerSwitchApply(1, this.pageSizes[1], this.installQueryParams()));
        },

        handleSizeChange(pageSize) {
            this.getPowerSwitchApply(1, pageSize);
        },

        // currentPage 改变时会触发
        handleCurrentChange(pageNumber) {
            this.getPowerSwitchApply(pageNumber, this.pageData['pageSize']);
        },
        reset() {
            this.searchData = '';
            this.$refs['queryForm'].resetFields();
            this.getPowerSwitchApply(1, this.pageData['pageSize'], this.installQueryParams());
        },
        search() {
            this.getPowerSwitchApply(1, this.pageData['pageSize'], this.installQueryParams());
        },

        // 组装查询条件
        installQueryParams() {
            let _conditions = [];
            let conditionConfig = {
                conditionConfig: {conditions: [], logic: 1},
                params: {keyword: this.searchData,}
            };
            let _temp = this.statusData[this.currentItemId]['condition'](this.currentUser);
            isArray(_temp) ? (_conditions = _temp) : (assign(conditionConfig.params, _temp.params));
            this.vm.query.type && (_conditions = concat(_conditions, this.vm.queryTypeMap[this.vm.query.type].condition(this.vm.query.typeValue)));
            this.vm.query.dateType && (_conditions = concat(_conditions, this.vm.queryTypeMap[this.vm.query.dateType].condition(this.vm.query.duration)));
            conditionConfig.conditionConfig.conditions = _conditions;
            // console.log(conditionConfig);
            return conditionConfig;
        },

        // 弹出框显示的回调
        powerSwitchDialogOpened() {
            this.vm.dataLoading = true;
            this.requestProcess(this.instance.getEquipments(1, 9999, {
                conditionConfig: {
                    conditions: [{
                        opCode: "LIKE",
                        paramsKey: "equipName",
                        targetCode: "",
                    }],
                    logic: 1
                }
            })).then(res => {
                this.vm.equipments = res.data;
            }).finally(() => {
                this.vm.dataLoading = false;
            });
            // 获取流程
            this.getProcess();
        },

        getProcess() {
            this.vm.dataLoading = true;
            return this.requestProcess(this.instance.getWorkflowDefine({page: 1, rows: 999})).then(res => {
                this.vm.workflowDefine = res.data;
            }).finally(() => {
                this.vm.dataLoading = false;
            });
        },
        resetForm(formName) {
            this.vm.powerSwitchDialogVisible = false;
            this.$refs[formName] && (this.$refs[formName].resetFields());
        },
        // 保存申请
        addPowerSwitch(formName) {
            this.$refs[formName].validate().then(() => {
                this.vm.dataLoading = true;
                let _postData = JSON.parse(JSON.stringify(this.vm.applyPower));
                assign(_postData, reduce(this.vm.receivers, (results, item) => {
                    results.receiverId.push(item.receiverId);
                    results.receiverName.push(item.receiverName);
                    return results;
                }, {receiverId: [], receiverName: []}));
                _postData['receiverId'] = _postData['receiverId'].join(',');
                _postData['receiverName'] = _postData['receiverName'].join(',');
                let _device = find(this.vm.equipments, {id: _postData['equipId']});
                _device && (_postData['equipName'] = _device['equipName'], _postData['equipCode'] = _device['equipCode']);
                return this.requestProcess(this.instance.postPowerSwitchApply(_postData));
            }).then(res => {
                res.data && (
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    }), this.search(), this.vm.powerSwitchDialogVisible = false);
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

        // 查看申请
        viewDetail(data) {
            this.$router.push({name: 'power_switch_detail', params: {uuId: data.id}});
        },
        addApply() {
            this.vm.powerSwitchDialogVisible = true;
            this.vm.applyPower = {specifyTime: moment().format('YYYY-MM-DD HH:mm'), applyType: 0};
        },
        // 获取流程审批信息
        getProcessDetail(data, flag, index) {
            this.$set(this.tableData[index], 'isShowProcess', flag);
        },
        // 搜索
        equipmentsFilter(keys){
            filter(vm.equipments,(o)=>{

            });
        },
    },
}
