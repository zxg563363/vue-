/**
 * Created by lixiansky on 2021/8/31
 */
import {axiosInstance} from "@/axios/request";
import uniqueId from 'lodash/uniqueId';
import {option} from "./option";
import {charts} from '@/components/mixins/echarts';
import reduce from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
import has from 'lodash/has';
import assign from 'lodash/assign';
import concat from 'lodash/concat';
export default {
  name: "RealTimeLineCharts",
  mixins: [charts],
  data() {
    return {
      dataLoading: false,
      vm: {
        uuId: uniqueId('real-time-line-charts-'),
        option: JSON.parse(JSON.stringify(option)),
      },
      myChart: null,
    }
  },
  mounted() {
    this.init();
  },
  destroyed(){

  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        // console.log(newVal,oldVal);
        if(has(newVal,'titles')){
          this.myChart = this.createEchartsInstance(this.$refs.echarts);
          let _option = this.vm.option;
          _option.legend.data = newVal['titles'];
          _option.xAxis.data = newVal['times'];
          _option.series = reduce(newVal['datas'],(results,value)=>{
            results.push(assign({
              type: 'line',
              smooth: true,
              showSymbol: false,
            },value));
            return results;
          },[]);
          _option.yAxis.name = newVal['unitName'];
          !this.myChart && (this.myChart = this.createEchartsInstance(this.$refs.echarts));
          this.myChart.clear();
          this.myChart.setOption(_option);
        }
      },
      deep: true,
    },
    increaseData:{
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        this.vm.option.xAxis.data = concat(this.vm.option.xAxis.data,newVal['times']);
        this.vm.option.series[0].data = concat(this.vm.option.series[0].data,newVal['datas'][0]);
        this.vm.option.series[1].data = concat(this.vm.option.series[1].data,newVal['datas'][1]);
        newVal['datas'][2] && (this.vm.option.series[2].data = concat(this.vm.option.series[2].data,newVal['datas'][2]));
        // console.log(this.vm.option);
        !this.myChart && (this.myChart = this.createEchartsInstance(this.$refs.echarts));
        this.vm.option.yAxis.name = newVal['unitName'];
        this.myChart.setOption(this.vm.option);
      },
      deep: true,
    }
  },
  methods: {
    init(){
      let myChart = this.createEchartsInstance(this.$refs.echarts);
      this.installResizeEvent(myChart);
      myChart.clear();
      myChart.setOption(this.vm.option);
      isFunction(this.$props.completed) && this.$props.completed(myChart);
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    height:{
      type: Number,
      required: false,
    },
    completed: {
      type: Function,
      required: false,
    },
    increaseData: {
      type: Object,
      required: false,
    },
  }
}
