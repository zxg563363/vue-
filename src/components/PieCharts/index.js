import {option} from "./option";
import {charts} from '@/components/mixins/echarts';
import uniqueId from 'lodash/uniqueId';
import reduce from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
/**
 * Created by lixiansky on 2021/8/3
 */
export default {
  name: "PieCharts",
  mixins: [charts],
  data() {
    return {
      dataLoading: false,
      vm: {
        uuId: uniqueId('pieCharts_'),
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
        _option.series[0]['data'] = reduce(newVal['datas'],(results, value, index)=>{
          results.push({
            name: newVal['titles'][index],
            value,
          });
          return results;
        },[]);
        _option.series[0]['name'] = newVal['name'] || '';
        myChart.clear();
        myChart.setOption(_option);
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
