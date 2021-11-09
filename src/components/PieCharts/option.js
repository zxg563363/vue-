/**
 * Created by lixiansky on 2021/8/3
 */
let option = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    top: 20,
    right:0,
  },

  series: [
    {
      name: '',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['40%', '50 %'],
      // avoidLabelOverlap: false,

      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: true
      },
      data: [

      ]
    }
  ]
};
export {option};
