/**
 * Created by lixiansky on 2021/8/11
 */
import {request} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import moment from "moment/moment";
import reduce from 'lodash/reduce';
export default {
  name: "TaskRecord",
  inject: ['reload'],
  mixins: [request],
  components: {},
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [7, 10, 20, 30, 40, 50, 100],
      vm: {
        dataLoading: false,
        task: {},
        dialogVisible: false,
        taskForm: {list:[],config:{}},
        taskFormData: {},
      }
    }
  },
  watch: {
    equipment: {
      handler(newVal, oldVal) {
        // console.log(newVal,oldVal);
        newVal['id'] && (this.getTableData(1, this.pageSizes[0]));
      }
    }
  },
  mounted() {

  },
  methods: {
    getTableData(page, rows){
      this.vm.dataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-inspection/job/search',
        method: 'post',
        data: {
          "conditionConfig": {
            "logic": 1,
            "conditions": [
              {
                "opCode":"EQUAL",
                "paramsKey":"equipmentId",
                "targetCode": this.equipment.id
              },{
                "opCode":"EQUAL",
                "paramsKey":"equipmentTypeId",
                "targetCode": this.equipment.typeId
              },{
                "opCode":"EQUAL",
                "paramsKey":"planType",
                "targetCode": this.planType
              }
            ],
          },
          "params":{},
          sidx: "startTime",
          sord: "asc",
          page, rows,
        },
      })).then(res => {
          this.tableData = res.dataList;
          this.pageData = res.page;
      }).finally(()=>{
        this.vm.dataLoading = false;
      });
    },

    handleSizeChange(pageSize){
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },

    isTaskTimeout(opTime,endTime){
      return opTime ? moment(endTime).isBefore(opTime) : moment(endTime).isBefore() ;
    },

    // 显示任务填报信息
    showTaskFillInModal(task){
      this.vm.task = task;

      this.vm.dialogVisible = true;
      // 查询任务
      this.requestProcess(axiosInstance({
        url: '/api-inspection/job',
        method: 'get',
        params:{
          id:task.id
        },
      })).then((res) => {
        let _formList = res.data.extension.formFields ? JSON.parse(res.data.extension.formFields) : {list:[],config:{}};
        _formList.list = reduce(_formList.list,(results, value)=>{
          value['options']['disabled'] = true;
          results.push(value);
          return results;
        },[]);
        this.vm.taskForm = _formList;
        this.vm.taskFormData = res.data.extension.formData || {};
      }).catch(error => {
        this.vm.taskForm = {list:[],config:{}};
      });
    }
  },
  props: {
    equipment: { // 父组件传来的id
      type: Object,
      required: true,
    },
    planType: {
      type: String,
      required: true,
    }
  }
}
