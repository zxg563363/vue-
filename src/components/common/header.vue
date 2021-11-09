<template>
  <div class="header clearfix">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar">
    </hamburger>

    <div class="header-right">
      <div  @click="$refs['messageBox'].openDialog()" class="download-service-btn">
        <el-badge :value="noticeNum > 0 ? noticeNum : ''" :max="99">
          <div title="通知消息中心">
              <span>
                <i class="el-icon-bell" style="font-size: 24px;"></i>
              </span>
          </div>
        </el-badge>
      </div>

      <div title="下载任务" class="download-service-btn"
           @click="$router.push({name: 'task_service_list'})">
            <span>
              <i class="el-icon-download" style="font-size: 24px;"></i>
            </span>
      </div>
      <div title="门户页面" class="download-service-btn"
           @click="$router.push({name: 'portal_index'})">
            <span>
              <i class="el-icon-menu" style="font-size: 24px;"></i>
            </span>
      </div>
      <el-dropdown trigger="click" class="userMain">
        <div v-bind:title="userInfo.account" class=" el-dropdown-link">
          <el-avatar :size="40" :src="headImg"></el-avatar>
          <span class="user-name">{{ userInfo.realName }} <i class="el-icon-arrow-down el-icon--right"></i></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-edit" @click.native="goAccount">账号设置</el-dropdown-item>
          <el-dropdown-item @click.native="loginOut" icon="el-icon-switch-button">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <message-box ref="messageBox"></message-box>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import VueCookies from 'vue-cookies'
  import {loginOutInit} from '../../axios/components/header';
  import Hamburger from '@/components/Hamburger/Hamburger';
  import MessageBox from '@/components/MessageBox/MessageBox';
  import {axiosInstance} from '@/axios/request';
  import {request} from '@/components/mixins/request';
  import mqtt from 'mqtt';
  import reduce from 'lodash/reduce';

  const mqttOptions = {
    // 超时时间
    // connectTimeout: 4000,
    // 认证信息
    // clientId: 'emqx',
    // 心跳时间
    keepalive: 60,
    clean: true,
  };
  export default {
    mixins: [request],
    components: {
      Hamburger, MessageBox
    },
    data() {
      return {
        headImg: require('./default.png'),
        userInfo: {},
        mqttClient: null,
        noticeNum: 0,
      }
    },
    computed: {
      ...mapGetters(["sidebar", "avatar"]),
    },
    mounted() {
      this.getUser();

      this.mqttClient = mqtt.connect('ws://coal.ceiov.com:8083/mqtt', mqttOptions);
      this.handleMQTT(this.mqttClient);
    },
    destroyed(){
      // 断开连接
      this.mqttClient.end();
      this.mqttClient = null;
    },
    methods: {
      getNoticeData(){
        this.requestProcess(axiosInstance({
          url: 'api-global/common/notice/fetch/all',
          method: 'get',
        })).then(res => {
          this.noticeNum = reduce(res.data,(results,value)=>{
            results += value['unread'];
            return results;
          },0);
          // console.log(res);
        });
      },
      handleMQTT(client){
        client.on('connect',(res)=>{
          // console.debug('消息服务连接成功！',res);
            let _user = JSON.parse(this.$ls.get('userInfo'));
            client.subscribe('coal/ws/notice/'+_user['id'],{},(error)=>{
              console.debug(error ||'消息主题订阅成功！');
            });

            // 获取通知消息
            this.getNoticeData();
        });


        client.on('message',(topic, message)=>{
          // console.log('收到来自', topic,'的消息:', message.toString());
          let data = null;
          try {
            data = JSON.parse(message.toString());
            this.noticeNum = this.noticeNum + 1;
          }catch (e) {
            data = {
              title: '成功',
              content: '消息提醒！'
            };
          }
          this.$notify({
            title: `【${data['title']}】消息提醒`,
            message: `${data['content']}`,
            type: 'success'
          });
        });

        client.on('error',(error)=>{
          console.error(error);
        });
        client.on('offline',()=>{
          console.error('offline');
        });

        client.on('reconnect',()=>{
          console.error('reconnect');
        });
      },

      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      getUser() {
        this.userInfo = {};
        try {
          this.userInfo = JSON.parse(this.$ls.get('userInfo'))
        } catch (e) {

        }
        // console.log(this.userInfo,'用户信息');
      },
      loginOut() {
        this.$confirm('此操作将退出登陆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let access_token = VueCookies.get('access_token');
          let params = {
            access_token: access_token
          };
          loginOutInit(params).then(res => {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '退出登陆成功!'
              });
              VueCookies.remove('access_token');
              VueCookies.remove('userInfo');
              // let that = this;
              setTimeout(function () {
                // that.$router.push({
                //     path: `/login`,
                // })
                window.location.href = 'login.html?_=' + new Date().getTime();
              }, 1000)
            } else {
              this.$message({
                message: '退出登陆失败，请稍后再试',
                type: 'warning'
              });
            }
          })
        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消'
          // });
        });
      },
      goAccount() {
        //跳转账号设置
        this.$router.push({
          path: `/systemManage/account`,
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .header-right{
    height: 60px;
    position: relative;
    float: right;
    right: 180px;
    transition: right 0.28s;
  }
  .hideSidebar{
    .header-right{
       right: 40px;
    }
  }
  .download-service-btn {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 12px 20px 8px 20px;
    float: left;

  }

  .download-service-btn:hover {
    background-color: rgba(20, 24, 53, .3);
  }

  .header {
    height: 100%;
    width: 100%;
    padding: 0 40px 0 0;
    box-sizing: border-box;
    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1), 0 2px 3px 0 rgba(0, 0, 0, .1);
    -moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1), 0 2px 3px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1), 0 2px 3px 0 rgba(0, 0, 0, .1);
    .userMain {
      height: 60px;
      line-height: 52px;
      cursor: pointer;
      font-size: 13px;
      color: #fff;
      span {
        margin: 0 0 0 6px;
      }
      .el-dropdown-link {
        margin-top: 10px;
      }
      .user-name {
        display: inline-block;
        position: relative;
        top: -14px;
        right: 0px;
      }
    }
    .userMain:hover {
      background-color: rgb(20, 24, 53);
    }
    .hamburger-container {
      cursor: pointer;
      line-height: 58px;
      height: 60px;
      float: left;
      padding: 0 10px;
    }
  }
</style>
