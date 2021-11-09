import Vue from 'vue';
import {axiosInstance} from '@/axios/request';
import assign from "lodash/assign";
Vue.directive('authCheck', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.style.display = 'none';
    },
    bind: function (el, binding, vnode) {
        axiosInstance({
            url: '/auth/check/action',
            method: 'get',
            params: {
                actionCode: binding.value
            },
        }).then(data =>{
            let results = data.data;
            if(results.status && results.status === 200){
                return results;
            }
            throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
        }).then(res => {
            el.style.display = res.data ? 'inline-block' : 'none';
        });
    }
});