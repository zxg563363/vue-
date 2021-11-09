/**
 * Created by lixiansky on 2021/7/11
 */
export default{
  'pie': {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'left',
      type: 'scroll',
      orient: 'vertical',
    },
    series: [
      {
        name: '表单类型',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['60%', '50%'],
        labelLine: {
          show: true
        },
        data: [
          {value: 1048, name: '类型01'},
          {value: 735, name: '类型02'},
          {value: 580, name: '类型03'},
          {value: 484, name: '类型04'},
          {value: 300, name: '类型05'}
        ]
      }
    ]
  },
}
