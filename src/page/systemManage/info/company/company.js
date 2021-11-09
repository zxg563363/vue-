import Breadcrumb from '../../../../components/breadcrumb/breadcrumb'
import System from "../../index";
import {request} from '@/components/mixins/request';
import assign from 'lodash/assign';
import { mapGetters } from 'vuex';
import VueCookies from 'vue-cookies';
export default {
  mixins: [request],
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    })
  },
  components: {
    Breadcrumb
  },
  data() {
    return {
      breadcrumbList: [],
      instance: new System(),
      companyFrom: {
        logo: '',
        areaCode: '',
      },
      companyRule: {
        companyName: [
          {required: true, message: '请填写企业名称', trigger: 'change'}
        ],
        streetCode: [
          {required: true, message: '请选择所在地区', trigger: 'blur'}
        ],
      },
      transferRule:{
        userId: [
          {required: true, message: '请选择转让成员', trigger: 'change'}
        ]
      },
      cityOptions: [],
      vm: {
        dataLoading: false,
        logo: '',
        districtData: [],
        areaCode: [],
        transfer: {
          userId: '',
        },
        members: [],
        isAdmin: false,
      }
    }
  },
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '企业信息管理'}
    ]);

    // 获取数据
    this.getCompanyInfo();
    this.getDistrictData();

    // 是否为管理员
    this.currentUser['company'] &&  (this.vm.isAdmin = this.currentUser['company']['adminAccountId'] === this.currentUser['id']);

    if(!this.currentUser['company']) {
      let _user = JSON.parse(this.$ls.get('userInfo'));
      this.vm.isAdmin = _user['company']['adminAccountId'] === _user['id'];
    }
    if(this.vm.isAdmin){
      this.getMembers();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _node = this.$refs['district'].getCheckedNodes()[0];
          let _districtData = [{
            label: _node.label,
            value: _node.value,
          }];
          this.getParentData(_node, _districtData)
          let _postData = assign(this.companyFrom, {
            provinceCode: _districtData[2]['value'],
            provinceName: _districtData[2]['label'],
            cityCode: _districtData[1]['value'],
            cityName: _districtData[1]['label'],
            areaCode: _districtData[0]['value'],
            areaName: _districtData[0]['label'],
          });
          this.vm.dataLoading = true;
          this.requestProcess(this.instance.updateCompanyData(_postData)).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！',
            });
            this.getCompanyInfo();
          }).finally(() => {
            this.vm.dataLoading = false;
          });
        }
      })
    },

    getParentData(node, data) {
      if (node.parent) {
        let {label, value} = node.parent;
        data.push({label, value});
        this.getParentData(node.parent, data);
      }
      return data;
    },

    // 获取企业信息
    getCompanyInfo() {
      this.vm.dataLoading = true;
      this.requestProcess(this.instance.getCompanyData()).then(res => {
        this.vm.logo = 'https://picture.ceiov.com/' + res.data['logo'];
        this.companyFrom = res.data;
        this.vm.areaCode = [res.data.provinceCode, res.data.cityCode, res.data.areaCode];
      }).finally(() => {
        this.vm.dataLoading = false;
      });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if (!res.data) {
        return false;
      }
      this.$message({
        type: 'success',
        message: 'Logo上传成功！',
      });
      this.getCompanyInfo();
    },

    // 获取行政区划数据
    getDistrictData() {
      this.requestProcess(this.instance.getDistrictTree()).then(res => {
        this.vm.districtData = res.data;
      });
    },

    // 获取成员信息
    getMembers() {
      this.requestProcess(this.instance.getMembers(999, 1, '')).then(res => {
        this.vm.members = res.dataList;
      });
    },
    // 提交转让
    submitTransfer(formName){
      this.$confirm('确认要转让管理员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        return this.$refs[formName].validate();
      }).then(res=>{
        console.log(res);
        if(!res){
          return false;
        }
        this.vm.dataLoading = true;
        this.requestProcess(this.instance.transferAdmin(this.vm.transfer.userId)).then(res => {
          if(res.data){
            this.$message({
              type: 'success',
              message: '转让成功，请重新登录！',
            });
            return this.requestProcess(this.instance.logOut( VueCookies.get('access_token')));
          }
        }).then(res=>{
          if(res.data) {
            VueCookies.remove('access_token');
            VueCookies.remove('userInfo');
            setTimeout(function () {
              window.location.href = 'login.html?_='+new Date().getTime();
            });
          }
        }).finally(() => {
          this.vm.dataLoading = false;
        });
      });

    }
  },

}
