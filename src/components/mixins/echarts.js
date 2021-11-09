/**
 * Created by lixiansky on 2021/8/2
 */
import * as echarts  from "echarts";
import debounce from 'lodash/debounce';

const charts = {
  methods: {
    createEchartsInstance(el) {
      let chart = echarts.getInstanceByDom(el); //获取实例，不要重复初始化
      if (!chart) {
        chart = echarts.init(el);
        //$once钩子的好处：
        //1每个新的实例都程序化地在后期清理它自己
        //2减少dom查询
        this.$once("hook:beforeDestroy", () => {
          // console.log('hook:beforeDestroy');
          chart.clear();
          !charts.isDisposed && (echarts.dispose(chart));
          chart = null;
        });
      }
      return chart;
    },

    installResizeEvent(myChart) {
      if(!myChart){
        return false;
      }
      let _debounce = debounce(() => {
        myChart.resize();
      }, 200, {'trailing': true,'leading': true,});
      window.addEventListener('resize', ()=>{
        _debounce();
      });
      myChart.isDisposed && (window.removeEventListener('resize', ()=>{
        myChart.resize();
      }));
    },


  }
};
export {charts};
