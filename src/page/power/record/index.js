/**
 * Created by lixiansky on 2021/9/3
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import PowerSwitch from '../index';
import {request, variables} from '@/components/mixins/request';
import {datePicker} from '@/components/mixins/common';
import moment from 'moment';
import assign from 'lodash/assign';
import layer from "layui-layer";
export default {
  mixins: [request, variables, datePicker],
  components: {
    Breadcrumb
  },
  data() {
    return {
      instance: new PowerSwitch(),
      params: {
        dateType: 'week',
        start: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        equipId: ''
      },
      dateRange: '',
      queryMap: {
        current: 'week',
        day: {
          value: '当日',
          command(str){
            return ((date)=>{
              return {start: date,end: date};
            })(moment(str).format('YYYY-MM-DD'));
          },
          next(str){
            return ((date)=>{
              return {start: date,end: date};
            })(moment(str).add(1,'days').format('YYYY-MM-DD'));
          },
          prev(str){
            return ((date)=>{
              return {start: date,end: date};
            })(moment(str).subtract(1,'days').format('YYYY-MM-DD'));
          },
        },
        week: {
          value: '当周',
          command(str){
            return ((date)=>{
              let _weekDay = moment().format('E');
              return {start: moment(date).subtract(_weekDay-1,'days').format('YYYY-MM-DD'),end: moment().add(7-_weekDay,'days').format('YYYY-MM-DD')};
            })(str);
          },
          next(str){
            return ((date)=>{
              let _weekDay = date.format('E');
              return {start: date.subtract(_weekDay-1,'days').format('YYYY-MM-DD'),end: date.add(7-_weekDay,'days').format('YYYY-MM-DD')};
            })(moment(str).add(7,'days'));
          },
          prev(str){
            return ((date)=>{
              let _weekDay = date.format('E');
              return {start: date.subtract(_weekDay-1,'days').format('YYYY-MM-DD'),end: date.add(7-_weekDay,'days').format('YYYY-MM-DD')};
            })(moment(str).subtract(7,'days'));
          }
        },
        month: {
          value: '当月',
          command(str){
            return ((date)=>{
              return {
                start: moment(date).startOf('month').format('YYYY-MM-DD'),
                end: moment(date).endOf('month').format('YYYY-MM-DD'),
              };
            })(str);
          },
          next(str){
            return ((date)=>{
              return {start: date.startOf('month').format('YYYY-MM-DD'),end: date.endOf('month').format('YYYY-MM-DD')};
            })(moment(str).add(1,'months'));
          },
          prev(str){
            return ((date)=>{
              return {start: date.startOf('month').format('YYYY-MM-DD'),end: date.endOf('month').format('YYYY-MM-DD')};
            })(moment(str).subtract(1,'months'));
          },
        },
        diy: {
          command:(str)=>{
            this.dateRange = [moment().subtract(7,'days').toDate(),moment().toDate()];
          }
        },
      },

      vm:{
        equipments: [],
        dataLoading: false,
      }

    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '停送电记录'}
    ]);
    this.dateCommand('week');

    // 获取设备
    this.getEquipments();

    this.getPowerSwitchRecord(1,this.pageSizes[1],this.params);
  },

  methods: {

    // 获取停送电记录
    getPowerSwitchRecord(pageNumber, pageSize, params){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getPowerSwitchRecord(pageNumber, pageSize, params)).then(res => {
        this.tableData = res.data;
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },

    dateCommand(key){
      this.queryMap[key] && (this.queryMap.current = key,this.$set(this,'params',assign(this.params, this.queryMap[key].command())),this.searchData());
    },
    nextDate(key){
      this.queryMap[key] && (this.$set(this,'params',assign(this.params, this.queryMap[key].next(this.params.start))),this.searchData());
    },
    prevDate(key){
      this.queryMap[key] && (this.$set(this,'params',assign(this.params, this.queryMap[key].prev(this.params.start))),this.searchData());
    },

    getEquipments(){
      this.vm.dataLoading = true;
      this.requestProcess(this.instance.getEquipments(1,9999,{conditionConfig:{
          conditions: [{
            opCode: "LIKE",
            paramsKey: "equipName",
            targetCode: "",
          }],
          logic: 1
        }})).then(res=>{
        this.vm.equipments = res.data;
      }).finally(()=>{
        this.vm.dataLoading = false;
      });
    },

    searchData(){
      this.getPowerSwitchRecord(1,this.pageSizes[1],this.params);
    },
    resetData(){
      this.params = {
        dateType: 'week',
        start: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        equipId: ''
      };
      this.dateCommand('week');
      this.getPowerSwitchRecord(1,this.pageSizes[1],this.params);
    },
    viewDetail(uuId){
      layer.open({
        type: 2,
        title: [`查看停送电单据【${uuId}】`, 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: [`/index.html#/extends/power-switch/apply/detail/${uuId}`, 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {

        },
      });
    },
    // 导出excel
    exportExcel(){
      this.$confirm('该操作会导出当前列表信息, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        return this.requestProcess(this.instance.exportPowerSwitchRecord(this.params));
      }).then(res=>{
        if(res.data) {
          this.$message({
            message: '导出成功，请前往任务中心查看！',
            type: 'success'
          });
          return true;
        }
        throw new Error('导出失败！');
      }).catch((e) => {
        e!=='cancel' && (this.$message({
          type: 'error',
          message: e.message || '',
        }));
      });
    }
  },
}
