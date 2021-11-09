import request from "../request";

export function postMenu(params) {  //新建菜单
    return request({
        url: '/api-global/system/act/add',
        method: 'post',
        params:params
    })
}
