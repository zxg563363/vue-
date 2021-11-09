import request from "../request";

export function getApply(data) {
    return request({
        url: '/api-electricity/transmits/search',
        method: 'POST',
        data:data
    })
}
export function addApply(data) {
    return request({
        url: '/api-electricity/transmits',
        method: 'POST',
        data:data
    })
}
export function changeApply(data) {
    return request({
        url: '/api-electricity/transmits',
        method: 'Patch',
        data:data
    })
}
export function deleteApply(id) {
    return request({
        url: '/api-electricity/transmits/'+id,
        method: 'Delete',
    })
}
export function detailApply(id) {
    return request({
        url: '/api-electricity/transmits/'+id,
        method: 'GET',
    })
}
export function stopApply(id,validity) {
    return request({
        url: '/api-electricity/transmits/'+id+'/'+validity,
        method: 'Patch',
    })
}



export function getTerminal(data) {
    return request({
        url: '/api-electricity/collectors/search',
        method: 'POST',
        data:data
    })
}
export function addTerminal(data) {
    return request({
        url: '/api-electricity/collectors',
        method: 'POST',
        data:data
    })
}
export function changeTerminal(data) {
    return request({
        url: '/api-electricity/collectors',
        method: 'Patch',
        data:data
    })
}
export function deleteTerminal(id) {
    return request({
        url: '/api-electricity/collectors/'+id,
        method: 'Delete',
    })
}
export function detailTerminal(id) {
    return request({
        url: '/api-electricity/collectors/'+id,
        method: 'GET',
    })
}
export function stopTerminal(id,validity) {
    return request({
        url: '/api-electricity/collectors/'+id+'/'+validity,
        method: 'Patch',
    })
}
export function equip(id,equipId) {
    return request({
        url: '/api-electricity/collectors/'+id+'/equip?equipId='+equipId,
        method: 'Put',
    })
}
export function deletEquip(id,equipId) {
    return request({
       url: '/api-electricity/collectors/'+id+'/equip?equipId='+equipId,
        method: 'Delete',
    })
}
