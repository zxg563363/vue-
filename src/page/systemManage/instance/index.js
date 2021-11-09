import System from "../index";
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {request} from '@/components/mixins/request';
import layer from "layui-layer";
/**
 * Created by lixiansky on 2021/8/3
 */
export default {
  mixins: [request],
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new System(),
      vm: {
        queryObj: {
          workflowInsId: '',
        },
        tableDataLoading: false,
      },
      workflowInsStates: {
        RUNNING: {
          label: '运行中',
          color: 'el-tag--success',
        },
        FINISHED: {
          label: '完成',
          color: '',
        },
        TERMINATED: {
          label: '关闭',
          color: 'el-tag--danger',
        },
        SUSPEND: {
          label: '挂起',
          color: 'el-tag--warning',
        },
      }
    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '流程实例'}
    ]);

    // 获取流程实例
    this.getTableData(1,this.pageSizes[0]);

    this.initEventListener();
  },
  methods: {
    getTableData(pageNumber, pageSize, params) {
      this.vm.tableDataLoading = true;
      this.requestProcess(this.instance.getWorkFlowInstance(pageNumber, pageSize, params)).then((res) => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(()=>{
        this.vm.tableDataLoading = false;
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      // console.log(this.pageData);
      this.getTableData(1,pageSize,{params: this.vm.queryObj});
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize'],{params: this.vm.queryObj});
    },
    onSubmit(){
      this.getTableData(1,this.pageData['pageSize'],{params: this.vm.queryObj});
    },
    onReset(){
      this.vm.queryObj = {keyword: ''};
      this.getTableData(1,this.pageData['pageSize']);
    },

    initEventListener(){
      window.addEventListener("message",(event)=> {
        // console.log(event);
        if(event.data['type'] === 'extends' && event.data['success']){
          layer.closeAll('iframe');
          // 刷新数据
          this.getTableData(1,this.pageSizes[0]);
        }
      });
    },
    // 干预
    interventionProcess(row){
      layer.open({
        type: 2,
        title: [`流程干预【${row['workflowName']}】`, 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: [`/index.html#/extends/process/intervention/${row['workflowInsId']}?scope=${row.scope}`, 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {

        },
      });
    }

  },
  filters: {

  }
}
