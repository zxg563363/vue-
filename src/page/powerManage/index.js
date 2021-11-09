/**
 * Created by lixiansky on 2021/7/16
 */
import assign from 'lodash/assign';
import request,{axiosInstance} from "@/axios/request";
import Base from "../../apps";
export default class Power extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '电源管理'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "realTime",
        name: "power_real_time",
        meta: {
          title: '实时数据',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          power_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_real_time" */ "./realTime/realTime.vue");
          },
        },
      },
      {
        path: "gateway",
        name: "power_gateway",
        meta: {
          title: '网关管理',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          power_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_gateway" */ "./gateway/gateway.vue");
          },
        },
      },
      {
        path: "historyData",
        name: "power_history_data",
        meta: {
          title: '网关管理',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          power_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_history_data" */ "./history/history.vue");
          },
        },
      },
      {
        path: "plc",
        name: "power_plc",
        meta: {
          title: 'PLC管理',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          power_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_plc" */ "./plc/plc.vue");
          },
        },
      },
      {
        path: "alarm",
        name: "power_alarm",
        meta: {
          title: '告警管理',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          power_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_alarm" */ "./alarm/alarm.vue");
          },
        },
      },
      {
        path: "command",
        name: "power_command",
        meta: {
          title: '指令日志',
          keepAlive: false
        },
        components: {
          // 父级路由名称
          'power_manage': () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_command" */ "./command/command.vue");
          },
        },
      },
    ];
  }

  getData(page, rows, params) {
    return request({
      url: '/api-capital/spare/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "createTime",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    })
  }

  // 获取终端空间树信息
  getTerminalTreeData(){
    return axiosInstance({
      url: '/api-electricity/collectors/tree/space',
      method: 'get',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 查询采集点数据（实时）
  getCollectorRealData(collectorId){
    return axiosInstance({
      url: '/api-electricity/data/model/real/',
      method: 'get',
      params: {collectorId},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 查询内置数据模型
  getDefaultDataModel(){
    return axiosInstance({
      url: '/api-electricity/data/models',
      method: 'get',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 查询采集点内置数据模型
  getDataModelByCollectorId(collectorId){
    return axiosInstance({
      url: '/api-electricity/data/model',
      method: 'get',
      params: {collectorId},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 查询通讯网关
  getCommunicationGateway(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/transmits/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 查询采集终端
  getCollectorsByGatewayId(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/collectors/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 获取空间数据
  getSpaceData(){
    return axiosInstance({
      url: '/api-capital/space',
      method: 'get',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 根据空间id获取设备信息
  getDeviceBySpaceId(page, rows, params){
    return axiosInstance({
      url: '/api-capital/equipments/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 获取数据模型
  getModelsData(){
    return axiosInstance({
      url: '/api-electricity/data/model/search',
      method: 'get',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 保存终端设备
  saveCollectors(data){
    return axiosInstance({
      url: '/api-electricity/collectors',
      method: 'post',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  updateCollectors(data){
    return axiosInstance({
      url: '/api-electricity/collectors',
      method: 'patch',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 移除终端
  removeCollectors(id){
    return axiosInstance({
      url: '/api-electricity/collectors/'+id,
      method: 'delete',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? (results.error.errorCode + '【' + results.error.errorMsg + '】'): '未知错误');
    });
  }

  // 添加网关
  saveTransmit(data){
    return axiosInstance({
      url: '/api-electricity/transmits',
      method: 'post',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 更新网关信息
  updateTransmit(data){
    return axiosInstance({
      url: '/api-electricity/transmits',
      method: 'patch',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 移除网关信息
  removeTransmit(id){
    return axiosInstance({
      url: '/api-electricity/transmits/'+id,
      method: 'delete',
      params: {},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取设备历史数据
  getCollectorHistoryData(collectorId,key,startTime,endTime){
    return axiosInstance({
      url: '/api-electricity/data/model/history',
      method: 'get',
      params:{
        collectorId,key,startTime,endTime
      }
    });
  }

  // 获取规则
  getRuleListByCollectorId(collectorId){
    return axiosInstance({
      url: '/api-electricity/rule/search',
      method: 'get',
      params:{
        collectorId
      }
    });
  }

  // 移除规则
  removeRule(ruleId){
    return axiosInstance({
      url: '/api-electricity/rule',
      method: 'delete',
      params:{
        ruleId
      }
    });
  }

  // 重载规则到内存
  reloadRule(collectorId){
    return axiosInstance({
      url: '/api-electricity/rule/reload',
      method: 'get',
      params:{
        collectorId
      }
    });
  }

  // 获取告警信息列表
  getAlarmData(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/alarm/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "alarmTime",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    });
  }

  // 获取指令日志信息列表
  getPowerCommandData(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/command/search',
      method: 'post',
      data: ((_params) => {
        return assign({
          sidx: "createTime",
          sord: "desc",
          "page": page, rows,
        }, _params)
      })((params ? params : {})),
    });
  }

  // 绑定plc
  bindPLC(plcId){
    return axiosInstance({
      url: '/api-electricity/plc/bind',
      method: 'get',
      params:{
        plcId
      }
    });
  }
  unbindPLC(plcId){
    return axiosInstance({
      url: '/api-electricity/plc/unbind',
      method: 'get',
      params:{
        plcId
      }
    });
  }
  getPLC(){
    return axiosInstance({
      url: '/api-electricity/plc',
      method: 'get',
      params:{}
    });
  }

  updatePLC(data){
    return axiosInstance({
      url: '/api-electricity/plc',
      method: 'put',
      data
    });
  }
  getDeviceByPlcId(plcId){
    return axiosInstance({
      url: '/api-electricity/plc/devices',
      method: 'get',
      params:{plcId}
    });
  }
  postDeviceByPlcId(plcId, data){
    return axiosInstance({
      url: '/api-electricity/plc/device?plcId='+plcId,
      method: 'post',
      data,
    });
  }
  deleteDeviceById(id){
    return axiosInstance({
      url: '/api-electricity/plc/device',
      method: 'delete',
      params: {id},
    });
  }
  putDeviceByPlcId(data){
    return axiosInstance({
      url: '/api-electricity/plc/device',
      method: 'put',
      data,
    });
  }
}
