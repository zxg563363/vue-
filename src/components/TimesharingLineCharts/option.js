/**
 * Created by lixiansky on 2021/8/2
 */
let option = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    left: '30',
    right: '60',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {

    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#DCE2E8'
      }
    },
    axisLabel: {
      interval: 0,
      color: '#666666',
      rotate: -45,
    },
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine:{
      lineStyle:{
        type: 'dashed',
      }
    }
  },
  series: []
};
export {option};
