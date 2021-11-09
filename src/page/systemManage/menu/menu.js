
import Breadcrumb from '../../../components/breadcrumb/breadcrumb'
import { postMenu } from '../../../axios/systemManage/menu'

export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            dialogMenu:false,
            menuTitle:'',
            form:{
                actName:'',
                actUrl:'',
                sort:'',
                pId:'',
                actType:'',
                validity:'',
                actCode:''
            },
            rules:{
                actName: [
                    {required: true, message: '请输入菜单名称', trigger: 'change'}
                ],
                actUrl: [
                    {required: true, message: '请输入资源地址', trigger: 'change'}
                ],
                sort: [
                    {required: true, message: '请输入排序', trigger: 'change'}
                ],
                actType: [
                    { required: true, message: '请选择资源类型', trigger: 'change' }
                ],
                validity: [
                    { required: true, message: '请选择数据有效性', trigger: 'change' }
                ],
                actCode: [
                    {required: true, message: '请输入权限编码', trigger: 'change'}
                ],
            }
        }
    },
    mounted() {
        this.toBreadcrumb()
    },
    methods: {
        menuFrom(menuIndex) {
            //新增 修改弹窗
            this.dialogMenu = !this.dialogMenu;
            if(menuIndex == 1) {
                //新增
                this.menuTitle = '添加菜单';
            } else {
                //修改
                this.menuTitle = '修改菜单';
            }
        },
        submitForm(formName) {
            //新增确定按钮
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = this.form;
                    postMenu(params).then(res => {
                        if(res.status == 200) {
                            this.$message({
                                message: '菜单创建成功',
                                type: 'success'
                            });
                            window.location.reload()
                            this.$refs[formName].resetFields();
                            this.dialogMenu = !this.dialogMenu;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            //取消
            this.$refs[formName].resetFields();
            this.dialogMenu = !this.dialogMenu;
        },
        fromClose() {
            //关闭dialog
            this.$refs['form'].resetFields();
            this.dialogMenu = !this.dialogMenu;
        },
        toBreadcrumb() {
            //面包屑
            this.breadcrumbList = [
                { path:'/', name:'首页' },
                { name:'系统管理' },
                { name:'菜单管理' }
            ]
        }
    },
    components: {
        Breadcrumb
    }
}
