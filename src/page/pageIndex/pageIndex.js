import * as echarts from 'echarts';

export default {
  name: '',
  data() {
    return {
      //审核列表
      auditTable: [{
        id: 0
      }, {
        id: 1
      }, {
        id: 2
      }],
      //备件低库存列表
      spareTable: [{
        id: 0
      }, {
        id: 1
      }, {
        id: 2
      }, {
        id: 2
      }, {
        id: 2
      }],
      //任务通知
      taskList: [{
        id: 0
      }, {
        id: 1
      }],
      equitType: null,
      spareType: null,
      taskMess: null
    }
  },
  mounted() {
    this.getEquit()
    this.getSpare()
    this.getTask()
  },
  methods: {
    // 初始化数据
    init() {

    },
    //获取设备类型柱状图
    getEquit() {
      !this.equitType && (this.equitType = echarts.init(document.getElementById('equitType')));
      var option = {
        tooltip: {},
        grid: {
          top: 50,
          left: 40,
          right: 0,
          bottom: 80
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'pig'],
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 16,
            color: '#121212'
          },
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        yAxis: {
          splitNumber: 3,
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 16,
            color: '#121212'
          },
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130, 250],
          type: 'bar',
          itemStyle: {
            color: "#3B85FE",
          },
          barWidth: 38,
        }]
      };
      this.equitType.setOption(option);
    },
    //获取备件类型饼图
    getSpare() {
      !this.spareType && (this.spareType = echarts.init(document.getElementById('spareType')));
      var option = {
        tooltip: {
          trigger: 'item'
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
        },
        legend: {
          top: '25%',
          orient: 'vertical',
          left: 'right',
          textStyle: { //图例文字的样式
            fontSize: 16,
            color: '#121212'
          },
          itemGap: 20
        },
        series: [{
          width: "80%",
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 5
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          right: 500,
          data: [{
              value: 1048,
              name: '类型一',
              itemStyle: {
                color: "#4189FF"
              }
            },
            {
              value: 735,
              name: '类型二',
              itemStyle: {
                color: "#FF2D14"
              }
            },
            {
              value: 580,
              name: '类型三',
              itemStyle: {
                color: "#00D6ED"
              }
            },
            {
              value: 484,
              name: '类型四',
              itemStyle: {
                color: "#00D20B"
              }
            },
            {
              value: 300,
              name: '类型五',
              itemStyle: {
                color: "#4189FF"
              }
            }
          ]
        }]
      }
      this.spareType.setOption(option);
    },
    //获取执行情况折线图
    getTask() {
      !this.taskMess && (this.taskMess = echarts.init(document.getElementById('taskMess')));
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 10,
          textStyle: { //图例文字的样式
            fontSize: 16,
            color: '#121212'
          },
           itemGap: 40,
          data: ['巡检', '点检', '保养']
        },
        grid: {
          left: 0,
          right: 20,
          bottom: 30,
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: 16,
            color: '#121212'
          },
          splitLine: {
            show: false
          },
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          splitLine: {
            show: false
          },
          type: 'value',
          axisLabel: {
            fontSize: 16,
            color: '#121212'
          },
        },
        series: [{
            symbolSize: 8,
            name: '巡检',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            itemStyle: {
              color: "#FBC115"
            }
          },
          {
            symbolSize: 8,
            name: '点检',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310],
            itemStyle: {
              color: "#FEED2F"
            }
          },
          {
            symbolSize: 8,
            name: '保养',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410],
            itemStyle: {
              color: "#1BE800"
            }
          },
        ]
      };
      this.taskMess.setOption(option);
    }
  }
}
