
import Breadcrumb from '../../../components/breadcrumb/breadcrumb'
import { deviceTypeList, saveFromData, fromData, editFromData, delFromData, } from '../../../axios/taskManage/inspect'

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
            deviceInfo:{},
            formName:'',
            fromType:'check',
            fromJson:'',
            isEdit:false,
            id:'',
        }
    },
    mounted() {
        if(this.showFrom == true) {
            document.getElementsByClassName('el-footer')[0].innerHTML = '';
        }
        let minHeight = document.documentElement.clientHeight - 60 - 40 - 16 - 60
        document.getElementsByClassName('content')[0].style.maxHeight = document.documentElement.clientHeight - 60 - 40 - 16 - 60 + 'px'
        this.toBreadcrumb();  //面包屑
        this.getDeviceType();
        // this.$refs.makingform.setJSON(this.jsonData)
        // this.fromRef = 'makingform' + this.fromType;
        // console.log(this.fromRef);
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
                    //回显
                    this.getFrom(this.fromType);
                    //tree默认选中第一条数据(样式)
                    this.$nextTick(() => {
                        this.$refs.deviceTreeRef.setCurrentKey(this.deviceTrees[0].id);
                    })
                }
            })
        },
        submitFrom() {
            //提交创建好的表单
            let json;
            if(this.fromType == 'check') {
                json = this.$refs.makingformcheck.getJSON();
            } else if (this.fromType == 'point') {
                json = this.$refs.makingformpoint.getJSON();
            } else if (this.fromType == 'protect') {
                json = this.$refs.makingformprotect.getJSON();
            }

            // console.log(json) //这个就是生成的表单数据，可以直接给后台或者直接拿过来生成表单
            // console.log(this.fromType);
            json = JSON.stringify(json)
            let params = {
                equipmentType:this.deviceInfo.id,
                formDetails:json,
                type:this.fromType,
            }
            if(this.isEdit == false) {
                //新增
                saveFromData(params).then(res =>{
                    //保存表单
                    if(res.status == 200) {
                        this.$message({
                            message: '保存自定义表单成功',
                            type: 'success'
                        });
                        this.id = res.data.id;
                        this.isEdit = true;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                })
            } else {
                //修改
                editFromData(params,this.id).then(res => {
                    if(res.status == 200) {
                        this.$message({
                            message: '修改自定义表单成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                })
            }
        },
        getFrom(fromType) {
            let params = {
                equipmentType:this.deviceInfo.id,
                type:fromType
            }
            fromData(params).then(res =>{
                //保存表单
                if(res.data != null) {
                    //有数据
                    this.isEdit = true;
                    this.fromJson = JSON.parse(res.data.formDetails);
                    // console.log(res.data.formDetails);
                    if(this.fromType == 'check') {
                        this.$refs.makingformcheck.setJSON(this.fromJson);
                    } else if (this.fromType == 'point') {
                        this.$refs.makingformpoint.setJSON(this.fromJson);
                    } else if (this.fromType == 'protect') {
                        this.$refs.makingformprotect.setJSON(this.fromJson);
                    }
                    this.id = res.data.id;
                } else {
                    this.isEdit = false;
                    this.id = '';
                    if(this.fromType == 'check') {
                        this.$refs.makingformcheck.clear();
                    } else if (this.fromType == 'point') {
                        this.$refs.makingformpoint.clear();
                    } else if (this.fromType == 'protect') {
                        this.$refs.makingformprotect.clear();
                    }
                }
            })
        },
        getDeviceId(data) {
            // console.log(data);
            this.deviceInfo = data;
            this.id = '';  //每次手动清空id
            this.getFrom(this.fromType);
        },
        delFrom() {
            //点击删除该表单
            let fromName = '';
            if(this.fromType == 'check') {
                fromName = '巡检';
            } else if (this.fromType == 'point') {
                fromName = '点检';
            } else if (this.fromType == 'protect') {
                fromName = '保养';
            }
            // console.log(this.deviceInfo.typeName);
            let text = '此操作将删除' + this.deviceInfo.typeName + '中的' + fromName + '表单，是否继续？';

            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delFromData(this.id).then(res =>{
                    this.$message({
                        message: '删除自定义表单成功',
                        type: 'success'
                    });
                    this.getFrom(this.fromType);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        tabClick(data) {
            //tab切换
            this.id = '';  //每次手动清空id
            // console.log(data.name);
            this.getFrom(data.name);
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
                { name:'巡检表单' }
            ]
        }
    },
    components: {
        Breadcrumb
    },
}