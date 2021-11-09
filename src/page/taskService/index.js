/**
 * Created by lixiansky on 2021/6/18
 */
import remove from 'lodash/remove';
import concat from 'lodash/concat';
import assign from 'lodash/assign';
import {axiosInstance} from "@/axios/request";

class TaskService {
  constructor() {
    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '任务服务'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "list",
        name: "task_service_list",
        components: {
          // 父级路由名称
          tasks_service: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_service_list" */ "./list/list.vue");
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

  getTaskServiceData(taskId,pageNumber,pageSize, params) {
    return axiosInstance({
      url: '/api-global/download/find',
      method: 'get',
      params:assign({
        pageNumber,pageSize,
        sidx: "createTime",
        sord: "desc",
      },params),
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 重试下载任务
  retryTaskService(taskId){
    return axiosInstance({
      url: '/api-global/download/rebuild/'+taskId,
      method: 'get',
      params:{},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200 && results.data){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 删除下载任务
  deleteTaskService(taskId){
    return axiosInstance({
      url: '/api-global/download/'+taskId,
      method: 'delete',
      params:{},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200 && results.data){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }
}

export default TaskService;




