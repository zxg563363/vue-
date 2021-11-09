import request from "../request";

export function getView(data) {
    return request({
        url: '/api-electricity/lines/search',
        method: 'POST',
        data:data
    })
}
export function addView(data) {
    return request({
        url: '/api-electricity/lines',
        method: 'POST',
        data:data
    })
}
export function changeView(data) {
    return request({
        url: '/api-electricity/lines',
        method: 'Patch',
        data:data
    })
}
export function deleteView(id) {
    return request({
        url: '/api-electricity/lines/'+id,
        method: 'Delete',
    })
}
export function detailView(id) {
    return request({
        url: '/api-electricity/lines/'+id,
        method: 'GET',
    })
}
export function stopView(id,validity) {
    return request({
        url: '/api-electricity/lines/'+id+'/'+validity,
        method: 'Patch',
    })
}
