/**
 * Created by lixiansky on 2021/7/5
 */
import remove from 'lodash/remove';
import concat from 'lodash/concat';
import {Message} from "element-ui";
import VueCookies from "vue-cookies";

export default class Base {
  constructor() {
    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '表单管理'
      }
    ];

    // 拦截器
    this.interceptors = {
      ajaxBefore: (instance) => {
        return {
          request: ( (ins)=> {
            return ins.interceptors.request.use(config => {
              let url = window.location.href;
              //判断不是在登陆页面的话 其他页面token是否存在
              if (url.indexOf("login") === -1 && !VueCookies.isKey('access_token')) {
                Message.error('身份验证已过期，请重新登陆');
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

          response: ((ins)=> {
            return ins.interceptors.response.use(response => {

              if (response.status && response.status === 200 && response.data.status !== 200) {
                throw new Error(JSON.stringify(response.data['error'] || (response.data['status']+'【'+response.data['msg']+'】')));
              }
              return response.data;
            }, error => {
              // 请求错误时做些事
              // console.log(error);

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

  }

  // 组装面包屑导航
  installBreadcrumbList(_breadcrumb){
    return concat(remove(this.breadcrumbList,(n,i)=>{
      return i<2;
    }),_breadcrumb);
  }

}

export const loading =  (message = '加载中...', errorFn = ()=> {})=> {
  return (target, name, descriptor)=> {
    const fn = descriptor.value;
    descriptor.value = async (...rest)=> {
      const loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      try {
        return await fn.call(this, ...rest)
      } catch (error) {
        // 在调用失败，且用户自定义失败的回调函数时，则执行
        errorFn && errorFn.call(this, error, ...rest)
        console.error(error)
      } finally {
        loading.close()
      }
    }
  }
}
