import request,{axiosInstance} from "../request";

export function getWorkTeam(params) {  //获取班组
    return axiosInstance({
        url: 'api-inspection/workTeam/',
        method: 'GET',
        params:params
    })
}

export function addWorkTeam(params) {  //新增班组
    return axiosInstance({
        url: 'api-inspection/workTeam/',
        method: 'post',
        data:params
    })
}

export function editWorkTeam(params,id) {  //修改班组
    return axiosInstance({
        url: 'api-inspection/workTeam/' + id,
        method: 'put',
        data:params
    })
}

export function delWorkTeam(id) {  //删除班组
    return axiosInstance({
        url: 'api-inspection/workTeam/' + id,
        method: 'delete',
    });
}

export function userListTeam(params) {  //根据班组获取人员
    return axiosInstance({
        url: 'api-inspection/workTeam/user',
        method: 'get',
        params:params
    })
}

export function userToTeam(params) {  //人员保存到 班组
    return axiosInstance({
        url: 'api-inspection/workTeam/user/' + params.teamId,
        method: 'post',
        data:params.userIdArr
    })
}

export function deviceListTeam(params) {  //根据班组获取设备
    return request({
        url: 'api-inspection/workTeam/equipment',
        method: 'get',
        params:params
    })
}

export function deviceToTeam(params) {  //设备保存到 班组
    return request({
        url: 'api-inspection/workTeam/equipment/' + params.teamId,
        method: 'post',
        data:params.deviceArr
    })
}

export function removeTeamUser(teamId, userId){
    return axiosInstance({
        url: 'api-inspection/workTeam/user/'+teamId,
        method: 'delete',
        params:{
            userId
        },
    });
}
