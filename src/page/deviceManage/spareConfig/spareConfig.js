import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {
  getDict,
  addDict,
  changeDict,
  deletDict
} from "@/axios/deviceManage/spareConfig"
export default {
  name: '',
  data() {
    return {
      breadcrumbList: [],
      tableData: [],
      store: {
        inData: '',
        outData: '',
        unitData: '',
        TypeData: '',
      },
      inStore: [],
      outStore: [],
      unit: [],
      type: [],
    }
  },
  mounted() {
    this.toBreadcrumb()
    this.initIn()
    this.initOut()
    this.initUnit()
    this.initType()
  },
  methods: {
    reset(id){
      if(id==1){
        this.initIn()
      }else if(id==2){
        this.initOut()
      }else if(id==3){
        this.initUnit()
      }else if(id==4){
        this.initType()
      }
    },
    initIn() {
      getDict({
        type: 'inStoreType'
      }).then(res => {
        this.inStore = res.dataList
      })
    },
    initOut() {
      getDict({
        type: 'outStoreType'
      }).then(res => {
        this.outStore = res.dataList
      })
    },
    initUnit() {
      getDict({
        type: 'spareUnit'
      }).then(res => {
        this.unit = res.dataList
      })
    },
    initType() {
      getDict({
        type: 'spareType'
      }).then(res => {
        this.type = res.dataList
      })
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [{
          path: '/',
          name: '首页'
        },
        {
          name: '设备管理'
        },
        {
          name: '备件选项配置'
        }
      ]
    },
    addIn() {
      let data = {
        name: this.store.inData,
        type: 'inStoreType'
      }
      if(this.store.inData!=''){
        addDict(data).then(res => {
          this.initIn()
          this.store.inData = ''
        })
      }else{
        this.$message('请输入入库类型')
      }

    },
    addOut() {
      let data = {
        name: this.store.outData,
        type: 'outStoreType'
      }
      if(this.store.outData!=''){
        addDict(data).then(res => {
          this.initOut()
          this.store.outData = ''
        })
      }else{
        this.$message('请输入出库类型')
      }
      
    },
    addUnit() {
      let data = {
        name: this.store.unitData,
        type: 'spareUnit'
      }
      if(this.store.unitData!=''){
        addDict(data).then(res => {
          this.initUnit()
          this.store.unitData = ''
        })
      }else{
        this.$message('请输入备件单位')
      }
    },
    addType() {
      let data = {
        name: this.store.TypeData,
        type: 'spareType'
      }
      if(this.store.TypeData!=''){
        addDict(data).then(res => {
          this.initType()
          this.store.TypeData = ''
        })
      }else{
        this.$message('请输入备件类型')
      }
    },
    delet(row){
		this.$confirm('此操作将删除类型, 是否继续?', '提示', {
		    confirmButtonText: '确定',
		    cancelButtonText: '取消',
		    type: 'warning'
		  }).then(res=>{
         deletDict(row.id).then(res=>{
            if(res.data==true){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                 });
                 if(row.type=='inStoreType'){
                   this.initIn()
                 }else if(row.type=='outStoreType'){
                   this.initOut()
                 }else if(row.type=='spareUnit'){
                   this.initUnit()
                 }else if(row.type=='spareType'){
                   this.initType()
                 }
             }
          })
       }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });
    },
    edit(row){
      console.log(row)
      this.$prompt('请输入修改名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        row.name=value;
        changeDict(row).then(res=>{
          if(res.data==true){
            if(row.type=='inStoreType'){
              this.initIn()
            }else if(row.type=='outStoreType'){
              this.initOut()
            }else if(row.type=='spareUnit'){
              this.initUnit()
            }else if(row.type=='spareType'){
              this.initType()
            }
          }
        })
        this.$message({
          type: 'success',
          message: '修改成功'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    common(){
        if(row.type=='inStoreType'){
          this.initIn()
        }else if(row.type=='outStoreType'){
          this.initOut()
        }else if(row.type=='spareUnit'){
          this.initUnit()
        }else if(row.type=='spareType'){
          this.initType()
        }
    }
  },

  components: {
    Breadcrumb
  }
}
