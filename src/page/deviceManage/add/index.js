/**
 * Created by lixiansky on 2021/7/22
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Device from '../index';
import {detailType} from '@/axios/deviceManage/deviceType';
import {changeDevice, addDevice, getdetail} from "@/axios/deviceManage/deviceList";
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
export default {
  data() {
    return {
      instance: new Device(),
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      addData:{
        status: '在用',
        extension: {
          formData: {},
        },
        equipCode: '',
        equipName: '',
      },
      extension: {list: [], config: {size:'small'}},
      datarules: {
        equipName: [{
          required: true,
          message: '设备名称不能为空',
          trigger: 'blur'
        }],
        typeId: [{
          required: true,
          message: '设备类型不能为空',
          trigger: 'blur'
        }],
        model: [{
          required: true,
          message: '设备型号不能为空',
          trigger: 'blur'
        }],
        // principalName: [{
        //   required: true,
        //   message: '负责人名称不能为空',
        //   trigger: 'blur'
        // }],
        // principalPhone: [{
        //   required: true,
        //   message: '负责人电话不能为空',
        //   trigger: 'blur'
        // }],
        // serviceLife: [{
        //   required: true,
        //   message: '使用年限不能为空',
        //   trigger: 'blur'
        // }],
        spaceId: [{
          required: true,
          message: '设备空间地点不能为空',
          trigger: 'change'
        }],
      },
      vm: {
        uuId:((uuId)=>{
          return uuId;
        })(this.$router.history.current.params['uuId']),
        isUpdate: ((uuId)=>{
          return !!uuId;
        })(this.$router.history.current.params['uuId']),
        statusArr: [
          {
            value: '在用',
            label: '在用'
          },{
            value: '报废',
            label: '报废'
          },{
            value: '维修',
            label: '维修'
          },{
            value: '未用',
            label: '未用'
          },{
            value: '其他',
            label: '其他'
          }
        ],

        // 数据加载中
        dataLoading: false,

        // 设备类型
        deviceTypeArr: [],
        // 空间
        deviceSpaceArr: [],
      },
    };
  },
  components: {
    Breadcrumb
  },
  mounted() {

    this.vm.isUpdate && (this.getDeviceInfo());
    this.initData();
  },
  methods: {
    // 返回
    backPage() {
      this.$router.push({
        name: 'device_list'
      })
    },
    resetForm(){
      this.$refs['deviceForm'].resetFields();
      this.extension = {list: [], config: {size:'small'}};
    },
    initData(){
      // 获取设备类型
      this.vm.dataLoading = true;
      this.instance.getDeviceDatas().then(res => {
        // console.log(res);
        this.vm.deviceTypeArr = res.type;
        this.vm.deviceSpaceArr = res.space;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.dataLoading = false;
      });
    },
    // 类型改变
    typeChange(ids){
      //this.$refs.deviceType.getCheckedNodes()[0]['value']
      this.vm.dataLoading = true;
      detailType(ids[0]).then(res => {
        console.log(res);
        this.extension = ((extension)=>{
          try {
            return JSON.parse(extension);
          }catch (e) {
            return {list: [], config: {size:'small'}};
          }
        })(res.data['extension']);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.dataLoading = false;
      });
    },

    // 组装提交数据
    installData(){
      // 获取空间名称
      let spaceName = this.$refs.deviceSpace.getCheckedNodes()[0]['label'];
      // 类型名称
      // console.log(this.$refs.deviceType.getCheckedNodes());
      let typeName = this.vm.isUpdate ? '' : this.$refs.deviceType.getCheckedNodes()[0]['label'];
      return this.$refs.makingformcheck.getData().then(res => {
        // console.log(res);
        return assign(this.addData,{spaceName,typeName,
          spaceId:((spaceId)=>{
            return isArray(spaceId) ? last(spaceId): spaceId;
          })(this.addData['spaceId']),
          typeId:((typeId)=>{
              console.log(typeId);
              return isArray(typeId) ? last(typeId): typeId;
          })(this.addData['typeId']),extension: {formData: res,}},{});
      });
    },

    // 保存设备
    saveDevice(){
      this.$refs['deviceForm'].validate((valid) => {
        if(valid){
          // 执行保存设备方法
          this.vm.dataLoading = true;
          this.installData().then(res => {
            return this.vm.isUpdate ? changeDevice(res): addDevice(res);
          }).then(()=>{
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.backPage();
          }).catch(error => {
            this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          }).finally(()=>{
            this.vm.dataLoading = false;
          });

        }
        return false;
      });
    },

    // 获取设备基本信息
    getDeviceInfo(){
      this.vm.dataLoading = true;
      getdetail(this.vm.uuId).then(res => {
        this.addData = res.data;
        this.typeChange([res.data['typeId']]);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.dataLoading = false;
      });
    },
  },

}
