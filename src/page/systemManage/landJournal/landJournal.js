
import Breadcrumb from '../../../components/breadcrumb/breadcrumb'

export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            serchFrom:{
                landUrl:'',
                userName:'',
                status:'',
            },
            tableData:[{}],
            loading:false,
        }
    },
    mounted() {
        this.toBreadcrumb();  //面包屑
    },
    methods: {
        onSubmit() {

        },
        resetForm() {

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
                { name:'系统管理' },
                { name:'登录日志' }
            ]
        }
    },
    components: {
        Breadcrumb
    },
}