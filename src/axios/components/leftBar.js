import request from "../request";
export function barDatas(params) {  //获取菜单
    return request({
        url: '/api-global/system/act/listTree',
        method: 'get',
        params:params
    })
}

export function barDatasNew(params) {  //获取菜单
    return request({
        url: '/api-global/sys/users/menus',
        method: 'get',
        params:params
    })
}