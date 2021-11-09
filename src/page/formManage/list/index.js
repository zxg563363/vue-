/**
 * Created by lixiansky on 2021/7/2
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Form from '../index';
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10,20,30,40,50,100],
      breadcrumbList: [],
      instance: new Form(),
      vm: {
        dialogVisible: false,
        jsonData: {},
        form: {},
        loading: true,
      },
      queryObj: {
        name: '',
        formType: '',
      }
    };
  },
  components: {
    Breadcrumb
  },

  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '表单列表信息'}
    ]);

    // 获取任务列表
    this.getTableData(1,this.pageSizes[0]);
  },

  methods: {
    getTableData(pageNumber,pageSize,params){
      this.instance.getData(pageNumber,pageSize,params).then((res)=>{
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      console.log(this.pageData);
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },

    // 移除表单
    removeForm(form){
      this.$confirm(`是否要移除表单【${form.name}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.instance.deleteForm(form['id']);
      }).then(()=>{
        // 获取任务列表
        this.getTableData(1,this.pageData['pageSize']);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },

    viewForm(id){
      this.$router.push({name: 'form_update',params:{id}});
    },

    // 预览表单
    previewForm(form){
      this.vm.dialogVisible = true;
      this.vm.form = form;
      this.getForm(form['id']).then((data)=>{
        this.vm.jsonData = data;
        this.vm.loading = false;
      }).catch(error => {
        // console.log(error);
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    getForm(id){
      return this.instance.getFormDataById(id).then((results)=>{
        // this.vm.jsonData =
          return results.data.formDetails ? JSON.parse(results.data.formDetails) : {list:[],config:{labelWidth:100,labelPosition:'right',size: 'small'}};
      });
    },

    // 查询
    onSubmit(){
      this.getTableData(1,this.pageData['pageSize'],this.queryObj);
    },

    // 重置
    onReset(){
      this.queryObj = {
        name: '',
        formType: '',
      };
      this.getTableData(1,this.pageData['pageSize'],this.queryObj);
    },
  },
  filters: {

  }
}
