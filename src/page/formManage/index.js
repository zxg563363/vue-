/**
 * Created by lixiansky on 2021/7/2
 */
import remove from 'lodash/remove';
import concat from 'lodash/concat';
import assign from 'lodash/assign';
import request from "@/axios/request";

class Form {
  constructor() {
    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '表单管理'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "list",
        name: "form_list",
        meta: {
          title: '表单列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          form_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "form_list" */ "./list/list.vue");
          },
        },
      },

      // 增加
      {
        path: "add",
        name: "form_add",
        components: {
          // 父级路由名称
          form_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "form_add" */ "./add/add.vue");
          },
        },
      },

      // 修改
      {
        path: "update/:id",
        name: "form_update",
        components: {
          // 父级路由名称
          form_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "form_update" */ "./add/add.vue");
          },
        },
      }
    ];
  }

  // 组装面包屑导航
  installBreadcrumbList(_breadcrumb){
    return concat(remove(this.breadcrumbList,(n,i)=>{
      return i<2;
    }),_breadcrumb);
  }

  getData(pageNumber,pageSize,params) {
    return request({
      url: '/api-global/common/extension/form',
      method: 'get',
      params:((_params)=>{
        return assign({
          pageNumber,pageSize
        },_params)
      })((params ? params : {})),
    })
  }

  saveForm(postData){
    return request({
      url: '/api-global/common/extension/form',
      method: 'post',
      data:postData
    });
  }

  updateForm(id,postData){
    return request({
      url: '/api-global/common/extension/form/'+id,
      method: 'put',
      data:postData
    });
  }

  deleteForm(id){
    return request({
      url: '/api-global/common/extension/form/'+id,
      method: 'DELETE',
    });
  }

  // 根据id获取表单
  getFormDataById(id) {
    return request({
      url: '/api-global/common/extension/form/given',
      method: 'get',
      params:{
        id,
        ts: new Date().getTime()
      }
    })
  }

}

export default Form;
