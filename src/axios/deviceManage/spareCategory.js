import request from "../request";

export function getCategory(data) {  //获取设备类型
    return request({
        url: '/api-capital/spare/search',
        method: 'post',
        data:data,
     })
}
export function addCategory(data) {  //获取设备类型
    return request({
        url: '/api-capital/spare',
        method: 'post',
        data:data,
     })
}
export function getCanUseByEquipType(equipTypeId) {  //获取设备类型可用备件列表
  return request({
    url: '/api-capital/spare/equip/can/use/'+equipTypeId,
    method: 'get'
  })
}
export function getDetail(id) {  //获取设备类型
    return request({
        url: '/api-capital/spare/'+id,
        method: 'get',
     })
}
export function changeCate(data) {  //获取设备类型
    return request({
        url: '/api-capital/spare',
        method: 'Patch',
        data:data,
     })
}
export function deleteCate(id) {  //获取设备类型
    return request({
        url: '/api-capital/spare/'+id,
        method: 'Delete',
     })
}
export function startOrStop(id,status) {  //获取设备类型
    return request({
        url: '/api-capital/spare/'+id+'/'+status,
        method: 'Patch',
     })
}
