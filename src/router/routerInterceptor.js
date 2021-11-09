import router from './index.js'
import VueCookies from 'vue-cookies'

export default function () {
  /*
    全局路由钩子
    访问资源时需要验证cookie中是否存在access_token
 */
    router.beforeEach((to, from, next) => {
        // console.log(to,from);
        if(to.fullPath != '/login') {
            if(VueCookies.isKey('access_token')) {
                next()
            } else {
                // next('/login');
              window.location.href = 'login.html';
            }
        } else {
            next()
        }
    })
}
