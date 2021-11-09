/**
 * Created by lixiansky on 2021/8/3
 */
import * as echarts from 'echarts';
let option = {
  tooltip: {
    trigger: 'item',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '2%',
    right: '4%',
    bottom: '0',
    top:'50',
    containLabel: true
  },
  legend: {
    data: [],
    left: 'center',
    top:'5%',
    textStyle: {
      color: "#666666"
    },
    itemWidth: 15,
    itemHeight: 10,
    itemGap: 25
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      lineStyle: {
        color: '#cdd5e2'
      }
    },
    axisLabel: {
      color: "#666666"
    },
  },

  yAxis: [{
    type: 'value',
    splitLine: {
      show: false,
    },
    axisLabel: {
      color: "#666666"
    },
    axisLine: {
      lineStyle: {
        color: '#cdd5e2'
      }
    },
  },
    {
      type: "value",
      name: "百分比",
      nameTextStyle: {
        color: "#666666"
      },
      position: "right",
      axisLine: {
        lineStyle: {
          color: '#cdd5e2'
        }
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        formatter: "{value} %", //右侧Y轴文字显示
        color: "#666666"
      }
    }
  ],
  series: []
};
export {option};
