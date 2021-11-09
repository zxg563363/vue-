import Breadcrumb from '@/components/breadcrumb/breadcrumb'
export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            tableData:[{id:1},{id:2}],
            multipleSelection:[]
        }
    },
    mounted() {
      this.toBreadcrumb()
    },
    methods: {
      toBreadcrumb() {
		    //面包屑
		    this.breadcrumbList = [
		        { path:'/', name:'首页' },
		        { name:'电源管理' },
		        { name:'用电数据列表' }
		    ]
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      urgency(){
        console.log('111')
      }
    },
    components: {
        Breadcrumb
    },
}
