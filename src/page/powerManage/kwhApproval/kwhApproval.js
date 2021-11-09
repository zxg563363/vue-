import Breadcrumb from '@/components/breadcrumb/breadcrumb'
export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            tableData:[{id:1},{id:2}],
            btn:true,
            pass:false,
            refuse:false,
            isInit:true,
            data:''
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
		        { name:'停/送电审批' }
		    ]
      },
      handleView(row){
        this.data=row.id
        this.isInit=false
      },
      handleHide(){
        this.isInit=true
      },
      handlePass(){
        this.$confirm('您确定要通过审批吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '审批成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
      },
      handleRefuse(){},
    },
    components: {
        Breadcrumb
    },
}
