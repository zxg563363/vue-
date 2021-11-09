import Breadcrumb from '@/components/breadcrumb/breadcrumb'
export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            breadcrumbList:[],
            tableData:[{id:1}],
            isInit:true,
            isWarn:false,
            isScram:false,
            isAdd:true,
            isPost:true,
            clear:false,
            isShowDoing:false,
            isStopP:false,
            title:'',
            addData:{
              method:'',
              id:1
            },
            radio:'1',
            radio1:'1',
            methodOpt:[{value:'微信'},{value:'短信推送'}],
            data:[{id:0}]
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
		        { name:'用电规则设置' }
		    ]
      },
      aaa(data){
        if(data==1){
          this.isShowDoing=false
        }else if(data==2){
          this.isShowDoing=true
        }
      },
      bbb(data){
        if(data==1){
          this.isStopP=false
        }else if(data==2){
          this.isStopP=true
        }
      },
      add(){
        this.data.push({id:''})
        this.clear=true
      },
      delet(i){
        this.data.forEach((item,index)=>{
          if(i==index&&this.data.length>1){
            this.data.splice(i,1)
          }
          if(this.data.length<2){
            this.clear=false
          }
        })
      },
      handleAdd(){
        this.isInit=false
        this.isWarn=true
      },
      handleHide(){
        this.isInit=true
        this.isWarn=false
      },
      AddPostWarn(){
        this.isInit=true
        this.isWarn=false
      },
      // AddPostScram(){
      //   this.isInit=true
      //   this.isWarn=false
      // },
    },
    components: {
        Breadcrumb
    },
}
