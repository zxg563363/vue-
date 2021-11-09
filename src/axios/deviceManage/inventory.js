import request from "../request";

export function getInventory(data) {
    return request({
        url: '/api-capital/spare/inventory/search',
        method: 'post',
        data:data
    })
}
export function putSpare(data) {
    return request({
        url: '/api-capital/spare/operator/in',
        method: 'post',
        data:data
    })
}
export function outSpare(data) {
    return request({
        url: '/api-capital/spare/operator/out',
        method: 'post',
        data:data
    })
}
export function record(data) {
    return request({
        url: '/api-capital/spare/operator/search',
        method: 'post',
        data:data
    })
}
export function okEquipType(equipType) {
    return request({
        url: '/api-capital/spare/inventory/equip/can/use/'+equipType,
        method: 'get',
    })
}
export function getSafe(data) {
    return request({
        url: '/api-capital/spare/inventory/safe',
        method: 'POST',
        data:data
    })
}
