import request,{axiosInstance} from "../request";

export function getDevice(data) {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/equipments/search',
        method: 'post',
        data:data
    });
}
export function addDevice(data) {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/equipments',
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
export function deleteDevice(id) {  //获取设备类型
    return request({
        url: '/api-capital/equipments/'+id,
        method: 'delete',
    })
}
export function changeDevice(data) {  //更新设备类型
    return axiosInstance({
        url: '/api-capital/equipments',
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
export function getdetail(id) {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/equipments/'+id,
        method: 'get',
    }).then(data=>{
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    });
}
export function geterweima(id) {  //获取设备类型
    return request({
        url: '/api-capital/equipments/qr_code/'+id,
        method: 'get',
        responseType:"arraybuffer"
    })
}
export function getqian(id) {  //获取设备类型
    return request({
        url: '/api-capital/equipments/label/'+id,
        method: 'get',
    })
}
export function getExport(data) {  //获取设备类型
    return axiosInstance({
        url: '/api-capital/equipments/export',
        method: 'post',
        data:data
    });
}
