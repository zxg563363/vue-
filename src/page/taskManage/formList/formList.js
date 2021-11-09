
import Breadcrumb from '../../../components/breadcrumb/breadcrumb'
import { deviceTypeList } from "../../../axios/taskManage/inspect";
import { jobList } from "../../../axios/taskManage/formList";

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
            fromType:'check',
            serchFrom:{
                type:'',
                code:'',
                date:[],
                speed:'',
                equipmentTypeId:'',
            },
            tableData:[],
            tableLoading:false,
            page:1,
            rows:10,
            currentPage: 1,
            total:0,
        }
    },
    mounted() {
        this.getList();
        this.getDeviceType();
        this.toBreadcrumb();  //面包屑
    },
    created() {

    },
    methods: {
        getList() {
            //列表数据
            let params = {
                conditionConfig: {
                    "logic": 1,
                    "conditions": [
                        {
                            opCode:"EQUAL",
                            paramsKey:"equipmentTypeId",
                            targetCode:this.serchFrom.equipmentTypeId
                        },
                        {
                            opCode:"EQUAL",
                            paramsKey:"formType",
                            targetCode:this.serchFrom.type
                        },
                        {
                            opCode:"EQUAL",
                            paramsKey:"equipmentCode",
                            targetCode:this.serchFrom.code
                        },
                        {
                            opCode:"GTE",
                            paramsKey:"startTime",
                            targetCode:this.serchFrom.date[0]
                        },
                        {
                            opCode:"LTE",
                            paramsKey:"startTime",
                            targetCode:this.serchFrom.date[1]
                        },
                        {
                            opCode:"EQUAL",
                            paramsKey:"status",
                            targetCode:this.serchFrom.speed*1
                        },
                    ]
                },
                params:{

                },
                "page": this.page,
                "rows": this.rows,
                "sidx": "",
                "sord": "asc"
            }
            jobList(params).then(res => {
                this.tableData = res.dataList;
                this.total = res.page.recordCount;
            })
        },
        onSubmit() {
            //查询表单
            console.log(this.serchFrom);
            if(this.serchFrom.type == 'all') {
                this.serchFrom.type = '';
            }
            this.rows = 10;
            this.page = 1;
            this.currentPage = 1;
            this.getList();
        },
        resetForm() {
            //重置表单
            this.reset();
            this.getList();
        },
        reset() {
            this.serchFrom.type = '';
            this.serchFrom.code = '';
            this.serchFrom.date = '';
            this.serchFrom.speed = '';
            this.serchFrom.equipmentTypeId = '';
            this.$nextTick(() => {
                this.$refs.deviceTreeRef.setCurrentKey(-1);
            })
        },
        handleSizeChange(val) {
            this.rows = val;
            this.page = 1;
            this.currentPage = 1;
            this.getList();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getList();
        },
        tabClick(data) {
            this.fromType = data;
            this.reset();
        },
        getDeviceType() {
            //获取设备类型左侧树
            deviceTypeList().then(res => {
                res.data.unshift({
                    typeName:'全部',
                    id:-1,
                })
                this.deviceTrees = res.data;
                if(res.data && res.data.length > 0) {
                    this.deviceInfo = this.deviceTrees[0];
                    //tree默认选中第一条数据(样式) 数据初始化展示
                    this.$nextTick(() => {
                        this.$refs.deviceTreeRef.setCurrentKey(this.deviceTrees[0].id);
                    })
                }
            })
        },
        getDeviceId(data) {
            console.log(data);
            this.deviceInfo = data;
            if(data.id == -1) {
                this.serchFrom.equipmentTypeId = '';
            } else {
                this.serchFrom.equipmentTypeId = data.id;
            }
            this.getList();
        },
        goDetail(id) {
            this.$router.push({
                path:'/taskManage/formList/detail',
                query:{id:id}
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
                { name:'表单列表' }
            ]
        }
    },
    components: {
        Breadcrumb
    },
}