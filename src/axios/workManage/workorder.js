import request,{axiosFormDataInstance,axiosInstance} from "../request";

export function getWork(data){
  return axiosInstance({
    url:'/api-global/ops/repair/search',
    method:'post',
    data:data
  });
}
//详情页
export function detailWork(uuId){
  return request({
    url:'/api-global/ops/repair/view/'+uuId,
    method:'get',
  })
}

//修改
export function changeWork(data){
  return axiosFormDataInstance({
    url:'/api-global/ops/repair',
    method:'patch',
    data:data
  })
}
//获取人
export function getPerson(){
  return request({
    url:'/api-global/sys/users',
    method:'get',
  })
}
//分配
export function assignPerson(uuId,userId,userName){
  return axiosInstance({
    url:'/api-global/ops/repair/assign/'+uuId+'?userId='+userId+'&'+'userName='+userName,
    method:'get',
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//开始
export function startWork(uuId){
  return request({
    url:'/api-global/ops/repair/start/'+uuId,
    method:'get',
  })
}
//动态日志
export function sourceWork(uuId){
  return request({
    url:'/api-global/ops/repair/record/'+uuId,
    method:'get',
  })
}
//协作
export function synergic(uuId,data){
  return axiosInstance({
    url:'/api-global/ops/repair/synergic/'+uuId,
    method:'post',
    data:data
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//取消
export function cancelWork(uuId,data){
  return request({
    url:'/api-global/ops/repair/cancel/'+uuId,
    method:'post',
    data:data
  })
}
//完成
export function endWork(data){
  return axiosFormDataInstance({
    url:'/api-global/ops/repair/finish',
    method:'post',
    data:data
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//催单
export function urgeWork(uuId,data){
  return axiosInstance({
    url:'/api-global/ops/repair/urge/'+uuId,
    method:'post',
    data:data
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200 && results.data){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//协作
export function deletsyId(uuId,synergicUserId){
  return axiosInstance({
    url:'/api-global/ops/repair/synergic/'+uuId+'?synergicUserId='+synergicUserId,
    method:'DELETE',
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200 && results.data){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//评价
export function postRepair(data){
  return request({
    url:'/api-global/ops/repair/visible',
    method:'post',
    data:data
  })
}
//回执
export function getReceipt(uuId){
  return request({
    url:'/api-global/ops/repair/receipt/'+uuId,
    method:'get',
  })
}
//审核
export function postAudit(uuId,data){
  return axiosInstance({
    url:'/api-global/ops/repair/approval/'+uuId,
    method:'post',
    data:data
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
//添加动态
export function addSource(uuId,visible,data){
  return request({
    url:'/api-global/ops/repair/record/'+uuId+'/'+visible,
    method:'post',
    data:data
  })
}
