/**
 * Created by lixiansky on 2021/10/19
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Stock from '../index';
import {request, variables} from '@/components/mixins/request';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
export default {
  mixins: [request, variables],
  components: {Breadcrumb,},
  data() {
    return {
      instance: new Stock(),
      activeNames: [],
      remoteLoading: false,
      vm: {
        // 二级部门
        departments: [],
        stockRules: {
          warehouseName: [
            {required: true, message: '请填写仓库名称', trigger: 'blur'},
          ],
          onlyTeamId: [
            {required: true, message: '请选择仓库所属', trigger: 'change'},
          ],
        },
        stock: {},
        // 搜索的用户集合
        users: [],
      }
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '仓库管理'}
    ]);

    // 获取仓库
    this.getStocks();
  },
  methods: {
    getStocks(){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getStocks()).then(res=>{
        this.tableData = reduce(res.data,(results, value, index)=>{
          !results[value['onlyTeamId']] ? (results[value['onlyTeamId']]= [value]) : (results[value['onlyTeamId']].push(value));
          (index===0) && (this.activeNames = [value['onlyTeamId']]);
          return results;
        },{});
      }).finally(()=>{
        this.tableDataLoading = false;
      })
    },

    getChildDepartments(){
      this.dataLoading = true;
      this.requestProcess(this.instance.getChildDepartments()).then(res=>{
        this.vm.departments = res.data;
      }).finally(()=>{
        this.dataLoading = false;
      });
    },

    // 编辑仓库
    editStock(stock){
      this.vm.stock = JSON.parse(JSON.stringify(stock));
      this.dialogVisible = true;
    },

    // 创建仓库
    addStock(formName){
      this.dataLoading = true;
      this.$refs[formName].validate().then(() => {
        return this.requestProcess(this.vm.stock.id ? this.instance.patchStocks(this.vm.stock): this.instance.postStocks(this.vm.stock));
      }).then(res => {
        (res.data || res.data['id']) && (
          this.$message({
            type: 'success',
            message: '操作成功！'
          }), this.getStocks(), this.dialogVisible = false
        );
      }).finally(()=>{
        this.dataLoading = false;
      });
    },
    resetForm(formName){
      this.dialogVisible = false;
      this.$refs[formName] && (this.$refs[formName].resetFields());
    },

    // 移除仓库
    deleteStock(stock){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.deleteStocks(stock['id'])).then(res=>{
        res.data && (
          this.$message({
            type: 'success',
            message: '删除成功！'
          }), this.getStocks()
        );
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    // 模糊搜索
    remoteMethod(query){
      this.remoteLoading = true;
      this.requestProcess(this.instance.queryUser((query ? query: this.vm.stock.principalName))).then(res=>{
        this.vm.users = res.dataList;
      }).finally(()=>{
        this.remoteLoading = false;
      });

    },
    // 负责人变化
    userChange(value){
      this.vm.stock.principalName = ((users)=>{
        let _temp = find(users,{'id': value});
        return _temp ? _temp['realName'] : '';
      })(this.vm.users);
    },

    // 仓库所属
    departmentsChange(value){
      this.vm.stock.onlyTeamName = ((departments)=>{
        let _temp = find(departments,{'departId': value});
        return _temp ? _temp['departName'] : '';
      })(this.vm.departments);
    },
  }
}
