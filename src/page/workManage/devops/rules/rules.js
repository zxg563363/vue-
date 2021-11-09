import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getRules,deletRule} from '@/axios/workManage/rules'
import layer from "layui-layer";
import VueCookies from 'vue-cookies'
export default{
  data(){
    return{
      breadcrumbList:[],//面包屑
      isShowChange:false,
      addData:{},
      list:{logic:0,child:[],condition:[]},
      tableData:[],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      tableDataLoading: false,
    }
  },
  mounted(){
    this.toBreadcrumb();
    this.init(1,10);

    // 初始化postMessage监听
    this.initEventListener();
  },
  methods:{
    initEventListener(){
      window.addEventListener("message",(event)=> {
        // console.log(event);
        if(event.data['type'] === 'extends' && event.data['success']){
          layer.closeAll('iframe');
          // 刷新数据
          this.init(1,10);
        }
      });
    },

    // 添加规则
    addRule(){
      layer.open({
        type: 2,
        title: ['添加规则', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        // 120.133.52.105:8009
        content: ['/coal-midway/service_desk_setting_midway.html?token='+VueCookies.get('access_token'), 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          // this.init(1,10);
        },
      });
    },

    // 编辑规则
    updateRule(row){
      layer.open({
        type: 2,
        title: ['编辑规则【'+row.ruleName+'】', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: ['/coal-midway/service_desk_setting_midway.html?uuId='+row['uuId']+'&token='+VueCookies.get('access_token'), 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {

        },
      });
    },
    handleClick(row){
      this.$confirm(`是否要删除【${row.ruleName}】规则吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(results => {
        deletRule(row.uuId).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.init(1,10)
          }
        }).catch(error => {
          this.$message.error((error.message || (error.status + ' ' + error.statusText)));
        })
      });
    },
    init(pageNumber, pageSize, params){
      this.tableDataLoading = true;
      getRules(pageNumber, pageSize, params).then(res=>{
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      // console.log(this.pageData);
      this.init(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.init(pageNumber,this.pageData['pageSize']);
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
          name: '工单规则'
        }
      ]
    },
  },
  components: {
    Breadcrumb,
  },

  filters: {
    statusFormat(triggerAction) {
      let statusMap = {
        'CREATE': '工单创建',
        'START': '工单开始',
        'ALLOT': '工单分配',
        'TURN': '工单转派',
        'FINISHED': '工单完成',
        'TERMINATED': '工单取消',
      };
      return statusMap[triggerAction] ? statusMap[triggerAction] : '-';
    }
  }
}
