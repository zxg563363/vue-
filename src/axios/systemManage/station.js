import request,{axiosInstance} from "../request";

export function roleDatas() {  //获取角色列表
    return axiosInstance({
        url: '/api-global/sys/role',
        method: 'get',
    })
}

export function roleUsersDatas(params) {  //获取角色
    return axiosInstance({
        url: '/api-global/sys/role/users/' + params.roleId,
        method: 'get',
    })
}

export function delRoleUser(params) {  //删除用户
    return axiosInstance({
        url: '/api-global/sys/role/users/' + params.roleId + '/' + params.userId,
        method: 'delete',
    })
}

export function roleAdd(params) {  //新增角色
    return axiosInstance({
        url: '/api-global/sys/role',
        method: 'post',
        data:params
    })
}

export function roleScope(params) {  //获取角色数据范围
    return request({
        url: '/api-global/sys/role/scope/' + params.roleId,
        method: 'get',
    })
}

export function saveroleScope(params) {  //保存数据范围配置
    return axiosInstance({
        url: '/api-global/sys/role/scope/' + params.roleId,
        method: 'post',
        data:params.data
    })
}

export function roleMenu(params) {  //获取角色功能权限
    return axiosInstance({
        url: '/api-global/sys/role/permissions/' + params.roleId,
        method: 'get',
    })
}

export function saveRoleMenu(params) {  //保存角色功能权限
    return axiosInstance({
        url: '/api-global/sys/role/permissions/' + params.roleId,
        method: 'post',
        data:params.data
    })
}

export function roleEdit(params) {  //修改角色
    return axiosInstance({
        url: '/api-global/sys/role/' + params.roleId,
        method: 'put',
        data:params.data
    })
}

export function roleDel(params) {  //删除角色
    return axiosInstance({
        url: '/api-global/sys/role/' + params.roleId,
        method: 'DELETE'
    })
}

export function groupAdd(params) {  //新建分组
    return axiosInstance({
        url: '/api-global/sys/role/group',
        method: 'POST',
        data:params
    })
}

export function groupEdit(params) {  //修改分组
    return axiosInstance({
        url: '/api-global/sys/role/group/' + params.uuId,
        method: 'put',
        data: params.groupName
    })
}

export function groupDel(params) {  //删除分组
    return axiosInstance({
        url: '/api-global/sys/role/group/' + params.roleId,
        method: 'DELETE'
    })
}

export function depTree() {  //部门树
    return axiosInstance({
        url: '/api-global/sys/depart',
        method: 'get'
    })
}

export function userList(params) {  //根据部门获取用户
    return axiosInstance({
        url: '/api-global/sys/users',
        method: 'get',
        params: params,
    });
}

export function addRoleUser(params) {  //保存用户
    return axiosInstance({
        url: '/api-global/sys/role/users/' + params.roleId,
        method: 'POST',
        data:params.userIdArr
    })
}
