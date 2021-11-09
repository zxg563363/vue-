import request,{axiosInstance} from "../request";

export function getCatalogs() {
    return axiosInstance({
        url: '/api-global/ops/catalogs',
        method: 'get',
    })
}
export function addCatalogs(data) {
    return axiosInstance({
        url: '/api-global/ops/catalogs',
        method: 'POST',
        data:data
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function datailCatalogs(id) {
    return axiosInstance({
        url: '/api-global/ops/catalogs/'+id,
        method: 'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function deletCatalogs(id) {
    return axiosInstance({
        url: '/api-global/ops/catalogs/'+id,
        method: 'Delete',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200 && results.data){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function changeCatalogs(data) {
    return axiosInstance({
        url: '/api-global/ops/catalogs/',
        method: 'Patch',
        data:data
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function SOSCatalogs(id,validity) {
    return request({
        url: '/api-global/ops/catalogs/'+id+'/'+validity,
        method: 'Patch',
    })
}
