import request,{axiosInstance} from "../request";
import assign from 'lodash/assign';
export function getRules(page,rows,params){
  return axiosInstance({
    url:'/api-global/ops/rule/search',
    method:'post',
    data:((_params)=>{
      return assign({
        sidx: "createTime",
        sord: "asc",
        page,rows,
      },_params)
    })((params ? params : {}))
  }).then(data=>{
    let results = data.data;
    if(results.status && results.status === 200){
      return results;
    }
    throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
  });
}

export function deletRule(uuId){
  return request({
    url:'/api-global/ops/rule/'+uuId,
    method:'DELETE',
  })
}
export function addRule(data){
  return request({
    url:'/api-global/ops/rule',
    method:'POST',
    data:data
  })
}

export function changeRule(uuId,data){
  return request({
    url:'/api-global/ops/rule/'+uuId,
    method:'POST',
    data:data
  })
}

export function getdetail(uuId){
  return request({
    url:'/api-global/ops/rule/'+uuId,
    method:'get',
  })
}
