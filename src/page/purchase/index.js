/**
 * Created by lixiansky on 2021/10/19
 */
import assign from "lodash/assign";
import { axiosInstance } from "@/axios/request";
import Base from "../../apps";
export default class Purchase extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: "/",
        name: "首页"
      },
      {
        name: "采购管理"
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "agreement",
        name: "purchase_agreement",
        meta: {
          title: "备品列表",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          purchase_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "stock_warehouse" */ "./agreement/agreement.vue"
            );
          }
        }
      }
    ];
  }

  getSuppliers(data) {
    console.log(JSON.stringify(data));
    // 获取供应商列表
    return axiosInstance({
      url: "api-capital/supplier/search",
      method: "post",
      data
    });
  }

  spareData(data) {
    // 获取该供应商的备件列表
    return axiosInstance({
      url: "/api-capital/supplier/spare/search",
      method: "get",
      params: {
        supplierId: data
      }
    });
  }
  getSpares(data) {
    ///动态条件查找备件
    return axiosInstance({
      url: "/api-capital/spare/search",
      method: "post",
      data: data
    });
  }

  getspareData(spareId) {
    ///查找指定备件
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "get",
      params: {
        branchId: "",
        spareId: spareId,
        pageNumber: "",
        pageSize: ""
      }
    });
  }


  getspareData(spareId) {
    ///查找指定备件
    return axiosInstance({
      url: "/api-capital/spare/warehouseLimit",
      method: "get",
      params: {
        branchId: "",
        spareId:spareId,
        pageNumber: 1,
        pageSize: 10
      }
    });
  }
  addSpare(data) {
    //添加备件
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "POST",
      data
    });
  }
  updateSpare(data, id) {
    //更新备件
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "PUT",
      data: {
        supplierId: data.supplierId,
        spareId: id,
        unitPrice: data.unitPrice
      }
    });
  }

  deleteAgreement(supplierId, spareId) {
    //删除备品
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "DELETE",
      data: {
        supplierId,
        spareId
      }
    });
  }
}
