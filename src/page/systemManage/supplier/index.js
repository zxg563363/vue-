/**
 * Created by lixiansky on 2021/10/22
 */
import System from "../index";
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import DepToPerson from '@/components/depToPerson/depToPerson';
import ShowMore from '@/components/ShowMore/ShowMore';
import {request, variables} from '@/components/mixins/request';
import isArray from 'lodash/isArray';
import has from 'lodash/has';
export default {
  mixins: [request, variables],
  data() {
    return {
      instance: new System(),
      vm: {
        rules: {
          supplierNumber: [
            {required: true, message: '请填写企业信用统一编码', trigger: 'blur'},
          ],
          supplierName: [
            {required: true, message: '请填写企业名称', trigger: 'blur'},
          ],
          supplierAccountId: [
            {required: true, message: '请绑定账户信息', trigger: 'blur'},
          ],
          supplierLinkUser: [
            {required: true, message: '请填写联系人', trigger: 'blur'},
          ],
          supplierLinkPhone: [
            {required: true, message: '请填写联系电话', trigger: 'blur'},
          ],
        }
      },
      grade: [
        {
          value: 1,
          label: 'A级（>1000万）',
          text: 'A级',
        },{
          value: 2,
          label: 'B级（300 ~ 1000万）',
          text: 'B级',
        },{
          value: 3,
          label: 'C级（100 ~ 300万）',
          text: 'C级',
        },{
          value: 4,
          label: 'D级（30 ~ 100万）',
          text: 'D级',
        },{
          value: 5,
          label: 'E级（<30万）',
          text: 'E级',
        }
      ],
      entityData: {
        supplierGrade: '',
        supplierLinkUser: '',
        supplierLinkPhone: '',
        supplierNickName: '',
        supplierName: '',
        supplierNumber: '',
        supplierAccountId: '',
        purchasingContent: '',
        supplierAccountName: '',
      },
      opens: false,
    };
  },
  components: {Breadcrumb, DepToPerson, ShowMore},
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '供应商管理'}
    ]);

    // 查询数据
    this.getSupplier(1,this.pageSizes[1], {});
  },
  methods: {
    handleSizeChange(pageSize) {
      this.getSupplier(1, pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber) {
      this.getSupplier(pageNumber, this.pageData['pageSize']);
    },
    getSupplier(pageNumber, pageSize, params) {
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getSupplier(pageNumber, pageSize, params)).then(res => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(() => {
        this.tableDataLoading = false;
      });
    },
    installQueryParams() {
      let conditionConfig = {
        conditionConfig: {conditions: [], logic: 1},
        params: {keyword: this.query.key,}
      };
      return conditionConfig;
    },
    search(){
      this.getSupplier(1,this.pageData['pageSize'],this.installQueryParams());
    },

    // 添加或者修改供应商
    addSupplier(formName){
      this.$refs[formName].validate().then(() => {
        this.dataLoading = true;
        return this.requestProcess(this.entityData.id ? this.instance.putSupplier(this.entityData) : this.instance.postSupplier(this.entityData));
      }).then(res=>{
        (res.data || res.data['id']) && (
          this.$message({
            type: 'success',
            message: '操作成功！'
          }), this.search(), this.dialogVisible = false
        );
      }).finally(()=>{
        this.dataLoading = false;
      });
    },
    resetForm(formName){
      this.dialogVisible = false;
      this.$refs[formName] && (this.$refs[formName].resetFields());
    },
    getOpens(data) {
      this.opens = data;
    },
    getPersonParams(data,item) {
      if(!has(data,'userIdArr') || !isArray(data['userIdArr']) || data['userIdArr'].length <= 0){
        return false;
      }
      this.opens = false;
      this.entityData.supplierAccountId = data.userIdArr[0];
      this.entityData.supplierAccountName = item.userNameArr[0];
    },

    removeSupplier(item){
      return this.requestProcess(this.instance.deleteSupplier(item.id)).then(res=>{
        (res.data || res.data['id']) && (
          this.$message({
            type: 'success',
            message: '操作成功！'
          }), this.search(), this.dialogVisible = false
        );
      });
    },
    editSupplier(item){
      this.entityData = JSON.parse(JSON.stringify(item));
      this.dialogVisible = true;
    }
  }
}
