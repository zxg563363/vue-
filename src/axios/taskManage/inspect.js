import request from "../request";

export function deviceTypeList(params) {  //设备类型
    return request({
        url: '/api-capital/equipment/type',
        method: 'get',
    })
}

export function saveFromData(params) {  //新建任务表单
    return request({
        url: '/api-inspection/form',
        method: 'post',
        data:params
    })
}

export function fromData(params) {  //查询任务表单
    return request({
        url: '/api-inspection/form/find',
        method: 'get',
        params:params
    })
}

export function editFromData(params,id) {  //修改任务表单
    return request({
        url: '/api-inspection/form/' + id,
        method: 'put',
        data:params
    })
}

export function delFromData(id) {  //删除任务表单
    return request({
        url: '/api-inspection/form/' + id,
        method: 'delete'
    })
}