/**
 * Created by lixiansky on 2021/8/4
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Power from '../index';
import {request} from '@/components/mixins/request';
import {axios} from '@/axios/request';
import moment from 'moment';
import LargeDataAreaCharts from '@/components/LargeDataAreaCharts/LargeDataAreaCharts';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import range from 'lodash/range';
import concat from 'lodash/concat';
import reverse from 'lodash/reverse';
export default {
  mixins: [request],
  components: {
    Breadcrumb,
    LargeDataAreaCharts,
  },
  watch: {
    'vm.filterText'(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      breadcrumbList: [],
      instance: new Power(),
      vm: {
        filterText: '',
        treeData: [],
        treeLoading: false,
        currentNode: {name:'暂无'},
        models: [],
        realDataLoading: false,
        historyDataLoading: false,
        historyData: {},
      },
      params: {
        dateType: 'interval',
        dateTypeDateValue: new Date(),
        dateTypeValue: 2,
        collectorId: '',
        key: '',
        times: [moment().subtract(2,'hour').format('YYYY-MM-DD HH:mm:ss'),moment().format('YYYY-MM-DD HH:mm:ss')],
      },
      conditionMap: {
        interval: {
          options: ((_range, _interval)=>{
            return reduce(_range,(results, value, index)=>{
              results.push({label: value,'value': `近${value}小时`, 'interval': _interval[index]});
              return results;
            }, []);
          })([2,4,6,8,10,12,14,16,18,20,22,24],['00:00 ~ 02:00','02:00 ~ 04:00',
            '04:00 ~ 06:00','06:00 ~ 08:00','08:00 ~ 10:00',
            '10:00 ~ 12:00','12:00 ~ 14:00','14:00 ~ 16:00',
            '16:00 ~ 18:00','18:00 ~ 20:00','20:00 ~ 22:00','22:00 ~ 23:59:59'
          ]),
          condition:(()=>{
            return ()=> {
              // 动态组装批量请求
              return axios.all(reduce(reverse(range(0, this.params.dateTypeValue / 2)), (results, value, i) => {
                results.push(this.processRequest(value));
                return results;
              }, [])).then(axios.spread((...args) => {
                // console.log(args);
                return this.processRequestData(args);
              }));
            }
          })(),
          reset:()=>{
            this.$set(this.params,'dateTypeValue',2);
          }
        },
        // 分时
        time_share: {
          condition:(()=>{
            return ()=> {
              let _temp = ['00:00:00','02:00:00','04:00:00','06:00:00','08:00:00','10:00:00',
                '12:00:00','14:00:00','16:00:00','18:00:00','20:00:00','22:00:00'];
              let _arr = reduce(_temp,(results, value, i)=>{
                results.push({start: value, end: ((i=== _temp.length-1)? '23:59:59' : _temp[i+1])});
                return results;
              },[]);
              // console.log(_arr);
              return axios.all(reduce((this.params.dateTypeValue> 0 ? [_arr[(this.params.dateTypeValue/2-1)]]:_arr), (results, value, i) => {
                results.push(this.processRequest2((moment(this.params.dateTypeDateValue)).format('YYYY-MM-DD')+' '+value.start, (moment(this.params.dateTypeDateValue)).format('YYYY-MM-DD')+' '+value.end));
                return results;
              }, [])).then(axios.spread((...args) => {
                // console.log(args);
                return this.processRequestData(args);
              }));
            }
          })(),
          reset:()=>{
            this.$set(this.params,'dateTypeValue',0);
            this.$set(this.params,'dateTypeDateValue',new Date());
          }
        },
        customize: {
          condition:(()=>{
            return ()=> {
              return axios.all([this.processRequest2(moment(this.params.times[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(this.params.times[1]).format('YYYY-MM-DD HH:mm:ss'))]).then(axios.spread((...args) => {
                // console.log(args);
                return this.processRequestData(args);
              }));
            }
          })(),
          reset:()=>{
            this.params.times = [moment().subtract(2,'hour').format('YYYY-MM-DD HH:mm:ss'),moment().format('YYYY-MM-DD HH:mm:ss')];
          }
        }
      }
    }
  },

  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '历史数据'}
    ]);

    this.getTreeData();
  },
  destroyed(){

  },
  methods: {
    dateType(label){
      this.conditionMap[label] && this.conditionMap[label].reset();
    },
    // 组装查询条件及
    processRequest(i, _date){
      // console.log(_date);
      return this.requestProcess(this.instance.getCollectorHistoryData(this.vm.currentNode['id'],this.params.key,
        (i===0 ? moment(_date).subtract((i*120+120),'minutes').format('YYYY-MM-DD HH:mm:ss') : moment(_date).subtract((i*120+120),'minutes').subtract(i,'seconds').format('YYYY-MM-DD HH:mm:ss')),
        (i===0 ? moment(_date).format('YYYY-MM-DD HH:mm:ss'): moment(_date).subtract(i*120,'minutes').subtract(i,'seconds').format('YYYY-MM-DD HH:mm:ss')))).then(res=>{
          return res.data;
      });
    },
    processRequest2(_start, _end){
      // console.log(_date);
      return this.requestProcess(this.instance.getCollectorHistoryData(this.vm.currentNode['id'],this.params.key, _start, _end)).then(res=>{
        return res.data;
      });
    },
    // 处理批量返回的数据
    processRequestData(datas){
      return reduce(datas,(results, value)=>{
        let _titles = reduce(value.times,(_results, _value)=>{
          _results.push(moment(_value * 1000).format('MM-DD HH:mm:ss'));
          return _results;
        },[]);
        results['titles'] = concat(results['titles'],_titles);

        results['datas'] = concat(results['datas'], value['values']);
        return results;
      },{titles: [],datas: [], name: ((model)=>{
          return model ? model['paramsName']+`（${model['unitName']}）`: ''
        })(find(this.vm.models,{paramsKey: this.params.key}))});
    },
    getTreeData(){
      this.vm.treeLoading = true;
      this.instance.getTerminalTreeData().then(results=>{
        this.vm.treeData = results;
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.treeLoading = false;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleNodeClick(data) {
      if(data['type']!== 'collector'){
        this.$message({
          message: `当前节点【${data.name}】，不是采集点`,
          type: 'warning'
        });
        return false;
      }
      this.vm.currentNode = data;

      this.params.key = '';
      this.vm.realDataLoading = true;
      this.instance.getDataModelByCollectorId(data['id']).then((results)=>{
        this.vm.models = results;
        this.vm.realDataLoading = false;

        // 获取历史数据
        results.length>0 && (this.params.key = results[0]['paramsKey'],this.queryHistoryData());
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.realDataLoading = false;
      });
    },

    // 历史数据查询
    queryHistoryData(){
      if(!this.vm.currentNode['id']){
        this.$message({
          type: 'warning',
          message: '请选择采集终端！',
        });
        return false;
      }
      if(!this.params.key){
        this.$message({
          type: 'warning',
          message: '请选择查询的参数项！',
        });
        return false;
      }
      this.vm.historyDataLoading = true;
      // 测试
      this.conditionMap[this.params.dateType] && this.conditionMap[this.params.dateType].condition().then(res=>{
        this.vm.historyData = res;
      }).finally(()=>{
        this.vm.historyDataLoading = false;
      });

    },

    // 计算两个时间的差值
    diffDate(date_1,date_2,flag='seconds'){
      return moment(date_1).diff(moment(date_2),flag);
    }
  },

}
