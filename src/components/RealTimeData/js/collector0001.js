/**
 * Created by lixiansky on 2021/8/31
 */
import RealTimeLineCharts from '@/components/RealTimeLineCharts/RealTimeLineCharts';
import Vue from 'vue';
import moment from "moment";
import {request} from '@/components/mixins/request';
import {axios} from "@/axios/request";
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import * as echarts from 'echarts';
import ICountUp from 'vue-countup-v2';
import max from 'lodash/max';
import min from 'lodash/min';
import concat from 'lodash/concat';
import {collector} from '../mixins/real-time-collector';
import Collector from './collector';
export default {
  template: require('../template/0001.html'),
  mixins: [request, collector],
  components: {RealTimeLineCharts, ICountUp,'Collector': Vue.extend(Collector),},
  data() {
    return {
      // 电流
      chartsCurrentData: {},
      // 当前展示的数据
      icon:{
        P: require('../icon/0001/gonglv01.png'),
        Q: require('../icon/0001/gonglvyinshu01.png'),
        f: require('../icon/0001/pinlv01.png'),
      },

      increaseCurrentData:{
        times: [],
        datas: [{data:[]},{data:[]}],
        max: [0,0,0],
        min: [0,0,0],
      },
    }
  },
  mounted() {
    // this.getData();
    this.collectorId && (this.processData(this.collectorId),this.processCurrentData(this.collectorId));
  },
  methods: {

    // 获取电流
    processCurrentData(newVal){
      this.dataLoading = true;
      axios.all([this.getData(newVal,'Ia'),this.getData(newVal,'Ic'),this.getModelDataByCollectorId(newVal)]).then(axios.spread((res1, res2,res4)=>{
        // console.log('所有请求完成');
        this.chartsCurrentData = {
          unitName: '单位：A',
          titles: ['Ia', 'Ic'],
          times: reduce(res1.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}'));
            return results;
          },[]),
          datas: [
            {
              name: 'Ia',
              data: res1.data.values,
            },
            {
              name: 'Ic',
              data: res2.data.values,
            }
          ]
        };

        this.increaseCurrentData = assign({
          times: [echarts.time.format(moment(res4.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}')],
          datas: [[res4.data['Ia']],[res4.data['Ic']]],
          max: [(max(res1.data.values)||0), (max(res2.data.values)||0)],
          min: [(min(res1.data.values)||0), (min(res2.data.values)||0)],
        },((data1,data2)=>{
          let temp = concat(data1,[(res4.data['Ia'] || 0)]);
          let temp2 = concat(data2,[(res4.data['Ic'] || 0)]);
          return {max: [max(temp), max(temp2)], min:[min(temp), min(temp2)]};
        })(res1.data.values,res2.data.values));
      })).finally(()=>{
        this.dataLoading = false;
      });
    },

  },
  watch: {
    collectorId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.processData(newVal);
          this.processCurrentData(newVal);
        }
      }
    },
    mqttData: {
      handler(newVal, oldVal) {
        if(newVal){
          this.modelData = assign({P: 0, Q: 0, f: 0, Ua: 0, Ub: 0, Uc: 0,Ia:0,Ic:0,}, newVal);
          this.increaseData = assign({
            times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}')],
            datas: [[newVal['Ua']],[newVal['Ub']],[newVal['Uc']]],
          },((increaseData)=>{
            return {
              max: [max([increaseData.max[0],newVal['Ua']]), max([increaseData.max[1],newVal['Ub']]), max([increaseData.max[2],newVal['Uc']])],
              min: [min([increaseData.min[0],newVal['Ua']]), min([increaseData.min[1],newVal['Ub']]), min([increaseData.min[2],newVal['Uc']])]
            };
          })(this.increaseData));
          this.increaseCurrentData = assign({
            times: [echarts.time.format(moment(newVal.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}')],
            datas: [[newVal['Ia']],[newVal['Ic']]],
          },((increaseCurrentData)=>{
            return {
              max: [max([increaseCurrentData.max[0],newVal['Ia']]), max([increaseCurrentData.max[1],newVal['Ic']])],
              min: [min([increaseCurrentData.min[0],newVal['Ia']]), min([increaseCurrentData.min[1],newVal['Ic']])]
            };
          })(this.increaseCurrentData));
        }

        // console.log('mqttData',newVal);
      },
      deep: true,
    }
  },
}
