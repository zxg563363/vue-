/**
 * Created by lixiansky on 2021/9/2
 */
import moment from "moment";
import {axiosInstance, axios} from "@/axios/request";
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import * as echarts from 'echarts';
import max from 'lodash/max';
import min from 'lodash/min';
import concat from 'lodash/concat';
const collector = {
  props: ['uuid', 'collectorId','mqttData'],
  data() {
    return {
      delay: 1000,
      options: {
        duration: 0.8,
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        decimalPlaces: 2,
        prefix: '',
        suffix: '',
      },
      dataLoading: false,
      chartsData: {},
      model:{},
      // 当前展示的数据
      modelData: {
        P: 0,
        Q: 0,
        f: 0,
        Ua: 0,
        Ub: 0,
        Uc: 0,
      },
      // 增量数据
      increaseData: {
        times: [],
        datas: [{data:[]},{data:[]},{data:[]}],
        max: [0,0,0],
        min: [0,0,0],
      },
    };
  },
  methods: {
    getData(collectorId, key) {
      return this.requestProcess(axiosInstance({
        url: '/api-electricity/data/model/history',
        method: 'get',
        params: {
          collectorId,
          startTime: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          key
        }
      }));
    },
    // 获取数据
    getModelDataByCollectorId(collectorId){
      return this.requestProcess(axiosInstance({
        url: '/api-electricity/data/model/real/',
        method: 'get',
        params: {
          collectorId,
        }
      }));
    },

    // 获取数据模型
    getModelByCollectorId(collectorId){
      return this.requestProcess(axiosInstance({
        url: '/api-electricity/data/model',
        method: 'get',
        params: {
          collectorId,
        }
      }));
    },

    // 获取电压
    processData(newVal){
      this.dataLoading = true;
      axios.all([this.getData(newVal,'Ua'),this.getData(newVal,'Ub'),this.getData(newVal,'Uc'),this.getModelDataByCollectorId(newVal)]).then(axios.spread((res1, res2, res3, res4)=>{
        // console.log('所有请求完成');
        this.chartsData = {
          unitName: '单位：V',
          titles: ['Ua', 'Ub', 'Uc'],
          times: reduce(res1.data.times,(results, value)=>{
            results.push(echarts.time.format(moment(value*1000).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}'));
            return results;
          },[]),
          datas: [
            {
              name: 'Ua',
              data: res1.data.values,
            },
            {
              name: 'Ub',
              data: res2.data.values,
            },
            {
              name: 'Uc',
              data: res3.data.values,
            },
          ],
        };
        this.modelData = assign({P: 0, Q: 0, f: 0, Ua: 0, Ub: 0, Uc: 0,Ia: 0,Ic: 0,Ib: 0}, res4.data);
        // console.log(this.modelData);

        this.increaseData = assign({
          times: [echarts.time.format(moment(res4.data.time).toDate(),'{yyyy}-{MM}-{dd}\n{HH}:{mm}:{ss}')],
          datas: [[res4.data['Ua']],[res4.data['Ub']],[res4.data['Uc']]],
        },((data1,data2,data3)=>{
          let temp = concat(data1,[(res4.data['Ua'] || 0)]);
          let temp2 = concat(data2,[(res4.data['Ub'] || 0)]);
          let temp3 = concat(data3,[(res4.data['Uc'] || 0)]);
          return {max: [max(temp), max(temp2), max(temp3)], min:[min(temp), min(temp2), min(temp3)]};
        })(res1.data.values,res2.data.values,res3.data.values));
      })).finally(()=>{
        this.dataLoading = false;
      });
    },
  }
};
export {collector};
