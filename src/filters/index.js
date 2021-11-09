import Vue from 'vue';
import moment from 'moment';
moment.locale('zh-cn');
import round from 'lodash/round';
import isNumber from 'lodash/isNumber';

//字符超出省略号，默认值是5个
Vue.filter('ellipsis', (value, num) => {
    const nums = num || '5';// 设置限定字数,默认为5
    if (!value) return '';
    if (value.length > nums) {
        return value.slice(0, nums) + '...';
    }
    return value;
});

// 格式化文件大小
Vue.filter('renderSizeFormatter', (value) => {
  if (value === null || value === '' || value === 0) {
    return '0 Bytes';
  }
  // console.log(value);
  let unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  let srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  size = size.toFixed(2);
  return size + ' ' + unitArr[index];
});

// 表单类型
Vue.filter('formTypeFormatter', (value,needKey) => {
  let _map = {
    'inspection': {
      label: '巡检'
    },
    'maintain': {
      label: '保养'
    },
    'spotcheck': {
      label: '点检'
    }
  };
  return _map[value] ? (needKey ? _map[value][needKey]: _map[value]['label']) : "-";
});

Vue.filter('dateHumanize',(value) => {
  let _duration = moment(value).diff(moment(),'minutes');
  return _duration < -30 ? value : moment.duration(_duration,'minutes').humanize(true);
});

// 保留几位小数
Vue.filter('numberRound',(value,length) => {
  return round(value,(isNumber(length) ? length :2));
});

