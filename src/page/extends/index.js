/**
 * Created by lixiansky on 2021/7/26
 */
import {axiosFormDataInstance,axiosInstance} from "@/axios/request";
import Base from "@/apps";
export default class BusinessExtends extends Base {
  constructor() {
    super();

    // 路由
    this.routers = [
      {
        path: "workorder/detail/:uuId",
        name: "extends_workorder_detail",
        meta: {
          title: '工单详细扩展',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          extends_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "extends_workorder_detail" */ "./workorderDetail/workorderDetail.vue");
          },
        },
      },
      {
        path: "process/intervention/:uuId",
        name: "extends_process_intervention",
        meta: {
          title: '流程干预',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          extends_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "extends_process_intervention" */ "../systemManage/intervention/intervention.vue");
          },
        },
      },

      {
        path: "equipment/detail/:uuId",
        name: "extends_equipment_detail",
        meta: {
          title: '设备详细信息',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          extends_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "extends_equipment_detail" */ "./equipmentDetail/equipmentDetail.vue");
          },
        },
      },

      // 停送电审批明细
      {
        path: "power-switch/apply/detail/:uuId",
        name: "power-switch_apply_detail",
        meta: {
          title: '停送电审批详细信息',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          extends_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "switch_apply_detail" */ "./powerSwitchDetail/powerSwitchDetail.vue");
          },
        },
      },
    ];

  }
}
