/**
 * Created by lixiansky on 2021/7/21
 */
import assign from 'lodash/assign';
import request,{axiosInstance} from "@/axios/request";
import Base from "@/apps";
export default class System extends Base {
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '系统管理'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "operation/list",
        name: "system_operation_list",
        meta: {
          title: '操作日志',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          system_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "system_operation_list" */ "./operateJournal/operateJournal.vue");
          },
        },
      },
      {
        path: "process/instance",
        name: "system_process_instance",
        meta: {
          title: '流程实例',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          system_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "system_process_instance" */ "./instance/instance.vue");
          },
        },
      },
      {
        path: "spare/setup",
        name: "spare_setup",
        meta: {
          title: '备件选项设置',
          keepAlive: false
        },
        components: {
          // 父级路由名称
          system_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "spare_setup" */ "./spare-setup/spare-setup.vue");
          },
        },
      },
      {
        path: "supplier",
        name: "system_supplier",
        meta: {
          title: '供应商管理',
          keepAlive: false
        },
        components: {
          // 父级路由名称
          system_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "system_supplier" */ "./supplier/supplier.vue");
          },
        },
      },
    ];
  }

  // 获取操作日志
  getSystemOperation(page,rows,params){
    return axiosInstance({
      url: '/api-global/common/log/operation',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          page,rows,
        },_params)
      })((params ? params : {})),
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取流程实例信息
  getWorkFlowInstance(page,rows,params){
    return axiosInstance({
      url: '/api-global/wf/instance/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          page,rows,
        },_params)
      })((params ? params : {})),
    });
  }

  // 获取企业信息
  getCompanyData(){
    return axiosInstance({
      url: '/api-global/common/company',
      method: 'get',
      params:{},
    });
  }

  // 更新企业信息
  updateCompanyData(data){
    return axiosInstance({
      url: '/api-global/common/company',
      method: 'patch',
      data:data,
    })
  }

  // 获取地区数据
  getDistrictTree(){
    return axiosInstance({
      url: '/api-global/common/district/tree',
      method: 'get',
      params:{},
    })
  }

  // 获取成员信息
  getMembers(rows,page,departId){
    return axiosInstance({
      url: 'api-global/sys/users',
      method: 'get',
      params:{
        rows, page, departId
      },
    });
  }

  transferAdmin(userId){
    return axiosInstance({
      url: 'api-global/common/company/transfer',
      method: 'get',
      params:{
        userId
      },
    });
  }

  // 退出登录
  logOut(access_token){
    return axiosInstance({
      url: '/auth/logout',
      method: 'get',
      params:{
        access_token
      },
    });
  }

  // 查询供应商
  getSupplier(page,rows,params){
    return axiosInstance({
      url: '/api-capital/supplier/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          page,rows,
        },_params)
      })((params ? params : {})),
    });
  }

  // 保存供应商
  postSupplier(data){
    return axiosInstance({
      url: '/api-capital/supplier',
      method: 'post',
      data,
    });
  }

  putSupplier(data){
    return axiosInstance({
      url: '/api-capital/supplier',
      method: 'put',
      data,
    });
  }

  deleteSupplier(id){
    return axiosInstance({
      url: '/api-capital/supplier/'+id,
      method: 'delete',
    });
  }

}
