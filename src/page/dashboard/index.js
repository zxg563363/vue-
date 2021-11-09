/**
 * Created by lixiansky on 2021/8/2
 */
import TimesharingLineCharts from '@/components/TimesharingLineCharts/TimesharingLineCharts';
import PieCharts from '@/components/PieCharts/PieCharts';
import {axiosInstance} from '@/axios/request';
import moment from "moment";
import {processChartsData} from '@/components/mixins/processChartsData';
import {request} from '@/components/mixins/request';
import layer from "layui-layer";

export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            user: ((userInfo) => {
                try {
                    return JSON.parse(userInfo);
                } catch (e) {
                    return null;
                }
            })(this.$ls.get('userInfo')),
            vm: {
                timeSharingChartsData: {},
                timeSharingLoading: false,

                // 工单统计
                repairCount: {
                    doing_rate: 0,
                    ok: 0,
                    ok_js_rate: 0,
                    ok_rate: 0,
                    total: 0,
                    undo: 0,
                    undo_rate: 0,
                },
                repairCountLoading: false,
                repairDate: [moment().subtract(30, 'days').toDate(), moment().toDate()],

                // 服务目录统计
                repairCatalog: {},
                catalogCountLoading: false,
                repairCatalogDate: [moment().subtract(30, 'days').toDate(), moment().toDate()],

                // 工单趋势
                repairTrendLoading: false,
                repairTrend: {},
                repairTrendDate: [moment().subtract(30, 'days').toDate(), moment().toDate()],

                // 备件消耗排行
                spareUseCount: [],
                spareUseCountLoading: false,
                spareUseCountDate: [moment().subtract(30, 'days').toDate(), moment().toDate()],

                //
                backlog: {
                    todo: {
                        key: 'todo',
                        label: '待我处理',
                        tableData: [],
                        params: (user) => {
                            return {
                                "conditionConfig": {
                                    "logic": 1,
                                    "conditions": [
                                        {
                                            "opCode": "EQUAL",
                                            "paramsKey": "receiverId",
                                            "targetCode": user['id'] || '',
                                        },
                                        {
                                            "opCode": "IN",
                                            "paramsKey": "status",
                                            "targetCode": 'DOING,WAITING',
                                        }
                                    ]
                                },
                                page: 1,
                                rows: 999,
                                sidx: "createTime",
                                sord: "desc",
                            };
                        },
                    },
                    approved: {
                        key: 'approved',
                        label: '发起审批',
                        tableData: [],
                        params: () => {
                            return {
                                "conditionConfig": {
                                    "logic": 1,
                                    "conditions": []
                                },
                                "params": {
                                    searchType: 'approval',
                                },
                                page: 1,
                                rows: 999,
                                sidx: "createTime",
                                sord: "desc",
                            };
                        },

                    },
                    delay: {
                        key: 'delay',
                        label: '延期审批',
                        tableData: [],
                        params: () => {
                            return {
                                page: 1,
                                rows: 999,
                                sidx: "applyTime",
                                sord: "desc",
                            };
                        },

                    },
                    cooperation: {
                        key: 'cooperation',
                        label: '我协作的',
                        tableData: [],
                        params: () => {
                            return {
                                "conditionConfig": {
                                    "logic": 1,
                                    "conditions": []
                                },
                                "params": {
                                    searchType: 'team',
                                },
                                page: 1,
                                rows: 999,
                                sidx: "createTime",
                                sord: "desc",
                            };
                        },

                    },
                },
                currentBacklog: {key: 'todo'},
                backlogLoading: false,
                backLogTableData: [],
            }
        }
    },
    mixins: [processChartsData, request],
    components: {TimesharingLineCharts, PieCharts,},
    mounted() {
        this.getTimeSharingTask();
        this.getRepairCount();
        this.getRepairTrend();
        this.getCatalogCount();
        this.getSpareUseCount();
        this.handleCommand('todo');
    },
    destroyed() {

    },
    methods: {

        // 获取工单数据
        getOrderData(params) {
            return this.requestProcess(axiosInstance({
                url: '/api-global/ops/repair/search',
                method: 'post',
                data: params,
            }));
        },

        // 延期审核列表
        getDelayOrderData(params) {
            return this.requestProcess(axiosInstance({
                url: '/api-global/ops/repair/delay/search',
                method: 'post',
                data: params,
            }));
        },

        getTimeSharingTask() {
            this.vm.timeSharingLoading = true;

            this.requestProcess(axiosInstance({
                url: '/api-inspection/job/statistics/times',
                method: 'get',
                params: {
                    dateFlag: 'hour',
                    startTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
                    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                },
            })).then(res => {
                this.vm.timeSharingChartsData = this.processTimeSharingData(res.data);
            }).finally(() => {
                this.vm.timeSharingLoading = false;
            });
        },

        // 工单
        getRepairCount() {
            this.vm.repairCountLoading = true;
            this.requestProcess(axiosInstance({
                url: '/api-global/ops/report/repair/count',
                method: 'get',
                params: {
                    start: moment(this.vm.repairDate[0]).format('YYYY-MM-DD'),
                    end: moment(this.vm.repairDate[1]).format('YYYY-MM-DD'),
                },
            })).then(res => {
                this.vm.repairCount = res.data;
            }).finally(() => {
                this.vm.repairCountLoading = false;
            });
        },

        // 服务目录统计
        getCatalogCount() {
            this.vm.catalogCountLoading = true;
            this.requestProcess(axiosInstance({
                url: '/api-global/ops/report/repair/trend/catalog/pie',
                method: 'get',
                params: {
                    start: moment(this.vm.repairCatalogDate[0]).format('YYYY-MM-DD'),
                    end: moment(this.vm.repairCatalogDate[1]).format('YYYY-MM-DD'),
                },
            })).then(res => {
                this.vm.repairCatalog = {
                    datas: res.data['nums'],
                    titles: res.data['catalogs'],
                    name: '服务目录',
                };
            }).finally(() => {
                this.vm.catalogCountLoading = false;
            });
        },

        // 工单趋势
        getRepairTrend() {
            this.vm.repairTrendLoading = true;
            this.requestProcess(axiosInstance({
                url: '/api-global/ops/report/repair/trend/add/line',
                method: 'get',
                params: {
                    start: moment(this.vm.repairTrendDate[0]).format('YYYY-MM-DD'),
                    end: moment(this.vm.repairTrendDate[1]).format('YYYY-MM-DD'),
                },
            })).then(res => {
                this.vm.repairTrend = ((data) => {
                    return {
                        times: data['times'],
                        datas: [data['add'], data['finish']],
                        titles: ['新增工单', '完成工单'],
                    };
                })(res.data);
            }).finally(() => {
                this.vm.repairTrendLoading = false;
            });
        },

        // 备品排行
        getSpareUseCount() {
            this.vm.spareUseCountLoading = true;
            this.requestProcess(axiosInstance({
                url: '/api-global/ops/report/repair/use/spare/count',
                method: 'get',
                params: {
                    start: moment(this.vm.repairTrendDate[0]).format('YYYY-MM-DD'),
                    end: moment(this.vm.repairTrendDate[1]).format('YYYY-MM-DD'),
                },
            })).then(res => {
                console.log(res.data);
                this.vm.spareUseCount = res.data;
            }).finally(() => {
                this.vm.spareUseCountLoading = false;
            });
        },

        // 工单待审批 待处理
        handleCommand(command) {
            if (!this.vm.backlog[command]) {
                return false;
            }

            this.vm.currentBacklog = this.vm.backlog[command];
            this.vm.backlogLoading = true;
            let _promise = command !== 'delay' ? this.getOrderData(this.vm.currentBacklog['params'](this.user)) : this.getDelayOrderData(this.vm.currentBacklog['params'](this.user));

            _promise.then(res => {
                this.vm.backLogTableData = res.data;
            }).finally(() => {
                this.vm.backlogLoading = false;
            });
        },

        // 查看工单详细
        viewOrder(uuId) {
            layer.open({
                type: 2,
                title: [`查看工单【${uuId}】`, 'font-size:14px; font-weight:bold;'],
                shade: 0.3,
                shadeClose: false,
                maxmin: true, // 开启最大化最小化按钮
                area: ['1280px', '660px'],
                offset: 'auto', // 右下角弹出
                anim: 2,
                content: [`/index.html#/extends/workorder/detail/${uuId}`, 'yes'], // iframe的url，no代表不显示滚动条
                end: () => {

                },
            });
        }
    },
}
