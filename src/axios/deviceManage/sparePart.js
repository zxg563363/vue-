import request from "../request";

export function getPart() {  //获取设备类型
    return request({
        url: '/api-capital/warehouse',
        method: 'get',
    })
}
export function addPart(data) {  //获取设备类型
    return request({
        url: '/api-capital/warehouse',
        method: 'post',
        data:data
    })
}
export function editPart(data) {  //获取设备类型
    return request({
        url: '/api-capital/warehouse',
        method: 'Patch',
        data:data
    })
}
export function deletePart(id) {  //获取设备类型
    return request({
        url: '/api-capital/warehouse/'+id,
        method: 'Delete',
    })
}
