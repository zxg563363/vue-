/**
 * Created by lixiansky on 2021/8/4
 */
import {option} from "./option";
import {charts} from '@/components/mixins/echarts';
import uniqueId from 'lodash/uniqueId';
import concat from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
export default {
  name: "LargeDataAreaChartsV2",
  mixins: [charts],
  data() {
    return {
      dataLoading: false,
      vm: {
        uuId: uniqueId('largeDataAreaChartsV2_'),
        option: JSON.parse(JSON.stringify(option)),
      },
    }
  },
  components: {},
  mounted() {
    this.init();
  },
  destroyed(){

  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        let myChart = this.createEchartsInstance(this.$refs.echarts);
        let _option = this.vm.option;
        _option.title.text = newVal['name'];
        _option.series[0]['data'] = newVal['datas'] || [];
        _option.xAxis.data = newVal['titles'] || [];
        myChart.clear();
        myChart.setOption(_option);
      },
      deep: true,
    },
    increaseData:{
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        this.vm.option.xAxis.data = concat(this.vm.option.xAxis.data,newVal['titles']);
        this.vm.option.series[0].data = concat(this.vm.option.series[0].data,newVal['datas']);
        // // console.log(this.vm.option);
        !this.myChart && (this.myChart = this.createEchartsInstance(this.$refs.echarts));
        this.vm.option.title.text = newVal['name'];
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
