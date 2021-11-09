import {getdetail} from "@/axios/deviceManage/deviceList"
import {
  getCanUseByEquipType
} from "@/axios/deviceManage/spareCategory"
export default {
  data(){
    return{
      detailId:'',
      data:{},
      okEquip:[],
      id:0,
      record:['维修记录','保养记录','巡检记录','工单记录'],
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    handleClick(){},
    init(){
      this.detailId = this.$router.history.current.params['id']
      getdetail(this.detailId ).then(res=>{
        this.data=res.data;
        this.data.extension.formFields.list.forEach((item,i)=>{
          Object.keys(this.data.extension.formData).forEach((data,j)=>{
            if(item.model==data){
              item.form_Value=this.data.extension.formData[item.model]
            }
          })
        })
        getCanUseByEquipType(this.data.typeId).then(res => {
            this.okEquip=res.data;
            // this.spare.total=res.page.recordCount
        })
      })
    },
    handleSizeChange(val){
      console.log(val)
    },
    handleCurrentChange(val){
      console.log(val)
    },
  },
}
