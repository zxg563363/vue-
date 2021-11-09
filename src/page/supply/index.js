/**
 * Created by lixiansky on 2021/10/20
 */
import assign from "lodash/assign";
import { axiosInstance } from "@/axios/request";
import Base from "../../apps";
export default class Supply extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: "/",
        name: "首页"
      },
      {
        name: "供货管理"
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "apply",
        name: "supply_apply",
        meta: {
          title: "补货申请",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          supply_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "supply_apply" */ "./apply/apply.vue"
            );
          }
        }
      },
      {
        path: "waybill",
        name: "supply_waybill",
        meta: {
          title: "发货单管理",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          supply_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "supply_waybill" */ "./waybill/waybill.vue"
            );
          }
        }
      },
      {
        path: "inventory/query",
        name: "supply_inventory_query",
        meta: {
          title: "实时库存查询",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          supply_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "supply_inventory_query" */ "./inventoryQuery/inventoryQuery.vue"
            );
          }
        }
      }
    ];
  }

  getSpares(data) {
    ///动态条件查找备件
    return axiosInstance({
      url: "/api-capital/spare/search",
      method: "post",
      data: data
    });
  }

  getspareData(spareData) {
    console.log(JSON.stringify(spareData))
    ///查找指定备件
    return axiosInstance({
      url: "/api-capital/supplier/supplier/spare/used/details",
      method: "POST",
      data: spareData
    });
  }

  // 获取二级部门
  getChildDepartments() {
    return axiosInstance({
      url: "/api-global/sys/depart/childs/0",
      method: "get",
      params: {}
    });
  }
  // 新增补货计划
  postSupply(params) {
    return axiosInstance({
      url: "/api-capital/supply/plan",
      method: "POST",
      data: params
    });
  }
  // 查询补货计划
  getSupply(params) {
    return axiosInstance({
      url: "/api-capital/supply/plan/search",
      method: "POST",
      data: params
    });
  }
  putModify(id,supplierDescription) {
    return axiosInstance({
      url: "/api-capital/supply/plan/update/description",
      method: "PUT",
      data: {
        id,
        supplierDescription
      }
    });
  }


}
