import request from "../request";

export function getDict(params) {  //获取设备类型
    return request({
        url: '/api-global/sys/dict',
        method: 'get',
        params:params
    })
}
export function addDict(data) {  //获取设备类型
    return request({
        url: '/api-global/sys/dict',
        method: 'post',
        data:data
    })
}
export function changeDict(data) {  //获取设备类型
    return request({
        url: '/api-global/sys/dict/'+data.id,
        method: 'PUT',
        data:data
    })
}
export function deletDict(params) {  //获取设备类型
    return request({
        url: '/api-global/sys/dict/'+params,
        method: 'DELETE',
    })
}
