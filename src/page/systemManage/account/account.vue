<template>
    <div class="account">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

        <div class="content">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-s-custom"></i> 个人资料</span>
                    <el-form ref="infoFrom" size="small" :model="infoFrom" :rules="infoRule" label-width="140px">
                        <el-form-item prop="account" label="登陆账号">
                            <el-input v-model="infoFrom.account" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item prop="departId" label="所属部门">
                          <el-cascader
                            v-model="infoFrom.departId"
                            :options="depList"
                            :props="{checkStrictly: true,label: 'departName',value: 'departId'}"
                            clearable></el-cascader>
                        </el-form-item>
                        <el-form-item prop="realName" label="姓名（昵称）">
                            <el-input v-model="infoFrom.realName" placeholder="请输入姓名（昵称）"></el-input>
                        </el-form-item>
                        <el-form-item prop="userPhone" label="手机号">
                            <el-input v-model="infoFrom.userPhone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="userEmail" label="邮箱">
                            <el-input v-model="infoFrom.userEmail" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item align="left">
                            <el-button type="primary" @click="submitInfoForm('infoFrom')" :loading="saveLoading">保存修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-lock"></i> 修改密码</span>
                    <el-form ref="editPassFrom" size="small" :model="editPassFrom" :rules="editPassRules" label-width="140px">
                        <el-form-item prop="originalPassword" label="原始密码">
                            <el-input v-model.trim="editPassFrom.originalPassword" type="password" placeholder="请输入原始密码" class="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="passOne" label="新密码">
                            <el-input v-model.trim="editPassFrom.passOne" type="password" placeholder="请输入修改密码，密码长度6-20位" class="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="passSec" label="确认新密码">
                            <el-input v-model.trim="editPassFrom.passSec" type="password" placeholder="请输入修改密码，密码长度6-20位" class="password"></el-input>
                        </el-form-item>
                        <el-form-item align="left">
                            <el-button type="primary" @click="submitPassForm('editPassFrom')" :loading="saveLoadPassing">保存修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
    import { userGet, passwordEdit, } from '../../../axios/systemManage/account';
    import { depTree } from '../../../axios/systemManage/station';
    import { userEdit } from '../../../axios/systemManage/department';
    import { mapGetters } from 'vuex';

    export default {
        computed: {
          ...mapGetters({
            currentUser: 'currentUser',
          })
        },
        data() {
            var validatepassOne = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请设置密码长度为6-20位'))
                } else if (value.length > 20) {
                    callback(new Error('请设置密码长度为6-20位'))
                }  else {
                    callback()
                }
            };
            var validatepassSed = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请设置密码长度为6-20位'))
                } else if (value.length > 20) {
                    callback(new Error('请设置密码长度为6-20位'))
                } else if (value != this.editPassFrom.passOne) {
                    callback(new Error('两次密码需一致'))
                } else {
                    callback()
                }
            };
            return {
                breadcrumbList:[],
                userInfos:{},
                infoFrom:{
                    account:''
                },
                infoRule:{
                    realName: [
                        {required: true, message: '姓名（昵称）不能为空', trigger: 'blur'}
                    ],
                },
                depList:[],
                saveLoading:false,
                editPassFrom:{
                    originalPassword:'',
                    passOne:'',
                    passSec:'',
                },
                editPassRules:{
                    originalPassword: [
                        {required: true, message: '原始密码不能为空', trigger: 'blur'}
                    ],
                    passOne: [
                        {required: true, trigger: 'blur', validator: validatepassOne}
                    ],
                    passSec: [
                        {required: true, trigger: 'blur', validator: validatepassSed}
                    ]
                },
                saveLoadPassing:false,
            }
        },
        mounted() {
            this.toBreadcrumb();
            this.depTreeList();
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                //获取用户信息
                let _id = this.currentUser['id'] ? this.currentUser['id']: JSON.parse(this.$ls.get('userInfo'))['id'];
                userGet({id: _id}).then(res => {
                    this.userInfos = res.data;
                    let {account,departId, realName, userPhone, userEmail} = res.data;
                    this.infoFrom = {account,departId, realName, userPhone, userEmail};
                })
            },
            submitPassForm(formName) {
                //确认修改密码
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveLoadPassing = true;
                        let params = {
                            id:this.userInfos.id,
                            data:{
                                old:this.editPassFrom.originalPassword,
                                new:this.editPassFrom.passSec,
                            }
                        }
                        passwordEdit(params).then(res => {
                            if(res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改密码成功!'
                                });
                                this.getUserInfo();
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }
                            this.$refs[formName].resetFields();
                            this.saveLoadPassing = false;
                        })
                    } else {
                        return false
                    }
                })
            },
            submitInfoForm(formName) {
                //确认修改个人信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveLoading = true;
                        let params = {
                            realName:this.infoFrom.realName,
                            userPhone:this.infoFrom.userPhone,
                            userEmail:this.infoFrom.userEmail,
                            id:this.userInfos.id
                        };
                        userEdit(params,this.userEditId).then(res => {
                          this.$message({
                            type: 'success',
                            message: '修改用户成功!'
                          });
                          this.getUserInfo();
                        }).catch(error => {
                          this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3000});
                        }).finally(()=>{
                          this.saveLoading = false;
                        });
                    }
                })
            },
            depTreeList() {
                depTree().then(res => {
                  this.depList = res.dataList;
                    // this.setName(res.dataList);  //方法遍历树结构，获取所有部门列表
                })
            },
            setName(datas){ //遍历树  获取id数组
                for(var i in datas){
                    this.depList.push({
                        departId:datas[i].departId,
                        departName:datas[i].departName,
                    })
                    if(datas[i].children){
                        this.setName(datas[i].children);
                    }
                }
            },
            toBreadcrumb() {
                //面包屑
                this.breadcrumbList = [
                    { path:'/', name:'首页' },
                    { name:'系统管理' },
                    { name:'账号设置' }
                ]
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style scoped lang="less">
    .account{
        .content{
            margin-top: 20px;
            background: #fff;
            padding: 20px;
            .userCarsBox{
                width: 600px;
            }
        }
    }
</style>
