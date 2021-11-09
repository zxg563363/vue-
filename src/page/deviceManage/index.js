/**
 * Created by lixiansky on 2021/7/22
 */
import { axiosInstance, axios } from "@/axios/request";
import Base from "@/apps";
import { getType } from "@/axios/deviceManage/deviceType";
import { getScape } from "@/axios/deviceManage/deviceScape";
import reduce from "lodash/reduce";
export default class Device extends Base {
  constructor() {
    super();
    this.breadcrumbList = [
      {
        path: "/",
        name: "首页"
      },
      {
        name: "设备管理"
      }
    ];

    this.routers = [
      {
        path: "add",
        name: "device_add",
        meta: {
          title: "设备添加",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          device_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "device_add" */ "./add/add.vue");
          }
        }
      },
      {
        path: "update/:uuId",
        name: "device_update",
        meta: {
          title: "设备更新",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          device_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "device_update" */ "./add/add.vue"
            );
          }
        }
      },
      {
        path: "supplier",
        name: "supplier_list",
        meta: {
          title: "供应商列表",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          device_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "device_add" */ "./supplier/supplier.vue"
            );
          }
        }
      },
      {
        path: "supplierAdd",
        name: "supplier_add",
        meta: {
          title: "添加供应商",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          device_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "device_add" */ "./supplierAdd/supplierAdd.vue"
            );
          }
        }
      }
    ];
  }

  // 获取设备相关数据
  getDeviceDatas() {
    return axios.all([getType(), getScape()]).then(
      axios.spread((type, space) => {
        return reduce(
          { type, space },
          (results, _results, key) => {
            // console.log(_results);
            if (_results.status && _results.status === 200) {
              results[key] = _results.data;
            } else {
              results.error.push(
                _results.error
                  ? (_results.error.errorCode || _results.error) +
                      "【" +
                      (_results.error.errorMsg || _results.msg) +
                      "】"
                  : "未知错误"
              );
            }
            return results;
          },
          { error: [] }
        );
      })
    );
  }

  // 下载二维码标签
  exportDeviceQRCode(ids) {
    return axiosInstance({
      url: "api-capital/equipments/export/label",
      method: "post",
      data: ids
    });
  }

  // 设备类型详细
  detailDeviceType(id) {
    return axiosInstance({
      url: "/api-capital/equipment/type/" + id,
      method: "get"
    });
  }

  // 设备类型保存
  saveDeviceType(data) {
    //新增设备类型
    return axiosInstance({
      url: "/api-capital/equipment/type",
      method: "post",
      data: data
    });
  }

  //更新设备类型
  updateDeviceType(data) {
    return axiosInstance({
      url: "/api-capital/equipment/type",
      method: "patch",
      data: data
    });
  }
  //删除设备类型
  deleteDeviceType(id) {
    return axiosInstance({
      url: "/api-capital/equipment/type/" + id,
      method: "delete"
    });
  }
}

export function searchSupplier(data) {
  // 获取供应商列表
  return axiosInstance({
    url: "api-capital/supplier/search",
    method: "post",
    data: data
  });
}

export function addSupplier(data) {
  //添加供应商
  {
    return axiosInstance({
      url: "/api-capital/supplier",
      method: "POST",
      data: {
        supplierName: data.supplierName,
        supplierNickName: data.supplierNickName,
        supplierNumber: data.supplierNumber,
        purchasingContent: data.purchasingContent,
        supplierGrade: data.supplierGrade,
        supplierAccountId: data.supplierAccountId,
        supplierAccountName: data.supplierAccountName,
        supplierLinkUser: data.supplierLinkUser,
        supplierLinkPhone: data.supplierLinkPhone
      }
    });
  }
}

export function updateSupplier(data) {
  //更新供应商
  {
    return axiosInstance({
      url: "/api-capital/supplier",
      method: "PUT",
      data: {
        id: data.id,
        supplierName: data.supplierName,
        supplierNickName: data.supplierNickName,
        supplierNumber: data.supplierNumber,
        purchasingContent: data.purchasingContent,
        supplierGrade: data.supplierGrade,
        supplierAccountId: data.supplierAccountId,
        supplierAccountName: data.supplierAccountName,
        supplierLinkUser: data.supplierLinkUser,
        supplierLinkPhone: data.supplierLinkPhone
      }
    });
  }
}

export function deleteSupplier(id) {
  //删除供应商
  {
    return axiosInstance({
      url: "/api-capital/supplier/" + id + "",
      method: "DELETE"
    });
  }
}

export function searchParts(id) {
  // 获取供应商提供的备件
  return axiosInstance({
    url: "/api-capital/supplier/spare/search?supplierId=" + id + "",
    method: "GET"
  });
}

export function addParts(data) {
  //添加供应商备件
  {
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "POST",
      data: {
        supplierId: data.supplierId,
        spareId: data.id,
        unitPrice: data.unitPrice
      }
    });
  }
}

export function updateParts(data) {
  
  //更新供应商备件
  {
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "PUT",
      data: {
        supplierId: data.supplierId,
        spareId: data.id,
        unitPrice: data.unitPrice
      }
    });
  }
}

export function deleteParts(data) {


  //删除供应商备件
  {
    return axiosInstance({
      url: "/api-capital/supplier/spare",
      method: "DELETE",
      data: {
        supplierId: data.supplierId,
        spareId: data.id,
        unitPrice: data.unitPrice
      }
    });
  }
}

export function getData(page, rows) {
  {
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
}
