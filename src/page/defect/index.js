/**
 * Created by lixiansky on 2021/9/3
 */
import Base from "../../apps";
import { axiosFormDataInstance, axiosInstance } from "../../axios/request";
import assign from "lodash/assign";
export default class defect extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: "/",
        name: "首页"
      },
      {
        name: "缺陷管理"
      }
    ];

    this.routers = [
      // 缺陷上报
      {
        path: "add",
        name: "defect_add",
        meta: {
          title: "缺陷上报",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          defect_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "defect_apply" */ "./add/add.vue"
            );
          }
        }
      },

      // 缺陷列表
      {
        path: "query/list",
        name: "defect_list",
        meta: {
          title: "缺陷列表",
          keepAlive: true
        },
        components: {
          // 父级路由名称
          defect_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(
              /* webpackChunkName: "defect_list" */ "./query/list/list.vue"
            );
          }
        }
      }
    ];
  }
}
export function viewAttachment(id) {
  return axiosInstance({
    url: `/api-inspection/defect/attr/${id}`,
    method: "get"
  });
}

export function addDefect(formData) {
  //上传缺陷
  {
    // interceptors.ajaxBefore(axiosFormDataInstance);
    return axiosFormDataInstance({
      url: "/api-inspection/defect",
      method: "POST",
      data: formData
    });
  }
}

export function getWork(data) {
  //缺陷列表
  return axiosInstance({
    url: "/api-inspection/defect/search",
    method: "post",
    data: data
  });
}

export function listDefect(pageNumber, pageSize) {
  //缺陷列表
  return axiosInstance({
    url: "/api-inspection/defect/search",
    method: "POST",
    data: {
      conditionConfig: {
        logic: 1,
        conditions: [
          {
            paramsKey: "",
            opCode: "LIKE",
            targetCode: ""
          }
        ]
      },
      page: pageNumber,
      rows: pageSize,
      sidx: "",
      sord: "asc"
    }
  });
}

export function deleteDefect(id) {
  //删除缺陷
  {
    return axiosInstance({
      url: "/api-inspection/defect/" + id + "",
      method: "DELETE"
    });
  }
}

export function updateDefect(row,equipName,equipCode) {
  console.log(row)
  //更新缺陷
  {
    return axiosInstance({
      url: "/api-inspection/defect",
      method: "PUT",
      data: {
        id: row.id,
        title: row.title,
        equipId: row.equipId,
        equipName: equipName,
        equipCode: equipCode,
        status: row.status,
        type: row.type,
        remark: row.remark
      }
    });
  }
}

export function viewDefect(enclosureId) {
  //查看附件
  {
    return axiosInstance({
      url: "/api-inspection/defect/attr/" + enclosureId + "",
      method: "GET"
    });
  }
}

// 获取设备
export function equipmentDefect(page, rows, params) {
  //查看附件

  return axiosInstance({
    url: "/api-capital/equipments/search",
    method: "post",
    data: (_params => {
      return assign(
        {
          sidx: "createTime",
          sord: "desc",
          page: page,
          rows
        },
        _params
      );
    })(params ? params : {})
  });
}
