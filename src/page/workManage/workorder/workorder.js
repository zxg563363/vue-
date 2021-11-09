import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getWork} from '@/axios/workManage/workorder'
import trim from 'lodash/trim';
import {request} from '@/components/mixins/request';
import {wordOrder} from '../mixins';
import Vue from 'vue';
export default {
  mixins: [request],
  data() {
    return {
      totalData:0,
      pageSize:10,
      page: 1,
      searchData:'',
      userinfo:{},
      breadcrumbList: [],
      workData: [],
      uuidArr:[],
      arr: [],
      statusArr:[],
      imeArr:[],
      statusId: 0,
      imeId:0,
      imeData:[{
         value:'全部',
         id:0,
      },{
         value:'我创建的',
          id:1,
          imeCode:'createUserId'
      },{
         value:'我负责的',
          id:2,
          imeCode:'receiverId'
      },{
        value:'我审批的',
        id:3,
        imeCode:'searchType'
      }],
      statusData: [{
        value: '全部',
        id: 0
      }, {
        value: '待分配',
        status: 'NEW',
        id: 1
      }, {
        value: '待处理',
        status: 'WAITING',
        id: 2
      }, {
        value: '处理中',
        status: 'DOING',
        id: 3
      }, {
        value: '已完成',
        status: 'OK',
        id: 4
      }, {
        value: '已取消',
        status: 'CANCEL',
        id: 5
      }],
      dataLoading: false,
    }
  },
  mounted() {
    this.toBreadcrumb();
    this.init();
  },
  methods: {
    init() {
      this.userinfo=this.$ls.get('userInfo');
      this.getMess();
    },
    handleCurrent(val){
      this.page = val;
      this.getMess(val, this.pageSize);
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.page = 1;
      this.getMess(1, val);
    },
    reset(){
      this.arr=[];
      this.getMess();
      this.statusId=0;
      this.imeId=0;
      this.searchData=''
    },
    changeStatu(item){
      this.statusArr=[];
      this.statusId=item.id;
      if(item.value === "全部"){
        this.statusArr=[]
      }else{
        this.statusArr.push({
          "paramsKey": "status",
          "opCode": "EQUAL",
          "targetCode":item.status
        })
      }
      this.arr=this.statusArr.concat(this.imeArr).concat(this.uuidArr);
      this.getMess()
    },
    changeime(item){
      this.imeId = item.id;
      this.imeArr=[];
      if(item.value === "全部"){
        this.imeArr=[]
      }else{
        item.id!==3 && (this.imeArr.push({
          "paramsKey": item.imeCode,
          "opCode": "EQUAL",
          "targetCode":JSON.parse(this.userinfo).id
        }));
      }
      this.arr=this.statusArr.concat(this.imeArr).concat(this.uuidArr);
      this.getMess();
    },

    search(){
      this.uuidArr=[];
      if(this.searchData){
        this.uuidArr=[{
          "paramsKey":'uuId',
          "opCode": "LIKE",
          "targetCode":trim(this.searchData),
        }];
      }
      this.arr = this.statusArr.concat(this.imeArr).concat(this.uuidArr);
      // console.log(this.arr);
      this.getMess();
    },
    routes(){
       this.$router.push({name:'work_list'})
    },
    getMess(pageNumber=1, pageSize=10) {
      this.dataLoading = true;
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": this.arr
        },
        params: ((imeId)=>{
          return imeId===3 ? {searchType:"approval"} : {};
        })(this.imeId),
        "rows": pageSize,
        "page":pageNumber,
        "sidx": "createTime",
        "sord": "desc"
      };
      this.requestProcess(getWork(data)).then(res => {
        this.workData = res.data;
        this.totalData=res.page.recordCount;
        this.pageSize = res.page.pageSize;
        this.page = res.page.pageNumber;
      }).finally(()=>{
        this.dataLoading = false;
      })
    },
    handleClick(row){
      this.$router.push({name: 'workOrder_detail',params:{uuId:row.uuId}});
      // this.$router.push(`/workManage/workflow/${row.uuId}`)
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
          name: '工单列表'
        }
      ]
    },
  },
  components: {
    Breadcrumb,
    // 状态格式化组件
    'order-status':{
      mixins: [wordOrder],
      props:{
        status: {
          type: String,
          required: true,
        },
      },
      render(createElement){
        return createElement(Vue.extend({
          template: ((status)=>{
            return `<el-tag type="${status['type']}" size="small" :disable-transitions="true">${status.label}</el-tag>`
          })(this.statusMap[this.status]),
        }))
      }
    }
  },
}
