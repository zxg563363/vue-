/**
 * Created by lixiansky on 2021/8/31
 */
let option = {
  title: {
    text: '折线图堆叠',
    show: false,
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '40',
    bottom: '50',
    top: '40',
    containLabel: true
  },

  toolbox: {
    feature: {
      saveAsImage: {}
    },
    show: false,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLabel: {
      color: '#666666',
      rotate: 0,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#DCE2E8',
      },
    },
    axisTick: {
      show: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  yAxis: {
    type: 'value',
    name: '单位：V',
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: 'Ua',
      type: 'line',
      smooth: true,
      data: [],
      symbol: 'none'
    },
  ]
};
export {option};
