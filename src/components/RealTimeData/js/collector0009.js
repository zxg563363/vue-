/**
 * Created by lixiansky on 2021/10/18
 */
import Vue from 'vue';
import RealTimeLineChartsV2 from '@/components/RealTimeLineCharts/RealTimeLineChartsV2';
import {axios} from "@/axios/request";
import {collector} from "../mixins/real-time-collector";
import Collector from "./collector";
import ICountUp from 'vue-countup-v2';
import moment from "moment";
import max from 'lodash/max';
import min from 'lodash/min';
import concat from 'lodash/concat';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import * as echarts from 'echarts';
import {request} from '@/components/mixins/request';
export default {
  template: require('../template/0009.html'),
  mixins: [request, collector],
  components: {RealTimeLineChartsV2, ICountUp, 'Collector': Vue.extend(Collector),},
  data() {
    return {
      chartsCurrentData: {},
      chartsCurrentData2: {},
      chartsCurrentData3: {},
      chartsCurrentData4: {},
      icon: {
        pm25: require('../icon/0009/pm25.png'),
        ll: require('../icon/0009/ll.png'),
        dl: require('../icon/0009/dl.png'),
        wd: require('../icon/0009/wd.png'),
      },
      increaseCurrentData: {
        times: [],
        datas: [],
        max: [],
        min: [],
      },
      increaseCurrentData2: {
        times: [],
        datas: [],
        max: [],
        min: [],
      },
      increaseCurrentData3: {
        times: [],
        datas: [],
        max: [],
        min: [],
      },
      increaseCurrentData4: {
        times: [],
        datas: [],
        max: [],
        min: [],
      },
    };
  },
  methods: {

    // 获取电流
    processCurrentData(newVal) {
      this.dataLoading = true;
      axios.all([this.getData(newVal,'pm25'),this.getData(newVal,'wd'),this.getData(newVal,'dl'),this.getData(newVal,'ll'),this.getModelDataByCollectorId(newVal)]).then(axios.spread((res1, res2, res3, res4, res5)=>{
        // console.log('所有请求完成');
        this.chartsCurrentData = {
          unitName: '单位：微克/立方米',
          titles: ['PM2.5'],
          times: reduce(res1.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}'));
            return results;
          },[]),
          datas: [
            {
              name: 'PM2.5',
              data: res1.data.values,
            },
          ]
        };
        this.chartsCurrentData2 = {
          unitName: '单位：升/分钟',
          titles: ['流量'],
          times: reduce(res2.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}'));
            return results;
          },[]),
          datas: [
            {
              name: '流量',
              data: res2.data.values,
            },
          ]
        };
        this.chartsCurrentData3 = {
          unitName: '单位：A',
          titles: ['电流'],
          times: reduce(res3.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}'));
            return results;
          },[]),
          datas: [
            {
              name: '电流',
              data: res3.data.values,
            },
          ]
        };
        this.chartsCurrentData4 = {
          unitName: '单位：℃',
          titles: ['温度'],
          times: reduce(res4.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}'));
            return results;
          },[]),
          datas: [
            {
              name: '温度',
              data: res4.data.values,
            },
          ]
        };
        this.modelData = assign({pm25: 0, wd: 0, dl: 0, ll: 0}, res5.data);
        this.increaseCurrentData = assign({
          unitName: '单位：微克/立方米',
          times: [echarts.time.format(moment(res4.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [res5.data['pm25']],
          max: [(max(res1.data.values)||0)],
          min: [(min(res1.data.values)||0)],
        },((data1)=>{
          let temp = concat(data1,[(res5.data['pm25'] || 0)]);
          return {max: [max(temp)], min:[min(temp)]};
        })(res1.data.values));

        this.increaseCurrentData2 = assign({
          unitName: '单位：升/分钟',
          times: [echarts.time.format(moment(res4.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [res5.data['ll']],
          max: [(max(res4.data.values)||0)],
          min: [(min(res4.data.values)||0)],
        },((data1)=>{
          let temp = concat(data1,[(res5.data['ll'] || 0)]);
          return {max: [max(temp)], min:[min(temp)]};
        })(res4.data.values));

        this.increaseCurrentData3 = assign({
          unitName: '单位：A',
          times: [echarts.time.format(moment(res3.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [res5.data['dl']],
          max: [(max(res3.data.values)||0)],
          min: [(min(res3.data.values)||0)],
        },((data1)=>{
          let temp = concat(data1,[(res5.data['dl'] || 0)]);
          return {max: [max(temp)], min:[min(temp)]};
        })(res3.data.values));

        this.increaseCurrentData4 = assign({
          unitName: '单位：℃',
          times: [echarts.time.format(moment(res2.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [res5.data['wd']],
          max: [(max(res2.data.values)||0)],
          min: [(min(res2.data.values)||0)],
        },((data1)=>{
          let temp = concat(data1,[(res5.data['wd'] || 0)]);
          return {max: [max(temp)], min:[min(temp)]};
        })(res2.data.values));

      })).finally(()=>{
        this.dataLoading = false;
      });
    },
  },
  watch: {
    collectorId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.processCurrentData(newVal);
        }
      }
    },
    mqttData: {
      handler(newVal, oldVal) {
        if(newVal){
          this.modelData = assign({pm25: 0, wd: 0, dl: 0, ll: 0,}, newVal);
          this.increaseCurrentData = assign({
            titles: ['PM2.5'],
            unitName: '单位：微克/立方米',
            times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
            datas: [Number(newVal['pm25'])],
          },((increaseCurrentData)=>{
            return {
              max: [max([increaseCurrentData.max[0],newVal['pm25']])],
              min: [min([increaseCurrentData.min[0],newVal['pm25']])]
            };
          })(this.increaseCurrentData));
        }


        this.increaseCurrentData2 = assign({
          titles: ['流量'],
          unitName: '单位：升/分钟',
          times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [Number(newVal['ll'])],
        },((increaseCurrentData)=>{
          return {
            max: [max([increaseCurrentData.max[0],newVal['ll']])],
            min: [min([increaseCurrentData.min[0],newVal['ll']])]
          };
        })(this.increaseCurrentData2));

        this.increaseCurrentData3 = assign({
          titles: ['电流'],
          unitName: '单位：A',
          times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [Number(newVal['dl'])],
        },((increaseCurrentData)=>{
          return {
            max: [max([increaseCurrentData.max[0],newVal['dl']])],
            min: [min([increaseCurrentData.min[0],newVal['dl']])]
          };
        })(this.increaseCurrentData3));

        this.increaseCurrentData4 = assign({
          titles: ['温度'],
          unitName: '单位：℃',
          times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}.{SSS}')],
          datas: [Number(newVal['wd'])],
        },((increaseCurrentData)=>{
          return {
            max: [max([increaseCurrentData.max[0],newVal['wd']])],
            min: [min([increaseCurrentData.min[0],newVal['wd']])]
          };
        })(this.increaseCurrentData4));
        // console.log('mqttData',newVal);
      },
      deep: true,
    }
  },
}
