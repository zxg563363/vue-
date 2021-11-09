/**
 * Created by lixiansky on 2021/7/9
 */
import TimesharingLineCharts from '@/components/TimesharingLineCharts/TimesharingLineCharts';
import BarLineCharts from '@/components/BarLineCharts/BarLineCharts';
import PieCharts from '@/components/PieCharts/PieCharts';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Task from '../index';
import moment from 'moment';
import {request} from '@/components/mixins/request';
import {processChartsData} from '@/components/mixins/processChartsData';
import {mapGetters} from "vuex";
import reduce from 'lodash/reduce';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import round from 'lodash/round';
export default {
  computed: {
    ...mapGetters(["taskTypeMapping"]),
  },
  data() {
    return {
      breadcrumbList: [],
      instance: new Task(),
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      vm: {
        pieCharts: null,
        timeSharingChartsData: {},
        timeSharingLoading: false,
        taskTypeLoading: false,
        taskTypeData: {},
        taskTypeDate: [moment(moment().format('YYYY-MM-DD')+' 00:00:00').toDate(),moment().toDate()],
        taskCards: [],

        taskTeamsLoading: false,
        taskTeamsDate: [moment(moment().format('YYYY-MM-DD')+' 00:00:00').toDate(),moment().toDate()],
        taskTeamsData: {},

        taskTeamsCurrentTab: 'inspection',
        taskTeamsChartsData: {},

        // 设备
        taskEquipmentLoading: false,
        taskEquipmentData: {},
      }

    }
  },
  mixins: [processChartsData,request],
  components: {
    Breadcrumb,
    TimesharingLineCharts,
    BarLineCharts,
    PieCharts,
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '任务看板视图'}
    ]);

    // 任务类型统计
    this.getTaskType();

    // 查询分时任务完成情况
    this.getTimeSharingTask();

    this.getTaskForTeams();

    this.getTaskForEquipment();
  },
  destroyed(){
  },

  methods: {
    // 获取任务分时统计
    getTimeSharingTask(){
      this.vm.timeSharingLoading = true;
      this.instance.getTimeSharingTask('hour',moment().format('YYYY-MM-DD')+' 00:00:00',moment().format('YYYY-MM-DD HH:mm:ss')).then(res =>{
        this.vm.timeSharingChartsData = this.processTimeSharingData(res.data);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.timeSharingLoading = false;
      });
    },

    // 获取任务类型
    getTaskType(){
      this.vm.taskTypeLoading = true;
      return this.requestProcess(this.instance.getTaskKanbanStatistics({
        startTime: (isArray(this.vm.taskTypeDate)) ? moment(this.vm.taskTypeDate[0]).format('YYYY-MM-DD')+' 00:00:00': '',
        endTime: (isArray(this.vm.taskTypeDate)) ? moment(this.vm.taskTypeDate[1]).format('YYYY-MM-DD HH:mm:ss'): '',
      })).then(res => {
        // 组装card数据
        let _cards = {
          'maintain': {id: 'baoyang', key: 'maintain',label: '保养'},
          'inspection': {id: 'xunjian', key: 'inspection',label: '巡检'},
          'spotcheck': {id: 'dianjian', key: 'spotcheck',label: '点检'}
        };
        let taskData = reduce(_cards,(results, value, key)=>{
          if(results['originalData'][key]) {
            results['taskTypeData'].datas.push(results['originalData'][key]['total']);
            results['taskTypeData'].titles.push(value['label']);

            let _temp = results['originalData'][key];
            results['taskItemData'][key] = assign({
              completed: _temp.normal + _temp.unnormal,
              untreated: _temp.undo,
              timeliness: round(_temp.normal/_temp.total*100,2),
              abnormal: round((_temp.timeout+_temp.unnormal)/_temp.total*100,2),
            },value);
          }
          return results;
        },{taskTypeData: {datas: [],titles: [],name: '任务类型'},taskItemData: {
            inspection: {completed: 0,untreated: 0,timeliness: 0,abnormal: 0, id: 'xunjian', label: '巡检'},
            maintain: {completed: 0,untreated: 0,timeliness: 0,abnormal: 0,id: 'baoyang', label: '保养'},
            spotcheck: {completed: 0,untreated: 0,timeliness: 0,abnormal: 0, id: 'dianjian', label: '点检'},
          }, originalData: res.data});
          // console.log(taskData);
          // 组装饼图
          this.vm.taskTypeData = taskData['taskTypeData'];
          this.vm.taskCards = taskData['taskItemData'];

      }).finally(()=>{
        this.vm.taskTypeLoading = false;
      });
    },

    // 获取班组
    getTaskForTeams(){
      this.vm.taskTeamsLoading = true;
      return this.requestProcess(this.instance.getTaskStatistics({
        startTime: (isArray(this.vm.taskTeamsDate)) ? moment(this.vm.taskTeamsDate[0]).format('YYYY-MM-DD')+' 00:00:00': '',
        endTime: (isArray(this.vm.taskTeamsDate)) ? moment(this.vm.taskTeamsDate[1]).format('YYYY-MM-DD HH:mm:ss'): '',
        fieldName: 'team',
      })).then(res => {
        this.vm.taskTeamsChartsData = JSON.parse(JSON.stringify(res.data));
        this.vm.taskTeamsData = this.installTaskTeamsData(res.data[this.vm.taskTeamsCurrentTab]);
      }).finally(()=>{
        this.vm.taskTeamsLoading = false;
      });
    },

    installTaskTeamsData(data,type='teamNames'){
      let normal = data ? data['status1s'] : [];
      return assign({
        legend: [
          {label: '未巡检', value: 'status0s'},
          {label: '巡检正常', value: 'status1s'},
          {label: '巡检异常', value: 'status2s'},
          {label: '巡检超时', value: 'timeouts'},
        ],
        titles:  data ? data[type]: [],
        percentage: reduce((data ? data['totals']: []),(results,value,i)=>{
          results.push(round(normal[i]/value*100));
          return results;
        },[]),
      },data);
    },
    changeTaskTeamsItem(value){
      this.vm.taskTeamsData = this.installTaskTeamsData(this.vm.taskTeamsChartsData[value]);
    },

    // 获取设备类型任务
    getTaskForEquipment(){
      this.vm.taskEquipmentLoading = true;
      return this.requestProcess(this.instance.getTaskStatistics({
        startTime: (isArray(this.vm.taskTypeDate)) ? moment(this.vm.taskTeamsDate[0]).format('YYYY-MM-DD')+' 00:00:00': '',
        endTime: (isArray(this.vm.taskTypeDate)) ? moment(this.vm.taskTeamsDate[1]).format('YYYY-MM-DD HH:mm:ss'): '',
        fieldName: 'equipmentType',
      })).then(res => {
        this.vm.taskEquipmentData = this.installTaskTeamsData(res.data,'equipmentTypeNames');
      }).finally(()=>{
        this.vm.taskEquipmentLoading = false;
      });
    },
  },
  filters: {

  }
}
