//需要重构此模块
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import DepToPerson from '@/components/depToPerson/depToPerson';
import {detailWork,assignPerson,startWork,sourceWork,synergic,cancelWork,endWork,urgeWork,deletsyId,postRepair,getReceipt,postAudit} from '@/axios/workManage/workorder';
import WorkOrderDetail from '@/components/WorkOrderDetail/WorkOrderDetail';
import WorkOrder from "../index";
import has from 'lodash/has';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import isArray from 'lodash/isArray';
import layer from "layui-layer";
import moment from 'moment';
import 'moment/locale/zh-cn';
require('moment-precise-range-plugin');
moment.locale('zh-cn');
export default {
  inject:['reload'],
  components: {
    Breadcrumb,
    DepToPerson,
    WorkOrderDetail,
  },
  data() {
    return {
      id:0,
      aduitShow:false,
      aduitData:{agree: true,remark: ''},
      visible:false,
      isPerpon:false,//展示人
      receiptData:{},//回执
      form:{satisfaction:0,processing:5,serve:5},//评价表单
      evaluate:false,//是否评价
      endVisible:false,//完成模态框
      modalTitle:'',//催单、取消
      userinfo:(()=>{
        try {
          return JSON.parse(this.$ls.get('userInfo')).id;
        }catch (e) {
          return '';
        }
      })(),//本人id
      breadcrumbList:[],//面包屑
      addData:{
        extension: {
          formFields:{
            list: []
          }
        }
      },//详情
      value:'',//是否解决
      opens:false,//选择人
      tableData:[],//选择人
      title:'分配',//分配、转派
      active:0,//步骤
      dialogFormVisible:false,//取消工单、催单
      data:{
        solution: '1',
        receipt: '',
      },//取消。催单form
      filesArr:[],//图片数组
      images:[],//图片展示
      // 工单状态条映射对象
      stepsMapping: (()=>{
        return this.$store.state['workOrderMapping'];
      })(),
      //工单编号
      uuId: (()=>{
        return this.$router.history.current.params['uuId'];
      })(),
      instance: new WorkOrder(),
      vm:{
        endVisible: false,
        dialogRemarksVisible: false,
        orderRemarks: {
          remark: '',
        },

        // 操作按钮
        opMap: {
          cancel: {
            command:(_this)=>{
              _this.cancel();
            },
            display: false,
            formData:{

            },
          },
          delay:{
            command:(_this)=>{
              _this.$refs['delayForm'] && _this.$refs['delayForm'].resetFields();
              _this.vm.opMap.delay.display = true;
            },
            display: false,
            loading: false,
            formData:{
              delayTime: '',
              cause: '',
              useWorkFlowId: '',
            },
            rules: {
              delayTime: [
                {required: true, message: '请选择日期', trigger: 'change' }
              ],
              cause: [
                {required: true, message: '请填写延期事由', trigger: 'blur' },
              ],
              useWorkFlowId: [
                {required: true, message: '请选择审批流程', trigger: 'blur' },
              ],
            },
            // 确认
            confirm:() => {
              this.$refs['delayForm'].validate((valid) => {
                if(!valid){
                  return false;
                }
                this.vm.opMap.delay.loading = true;
                return this.instance.postDelayApply(assign({repairOrderId: this.uuId},this.vm.opMap.delay.formData)).then(results=>{
                  this.vm.opMap.delay.display = false;
                  this.$message({
                    showClose: true,
                    message: '延期成功！',
                    type: 'success',
                    onClose:(message)=>{
                      this.init();
                    }
                  });
                }).catch(error => {
                  this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
                }).finally(()=>{
                  this.vm.opMap.delay.loading = false;
                });
              });

            },
            processList:[],
            // 获取流程信息
            getProcess:() =>{
              this.vm.opMap.delay.loading = true;
              let params = {
                "conditionConfig": {
                  "logic": 1,
                  "conditions": []
                },
                "rows": 999,
                "page": 1,
                "sidx": "",
                "sord": "asc"
              };
              this.instance.processList(params).then((res)=>{
                this.vm.opMap.delay.processList = res.data;
              }).catch(error => {
                error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
              }).finally(()=>{
                this.vm.opMap.delay.loading = false;
              });
            },
          },
          urge: {
            command:(_this)=>{
              _this.reminder();
            },
            display: false,
            formData:{},
          },
        },
        delayLoading: false,
        delayData: {},

        // 使用备件的数据
        useSpareTableData: [],
        queryStr: '',
        currentIndex: -1,
      }
    }
  },
  mounted() {
    this.toBreadcrumb();
  },
  methods: {
    edit(){
      this.$router.push({name:'workOrder_update',uuId:this.uuId});
    },
    confirmAduit(){
      this.vm.delayLoading = true;
      let _submitPromise = this.addData.status != 'DELAY' ? postAudit(this.uuId,this.aduitData) : this.instance.postDelayApproval(this.aduitData,this.uuId);
      _submitPromise.then((results)=>{
        if(results.data){
          this.aduitShow = false;
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success',
            onClose:(message)=>{
              this.init()
            }
          });
          return true;
        }
        throw new Error(results.msg);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.delayLoading = false;
      });
    },
    //提交评价
    postValue(){
      this.form.repairOrderId=this.uuId;
      postRepair(this.form).then(res=>{
        if(res.data){
          this.evaluate=false
          this.init()
        }
      })
    },
    //删除图片显示
    deleteimg(index) {
      this.filesArr.splice(index, 1);
      this.images.splice(index, 1);
    },
    //选择图片
    change(e) {
      let files = e.target.files;
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      let reader;
      let file;
      let images = this.images;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        console.log(this.filesArr)
        reader = new FileReader();
        reader.onload = (e) => {
          let img = new Image();
          img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // let w = img.width;
            let w = 100;
            let h = 100;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL('image/png');
            images.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    //展示取消工单模态框
    cancel(){
      this.dialogFormVisible=true;
      this.modalTitle='取消工单说明'
    },
    //展示催单模态框
    reminder(){
      this.dialogFormVisible=true;
      this.modalTitle='催单说明'
    },
    //提交催单
    confirmRemin(){
      urgeWork(this.uuId,this.data['receipt']).then(res=>{
        this.dialogFormVisible = false;
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success',
          onClose:(message)=>{
            this.init()
          }
        });
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
    //分配转派
    transferOrder(){
      this.opens=true;
      this.isTrue=false
    },
    //添加协作人
    synergicPer(){
      this.opens=true;
      this.isTrue=true
    },
    //提交取消工单
    confirm(){
      this.dialogFormVisible=false
      cancelWork(this.uuId,this.data).then(res=>{
        if(res.data){
          this.init()
        }
      })
    },
    //展示完成工单模态框
    //完成工单
    endThods(){
        this.vm.endVisible = true;
        let formData = new FormData();
        formData.append('formData',JSON.stringify(assign({
         omens: [],
         repairOrderId: this.uuId,
         spares: ((spares)=>{
           return reduce(spares,(results, value)=>{
             value['spareId'] && (results.push(value));
             return results;
           },[]);
         })(this.vm.useSpareTableData),
        },this.data)));
        isArray(this.filesArr) && (this.filesArr.forEach((file) => {
         formData.append('file', file);
        }));
       endWork(formData).then(res=>{
         this.endVisible = false;
         this.$message({
           showClose: true,
           message: '操作成功！',
           type: 'success',
           onClose:(message)=>{
             this.init()
           }
         });
       }).catch(error => {
         this.$message.error((error.message || (error.status + ' ' + error.statusText)));
       }).finally(()=>{
         this.vm.endVisible = false;
       });
    },
    //传参 （选择人）
    getOpens(data) {
        this.tableData=[];
        this.opens = data;
    },
    //删除协作人
    deletPer(item,index){
      deletsyId(this.uuId,item.synergicUserId).then(res=>{
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success',
        });
        this.addData.teams.splice(index,1);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
    //返回上一页
    back(){
      this.$router.push({name: 'work_order'})
    },
    //选择人后续操作
    getPersonParams(data,item) {
      this.opens = false;
      ((flag, users)=>{
        if(flag){
          return assignPerson(this.uuId,users.userIdArr[0],users.userNameArr[0]);
        }
        return synergic(this.uuId,reduce(users.userIdArr,(results, value, index)=>{
          results.push({
            synergicUserId: value,
            synergicUserName: users.userNameArr[index]
          });
          return results;
        },[]));
      })(!this.isTrue,assign(data,item)).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.init();
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
   //开始工单
    start(){
      this.$confirm('确定要开始工单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.instance.startWork(this.uuId);
      }).then(res=>{
        this.$message({
          showClose: true,
          message: '开始工单成功！',
          type: 'success',
          onClose:(message)=>{
            this.init();
          }
        });
      }).catch(error => {
        (has(error,'message') || has(error,'status')) && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
    //初始化
    init(results){
      if(!results){
        this.reload();
        // console.log(this.$router);
        return false;
      }
      // console.log(results);
      this.addData = results;
    },


    // 提交备注
    submitRemark(){
      let formData = new FormData();
      formData.append('formData',JSON.stringify(this.vm.orderRemarks));
      this.instance.postOrderRemark(this.uuId,formData).then(res=>{
        this.vm.dialogRemarksVisible=false;
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success',
            onClose:(message)=>{
              this.init();
            }
          });
      }).catch(error => {
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 查看附件
    viewOrderAttachment(pic,index){
      // console.log(pic,index);
      layer.photos({
        photos:{
          "title": pic.repairOrderId, //相册标题
          "id": pic.repairOrderId, //相册id
          "start": index, //初始显示的图片序号，默认0
          "data": ((_photos)=>{
            return reduce(_photos,(results,p)=>{
              results.push({
                "alt": p.fileName,
                "pid": p.id, //图片id
                "src": "https://picture.ceiov.com/"+p.filePath, //原图地址
                "thumb": "https://picture.ceiov.com/"+p.filePath //缩略图地址
              });
              return results;
            },[]);
          })(this.receiptData.attachments),
        },
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
      });
    },
    querySearchAsync(queryString, cb){
      if(!queryString){
        cb([]);
        return false;
      }
      // 获取备件
      this.instance.getSpares(1,20,{conditionConfig:{
          conditions:[{
            opCode: "LIKE",
            paramsKey: "spareName",
            targetCode: queryString,
          }],
          logic: 1,
        }
      }).then(res=>{
        cb(res.data);
      }).catch(error => {
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });

    },
    handleSelect(item){
      // console.log(item,this.vm.currentIndex);
      if(findIndex(this.vm.useSpareTableData,{spareId: item['id']}) > -1){
        this.$message({
          message: '备件已经存在！',
          type: 'warning'
        });
        return false;
      }

      item['spareId'] = item['id'];
      this.vm.useSpareTableData[this.vm.currentIndex] = ((_item,_target)=>{
        return assign(_target,_item,{});
      })(item,this.vm.useSpareTableData[this.vm.currentIndex]);
    },
    addRowSpare(){
      this.vm.useSpareTableData.push({
        spareId:"",
        spareName:"",
        spareCode:"",
        spareTypeId:"",
        spareTypeCode:"",
        spareTypeName:"",
        spareUnitCode:"",
        spareUnitName:"",
        nums:1,
        remark:"",
        queryStr: '',
      });
    },
    // 更多操作
    moreOperations(item){
      this.vm.opMap[item] && (this.vm.opMap[item]['command'](this));
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
          name: '工单详情'
        }
      ]
    },

  },

  filters: {

  }
}
