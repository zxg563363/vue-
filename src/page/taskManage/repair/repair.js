
import Breadcrumb from '../../../components/breadcrumb/breadcrumb'
import { deviceTypeList } from "../../../axios/taskManage/inspect";
import { repairList, delRepair, deviceList } from "../../../axios/taskManage/repair";
import VueCookies from 'vue-cookies'

export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            deviceTrees:[],
            deviceProps:{
                children: 'children',
                label: 'typeName',
            },
            deviceInfo:'',
            loading:true,
            tableData:[],
            tableDevice:[],
            loadingDevice:true,
            page:1,
            rows:10,
            currentPage: 1,
            total:0,
        }
    },
    mounted() {
        this.getDeviceType();
        this.toBreadcrumb();  //面包屑
        if(VueCookies.isKey('repairData')) {
            VueCookies.remove('repairData');
        }
    },
    created() {

    },
    methods: {
        getDeviceType() {
            //获取设备类型左侧树
            deviceTypeList().then(res => {
                this.deviceTrees = res.data;
                if(res.data && res.data.length > 0) {
                    this.deviceInfo = this.deviceTrees[0];
                    //tree默认选中第一条数据(样式) 数据初始化展示
                    if(this.$route.query.equipmentType) {
                        this.$nextTick(() => {
                            this.$refs.deviceTreeRef.setCurrentKey(this.$route.query.equipmentType);
                            //任务列表
                            this.repairList(this.$route.query.equipmentType);
                            //设备列表
                            this.getDeviceList(this.$route.query.equipmentType);
                        })
                    } else {
                        this.$nextTick(() => {
                            this.$refs.deviceTreeRef.setCurrentKey(this.deviceTrees[0].id);
                            //任务列表
                            this.repairList(this.deviceTrees[0].id);
                            //设备列表
                            this.getDeviceList(this.deviceTrees[0].id);
                        })
                    }
                }
            })
        },
        getDeviceId(data) {
            console.log(data);
            this.deviceInfo = data;
            this.repairList(data.id);  //计划列表
            this.getDeviceList(data.id);  //设备列表
        },
        repairList(equipmentType) {
            let params = {
                equipmentType:equipmentType
            }
            repairList(params).then(res => {
                this.tableData = res.dataList;
                this.loading = false;
            })
        },
        editRepair(data,edit) {
            //编辑任务 跳转
            this.$router.push({
                path:'/taskManage/repair/add',
                query:{edit:edit}
            });
            let repairData = JSON.stringify(data);
            VueCookies.set('repairData',repairData);
        },
        deleteRepair(data) {
            //删除任务
            let params = {
                id:data.id
            }
            delRepair(params).then(res => {
                this.$confirm('此操作将删除该计划任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(res.status == 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.repairList(this.deviceInfo.id);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            })
        },
        getDeviceList(equipmentType) {
            //获取设备列表
            let params = {
                equipmentType:equipmentType,
                pageSize:this.rows,
                pageNumber:this.page
            }
            deviceList(params).then(res => {
                this.tableDevice = res.dataList;
                this.loadingDevice = false;
                this.total = res.page.recordCount;
            })
        },
        handleSizeChange(val) {
            this.rows = val;
            this.page = 1;
            this.currentPage = 1;
            this.loadingDevice = true;
            this.getDeviceList(this.deviceInfo.id);
        },
        handleCurrentChange(val) {
            this.page = val;
            this.loadingDevice = true;
            this.getDeviceList(this.deviceInfo.id);
        },
        goAdd() {
            //跳转修改或者新增页面
            this.$router.push({
                path:'/taskManage/repair/add',
                query:{id:this.deviceInfo.id,name:this.deviceInfo.typeName}
            });
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 === 0) {
                return 'warning-row';
            } else if (rowIndex % 2 === 1) {
                return 'success-row';
            }
            return '';
        },
        toBreadcrumb() {
            //面包屑
            this.breadcrumbList = [
                { path:'/', name:'首页' },
                { name:'任务管理' },
                { name:'维修表单' }
            ]
        }
    },
    components: {
        Breadcrumb
    },
}