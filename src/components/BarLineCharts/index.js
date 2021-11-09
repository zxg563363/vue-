import {option} from "./option";
import {charts} from '@/components/mixins/echarts';
import uniqueId from 'lodash/uniqueId';
import reduce from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
/**
 * Created by lixiansky on 2021/8/3
 */
export default {
  name: "BarLineCharts",
  mixins: [charts],
  data() {
    return {
      dataLoading: false,
      vm: {
        uuId: uniqueId('barLineCharts_'),
        option: JSON.parse(JSON.stringify(option)),
      },
    }
  },
  components: {},
  mounted() {
    this.init();
  },
  destroyed() {

  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        if(isEmpty(newVal)){
          return false;
        }
        let myChart = this.createEchartsInstance(this.$refs.echarts);
        this.vm.option.xAxis.data = newVal['titles'];

        let _map = reduce(newVal['legend'],(results,value)=>{
          results.legend.push(value['label']);
          results.series.push({
            name: value['label'],
            type: 'bar',
            barWidth: '12px',
            itemStyle: {
              borderRadius: 6,
            },
            data: newVal[value['value']],
          });
          return results;
        },{legend: [], series: []});
        this.vm.option.legend.data  = _map['legend'];
        this.vm.option.series = _map['series'];
        this.vm.option.series.push({
          name: "正常率",
          type: "line",
          yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
          smooth: true, //平滑曲线显示
          symbol: "circle", //标记的图形为实心圆
          symbolSize: 8, //标记的大小
          itemStyle: {
            color: '#ffa43a',
            borderColor: 'rgba(255, 234, 0, 0.5)',  //圆点透明 边框
            borderWidth: 5
          },
          lineStyle: {
            color: "#ffa43a"
          },

          data: newVal['percentage'],
        });
        console.log(this.vm.option);
        myChart.clear();
        myChart.setOption(this.vm.option);
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
    }
  }
}
