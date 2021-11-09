/**
 * Created by lixiansky on 2021/7/30
 */
let option = {
  // "backgroundColor": 'rgba(34,41,57,0.8)',
  "series": [
    {
      type: 'gauge',
      // center: [''],
      // radius: '33.33%',  // 1行3个
      splitNumber: 10,
      min: 0,
      max: 100,
      startAngle: 225,
      endAngle: -45,
      axisLine: {
        show: true,
        lineStyle: {
          width: 2,
          shadowBlur: 0,
          color: [
            [1, '#03b7c9']
          ]
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#03b7c9',
          width: 1
        },
        length: -5,
        splitNumber: 10
      },
      splitLine: {
        show: true,
        length: -14,
        lineStyle: {
          color: '#03b7c9',
        }
      },
      axisLabel: {
        distance: -20,
        color: '#03b7c9',
        fontSize: '14',
        fontWeight: 'bold'
      },
      pointer: {
        show: 0
      },
      detail: {
        show: 0
      }
    },

    // 内侧指针、数值显示
    {
      name: '电压',
      type: 'gauge',
      // center: item.pos,
      // radius: '30.33%',
      startAngle: 225,
      endAngle: -45,
      min: 0,
      max: 100,
      axisLine: {
        show: true,
        lineStyle: {
          width: 16,
          color: [
            [1, 'rgba(255,255,255,.1)']
          ]
        }
      },
      axisTick: {
        show: 0,
      },
      splitLine: {
        show: 0,
      },
      axisLabel: {
        show: 0
      },
      pointer: {
        show: true,
        length: '105%'
      },
      detail: {
        show: true,
        offsetCenter: [0, '100%'],
        textStyle: {
          fontSize: 14,
          color: '#fff'
        },
        formatter: [
          '{value} V',
          '{name|电压}'
        ].join('\n'),
        rich: {
          name: {
            fontSize: 14,
            lineHeight: 30,
            color: '#ddd'
          }
        }
      },
      itemStyle: {
        normal: {
          color: '#03b7c9',
        }
      },
      data: [{
        value: 0
      }]
    }
  ]
};
export {option};


