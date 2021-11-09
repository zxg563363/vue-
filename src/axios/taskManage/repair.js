import request from "../request";

export function saveRepair(params) {  //新建任务计划
    return request({
        url: '/api-inspection/plan',
        method: 'post',
        data:params
    })
}

export function repairList(params) {  //任务计划列表
    return request({
        url: '/api-inspection/plan',
        method: 'get',
        params:params
    })
}

export function delRepair(params) {  //删除 任务计划
    return request({
        url: '/api-inspection/plan/' + params.id,
        method: 'delete',
    })
}

export function editRepair(params,id) {  //修改 任务计划
    return request({
        url: '/api-inspection/plan/' + id,
        method: 'put',
        data:params
    })
}

export function deviceList(params) {  //设备列表 任务计划
    return request({
        url: '/api-inspection/plan/listEquipment',
        method: 'get',
        params:params
    })
}