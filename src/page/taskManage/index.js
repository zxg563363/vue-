/**
 * Created by lixiansky on 2021/7/6
 */
import assign from 'lodash/assign';
import request,{axiosInstance} from "@/axios/request";
import Base from "@/apps";
export default class Task extends Base{
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '任务管理'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "plan/list",
        name: "task_plan_list",
        meta: {
          title: '任务计划列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          task_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_plan_list" */ "./list/list.vue");
          },
        },
      },
      {
        path: "plan/add",
        name: "task_plan_add",
        meta: {
          title: '任务计划增加',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          task_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_plan_add" */ "./repair/add/add.vue");
          },
        },
      },
      {
        path: "plan/update/:id",
        name: "task_plan_update",
        meta: {
          title: '任务计划编辑',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          task_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_plan_update" */ "./repair/add/add.vue");
          },
        },
      },
      {
        path: "query/list",
        name: "task_query_list",
        meta: {
          title: '任务查询列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          task_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_query_list" */ "./query/query.vue");
          },
        },
      },
      {
        path: "view/kanban",
        name: "task_view_kanban",
        meta: {
          title: '任务看板视图',
          // keepAlive: true
        },
        components: {
          // 父级路由名称
          task_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "task_view_kanban" */ "./kanban/kanban.vue");
          },
        },
      },
    ];
  }

  getData(pageNumber,pageSize,params) {
    return request({
      url: '/api-inspection/plan',
      method: 'get',
      params:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          pageNumber,pageSize,
        },_params)
      })((params ? params : {})),
    })
  }

  // 查询班组
  getWorkTeam(){
    return request({
      url: '/api-inspection/workTeam',
      method: 'get',
      params:{
        formType: 'check',
      },
    })
  }

  // 获取设备信息
  getEquipments(page,rows,params){
    return request({
      url: '/api-capital/equipments/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          "page":page,rows,
        },_params)
      })((params ? params : {})),
    })
  }

  // 获取表单
  getExtensionForm(){
    return request({
      url: '/api-global/common/extension/form',
      method: 'get',
      params:{
        pageNumber: '1',
        pageSize: 999,
      },
    })
  }

  // 获取计划信息
  getPlanDataById(id){
    return request({
      url: '/api-inspection/plan/'+id,
      method: 'get',
      params:{},
    });
  }

  deletePlanDataById(id){
    return request({
      url: '/api-inspection/plan/'+id,
      method: 'delete',
      params:{},
    });
  }

  // 更新计划状态
  updatePlanValidity(planId,validity){
    return request({
      url: '/api-inspection/plan/updatePlanValidity',
      method: 'post',
      params:{
        planId,validity
      },
    });
  }
  // 任务查询
  findTaskJob(page,rows,params){
    return axiosInstance({
      url: '/api-inspection/job/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "startTime",
          sord: "desc",
          page,rows,
        },_params)
      })((params ? params : {})),
    })
  }

  findTaskById(id,startTime){
    return axiosInstance({
      url: '/api-inspection/job',
      method: 'get',
      params:{
        id,
        startTime
      },
    });
  }

  // 查询当日任务执行状态
  getTimeSharingTask(dateFlag='hour',startTime,endTime){
    return axiosInstance({
      url: '/api-inspection/job/statistics/times',
      method: 'get',
      params:{
        dateFlag,
        startTime,
        endTime,
      },
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 查询各个任务类型统计
  // startTime  endTime
  // fieldName	ture	string	1,equipmentType设备类型 2，planType 任务类型 3，team 班组
  getTaskStatistics(params){
    return axiosInstance({
      url: '/api-inspection/job/statistics/fields',
      method: 'get',
      params: params
    })
  }

  // 获取任务看板统计数据
  getTaskKanbanStatistics(params){
    return axiosInstance({
      url: '/api-inspection/job/statistics/planType',
      method: 'get',
      params: params
    });
  }
}
