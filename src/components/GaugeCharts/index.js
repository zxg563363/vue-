/**
 * Created by lixiansky on 2021/7/30
 */
import uniqueId from 'lodash/uniqueId';
import {option} from "./option";
import {charts} from '@/components/mixins/echarts';
import isFunction from 'lodash/isFunction';
export default {
  name: "GaugeCharts",
  mixins: [charts],
  data() {
    return {
      dataLoading: false,
      vm: {
        uuId: uniqueId('gaugeCharts_'),
        option: JSON.parse(JSON.stringify(option)),
      },
    }
  },
  components: {},
  mounted() {
    // console.log(this.params,this.data);
    let _option = this.vm.option;
    _option.series[1]['name'] = this.params['unitName'] || '';
    _option.series[0]['min'] = this.params['range'][0];
    _option.series[0]['max'] = this.params['range'][1];
    _option.series[1]['min'] = this.params['range'][0];
    _option.series[1]['max'] = this.params['range'][1];
    _option.series[1]['detail']['formatter'] = [
      '{value} '+(this.params['unitName'] || ''),
      '{name|'+(this.params['paramsName'] || '')+'}'
    ].join('\n');
    this.init();
  },
  destroyed(){

  },
  watch: {
    data:{
      handler(newVal, oldVal) {
        let myChart = this.createEchartsInstance(this.$refs.gaugeCharts);
        let _option = this.vm.option;
        _option.series[1]['name'] = this.params['unitName'] || '';
        _option.series[0]['min'] = this.params['range'][0];
        _option.series[0]['max'] = this.params['range'][1];
        _option.series[1]['min'] = this.params['range'][0];
        _option.series[1]['max'] = this.params['range'][1];
        _option.series[1]['detail']['formatter'] = [
          '{value} '+(this.params['unitName'] || ''),
          '{name|'+(this.params['paramsName'] || '')+'}'
        ].join('\n');
        _option.series[1]['data'] = [{value: newVal}];
        myChart.setOption(_option);
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  methods: {
    init(){
      let myChart = this.createEchartsInstance(this.$refs.gaugeCharts);
      this.installResizeEvent(myChart);
      myChart.clear();
      myChart.setOption(this.vm.option);
      isFunction(this.$props.completed) && this.$props.completed(myChart);
    }
  },
  props: {
    data: {
      type: Number,
      required: true,
    },
    params:{
      type: Object,
      required: true,
    },
    completed: {
      type: Function,
      required: false,
    }
  }
}
