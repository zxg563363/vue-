import {request} from '@/components/mixins/request';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {changeScape, deleteScape, getScape, saveScape} from '@/axios/deviceManage/deviceScape';
import filter from 'lodash/filter';
export default {
  mixins: [request],
  data() {
    return {
      datarules: {
        spaceName: [{
          required: true,
          message: '空间名称不能为空',
          trigger: 'blur'
        }],
        spaceCode: [{
          required: true,
          message: '空间编码不能为空',
          trigger: 'blur'
        },],
      },
      searchData: '',
      isLoading: false,
      breadcrumbList: [],
      tableData: [],
      addSpace: {
        spaceName: '',
        spaceCode: '',
        pId: '',
        description: '',
        pName: ''
      },
      spaceProps: {
        label: 'spaceName'
      },
      dialogVisible: false,
    }
  },
  mounted() {
    this.toBreadcrumb();
    this.getMess();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate().then(()=>{
        this.isLoading = true;
        let _postData = JSON.parse(JSON.stringify(this.addSpace));
        return this.requestProcess((this.addSpace['id'] ? changeScape(_postData): saveScape(_postData)));
      }).then(res => {
        if(res.data){
          this.$message({
            type: 'success',
            message: '操作成功！'
          });
          this.dialogVisible = false;
          // 刷新空间数据
          this.getMess();
        }
      }).finally(()=>{
        this.isLoading = false;

      });
    },
    //获取空间
    getMess() {
      this.isLoading = true;
      getScape().then(res => {
        this.tableData = res.data
      }).finally(()=>{
        this.isLoading = false;
      });
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [
        {path: '/', name: '首页'},
        {name: '设备管理'},
        {name: '空间管理'}
      ]
    },

    //删除空间
    deleteSpace(item) {
      this.$confirm(`此操作将删除整个空间【${item.spaceName}】, 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        return this.requestProcess(deleteScape(item.id))
      }).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getMess();
        }
      });
    },
    //新增空间
    search() {
      if(this.searchData){
        getScape().then(res => {
          this.tableData = filter(res.data,(item)=>{
            return item.spaceName.indexOf(this.searchData) > -1;
          });
        });
        return true;
      }
      this.$message({
        message: '请输入类型名称！',
        type: 'warning',
      });
    },
  },
  components: {
    Breadcrumb
  }
}
