// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import store from "./store/index";
import "@/filters/index";
import "@/directive/auth-check";
import promiseFinally from "promise.prototype.finally";
promiseFinally.shim();
import axios from "axios";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
//添加ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./static/css/coal/theme/index.css";
import "./static/css/main.css";
import "./static/css/coal/theme/table.less";
import "./static/css/text.less";
import "./static/css/card.less";
import "font-awesome/less/font-awesome.less";
import "prismjs/themes/prism-tomorrow.css";
import "./static/css/query.less";

//添加less
import less from "less";
import VueLocalStorage from "vue-localstorage";
Prism.manual = true;

Prism.highlightAll();

Vue.use(VueLocalStorage, {
  name: "ls"
});
Vue.use(less);

import App from "./App";
// 路由开始
import router from "./router";
import routerInterceptor from "./router/routerInterceptor"; //路由守卫
routerInterceptor();
//路由结束

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
Vue.use(ElementUI);
// 引入animate
import "./static/css/animate.css";

import FormMaking from "form-making";
import { GenerateForm, MakingForm } from "form-making";
import "form-making/dist/FormMaking.css";
Vue.use(GenerateForm);
Vue.use(MakingForm);
Vue.use(FormMaking);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App: App },
  template: "<App/>"
});



//添加图片查看器
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});
//添加图片查看器
