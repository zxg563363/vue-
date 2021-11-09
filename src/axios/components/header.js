import request from "../request";

export function loginOutInit(params) {
    return request.get("/auth/logout",params);
}