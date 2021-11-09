import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getCatalogs} from '@/axios/systemManage/service'
import {request} from '@/components/mixins/request';
export default{
  mixins: [request],
	data(){
		return{
      breadcrumbList: [],
      logData:[],
      dataLoading: false,
		}
	},
	mounted(){
    this.toBreadcrumb();
    this.init();
  },
	methods:{
    init(){
      this.dataLoading = true;
      this.requestProcess(getCatalogs()).then(res=>{
        this.logData = res.data;
      }).finally(()=>{
        this.dataLoading = false;
      });
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [{
          path: '/',
          name: '首页'
        },
        {
          name: '工单管理'
        },
        {
          name: '新建工单'
        }
      ]
    },
    routes(){
      this.$router.push({name:'service_log'})
    },
    addWork(data){
      this.$router.push({name: 'work_add',params:{logId:data.id,logName:data.catalogName}});
    }
  },
	components: {
	  Breadcrumb
	},
}
