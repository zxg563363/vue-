import request,{axiosInstance} from "../request";

export function depAdd(params) {  //新增部门
    return request({
        url: '/api-global/sys/depart',
        method: 'post',
        data:params
    })
}

export function depGet(params) {  //获取部门
    return request({
        url: '/api-global/sys/depart/' + params,
        method: 'GET'
    })
}

export function depEdit(params,id) {  //修改部门
    return request({
        url: '/api-global/sys/depart/' + id,
        method: 'PUT',
        data:params
    })
}

export function depDel(id) {  //修改部门
    return request({
        url: '/api-global/sys/depart/' + id,
        method: 'DELETE'
    })
}

export function userAdd(params) {  //新增用户
    return axiosInstance({
        url: '/api-global/sys/users',
        method: 'post',
        data:params
    })
}

export function userEdit(params,id) {  //修改用户
    return axiosInstance({
        url: '/api-global/sys/users/' + id,
        method: 'PUT',
        data:params
    })
}


// export function userList(params) {  //根据部门查询 用户列表
//     return request({
//         url: '/api-global/sys/depart',
//         method: 'get',
//         params:params
//     })
// }
