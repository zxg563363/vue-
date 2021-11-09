/**
 * Created by lixiansky on 2021/8/4
 */
import * as echarts  from "echarts";
let option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',
    text: '',
  },
  grid: {
    left: '30',
    right: '30',
    bottom: '50',
    containLabel: true
  },
  toolbox: {
    show: false,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: '#DCE2E8'
      }
    },
    axisLabel: {
      color: '#666666',
    },
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [{
    type: 'inside',
    start: 0,
    end: 80
  }, {
    start: 0,
    end: 80
  }],
  series: [
    {
      name: '数据',
      type: 'line',
      smooth: true,
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgb(255, 70, 131)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(255, 158, 68)'
        }, {
          offset: 1,
          color: 'rgb(255, 70, 131)'
        }])
      },
      data: []
    }
  ]
};
export {option};
