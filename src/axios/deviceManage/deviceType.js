import request,{axiosInstance} from "../request";

export function getType() {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/equipment/type',
        method: 'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function saveType(data) {  //新增设备类型
    return request({
        url: '/api-capital/equipment/type',
        method: 'post',
        data:data,
    })
}
export function changeType(data) {  //更新设备类型
    return request({
        url: '/api-capital/equipment/type',
        method: 'patch',
        data:data
    })
}
export function deleteType(id) {  //删除设备类型
    return request({
        url: '/api-capital/equipment/type/'+id,
        method: 'delete',
    })
}
export function detailType(id) {
    return axiosInstance({
        url: '/api-capital/equipment/type/'+id,
        method: 'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
