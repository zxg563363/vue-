import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import layer from "layui-layer";
import {
    getDevice,
    deleteDevice,
    changeDevice,
    getdetail,
    geterweima,
    getqian,
    getExport
} from "@/axios/deviceManage/deviceList";
import {
    getType,
    detailType,
} from "@/axios/deviceManage/deviceType";
import {
    getScape
} from "@/axios/deviceManage/deviceScape";
import {request} from '@/components/mixins/request';
import findIndex from 'lodash/findIndex';
import reduce from 'lodash/reduce';
import Device from "../index";

export default {
    mixins: [request],
    data() {
        return {
            instance: new Device(),
            listData: [],
            breadcrumbList: [],
            pageSize: 1,
            totalData: 0,
            tableData: [],
            detailData: {},
            multipleSelection: [],
            typeData: [],
            scapeData: [],
            detailId: '',
            itemId: '',
            itemData: {},
            typeProps: {
                label: 'typeName'
            },
            spaceProps: {
                label: 'spaceName'
            },
            optionEquip: [{
                value: '设备名称',
                id: 'equipName'
            }, {
                value: '设备编号',
                id: 'equipCode'
            }, {
                value: '设备型号',
                id: 'model'
            },],
            optionVender: [],
            optionMotor: [],
            searchData: {
                searchId: '',
                equipName: '',
                typeId: '',
                // vender:''
                spaceId: ''
            },
            vm: {
                showQRCodeId: '',

                // 打印列表
                printList: [],

                // 二维码下载弹出框
                qrCodeDialogVisible: false,
                exportDataLoading: false,
                tableDataLoading: false,
            }
        }
    },
    mounted() {
        this.toBreadcrumb();
        this.getMess();
    },
    methods: {
        submitForm(addData) {
            this.$refs[addData].validate((valid) => {
                if (valid) {
                    if (!this.isShowChange) {
                        this.saveDevice()
                    } else {
                        this.saveChange()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        exportEr() {
            if (this.searchData.searchId) {
                this.arr = [{
                    "paramsKey": this.searchData.searchId,
                    "opCode": "LIKE",
                    "targetCode": this.searchData.equipName
                }]
            } else {
                this.arr = []
            }
            let data = {
                "conditionConfig": {
                    "logic": 1,
                    "conditions": this.arr
                },
                "params": {
                    "typeId": this.searchData.typeId, //设备类型ID
                    "spaceId": this.searchData.spaceId, //空间ID
                },
                "page": 1,
                "rows": 1000,
                "sidx": "",
                "sord": "asc"
            };
            // 执行导出
            this.requestProcess(getExport(data)).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功，请前往任务下载中心查看任务执行情况！',
                    });
                }
            });
        },
        getOpens(data) {
            this.tableData = [];
            this.opens = data;
        },
        getPersonParams(data, item) {
            this.opens = false;
            this.addData.principalName = item.userNameArr[0]
            this.addData.principalId = data.userIdArr[0]
        },
        assign() {
            this.opens = true
            this.isTrue = false
        },
        search() {
            let data = {
                "conditionConfig": {
                    "logic": 1,
                    "conditions": [ //动态查询条件 看自己页面需要什么查询条件 非必填
                        {
                            "paramsKey": this.searchData.searchId,
                            "opCode": "LIKE",
                            "targetCode": this.searchData.equipName
                        }
                    ]
                },
                "params": {
                    "typeId": this.searchData.typeId, //设备类型ID
                    "spaceId": this.searchData.spaceId, //空间ID
                },
                "page": 1,
                "rows": 10,
                "sidx": "createTime",
                "sord": "desc"
            };
            this.vm.tableDataLoading = true;
            this.requestProcess(getDevice(data)).then(res => {
                this.listData = res.data;
                this.totalData = res.page.recordCount;
            }).finally(() => {
                this.vm.tableDataLoading = false;
            })
        },
        reset() {
            this.searchData = {
                searchId: '',
                equipName: '',
                typeId: '',
                spaceId: ''
            };
            this.pageSize = 1;
            this.getMess();
        },
        selectA(data) {
            this.searchData.typeName = data.typeName;
            this.searchData.typeId = data.id;
            this.isShowSelect = false;
        },
        selectClass(data) {
            this.addData.spaceName = data.spaceName;
            this.addData.spaceId = data.id;
            this.isShowSacpe = false;
        },
        changeSelect() {
            this.isShowSacpe = true;
        },
        selectClassfy(data) {
            this.extension = null
            this.$refs.makingformcheck.reset()
            this.isShowSelect = false;
            this.addData.typeId = data.id;
            this.addData.typeName = data.typeName;
            detailType(data.id).then(res => {
                let fromJson = window.JSON.parse(res.data.extension);
                this.extension = fromJson;
                this.$nextTick(() => {
                    this.$refs.makingformcheck.refresh();
                })
            })
            // console.log(this.addData.extension.formData)
            // console.log(this.$refs.makingformcheck)
        },
        changeSelectTree() {
            this.isShowSelect = true;
        },
        hideParentClick(e) {
            var isOther = e.relatedTarget == null || e.relatedTarget.closest("div.el-tree") ==
                null || e.relatedTarget.closest("div.el-tree").id != "floatTree";

            if (isOther) {
                this.isShowSelect = false;
            } else {
                e.target.focus();
            }
        },
        getMess() {
            let data = {
                "conditionConfig": {
                    "logic": 1,
                    "conditions": ((searchData) => {
                        return searchData.searchId ? [
                            {
                                "paramsKey": searchData.searchId,
                                "opCode": "LIKE",
                                "targetCode": searchData.equipName
                            }
                        ] : [];
                    })(this.searchData)
                },
                "params": ((searchData)=>{
                    return searchData.typeId ? {
                        "typeId": searchData.typeId, //设备类型ID
                        "spaceId": searchData.spaceId, //空间ID
                    }: {};
                })(this.searchData),
                "page": this.pageSize,
                "rows": 10,
                "sidx": "",
                "sord": "asc"
            };
            this.vm.tableDataLoading = true;
            this.requestProcess(getDevice(data)).then(res => {
                this.listData = res.data;
                this.totalData = res.page.recordCount;
            }).finally(()=>{
              this.vm.tableDataLoading = false;
            });
            getType().then(res => {
                this.typeData = res.data
            });
            // getScape().then(res => {
            //   this.scapeData = res.data
            // })
        },
        toBreadcrumb() {
            //面包屑
            this.breadcrumbList = [{
                path: '/',
                name: '首页'
            },
                {
                    name: '设备管理'
                },
                {
                    name: '设备列表'
                }
            ]
        },
        handleCurrentChange(val) {
            this.pageSize = val;
            this.getMess();
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        view(item) {
            console.log(item)
            layer.open({
                type: 2,
                title: ['设备详情', 'font-size:14px; font-weight:bold;'],
                shade: 0.3,
                shadeClose: false,
                maxmin: true, // 开启最大化最小化按钮
                area: ['1480px', '700px'],
                offset: 'auto', // 右下角弹出
                anim: 2,
                content: ['/index.html#/extends/equipment/detail/' + item.id, 'yes'], // iframe的url，no代表不显示滚动条
                end: function () {

                },
            });

        },
        erweima(row) {
            this.dialogVisible = true;
            this.id = row.id
            geterweima(row.id).then(res => {
                console.log(res)
            })
        },
        hideDetail() {
            this.isShowDetail = false;
            this.isShow = true;
            this.isShowAdd = false;
        },

        delet(item) {
            // console.log(item)
            this.$confirm(`是否要删除此设备【${item.equipName}】？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(res => {
                deleteDevice(item.id).then(res => {
                    if (res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getMess()
                    }
                }).catch(err => {
                    console.log(err)
                })
            });
        },

        // 添加到打印
        addToPrint(item) {
            let _index = findIndex(this.vm.printList, {id: item['id']});
            if (_index > -1) {
                this.$message({
                    type: 'warning',
                    message: `【${item.equipName}】已存在，请勿重复添加！`
                });
                return false;
            }

            this.vm.printList.push(item);
        },

        // 下载二维码标签
        downloadQRCodeTag() {
            this.vm.exportDataLoading = true;
            let ids = reduce(this.vm.printList, (results, value) => {
                results.push(value['id']);
                return results;
            }, []);
            this.requestProcess(this.instance.exportDeviceQRCode(ids)).then(res => {
                if (res.data) {
                    this.vm.printList = [];
                    this.vm.qrCodeDialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功！请前往任务下载中心查看任务执行情况！',
                    });
                }
            }).finally(() => {
                this.vm.exportDataLoading = false;
            });
        }
    },
    components: {
        Breadcrumb,
    },
    filters: {
        statusFormat(status) {
            let statusC = '';
            switch (status) {
                case 'use':
                    statusC = "使用中";
                    break;
                default:
                    statusC = "其他";
            }
            return statusC
        }
    }
}
