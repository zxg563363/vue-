import request from "../request";

export function userGet(params) {  //获取单个用户信息
    return request({
        url: '/api-global/sys/users/' + params.id,
        method: 'GET'
    });
}

export function passwordEdit(params) {  //修改用户密码
    return request({
        url: '/api-global/sys/users/' + params.id + '/pass',
        method: 'patch',
        data:params.data
    });
}
