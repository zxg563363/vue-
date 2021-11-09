/**
 * Created by lixiansky on 2021/10/19
 */
import assign from "lodash/assign";
import { axiosInstance } from "@/axios/request";
import Base from "../../apps";
export default class Stock extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: "/",
        name: "首页"
      },
      {
        name: "库存管理"
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "warehouse",
        name: "stock_warehouse",
        meta: {
          title: "备品列表",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          stock_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "stock_warehouse" */ "./warehouse/warehouse.vue"
            );
          }
        }
      },
      {
        path: "inventory",
        name: "stock_inventory",
        meta: {
          title: "备件库存",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          stock_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "stock_inventory" */ "./inventory/inventory.vue"
            );
          }
        }
      },
      {
        path: "security",
        name: "security_list",
        meta: {
          title: "备品安全库存",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          stock_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "stock_inventory" */ "./security/security.vue"
            );
          }
        }
      }
    ];
  }

  // 获取仓库信息列表
  getStocks() {
    return axiosInstance({
      url: "/api-capital/warehouse",
      method: "get",
      params: {}
    });
  }

  postStocks(data) {
    return axiosInstance({
      url: "/api-capital/warehouse",
      method: "post",
      data
    });
  }

  patchStocks(data) {
    return axiosInstance({
      url: "/api-capital/warehouse",
      method: "patch",
      data
    });
  }

  deleteStocks(id) {
    return axiosInstance({
      url: "/api-capital/warehouse/" + id,
      method: "delete"
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

  // 模糊搜索
  queryUser(query) {
    return axiosInstance({
      url: "/api-global/sys/users?validity=1&rows=20&page=1&key=" + query,
      method: "get",
      params: {}
    });
  }

  // 获取备件库存信息
  getStockInventory(page, rows, params) {
    return axiosInstance({
      url: "/api-capital/spare/inventory/search",
      method: "post",
      data: (_params => {
        return assign(
          {
            sidx: "spareCode",
            sord: "asc",
            page: page,
            rows
          },
          _params
        );
      })(params ? params : {})
    });
  }

  // 获取指定二级部门下的备品安全库存
  getStockSecurity(spareData) {
   
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "get",
      params: {
        branchId: spareData.branchId,
        spareId: spareData.spareId,
        pageNumber: spareData.pageNumber,
        pageSize: spareData.pageSize
      }
    });
  }
  getData(page, rows) {
    //获取所有备品
    return axiosInstance({
      url: "/api-capital/spare/search",
      method: "post",
      data: {
        sidx: "createTime",
        sord: "desc",
        page: page,
        rows
      }
    });
  }

  getStock(data) {
    ///动态条件查找备品
    return axiosInstance({
      url: "/api-capital/spare/search",
      method: "post",
      data: data
    });
  }

  addEquipment(data) {
    //添加备品
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "POST",
      data
    });
  }
  updateEquipment(data) {
    //更新备品
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "PUT",
      data
    });
  }
  deleteEquipment(branchId, spareId) {
    //删除备品
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "DELETE",
      data: {
        branchId,
        spareId
      }
    });
  }
}
