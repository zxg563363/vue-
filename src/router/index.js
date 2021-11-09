import Vue from 'vue'
import Router from 'vue-router'
import navRouter from './nav'  //左侧导航路由页面配置

const ContentMain = () => import("@/components/common/contentMain.vue");  //整体框架
// const Login = () => import("@/components/login/login.vue");  //登录页
const Detail = () => import("@/page/deviceManage/detail/detail.vue");//系统管理-流程定制

// 路由扩展业务（用于展示去除左边和头部部分）
import BusinessExtends from '@/page/extends/index';

Vue.use(Router);

//防止路由报错 START
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
//防止路由报错 END

export default new Router({
  routes: [
    {
      path: '/',           //这个表示的是根目录，即一进入的页面
      redirect: '/index',    //设置页面一进来就显示的页面，即重定向到goods组件
      requireAuth: true,
      title: '首页',
    }, {
      path: '',
      name: 'content',
      component: ContentMain,
      children: navRouter
    }, {
      name: 'detail',
      path: '/detail/:id',
      component: Detail,
    }, {
      name: 'extends',   // 业务扩展路由
      path: '/extends',
      component: {
        template: '<router-view name="extends_manage" v-if="isRouterAlive"></router-view>',
        provide() {
          return {
            reload: this.reload,
          }
        },
        data() {
          return {
            isRouterAlive: true,
          }
        },
        methods: {
          reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => {
              this.isRouterAlive = true;
            })
          }
        }
      },
      children: ((be) => {
        return be.routers;
      })(new BusinessExtends()),
    }, {
      name: 'portal',   // 业务扩展路由
      path: '/portal',
      component: {
        template: '<router-view name="portal_manage"></router-view>'
      },
      children: [
        {
          path: "index",
          name: "portal_index",
          meta: {
            title: '平台门户',
            keepAlive: true
          },
          components: {
            // 父级路由名称
            portal_manage: () => {
              // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
              return import(/* webpackChunkName: "portal_index" */ "../page/portal/portal.vue");
            },
          },
        },
      ],
    }
  ]
})
