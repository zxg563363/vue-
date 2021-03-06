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
                item.valiy="?????????"
              }else if(item.validity==0){
                item.valiy="?????????"
              }
              item.type='????????????'
            })
            this.tableData1=res.data
            this.totalData0=res.page.recordCount
        })
      },
      toBreadcrumb() {
		    //?????????
		    this.breadcrumbList = [
		        { path:'/', name:'??????' },
		        { name:'????????????' },
		        { name:'????????????' }
		    ]
      },
      handleCurrentChange(val) {
        this.pageSize0=val
        this.data.page=val
        getTerminal(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="?????????"
            }else if(item.validity==0){
              item.valiy="?????????"
            }
            item.type='????????????'
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
              item.valiy="?????????"
            }else if(item.validity==0){
              item.valiy="?????????"
            }
            item.type='????????????'
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
              item.valiy="?????????"
            }else if(item.validity==0){
              item.valiy="?????????"
            }
            item.type='????????????'
          })
          this.tableData=res.data
          this.totalData=res.page.recordCount
        })
        getTerminal(this.data).then(res=>{
          res.data.forEach((item,i)=>{
            if(item.validity==1){
              item.valiy="?????????"
            }else if(item.validity==0){
              item.valiy="?????????"
            }
            item.type='????????????'
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
      //??????????????????
      handleAddTerminal(){
        this.isInit=false;
        this.isTerminal=true;
        this.isAdd=true
        this.title='??????????????????'
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
              "typeId": "" ,  //????????????ID
               "spaceId" : "" , //??????ID
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
        this.$confirm('??????????????????????????????, ?????????????', '??????', {
            confirmButtonText: '??????',
            cancelButtonText: '??????',
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
              message: '???????????????'
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
               message: '????????????????????????!'
             });
             this.addTerminal.equipName=item.equipName;
          }else{
            this.$message({
               type: 'info',
               message: '????????????????????????!'
             });
          }
        })
      },
      //??????????????????
      handleAddApply(){
        this.isInit=false;
        this.isApply=true;
        this.title='??????????????????'
        this.addApply={
          transmitName:'',
          transmitCode:'',
          transmitPassword:'',
          period:'',
          iotNumber:'',
          remark:''
        }
      },
      //????????????
      handleHide(){
        this.isInit=true
        this.isTerminal=false
        this.isApply=false
        this.isViewApply=false
        this.isViewTerminal=false
      },
      //????????????
      handleEdit(row){
        console.log(row)
        if(row.collectors==null){
          this.isInit=false
          this.isApply=true
          this.title="??????????????????"
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
        this.$confirm('??????????????????????????????, ?????????????', '??????', {
            confirmButtonText: '??????',
            cancelButtonText: '??????',
            type: 'warning'
          }).then(res=>{
            deleteApply(row.id).then(res=>{
              if(res.data==true){
                this.$message({
                   type: 'success',
                   message: '????????????!'
                 });
                this.init()
              }
            }).catch(err => {
                console.log(err)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '???????????????'
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
      //????????????????????????
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
       //??????????????????
      handleEditTN(row){
        this.isInit=false;
        this.isTerminal=true;
        this.title="??????????????????"
        this.isAdd=false;
        let data={
            "conditionConfig": {
                "logic": 1,
                "conditions": []
            },
            "params":{
              "typeId": "" ,  //????????????ID
               "spaceId" : "" , //??????ID
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
      //????????????????????????
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
        this.$confirm('??????????????????????????????, ?????????????', '??????', {
            confirmButtonText: '??????',
            cancelButtonText: '??????',
            type: 'warning'
          }).then(res=>{
            deleteTerminal(row.id).then(res=>{
              if(res.data==true){
                this.init()
                this.$message({
                   type: 'success',
                   message: '????????????!'
                 });
              }
            }).catch(err => {
                console.log(err)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '???????????????'
            });
          });
      }
    },
    components: {
        Breadcrumb
    },
}
