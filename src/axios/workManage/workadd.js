import request,{axiosFormDataInstance,axiosInstance,interceptors} from "../request";

export function addWork(data){
  // interceptors.ajaxBefore(axiosFormDataInstance);
  return axiosFormDataInstance({
    url:'/api-global/ops/repair',
    method:'post',
    data:data,
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}
export function getWork(data){
  return request({
    url:'/api-global/ops/repair/search',
    method:'post',
    data:data
  })
}








//获取流程
export function getDefine(data){
  return axiosInstance({
    url:'/api-global/wf/define/search',
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



