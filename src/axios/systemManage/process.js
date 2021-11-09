import request,{axiosInstance} from "../request";

export function processList(params) {  //获取流程名字列表
    return axiosInstance({
        url: '/api-global/wf/define/search',
        method: 'post',
        data:params
    })
}

export function processAdd(params) {  //新增流程名字列表
    return axiosInstance({
        url: '/api-global/wf/define',
        method: 'post',
        data:params
    })
}

export function processGet(params) {  //流程 获取
    return axiosInstance({
        url: '/api-global/wf/define/' + params,
        method: 'get',
    })
}

export function processEdit(params) {  //流程 修改
    return axiosInstance({
        url: '/api-global/wf/define',
        method: 'Patch',
        data:params
    })
}

export function processDel(params) {  //流程 删除
    return axiosInstance({
        url: '/api-global/wf/define/' + params,
        method: 'Delete',
    })
}
