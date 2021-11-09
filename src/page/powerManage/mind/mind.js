import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getApply,addApply,changeApply,deleteApply,detailApply,stopApply,getTerminal,addTerminal,changeTerminal,deleteTerminal,detailTerminal,stopTerminal,equip,deletEquip} from '@/axios/powerManage/mind'
import {getDevice} from '@/axios/deviceManage/deviceList'
export default {
    name: '',
    data() {
        return {
          isQuip:true,
            typeData:[],
            breadcrumbList:[],
            tableData:[],
            tableData1:[],
            isInit:true,
            isTerminal:false,
            isApply:false,
            isAdd:true,
            title:'',
            pageSize:1,
            pageSize0:1,
            totalData:0,
            totalData0:0,
            addApply:{
              transmitName:'',
              transmitCode:'',
              transmitPassword:'',
              period:'',
              iotNumber:'',
              remark:''
            },
            addTerminal:{
              collectorName:'',
              collectorCode:'',
              maxVoltage:'',
              minVoltage:'',
              maxAmpere:'',
              minAmpere:'',
              period:'',
              remark:'',
              collectorPassword:'',
              transmitId:''
            },
            isAdd:true,
            isViewApply:false,
            applyView:{},
            isViewTerminal:false,
            terminalView:{},
            data:{},
            isChoose:false
        }
    },
    mounted() {
      this.toBreadcrumb()
      this.init()
    },
    methods: {
      reset(){
        this.init()
      },
      getTerminal(item){
        this.pageSize0=1
        this.data={
            "conditionConfig": {
                "logic": 1,
                "conditions": [{
                  "paramsKey": "transmitId",
                  "opCode": "EQUAL",
                  "targetCode": item.id
              }]
            },
            "params":{},
            "page": this.pageSize0,
            "rows": 5,
            "sidx": "",
            "sord": "asc"
        }
        getTerminal(this.data).then(res=>{
            res.data.forEach((item,i)=>{
              if(item.validity==1){
                item.valiy="已启用"
              }else if(item.validity==0){
                item.valiy="已禁用"
              }
              item.type='采控终端'
            })
            this.tableData1=res.data
            this.totalData0=res.page.recordCount
        })
      },
      toBreadcrumb() {
		    //面包屑
		    this.breadcrumbList = [
		        { path:'/', name:'首页' },
		        { name:'电源管理' },
		        { name:'网关管理' }
		    ]
      },
      handleCurrentChange(val) {
        this.pageSize0=val
        this.data.page=val
        getTerminal(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="已启用"
            }else if(item.validity==0){
              item.valiy="已禁用"
            }
            item.type='采控终端'
            this.tableData1=res.data
            this.totalData0=res.page.recordCount
          })
        })
      },
      handleCurrent(val){
        this.pageSize=val
        this.data.page=val
        getApply(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="已启用"
            }else if(item.validity==0){
              item.valiy="已禁用"
            }
            item.type='通信终端'
            this.tableData=res.data
          })
        })
      },
      init(){
        this.pageSize0=1
        this.pageSize=1
        this.data={
          "conditionConfig": {
              "logic": 1,
              "conditions": []
          },
          "params":{},
          "page": this.pageSize,
          "rows": 5,
          "sidx": "",
          "sord": "asc"
      }
        getApply(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="已启用"
            }else if(item.validity==0){
              item.valiy="已禁用"
            }
            item.type='通信终端'
          })
          this.tableData=res.data
          this.totalData=res.page.recordCount
        })
        getTerminal(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="已启用"
            }else if(item.validity==0){
              item.valiy="已禁用"
            }
            item.type='采控终端'
          })
          this.tableData1=res.data
          this.totalData0=res.page.recordCount
        })
      },
      handleView(row){
        this.isViewApply=true
        this.isInit=false
        detailApply(row.id).then(res=>{
          this.applyView=res.data
        })
      },
      handleViewTN(row){
        this.isViewTerminal=true
        this.isInit=false
        detailTerminal(row.id).then(res=>{
          this.terminalView=res.data
        })
      },
      //新增采控终端
      handleAddTerminal(){
        this.isInit=false;
        this.isTerminal=true;
        this.isAdd=true
        this.title='新增采控终端'
        this.addTerminal={
            collectorName:'',
            collectorCode:'',
            maxVoltage:'',
            minVoltage:'',
            maxAmpere:'',
            minAmpere:'',
            period:'',
            remark:'',
            collectorPassword:'',
            transmitId:'',
            equips:[{equipId:''}]
          }
        let data={
            "conditionConfig": {
                "logic": 1,
                "conditions": []
            },
            "params":{
              "typeId": "" ,  //设备类型ID
               "spaceId" : "" , //空间ID
            },
            "page": 1,
            "rows": 10,
            "sidx": "",
            "sord": "asc"
        }
        getDevice(data).then(res=>{
          this.typeData=res.data
        })
      },
      choose(){
        this.isChoose=true;
      },
      handleClose() {
        this.$confirm('此操作将删除对应设备, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
            deletEquip(this.addTerminal.id,this.addTerminal.equipId).then(res=>{
              if(res.data==true){
                this.isQuip=false;
                this.addTerminal.equipName=''
                this.addTerminal.equipId=''
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
      chooseType(item){
        this.addTerminal.equipName=item.equipName;
        this.addTerminal.equips[0].equipId=item.id;
        this.isChoose=false
      },
      changeType(item){
        equip(this.addTerminal.id,item.id).then(res=>{
          this.isChoose=false
          if(res.status==200){
            this.$message({
               type: 'success',
               message: '对应设备修改成功!'
             });
             this.addTerminal.equipName=item.equipName;
          }else{
            this.$message({
               type: 'info',
               message: '对应设备修改失败!'
             });
          }
        })
      },
      //新增通信终端
      handleAddApply(){
        this.isInit=false;
        this.isApply=true;
        this.title='新增通信终端'
        this.addApply={
          transmitName:'',
          transmitCode:'',
          transmitPassword:'',
          period:'',
          iotNumber:'',
          remark:''
        }
      },
      //返回列表
      handleHide(){
        this.isInit=true
        this.isTerminal=false
        this.isApply=false
        this.isViewApply=false
        this.isViewTerminal=false
      },
      //编辑终端
      handleEdit(row){
        console.log(row)
        if(row.collectors==null){
          this.isInit=false
          this.isApply=true
          this.title="修改通信终端"
          this.isAdd=false
          detailApply(row.id).then(res=>{
            this.addApply=res.data
          })
        }

      },
      changePostApply(){
        changeApply(this.addApply).then(res=>{
          this.isInit=true
          this.isApply=false
          this.init()
        })
      },
      handleDelet(row){
        this.$confirm('此操作将删除整个类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
            deleteApply(row.id).then(res=>{
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
      handleSOS(row){
         if(row.validity==1){
           this.valiy=0
         }else if(row.validity==0){
           this.valiy=1
         }
         stopApply(row.id,this.valiy).then(res=>{
           this.init()
         })
      },
      handleSOSTN(row){
        if(row.validity==1){
          this.valiy=0
        }else if(row.validity==0){
          this.valiy=1
        }
        stopTerminal(row.id,this.valiy).then(res=>{
          this.init()
        })
      },
      //提交新增采控终端
      AddPostTerminal(){
        console.log(this.addTerminal)
        addTerminal(this.addTerminal).then(res=>{
          if(res.status==200){
            this.isInit=true
            this.isTerminal=false
            this.init()
          }
        })
      },
       //编辑采控终端
      handleEditTN(row){
        this.isInit=false;
        this.isTerminal=true;
        this.title="修改采控终端"
        this.isAdd=false;
        let data={
            "conditionConfig": {
                "logic": 1,
                "conditions": []
            },
            "params":{
              "typeId": "" ,  //设备类型ID
               "spaceId" : "" , //空间ID
            },
            "page": 1,
            "rows": 10,
            "sidx": "",
            "sord": "asc"
        }
        getDevice(data).then(res=>{
          this.typeData=res.data
        })
        detailTerminal(row.id).then(res=>{
          this.addTerminal=res.data;
          if(res.data.equips.length==0){
            this.isQuip=false;
          }else{
            this.isQuip=true;
            this.addTerminal.equipName=res.data.equips[0].equipName;
            this.addTerminal.equipId=res.data.equips[0].equipId;
          }
        })
      },
      //提交新增通信终端
      AddPostApply(){
        addApply(this.addApply).then(res=>{
          if(res.status==200){
            this.isInit=true
            this.isApply=false
            this.init()
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      changePostTerminal(){
        console.log(this.addTerminal)
        changeTerminal(this.addTerminal).then(res=>{
          if(res.data==true){
            this.init()
            this.isInit=true
            this.isTerminal=false
          }
        })
      },
      hide(){
        this.isChoose=false
      },
      handleDeletTN(row){
        this.$confirm('此操作将删除整个类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
            deleteTerminal(row.id).then(res=>{
              if(res.data==true){
                this.init()
                this.$message({
                   type: 'success',
                   message: '删除成功!'
                 });
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
    components: {
        Breadcrumb
    },
}
