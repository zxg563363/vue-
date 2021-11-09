<template>
    <div class="login">
        <div class="loginBox">
            <div class="loginTitle">智能化洗煤厂综合管理系统</div>
            <div class="warp">
                <!--登陆 START-->
                <div v-show="isLogin == 1">
                    <el-form ref="loginForm" :model="loginForm" :rules="rules" status-icon>
                        <el-form-item prop="name" style="margin-bottom: 30px">
                            <el-input v-model.trim="loginForm.name" placeholder="请输入用户名" class="user" prefix-icon="el-icon-user"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model.trim="loginForm.password" type="password" placeholder="请输入密码" class="password" prefix-icon="el-icon-lock"></el-input>
                        </el-form-item>
                        <!--<div class="clearfix">-->
                            <!--<el-button type="text" @click="forgetPassword()" class="fr forget">忘记密码?</el-button>-->
                        <!--</div>-->
                        <el-form-item style="margin-top: 60px">
                            <el-button type="primary" @click="login" class="land">
                              登录
                              <i class="el-icon-right el-icon--right"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!--登陆 END-->

                <!--修改密码 START-->
                <div v-show="isLogin == 2">
                    <el-form ref="editFrom" :model="editFrom" :rules="editRules" status-icon>
                        <el-form-item prop="originalPassword">
                            <el-input v-model.trim="editFrom.originalPassword" type="password" placeholder="请输入原始密码" class="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="passOne">
                            <el-input v-model.trim="editFrom.passOne" type="password" placeholder="请输入修改密码，密码长度6-20位" class="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="passSec">
                            <el-input v-model.trim="editFrom.passSec" type="password" placeholder="请输入修改密码，密码长度6-20位" class="password"></el-input>
                        </el-form-item>
                        <div class="clearfix">
                            <el-button type="text" @click="backLogin()" class="fr forget">返回</el-button>
                        </div>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-edit" @click="editClick" class="land">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!--修改密码 END-->
            </div>
        </div>
    </div>
</template>

<script src="./login.js"></script>

<style scoped lang="less" src="./login.less"></style>
