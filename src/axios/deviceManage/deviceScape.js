import request,{axiosInstance} from "../request";

export function getScape() {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/space',
        method: 'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function saveScape(data) {  //新增设备类型
    return axiosInstance({
        url: '/api-capital/space',
        method: 'post',
        data:data,
    });
}
export function changeScape(data) {  //更新设备类型
    return axiosInstance({
        url: '/api-capital/space',
        method: 'patch',
        data:data
    })
}
export function deleteScape(id) {  //删除设备类型
    return axiosInstance({
        url: '/api-capital/space/'+id,
        method: 'delete',
    })
}
