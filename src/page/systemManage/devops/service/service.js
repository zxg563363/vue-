import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {
  getCatalogs,
  addCatalogs,
  datailCatalogs,
  deletCatalogs,
  changeCatalogs,
  SOSCatalogs
} from '@/axios/systemManage/service';
import {request} from '@/components/mixins/request';
export default {
  name: 'DevopsService',
  mixins: [request],
  data() {
    return {
	    isDetet:true,
      breadcrumbList: [],
      catalogTree: [],
      catalogProps: {
        children: 'children',
        label: 'catalogName',
      },
      deviceInfo: {},
      formName: '',
      fromType: 'check',
      addPformData:{
        catalogName: '',
        seq: '0',
        pId: '',
        assignPoint: '0',
        approvalModel: '',
        extension: '',
        evaluateModel: '0',
      },
      fromJson: '',
      isEdit: false,
      isPid:false,
      id: '',
      isAdd:true,
      addData: {
        catalogName: '',
        seq: '',
        pId: '',
        assignPoint: '',
        approvalModel: '',
        extension: '',
        evaluateModel: '0',
      },
      optionEquip: [{
        value: '指定设备',
        id: 1
      }, {
        value: '不指定设备',
        id: 0
      }],
      optionCircle: [{
        value: '无需审批',
        id: 0
      }, {
        value: '选择审批',
        id: 1
      }, {
        value: '必须审批',
        id: 2
      }],
      rules:{
        catalogName: [
          {required: true, message: '请填写服务目录名称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        seq: [
          {required: true, message: '请填写序号', trigger: 'blur'}
        ],
      },
      vm: {
	      dataLoading: false,
        serviceDataLoading: false,
      }
    }
  },
  mounted() {
    this.toBreadcrumb(); //面包屑
    this.init();
  },
  created() {

  },
  methods: {
    cancel(){
      this.isPid=false
    },
    addFromM(data){
      this.isAdd=true
      this.isEdit=false
      // this.isPid=true
      this.addData={
        catalogName: '',
        seq: '',
        pId: data.id,
        assignPoint: '0',
        approvalModel: '',
        extension: '',
        evaluateModel: '0'
      };
	  if(this.$refs.makingformcheck){
		  this.$refs.makingformcheck.clear();
	  }
	  this.isDetet=false
    },
    addFrom(){
      this.addPformData={
       catalogName: '',
       seq: '',
      };
      this.isPid=true;
    },
    confirm(formName){
      this.$refs[formName].validate((valid) => {
        if(!valid){
          return false;
        }
        addCatalogs(this.addPformData).then(res => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.isPid = false;
          this.init();
        }).catch(error => {
          this.$message.error((error.message || (error.status + ' ' + error.statusText)));
        });
      });
    },
    changeLog(){
      changeCatalogs(this.deviceInfo).then(res => {
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
        this.init();
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },
    reset() {
      this.isDetet=true
      this.init()
    },
    init() {
      this.vm.serviceDataLoading = true;
      this.requestProcess(getCatalogs()).then(res => {
        this.catalogTree = res.data;
        this.isEdit = true;
        this.isAdd=true;
        if(res.data[0].hasChildren){
          this.addData=res.data[0].children[0];
          this.deviceInfo=res.data[0].children[0];
          this.$nextTick(() => {
              this.$refs.deviceTreeRef.setCurrentKey(res.data[0].children[0].id);
          });
          this.getFrom();
        }else{
          this.isAdd=false;
          this.deviceInfo.id=res.data[0].id;
          this.addData=res.data[0];
          this.$nextTick(() => {
              this.$refs.deviceTreeRef.setCurrentKey(res.data[0].id);
          })
        }
      }).finally(()=>{
        this.vm.serviceDataLoading = false;
      })
    },
    submitFrom(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        let json = this.$refs.makingformcheck.getJSON();
        json = window.JSON.stringify(json);
        this.addData.extension = json;
        let _reqPromise = !this.isEdit ? addCatalogs(this.addData) : changeCatalogs(this.addData);
        _reqPromise.then(res => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.init();
        }).catch(error => {
          this.$message.error((error.message || (error.status + ' ' + error.statusText)));
        })
      });
    },
    getFrom() {
      if(this.deviceInfo.catalogType=='0'){
        this.isAdd=false;
        this.addData=this.deviceInfo
      }else{
        this.isAdd=true;
        this.vm.dataLoading = true;
        datailCatalogs(this.deviceInfo.id).then(res => {
            this.addData=res.data;
            this.addData.assignPoint = this.addData.assignPoint+'';
            this.addData.evaluateModel = this.addData.evaluateModel ? (this.addData.evaluateModel+'') : '0';
            this.fromJson = window.JSON.parse(res.data.extension);
            this.$refs.makingformcheck.setJSON(this.fromJson ? this.fromJson : ({list:[],config:{}}));
            if(res.data.pId == 0){
              this.addData.pId = '';
            }
        }).finally(()=>{
          this.vm.dataLoading = false;
        })
      }
    },
    getDeviceId(data) {
      // console.log(data)
      this.isEdit=true;
      this.deviceInfo = data;
      this.getFrom();
    },
    delFrom() {
      this.$confirm(`此操作将删除目录【${this.addData['catalogName']}】，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletCatalogs(this.deviceInfo.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.init();
        })
      }).catch((error) => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
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
          name: '工单配置'
        },
        {
          name: '服务目录'
        }
      ]
    }
  },
  components: {
    Breadcrumb
  },
}
