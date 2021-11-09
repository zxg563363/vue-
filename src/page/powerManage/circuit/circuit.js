import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getView,addView,changeView,deleteView,detailView,stopView} from '@/axios/powerManage/circuit'
import {getScape} from "@/axios/deviceManage/deviceScape"
export default {
    name: '',
    data() {
        return {
            breadcrumbList:[],
            tableData:[],
            isInit:true,
            title:'',
            addCircuit:{},
            isAdd:true,
            addData:{
              lineName:'',
              lineCode:'',
              lineVoltage:'',
              lineAmpere:'',
              address:'',
              remark:'',
              spaces:[],
            },
            isShowSacpe:true,
            spacesData:[],
            spaceProps:{
              label: 'spaceName'
            },
            valiy:''
        }
    },
    mounted() {
      this.toBreadcrumb()
      this.init()
    },
    methods: {
      toBreadcrumb() {
		    //面包屑
		    this.breadcrumbList = [
		        { path:'/', name:'首页' },
		        { name:'电源管理' },
		        { name:'供电线路管理' }
		    ]
      },
      //查看线路列表
      init(){
        let data={
          "conditionConfig": {
              "logic": 1,
              "conditions": []
          },
          "params":{},
          "page": 1,
          "rows": 10,
          "sidx": "",
          "sord": "asc"
        }
        getView(data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="已启用"
            }else if(item.validity==0){
              item.valiy="已禁用"
            }
          this.tableData=res.data
          })
        })
      },
      //新增线路
      handleAdd(){
        this.addData={
            lineName:'',
            lineCode:'',
            lineVoltage:'',
            lineAmpere:'',
            address:'',
            remark:'',
            spaces:[]
        }
        getScape().then(res=>{
          this.spacesData=res.data
        })
        this.isAdd=true
        this.title="新增供电线路"
        this.isInit=false
      },
      //修改线路
      handleEdit(row){
        console.log(row)
        detailView(row.id).then(res=>{
          this.addData=res.data
        })
        this.isAdd=false
        this.title="修改供电线路"
        this.isInit=false
      },
      //返回列表
      handleHide(){
        this.isInit=true
      },
      //提交新增
      AddPost(){
        let that=this
       that.addData.spaces=[]
        let arr=this.$refs.tree.getCheckedNodes();
        arr.forEach((item,i)=>{
          that.addData.spaces.push({spaceId:item.id})
        })
        addView(this.addData).then(res=>{
          if(res.status==200){
            this.isInit=true
            this.init()
          }
        })
      },
      //修改提交
      changePost(){
        console.log(this.addData)
        changeView(this.addData).then(res=>{
          if(res.data==true){
            this.init()
            this.isInit=true
          }
        })
      },
      //删除线路
      handleDelet(row){
        this.$confirm('此操作将删除整个类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
              deleteView(row.id).then(res => {
                if(res.data==true){
                  this.$message({
                     type: 'success',
                     message: '删除成功!'
                   });
                  this.init()
                }
              }).catch(err => {
                console.log(err)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //启用禁用
      handleStop(row){
        if(row.validity==1){
          this.valiy=0
        }else if(row.validity==0){
          this.valiy=1
        }
        stopView(row.id,this.valiy).then(res=>{
          this.init()
        })
      },
    },
    components: {
        Breadcrumb
    },
}
