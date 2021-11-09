import Vue from 'vue'  //引入vue
import Vuex from 'vuex'  //引用vuex
import Cookies from 'js-cookie';
//使用vuex
Vue.use(Vuex);

//创建实例
const store = new Vuex.Store({
    modules:{
      app: {
        namespaced: true,
        state: {
          sidebar: {
            opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
            withoutAnimation: false
          },
        },
        actions: {
          toggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR');
          },
          closeSideBar({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
          },
        },
        mutations:{
          TOGGLE_SIDEBAR: state => {
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
            if (state.sidebar.opened) {
              Cookies.set('sidebarStatus', 1)
            } else {
              Cookies.set('sidebarStatus', 0)
            }
          },
          CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 0);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
          },
        }
      }
    },
    state: {
      workOrderMapping: {
        'NEW': {
          active: 0,
          title: '分配',
        },
        'WAITING': {
          active: 1,
          title: '转派',
        },
        'DOING': {
          active: 2,
          title: '转派',
        },
        'OK': {
          active: 4,
          title: '转派',
        },
        'CANCEL': {
          active: 4,
          title: '转派',
        },
        'DELAY': {
          active: 2,
          title: '转派',
        },
      },
      // 任务类型
      taskTypeMapping:{
        'inspection':{
          label: '巡检',
          value: 'inspection'
        },
        'maintain':{
          label: '保养',
          value: 'maintain'
        },
        'spotcheck':{
          label: '点检',
          value: 'spotcheck'
        }
      },

      // 电源管理
      powerInstrumentMapping: {
        'Ia':{
          paramsKey: "Ia",
          paramsName: "A相电流",
          unitName: "A",
          range: [0,60],
        },
        'Ib':{
          paramsKey: "Ib",
          paramsName: "B相电流",
          unitName: "A",
          range: [0,60],
        },
        'Ic':{
          paramsKey: "Ic",
          paramsName: "C相电流",
          unitName: "A",
          range: [0,60],
        },
        'Ig':{
          paramsKey: "Ig",
          paramsName: "漏电电流",
          unitName: "A",
          range: [0,60],
        },
        'I0':{
          paramsKey: "I0",
          paramsName: "零序电流",
          unitName: "A",
          range: [0,60],
        },
        'Iunb':{
          paramsKey: "Iunb",
          paramsName: "不平衡度",
          unitName: "",
          range: [0,100],
        },
        'F':{
          paramsKey: "F",
          paramsName: "频率",
          unitName: "HZ",
          range: [0,100],
        },
        'X':{
          paramsKey: "X",
          paramsName: "保留",
          unitName: "",
          range: [0,100],
        },
        'Ia/ln':{
          paramsKey: "Ia/ln",
          paramsName: "A相电流百分比",
          unitName: null,
          range: [0,100],
        },
        'Ib/ln':{
          paramsKey: "Ib/ln",
          paramsName: "B相电流百分比",
          unitName: null,
          range: [0,100],
        },
        'Ic/ln':{
          paramsKey: "Ic/ln",
          paramsName: "C相电流百分比",
          unitName: null,
          range: [0,100],
        },
        'Ua':{
          paramsKey: "Ua",
          paramsName: "A相电压",
          unitName: null,
          range: [0,400],
        },
        'f':{
          paramsKey: "f",
          paramsName: "频率",
          unitName: "HZ",
          range: [0,100],
        },
        'P':{
          paramsKey: "P",
          paramsName: "功率",
          unitName: "KW",
          range: [0,100],
        },
        'Q':{
          paramsKey: "Q",
          paramsName: "功率因数",
          unitName: null,
          range: [0,1],
        },
        '3U0':{
          paramsKey: "3U0",
          paramsName: "3U0",
          unitName: 'KV',
          range: [0,100],
        },
        'cos':{
          paramsKey: "cos",
          paramsName: "cos",
          unitName: '',
          range: [0,100],
        },
        'Ub':{
          paramsKey: "Ub",
          paramsName: "Ub",
          unitName: 'KV',
          range: [0,100],
        },
        'Uc':{
          paramsKey: "Uc",
          paramsName: "Uc",
          unitName: 'KV',
          range: [0,100],
        },
        'Uab':{
          paramsKey: "Uab",
          paramsName: "Uab",
          unitName: 'KV',
          range: [0,100],
        },
        'Ubc':{
          paramsKey: "Ubc",
          paramsName: "Ubc",
          unitName: 'KV',
          range: [0,100],
        },
        'Ux':{
          paramsKey: "Ux",
          paramsName: "Ux",
          unitName: 'KV',
          range: [0,100],
        }
      },
      // 任务类型
      equipmentStatusMapping:{
        'use':{
          value: 'use',
          label: '在用'
        },
        'scrap':{
          label: '报废',
          value: 'scrap'
        },
        'repair':{
          label: '维修',
          value: 'repair'
        },
        'unused':{
          label: '未用',
          value: 'unused'
        },
        'other':{
          label: '其他',
          value: 'other'
        }
      },
      CURRENTUSER: {},
    },
    mutations: {
        userInfo: (state, item) => {
            state['CURRENTUSER'] = item;
        },
    },
    getters: {
      sidebar: state => state.app.sidebar,
      powerInstrument: (state)=>{
        return state.powerInstrumentMapping;
      },
      taskTypeMapping: (state)=>{
        return state.taskTypeMapping;
      },
      equipmentStatusMapping: (state)=>{
        return state.equipmentStatusMapping;
      },
      currentUser: (state)=>{
        return state['CURRENTUSER'];
      }
    },
    actions:{
        // 设置城市信息
        // 参数列表：{commit, state}
        // state指的是state数据
        // commit调用mutations的方法
        // name就是调用此方法时要传的参数
        setUser({commit,state}, name){
            // 跟后台打交道
            // 调用mutaions里面的方法
            commit("userInfo", name);
        }
    },
})

export default store
