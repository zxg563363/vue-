/**
 * Created by lixiansky on 2021/8/18
 */
import VueCookies from 'vue-cookies';
import {request} from '@/components/mixins/request';
import {axiosInstance} from "../../axios/request";
export default {
  mixins: [request],
  data() {
    var validatepassOne = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请设置密码长度为6-20位'))
      } else if (value.length > 20) {
        callback(new Error('请设置密码长度为6-20位'))
      }  else {
        callback()
      }
    }
    var validatepassSed = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请设置密码长度为6-20位'))
      } else if (value.length > 20) {
        callback(new Error('请设置密码长度为6-20位'))
      } else if (value != this.editFrom.passOne) {
        callback(new Error('两次密码需一致'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        name:'',
        password:'',
      },
      rules: {
        name: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ],
      },
      isLogin:1,  //正常登陆1  修改密码2
      editFrom: {
        originalPassword:'',
        passOne:'',
        passSec:''
      },
      editRules: {
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
      loading: false,
    }
  },
  mounted() {
    this.keyBoard()
  },
  methods: {
    forgetPassword() {
      //忘记密码
      this.isLogin = 2;
      this.$refs['loginForm'].resetFields();
    },
    backLogin() {
      this.isLogin = 1;
      this.$refs['editFrom'].resetFields();
    },
    editClick() {
      //修改密码
      this.$refs.editFrom.validate((valid) => {
        if (valid) {
          console.log(this.editFrom);
        } else {
          return false
        }
      })
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if(!valid){
          return false;
        }
        let params = {
          'username':this.loginForm.name,
          'password':this.loginForm.password,
        };
        this.loading = true;
        return this.requestProcess(axiosInstance.post("/auth/global",params)).then(res => {
          // console.log(res);
          return res.data;
        }).then((data)=>{
          this.$ls.set('userInfo', JSON.stringify(data.account));
          let token = data.access_token;
          let expires = data.expires;
          VueCookies.set('access_token',token,expires);
          VueCookies.set('userInfo',data.account);
          window.location.href = '/index.html#/portal/index';
          this.$message({
            message: '恭喜你，登陆成功',
            type: 'success',
          });
          // this.$store.dispatch('setUser',data.account);
          // this.$router.push({
          //   path: `/index`,
          // });

        }).catch((e) => {
          this.$refs.loginForm.resetFields();
        }).finally(()=>{
          this.loading = false;
        });
      });
    },
    keyBoard() {
      let that = this;
      document.onkeydown = function (e) { // 回车提交表单
        // 兼容FF和IE和Opera
        var theEvent = window.event || e;
        if (theEvent.key === 'Enter') {
          that.login();
        }
      }
    }
  }
}
