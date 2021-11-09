<template>
  <div>
    <div class="sidebar-logo-container">
      <el-image
        class="logo-normal"
        style="height: 60px; width: 120px;"
        :src="require('../../static/img/logo.png')"
        fit="fill"></el-image>
      <el-image
        class="logo-mini"
        style="height: 60px;"
        :src="require('../../static/img/logo-mini.png')"
        fit="fill"></el-image>
    </div>
    <div class="leftBar">
        <el-menu router
                 :default-active="activeIndex"
                 class="el-menu-vertical-demo"
                 :collapse="isCollapse"
                 @open="handleOpen"
                 @close="handleClose"
                 background-color="#141835"
                 text-color="rgba(202,206,209,.6)!important"
                 active-text-color="#cacee5!important"
                 :default-openeds="openeds">
            <!--<router-link v-for="(list,index) in listOne" :to="list.menuUrl" :key="'nav-1' + index">-->
                <!--<el-menu-item :index="list.menuId">-->
                    <!--<i :class="list.menuIcon"></i>-->
                    <!--<span slot="title">{{list.menuName}}</span>-->
                <!--</el-menu-item>-->
            <!--</router-link>-->
            <div v-for="(item,index) in listMore" :key="'nav-1' + index">
            <el-menu-item v-if="item.subMenu.length == 0" :index="item.menuUrl">
              <i :class="item.menuIcon"></i>
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
            <el-submenu v-if="item.subMenu.length>0"  :index="item.menuId + ''" >
                <template slot="title">
                    <i :class="item.menuIcon"></i>
                    <span>{{item.menuName}}</span>
                </template>
                <el-menu-item-group>
                    <div style="transition: width 0.28s;" v-if="item.subMenu.length != 0" v-for="(middleItem,index) in item.subMenu" :key="'nav4' + index">
                        <el-submenu v-if="middleItem.subMenu.length != 0" :index="middleItem.menuUrl + '1'">
                            <template slot="title">{{middleItem.menuName}}</template>
                            <el-menu-item v-if="middleItem.subMenu.length != 0" v-for="(littleItem,index) in middleItem.subMenu" :index="littleItem.menuUrl + ''" :key="'info5' + index">
                                {{littleItem.menuName}}
                            </el-menu-item>
                        </el-submenu>
                    </div>
                    <el-menu-item v-for="(middleItem,index) in item.subMenu" :index="middleItem.menuUrl + ''" v-if="middleItem.subMenu.length == 0" :key="'nav-3' + index">
                        <span>{{middleItem.menuName}}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            </div>
        </el-menu>
    </div>
  </div>
</template>

<script>
    import { barDatas, barDatasNew, } from '../../axios/components/leftBar'
    import {mapGetters} from "vuex";
    export default {
        data() {
            return {
                openeds:[],
                dataListOne:[],
                dataListMore:[],
                listOne:[],
                listMore:[],
            }
        },
        mounted() {
            this.getBarDatas()
            // console.log(this.$store.state);
        },
        methods: {

            getBarDatas() {
                barDatasNew().then(res => {
                    this.listMore = res.data.menus;
                    // for(var i = 0; i < res.data.menus.length; i++) {
                    //     if(res.data.menus[i].subMenu.length == 0) {
                    //         this.listOne.push(res.data.menus[i]);
                    //     } else {
                    //         this.listMore.push(res.data.menus[i]);
                    //     }
                    // }
                })
            },
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            }
        },
        computed: {
            ...mapGetters(["sidebar"]),
            activeIndex() {  //设置路由高亮
                // console.log(this.$route);
                if(this.$route.name === 'workOrder_detail' || this.$route.name === 'workOrder_update') {  //工单详细
                    return '/workManage/workorder';
                }

                if(this.$route.name === 'task_plan_add' || this.$route.name === 'task_plan_update') {  //工单详细
                  return '/task/plan/list';
                }
                if(this.$route.name === 'work_add'){
                  return '/workManage/workadd';
                }

                if(this.$route.name === 'dashboard'){
                  return '/index';
                }

                return this.$route.path;

            },
            isCollapse(){
              return !this.sidebar.opened;
            },
        }
    }
</script>

<style scoped lang="less">
    .leftBar{
        transition: width .28s;
        width: 200px;
        background: #141835;
        z-index: 6;
        overflow-y: auto;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-x:hidden;//隐藏x轴
        margin-top: 60px;
    }
    .leftBar::-webkit-scrollbar-track-piece {
        background: #2b3153 !important;
    }
    .leftBar::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
    }
    .leftBar::-webkit-scrollbar-thumb {
        background: rgba(144,147,153,.3) !important;
        border-radius: 20px !important;
    }
    .el-menu{
        width: 100%;
    }
    .el-menu-item.is-active {
        box-sizing: border-box;
        color: #cacee5;
        border-left: 6px solid #1947ff;
        background-image: linear-gradient(90deg,rgba(26,71,255,.25),rgba(26,71,255,0))!important;
    }
    .el-submenu__title i,.el-menu-item i{
        display: inline-block;
        height: 20px;
        width: 20px;
        margin-right: 15px;
    }
    .icon-index{
        background: url("../../static/img/common/leftBar/首页2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-workManage{
        background: url("../../static/img/common/leftBar/工单2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-deviceManage{
        background: url("../../static/img/common/leftBar/设备2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-taskManage{
        background: url("../../static/img/common/leftBar/表单2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-powerManage{
        background: url("../../static/img/common/leftBar/电源2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-power-switch{
        background: url("../../static/img/common/leftBar/停送电2x.png") 100% 100%;
        background-size: 100% 100%;
    }
    .icon-systemManage{
        background: url("../../static/img/common/leftBar/系统2x.png") 100% 100%;
        background-size: 100% 100%;
    }

    /*采购管理*/
    .icon-purchase{
      background: url("../../static/img/common/leftBar/采购2x.png") 100% 100%;
      background-size: 100% 100%;
    }
    /*缺陷管理*/
    .icon-defect{
      background: url("../../static/img/common/leftBar/缺陷2x.png") 100% 100%;
      background-size: 100% 100%;
    }
    /*库存管理*/
    .icon-stock{
      background: url("../../static/img/common/leftBar/库存2x.png") 100% 100%;
      background-size: 100% 100%;
    }
    .icon-supply{
      background: url("../../static/img/common/leftBar/供货2x.png") 100% 100%;
      background-size: 100% 100%;
    }
    .el-menu-item.is-active .icon-index{
        background: url("../../static/img/common/leftBar/icon-index-active.png") 100% 100%;
    }
    .sidebar-logo-container {
      transition: width 0.28s;
      position: fixed;
      width: 200px;
      height: 60px;
      line-height: 60px;
      background: #2b3153;
      text-align: center;
      overflow: hidden;
      z-index: 3;
    }
    .logo-mini{
      display: none;
    }
    .logo-normal{
      display: inline-block;
    }
    .hideSidebar{
      .sidebar-logo-container{
        width: 58px;
      }
      .logo-mini{
        display: inline-block;
      }
      .logo-normal{
        display: none;
      }
    }
    .sidebar-logo-container:before {
      content: " ";
      border-right: 1px solid hsla(0,0%,88.2%,.1);
      display: inline-block;
      height: 46px;
      position: absolute;
      top: 7px;
      right: 0;
    }
</style>
