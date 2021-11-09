import axios from "axios";
import { Message, Loading } from "element-ui";
import VueCookies from 'vue-cookies'

//loading设置 START
let loading;
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}
//loading END


axios.defaults.withCredentials = false;
axios.defaults.headers.get['Authorization'] = 'Bearer '+VueCookies.get('access_token');
// create an axios instance
const service = axios.create({
    headers: { "Content-Type": "application/json" },
    // process.env.VUE_APP_BASE_API  修改前
    baseURL: process.env.BASE_API, // url = base url + request url  修改后
    withCredentials: false, // send cookies when cross-domain requests
    timeout: 60 * 1000, // request timeout
}),axiosFormDataInstance = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
  // process.env.VUE_APP_BASE_API  修改前
  baseURL: process.env.BASE_API, // url = base url + request url  修改后
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60 * 1000 // request timeout
}),axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  // process.env.VUE_APP_BASE_API  修改前
  baseURL: process.env.BASE_API, // url = base url + request url  修改后
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60 * 1000, // request timeout
});

let interceptors = {
      ajaxBefore: (instance) => {
        return {

          request: (function (ins) {
            return ins.interceptors.request.use(config => {
              // 在发送请求之前做某事，比如说 设置loading动画显示
              startLoading();
              // Swal.fire({
              //   title: '提示',
              //   html: '处理中，请稍等...',
              //   timerProgressBar: true,
              //   allowOutsideClick: false,
              //   didOpen: () => {
              //     Swal.showLoading();
              //   },
              // });
              let url = window.location.href;
              //判断不是在登陆页面的话 其他页面token是否存在
              if (url.indexOf("login") == -1 && !VueCookies.isKey('access_token')) {
                Message.error('身份验证已过期，请重新登陆');
                // let that = this;
                setTimeout(function () {
                  window.location.reload();
                }, 1000)
              }
              // console.log(config);
              return config;
            }, error => {
              // 请求错误时做些事
              return Promise.reject(error);
            });
          })(instance),

          response: (function (ins) {
            return ins.interceptors.response.use(response => {
              // console.log(response);
              // 对响应数据做些事，比如说把loading动画关掉
              // Swal.close();
              endLoading();
              if ((response.status && response.status !== 200) || (response.data.status !== 200)) {
                // throw new Error(JSON.stringify(response.data['error'] || (response.data['status']+'【'+response.data['msg']+'】')));
                let results = response.data;
                throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
              }
              return response.data;
            }, error => {
              // 请求错误时做些事
              // console.log(error);

              endLoading();
              // Swal.close();
              if(error.response.status && error.response.status === 401){
                window.location.href = 'login.html';
              }else{
                return Promise.reject(error);
              }
            });
          })(instance),
        };
      }
};
interceptors.ajaxBefore(service);

export {axiosFormDataInstance, interceptors, axiosInstance,axios};
export default service;
