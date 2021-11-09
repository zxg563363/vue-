import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import DeviceType from '@/components/DeviceType/DeviceType';
import Device from "../index";
import {request} from '@/components/mixins/request';
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
export default {
  mixins: [request],
  components: {Breadcrumb, DeviceType},
  data() {
    return {
      instance: new Device(),
      breadcrumbList: [],
      addData: {
        typeName: '',
        typeCode: '',
        pId: '',
        parentName: '',
        description: "",
        dateFormat: 'yyyyMMdd',
        sequenceSize: '5',
        extension: ''
      },
      datarules: {
        typeName: [{
          required: true,
          message: '设备名称不能为空',
          trigger: 'blur'
        }],
        typeCode: [{
          required: true,
          message: '设备编码不能为空',
          trigger: 'blur'
        }, ],
      },
      options: [{
        value: 'yyyyMMdd'
      }, {
        value: 'yyyyMM'
      }],
      options0: [{
        value: '5'
      }, {
        value: '4'
      }],
      fromJson: '',
      vm: {
        isUpdate: false,
        loading: false,
      }
    }
  },
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '设备类型管理'}
    ]);
  },
  methods: {
    addType() {
      this.vm.isUpdate = false;
      this.addData = assign({
        typeName: '',
        typeCode: '',
        description: "",
        dateFormat: 'yyyyMMdd',
        sequenceSize: '5',
        extension: '',
      },((_node)=>{
        return {
          pId: '',
          parentName: '',
        }
      })(this.$refs['deviceTypeTree'].getCurrentNode()));
      this.fromJson = {list: [],config:{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}};
      this.$refs.makingformcheck.setJSON(this.fromJson);
    },
    // --------------------------------------
    deleteDeviceType(node,data){
      this.$confirm(`是否要删除此类型【${data['typeName']}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.requestProcess(this.instance.deleteDeviceType(data['id']));
      }).then((res)=>{
        if(res.data) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$refs['deviceTypeTree'].getData().then(()=>{
            let _node = this.$refs['deviceTypeTree'].getCurrentNode();
            if(_node){
              (data['id'] === _node['id']) ? (this.addType(),this.addData.pId = '', this.addData.parentName = '') : (this.$refs['deviceTypeTree'].setCurrentKey(_node['id']));
            }
          });
        }
      })
    },
    addSubtype(node,data){
      // console.log(node, data);
      this.addType();
      this.addData.pId = data['id'];
      this.addData.parentName = data['typeName'];

    },
    onClickNode(data,node,tree){
      // console.log(data,node);
      this.vm.loading = true;
      this.requestProcess(this.instance.detailDeviceType(data['id'])).then(res => {
        this.addData = assign(res.data,{parentName: isArray(node['parent']) ? '暂无' : (node['parent']['data']['typeName'])});
        this.vm.isUpdate = true;
        if (res.data.extension) {
          this.fromJson = window.JSON.parse(res.data.extension);
          this.$refs.makingformcheck.setJSON(this.fromJson);
        }
      }).finally(()=>{
        this.vm.loading = false;
      });
    },
    // 提交
    handleDeviceType(){
      this.$refs['deviceTypeForm'].validate().then(validate =>{
        this.vm.loading = true;
        return this.requestProcess((this.vm.isUpdate ? this.instance.updateDeviceType(this.processData()): this.instance.saveDeviceType(this.processData())));
      }).then(res=>{
        if(res.data){
          this.$message({
            type: 'success',
            message: '操作成功！'
          });

          let refreshData = this.$refs['deviceTypeTree'].getData();
          if(!this.vm.isUpdate) {
            this.addData = res.data;
            return refreshData.then(()=>{
              this.$refs['deviceTypeTree'].setCurrentKey(res.data['id']);
              return true;
            });

          }
          // 刷新类型树
          return refreshData.then(()=>{
            this.$refs['deviceTypeTree'].setCurrentNode(this.$refs['deviceTypeTree'].getCurrentNode());
            return true;
          });
        }
        this.$message({
          type: 'error',
          message: '操作失败！'
        });
        return false;
      }).then((res)=>{
        res && (this.onClickNode(this.addData,this.$refs['deviceTypeTree'].getNode(this.addData['id'])));

      }).finally(()=>{
        this.vm.loading = false;
      })
    },

    // 加工数据
    processData(){
      return assign(this.addData,{
        extension: ((json)=>{
          try {
            return JSON.stringify(json);
          }catch (e) {
            return JSON.stringify({list: [],config:{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}});
          }
        })(this.$refs.makingformcheck.getJSON())
      })
    }
  },

}
