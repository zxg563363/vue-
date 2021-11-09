/**
 * Created by lixiansky on 2021/8/2
 */
import reduce from 'lodash/reduce';
const processChartsData = {
  methods: {
    // 组装任务分时数据
    processTimeSharingData(data){
      let _temp = {'status0s': '未巡检','status1s': '巡检正常','status2s': '巡检异常'};
      return reduce(data,(results, value, key)=>{
        _temp[key] && (results['titles'] ? results['titles'].push(_temp[key]) : results['titles'] = [_temp[key]]);
        key ==='times' && (results['times'] = value);
        _temp[key] && (results['datas'] ? results['datas'].push(value) :results['datas'] = [value]);
        return results;
      },{});
    }
  },
};
export {processChartsData};
