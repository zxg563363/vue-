
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import DepToPerson from '../../../components/depToPerson/depToPerson'
import {getPart,addPart,editPart,deletePart} from "@/axios/deviceManage/sparePart"
export default {
    name: '',
    data() {
        return {
          opens:false,
          tableData:[],
          datarules: {
            warehouseName: [{
              required: true,
              message: '设备名称不能为空',
              trigger: 'blur'
            }],
            address: [{
              required: true,
              message: '设备编码不能为空',
              trigger: 'blur'
            }],
            principalName:[{
              required: true,
              message: '负责人不能为空',
              trigger: 'change'
            }]
          },
            breadcrumbList:[],
            data:[],
            isShow:true,
            addData:{
              warehouseName:'',
              description:'',
              address:'',
              principalId:'',
              principalName:'',
            },
            title:'',
            isAdd:false,
            isChange:false,
            id:9999
        }
    },
    mounted() {
      this.toBreadcrumb()
      this.init()
    },
    methods: {
      submitForm(addData) {
        this.$refs[addData].validate((valid) => {
          if (valid) {
            if(this.isAdd){
              this.save()
            }else{
              this.changeData()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getOpens(data) {
          this.tableData=[]
          this.opens = data;
      },
      getPersonParams(data,item) {
          this.opens=false;
          console.log(data)
          this.addData.principalName=item.userNameArr[0]
          this.addData.principalId=data.userIdArr[0]
      },
      choose(){
        this.opens=true
      },
      init(){
        getPart().then(res=>{
          this.data=res.data
        })
      },
      toBreadcrumb() {
          //面包屑
        this.breadcrumbList = [
            { path:'/', name:'首页' },
            { name:'设备管理' },
            { name:'仓库配置' }
        ]
      },
      add(){
        this.isShow=false;
        this.isAdd=true;
        this.addData={
          warehouseName:'',
          description:'',
          address:'',
          principalId:'',
          principalName:'',
        }
        this.title='新增仓库'
      },
      hide(){
        this.isShow=true
      },
      save(){
        addPart(this.addData).then(res=>{
          if(res.status==200){
            this.isShow=true
            this.init()
          }
        })
      },
      change(item){
        this.isAdd=false;
        this.isShow=false
        this.addData=item
        this.title='修改仓库'
      },
      changeData(){
        console.log(this.addData)
        editPart(this.addData).then(res=>{
          if(res.status==200){
            this.isShow=true
            this.init()
          }
        })
      },
      delet(id){
        this.$confirm('此操作将删除整个类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
              deletePart(id).then(res => {
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
      }
    },
    components:{
       Breadcrumb,
       DepToPerson
    }
}
