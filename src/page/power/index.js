/**
 * Created by lixiansky on 2021/9/3
 */
import Base from "../../apps";
import {axiosInstance} from "@/axios/request";
import assign from 'lodash/assign';
export default class PowerSwitch extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '停送电管理'
      }
    ];

    this.routers = [
      {
        path: "apply",
        name: "power_switch_apply",
        meta: {
          title: '停送电申请',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          'power-switch_manage': () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_switch_apply" */ "./apply/apply.vue");
          },
        },
      },
      {
        path: "record",
        name: "power_switch_record",
        meta: {
          title: '停送电记录',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          'power-switch_manage': () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_switch_record" */ "./record/record.vue");
          },
        },
      },
      {
        path: "detail/:uuId",
        name: "power_switch_detail",
        meta: {
          title: '停送电详细',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          'power-switch_manage': () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "power_switch_detail" */ "./detail/detail.vue");
          },
        },
      },
    ];
  }

  // 获取停送电申请
  getPowerSwitchApply(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/power_switch/search',
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

  // 保存停送电申请
  postPowerSwitchApply(data){
    return axiosInstance({
      url: '/api-electricity/power_switch',
      method: 'post',
      data: data,
    });
  }

  // 获取设备
  getEquipments(page, rows, params){
    return axiosInstance({
      url: '/api-capital/equipments/search',
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

  // 获取流程定义
  getWorkflowDefine(data){
    return axiosInstance({
      url:'/api-global/wf/define/search',
      method:'post',
      data: data
    });
  }

  // 获取停送电记录
  getPowerSwitchRecord(page, rows, params){
    return axiosInstance({
      url: '/api-electricity/power_switch/record',
      method: 'get',
      params: ((_params) => {
        return assign({
        }, _params)
      })((params ? params : {})),
    });
  }
  // 导出
  exportPowerSwitchRecord(params){
    return axiosInstance({
      url: '/api-electricity/power_switch/record/export',
      method: 'get',
      params: ((_params) => {
        return assign({
        }, _params)
      })((params ? params : {})),
    });
  }
}
