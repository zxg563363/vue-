<template>
  <div class="app-main">
    <div class="l-wrap">
      <div class="l-container">
        <div class="l-img">
          <div class="l-img-left">
            <div class="l-img-outline"></div>
            <div class="l-img-brand"></div>
            <div class="l-img-outside"></div>
            <div class="l-img-middle"></div>
            <div class="l-img-inside"></div>
          </div>
          <div class="l-img-right">
            <div class="l-img-device-1"></div>
            <div class="l-img-device-2"></div>
            <div class="l-img-device-3"></div>
            <div class="l-img-device-4"></div>
            <div class="l-img-device-5"></div>
          </div>
        </div>
        <div class="l-login-box">
          <div class="l-login-box-bg"></div>
          <h1 class="l-login-title">
            智能化选煤厂综合管理系统
          </h1>

          <el-form v-loading="loading"
                   element-loading-text="正在登录中，请稍后..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   ref="loginForm" :model="loginForm" :rules="rules" status-icon class="l-login-form">
            <el-form-item prop="name" style="margin-bottom: 30px">
              <el-input v-model.trim="loginForm.name" placeholder="请输入用户名" class="user" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model.trim="loginForm.password" type="password" placeholder="请输入密码" class="password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <!--<div class="clearfix">-->
            <!--<el-button type="text" @click="forgetPassword()" class="fr forget">忘记密码?</el-button>-->
            <!--</div>-->
            <el-form-item style="margin-top: 20px; text-align: center">
              <el-button :loading="loading" type="primary" @click="login" class="land" style="width: 100%;">
                登录
                <i class="el-icon-right el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./login.js"></script>

<style scoped lang="less" src="./login.less"></style>
