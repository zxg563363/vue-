/**
 * Created by lixiansky on 2021/7/10
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import WorkOrder from '../index';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import layer from "layui-layer";
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new WorkOrder(),
      vm: {
        queryObj:{
          uuId: '',
          evaluationStatus: 'all'
        },
        dialogVisible: false,
        currentEvaluate: {},
        evaluateForm:{
          satisfaction: 2,
          processing: 5,
          serve: 5,
          idea: '',
        },
        currentUser:(()=>{
          try {
            return JSON.parse(this.$ls.get('userInfo'));
          }catch (e) {
            return {};
          }

        })(),
        evaluateStatus: [
          {
            label: '待评价',
            selected: true,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "visible",
                "targetCode": "0"
              }
            ],
          },
          {
            label: '已评价',
            selected: false,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "visible",
                "targetCode": "1"
              }
            ],
          },
          {
            label: '无需评价',
            selected: false,
            condition: [
              {
                "opCode": "EQUAL",
                "paramsKey": "visible",
                "targetCode": "-1"
              }
            ],
          },
          {label: '全部',selected: false,condition: []},
        ]
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '评价列表'}
    ]);

    // 获取任务计划列表
    this.getTableData(1,this.pageSizes[0],this.installCondition());
  },
  methods: {
    getTableData(pageNumber, pageSize, params) {
      this.instance.getEvaluateData(pageNumber, pageSize, params).then((res) => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      // console.log(this.pageData);
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },
    onSubmit(){

      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },
    onReset(){
      this.vm.queryObj = {uuId: ''};
      this.getTableData(1,this.pageData['pageSize']);
    },
    evaluateOrder(evaluate){
      this.vm.dialogVisible = true;
      this.vm.currentEvaluate = evaluate;
      this.vm.evaluateForm = {
        satisfaction: 2,
        processing: 5,
        serve: 5,
        idea: '',
      };
    },

    // 查看评价
    viewEvaluateOrder(evaluate){
      this.vm.dialogVisible = true;
      this.vm.currentEvaluate = evaluate;
      this.vm.evaluateForm = evaluate;
    },
    satisfactionFormatter(row, column, cellValue, index){
      return row['satisfaction']!==-1 ? ({"0": '差评',"1": '中评',"2": '好评'}[row['satisfaction']]) : '暂无评价';
    },
    submitEvaluate(){

      this.instance.postEvaluate(assign({repairOrderId:this.vm.currentEvaluate.uuId},this.vm.evaluateForm)).then(res=>{
        if(res.data) {
          this.$message({
            showClose: true,
            message: '评价成功！',
            type: 'success',
            onClose: (message) => {
              this.onSubmit();

            }
          });
          this.vm.dialogVisible = false;
        }
      }).catch(error => {
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 组装查询条件
    installCondition(){
      let _conditions = [];

      // 组装状态查询条件
      forEach(this.vm.evaluateStatus,(status)=>{
        status['selected'] && (_conditions = concat(_conditions, status.condition));
      });

      let _map = {
        'all': [],
        'evaluated': [
          {
            "opCode": "EQUAL",
            "paramsKey": "evaluationUserId",
            "targetCode": this.vm.currentUser.id
          }],
        'solved': [{
          "opCode": "LIKE",
          "paramsKey": "receiverName",
          "targetCode": this.vm.currentUser.realName
        }],
      };
      _conditions = concat(_conditions, _map[this.vm.queryObj.evaluationStatus]);

      if(this.vm.queryObj.uuId){
        _conditions.push({
          "opCode": "LIKE",
          "paramsKey": "uuId",
          "targetCode": this.vm.queryObj.uuId,
        });
      }

      return {
        "conditionConfig": {
          "logic": 1,
          "conditions": _conditions ? _conditions : [],
        }
      };
    },

    // 改变状态
    changeStatus(item, index){
      // console.log(item);
      forEach(this.vm.evaluateStatus,(status)=>{
        status['selected'] =  false;
      });
      item['selected'] = true;

      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },
    evaluationStatusChange(){
      this.getTableData(1,this.pageData['pageSize'],this.installCondition());
    },

    // 跳转
    navigationOrder(uuId){
      layer.open({
        type: 2,
        title: [`查看工单【${uuId}】`, 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: [`/index.html#/extends/workorder/detail/${uuId}`, 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {

        },
      });
    }
  }
}
