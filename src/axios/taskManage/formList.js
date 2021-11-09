import request from "../request";

export function jobList(params) {  //获取任务列表
    return request({
        url: '/api-inspection/job',
        method: 'post',
        data:params
    })
}