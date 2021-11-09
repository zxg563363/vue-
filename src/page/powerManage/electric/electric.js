import * as echarts from 'echarts';
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {getDevice} from "@/axios/deviceManage/deviceList"
// import {currentAppend} from "@/axios/powerManage/electric"
import moment from 'moment';
export default {
  data() {
    return {
      breadcrumbList: [],
      equitData: [],
      nowEcharts: null,
      xAxisTime:[],
      loopTimer:null,
      times:10,
      data:[100,200,500,100,5,10],
      equitProps: {
        label: 'equipName'
      },
    }
  },
  mounted() {
    this.toBreadcrumb()
    this.init()
    this.nowChart()
  },
  methods: {
    init() {
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": []
        },
        "page": 1,
        "rows": 10,
        "sidx": "",
        "sord": "asc"
      }
      getDevice(data).then(res => {
        this.equitData = res.data
      })
      let that = this
      that.loopTimer = null
      that.loopTimer = setInterval(function () {
           that.timeSpace(that.times * 1000).reverse()
           console.log(that.xAxisTime)
           that.getNextDatas()
      },10000)
      this.xAxisTime = this.timeSpace(this.times * 1000).reverse()
    },
    getNextDatas() {

        //根据间隔获取下一次数据
        // currentAppend(this.params,this.times,this.lastLimit).then((response) => {
            // this.lastLimit = response.data.begin + response.data.limit - 1
            //返回第一条始终更新原数组 最后一条
            let updateData = [0,0,0,0,0,0]
            this.data.splice(this.data.length - 1,1,updateData)
            //如果limit大于1 则删除第一项 并更新时间 其余推入
            // if(response.data.limit > 1) {
                let times = moment().format('YYYY-MM-DD HH:mm:ss')
                this.xAxisTime.push(times)
                var newArr = updateData.slice(0);
                newArr.splice(0, 1);
                for(var i = 0; i < newArr.length; i++) {
                    this.data.push(newArr[i])
                }
            // }
        // })
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [{
          path: '/',
          name: '首页'
        },
        {
          name: '电源管理'
        },
        {
          name: '供电线路管理'
        }
      ]
    },
    getEquitId(data) {
      console.log(data)
    },
    nowChart() {
      !this.nowEcharts && (this.nowEcharts = echarts.init(document.getElementById('nowEcharts')));
      let data = this.data
      var option = {
        tooltip: {
          show: true,
          trigger: 'axis',
          // transitionDuration: 0,
          backgroundColor: 'rgba(50,50,50,0.7)',
          textStyle: {
            color: '#fff'
          },
          borderWidth: '0',
          formatter: function(params) {
            let str = ''
            for (let i = 0; i < params.length; i++) {
              str += params[i].marker + params[i].axisValueLabel + ' ' + params[i].seriesName + ' : ' + params[i].data +'<br/>'
            }
            return str
          },
          axisPointer: {
            lineStyle: {
              type: 'solid',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            }
          }
        },
        grid: {
          top: 30,
          left: 40,
          right: 200,
          bottom: 80
        },
        xAxis: {
          data: this.xAxisTime,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#003399'
            }
          },
          axisLabel: {
            color: '#0081C2',
            fontSize: 14,
          }
        },
        yAxis: {
          axisLabel: {
            color: '#0081C2',
            fontSize: 14
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#003399'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#003399'
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 90,
          end: 100,
        }, {
          height: 20, // 这里可以设置dataZoom的尺寸
          // start: 90,
          // end: 100,
          backgroundColor: '#0081C2',
          handleIcon: "path://M0,0 v9.7h5 v-9.7h-5 Z",
          handleSize: '70%',
          borderColor: '#2A5AAF',
          fillerColor: '#0073DE',
          handleStyle: {
            color: '#0081C2',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowOffsetX: 2,
            shadowOffsetY: 10,
            borderColor: '#666',
          },
          textStyle: {
            color: '#0081C2',
            fontSize: 14
          }
        }],
        series: [{
          name: '电流',
          type: 'line',
          data: data,
          smooth: 0.2,
          symbolSize: 0,
          symbol: 'none',
          itemStyle: {
            color: '#1334F9'
          },
          lineStyle: {
            color: '#1334F9',
            width: 3
          },
          areaStyle: {
            origin: 'start',
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: []
            }
          }
        },{
          name: '电压',
          type: 'line',
          data: [100,100,100,100,100,100,100,100,100,100,100,100,100,100,500,100,100,500],
          smooth: 0.2,
          symbolSize: 0,
          symbol: 'none',
          itemStyle: {
            color: 'red'
          },
          lineStyle: {
            color: 'red',
            width: 3
          },
          areaStyle: {
            origin: 'start',
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: []
            }
          }
        }]
      }
      this.nowEcharts.setOption(option)
    },
    timeSpace(space) {
      let startDate = moment().startOf('day').format('x')
      let endDate = moment().format('x')
      var mod = endDate - startDate; //16h
      var dateArray = [];
      var a = new Date();
      if (mod % space != 0) {
        endDate = endDate - mod % space;
      }
      a.setTime(endDate);
      a = this.nowtime(a);
      dateArray.push(a);
      while (mod - space >= space) {
        var d = new Date();
        d.setTime(endDate - space);
        d = this.nowtime(d);
        dateArray.push(d);
        mod = mod - space;
        endDate = endDate - space;
      }
      // 加入开始时间
      a = new Date();
      a.setTime(startDate);
      a = this.nowtime(a);
      dateArray.push(a);
      return dateArray;
    },
    nowtime(dt) {
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1 < 10 ?
          "0" + (dt.getMonth() + 1) :
          dt.getMonth() + 1) +
        "-" +
        (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()) +
        " " +
        (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) +
        ":" +
        (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes()) +
        ":" +
        (dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds())
      );
    },
  },
  components: {
    Breadcrumb
  },
  destroyed() {
      //清除定时器
      clearInterval(this.loopTimer)
  },
  watch: {
    data(val){
        this.nowChart()
    }
  }
}
