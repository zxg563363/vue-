/**
 * Created by lixiansky on 2021/9/2
 */
import Vue from 'vue';
import RealTimeLineCharts from '@/components/RealTimeLineCharts/RealTimeLineCharts';
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
  template: require('../template/0004.html'),
  mixins: [request, collector],
  components: {RealTimeLineCharts, ICountUp, 'Collector': Vue.extend(Collector),},
  data() {
    return {
      chartsCurrentData: {},
      icon: {
        P: require('../icon/0001/gonglv01.png'),
        Q: require('../icon/0001/gonglvyinshu01.png'),
        f: require('../icon/0001/pinlv01.png'),
      },
      increaseCurrentData: {
        times: [],
        datas: [{data: []}, {data: []}, {data: []}],
        max: [0, 0, 0],
        min: [0, 0, 0],
      },
    }
  },
  mounted() {
    // this.getData();
    this.collectorId && (this.getData());
  },
  methods: {
    getData(){
      this.dataLoading = true;
      axios.all([this.getModelByCollectorId(this.collectorId),this.getModelDataByCollectorId(this.collectorId)]).then(axios.spread((res, res2) => {
        this.model = res.data;
        this.modelData = res2.data;
      })).finally(()=>{
        this.dataLoading = false;
      })
    },
  },
  watch: {
    collectorId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.getData();
        }
      }
    },
    mqttData: {
      handler(newVal, oldVal) {
        if(newVal){
          this.modelData = assign({P: 0, Q: 0, f: 0, Ua: 0, Ub: 0, Uc: 0,Ia:0,Ic:0,}, newVal);
        }

      },
      deep: true,
    }
  },
}
