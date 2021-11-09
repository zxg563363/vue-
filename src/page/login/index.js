/**
 * Created by lixiansky on 2021/5/24
 */
import Vue from 'vue'
import Login from './LoginNew.vue';
//添加ElementUI
import ElementUI from 'element-ui';
import 'static/css/theme/index.css';
import "static/css/main.css";
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage, {
  name: 'ls',
});
Vue.use(ElementUI);
new Vue({
  render: (h) => h(Login),
}).$mount("#app");
