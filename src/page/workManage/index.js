/**
 * Created by lixiansky on 2021/7/10
 */
import assign from 'lodash/assign';
import request ,{axiosFormDataInstance,axiosInstance} from "@/axios/request";
import Base from "@/apps";
export default class WorkOrder extends Base{
  constructor() {
    super();
    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '工单管理'
      }
    ];

    this.routers = [
      {
        path: "evaluate/list",
        name: "workOrder_evaluate_list",
        meta: {
          title: '工单评价列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          workOrder_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "workOrder_evaluate_list" */ "./evaluate/evaluate.vue");
          },
        },
      },
      {
        path: "delay/list",
        name: "workOrder_delay_list",
        meta: {
          title: '延期申请列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          workOrder_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "workOrder_delay_list" */ "./delay/delay.vue");
          },
        },
      },
      // 服务协议
      {
        path: "agreement/list",
        name: "workOrder_agreement_list",
        meta: {
          title: '服务协议列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          workOrder_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "workOrder_agreement_list" */ "./agreement/agreement.vue");
          },
        },
      },
      // 工单编辑
      {
        path: "update/:uuId",
        name: "workOrder_update",
        meta: {
          title: '工单编辑',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          workOrder_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "workOrder_update" */ "./add/add.vue");
          },
        },
      },

      // 工单详细
      {
        path: "detail/:uuId",
        name: "workOrder_detail",
        meta: {
          title: '工单详细',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          workOrder_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "workOrder_detail" */ "./detail/detail.vue");
          },
        },
      },
    ];

  }

  // 获取评价列表
  getEvaluateData(page,rows,params) {
    return request({
      url: '/api-global/ops/repair/visible/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          page,rows,
        },_params)
      })((params ? params : {})),
    })
  }

  // 获取评价列表
  getDelayData(page,rows,params) {
    return axiosInstance({
      url: '/api-global/ops/repair/delay/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "applyTime",
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

  // 提交评价
  postEvaluate(data){
    return request({
      url: '/api-global/ops/repair/visible',
      method: 'post',
      data:data,
    });
  }

  // 添加备注
  postOrderRemark(id,data){
    return axiosFormDataInstance({
      url: '/api-global/ops/repair/record/'+id,
      method: 'post',
      data:data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results.data;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 提交延期申请
  postDelayApply(data){
    return axiosInstance({
      url: '/api-global/ops/repair/delay/apply',
      method: 'post',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 审核延期申请
  postDelayApproval(data,orderId){
    return axiosInstance({
      url: '/api-global/ops/repair/delay/approval?orderId='+orderId,
      method: 'post',
      data: data,
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取服务协议列表数据
  getAgreementData(page,rows,params) {
    return axiosInstance({
      url: '/api-global/ops/agreement/search',
      method: 'POST',
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

  // 删除服务协议
  deleteAgreement(id){
    return axiosInstance({
      url: '/api-global/ops/agreement',
      method: 'delete',
      params: {id},
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取流程信息
  processList(params) {
    return axiosInstance({
      url: '/api-global/wf/define/search',
      method: 'post',
      data:params
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 开始工单
  startWork(uuId){
    return axiosInstance({
      url:'/api-global/ops/repair/start/'+uuId,
      method:'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200 && results.data){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取工单详细数据
  detailWork(uuId){
    return axiosInstance({
      url:'/api-global/ops/repair/view/'+uuId,
      method:'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      console.log(results);
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取工单解决方案
  getReceipt(uuId){
    return axiosInstance({
      url:'/api-global/ops/repair/receipt/'+uuId,
      method:'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取工单详细by uuId
  getWorkOrderByuuId(uuId){
    return axiosInstance({
      url:'/api-global/ops/repair/view/'+uuId,
      method:'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  //获取设备
  getDevice(data) {  //获取设备类型
    return axiosInstance({
      url: '/api-capital/equipments/search',
      method: 'post',
      data:data
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 修改工单
  updateWorkOrder(data){
    return axiosFormDataInstance({
      url:'/api-global/ops/repair',
      method:'patch',
      data:data
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
  }

  // 获取备件
  getSpares(page = 1,rows = 20,params) {
    return axiosInstance({
      url: '/api-capital/spare/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "",
          sord: "desc",
          "page":page,rows,
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
}
