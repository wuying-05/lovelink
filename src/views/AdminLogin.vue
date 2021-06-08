<template>
  <el-container class="container">
    <el-main class="main" v-loading.fullscreen="loading">
      <el-row class="first">
        <el-col
          :lg="{ span: 7, offset: 2 }"
          :md="{ span: 8, offset: 2 }"
          :sm="{ span: 10, offset: 3 }"
          :xs="{ span: 20, offset: 1 }"
        >
          <img class="home-image" src="../assets/home.jpg" />
          <p style="font-size: 24px">心相动，爱互联——爱联</p>
        </el-col>
        <el-col
          :lg="{ span: 7, offset: 7 }"
          :md="{ span: 8, offset: 4 }"
          :sm="{ span: 10, offset: 3 }"
          :xs="{ span: 20, offset: 2 }"
        >
          <el-card
            style="margin-top: 80px"
            v-if="!sharedState.is_admin_authenticated"
          >
            <div slot="header" style="text-align: center">管理员登录</div>
            <el-col>
              <el-form
                :model="loginForm"
                :rules="rules"
                ref="loginForm"
                status-icon
                style="margin-bottom: 12px"
              >
                <el-form-item prop="phone">
                  <el-input
                    @keyup.enter.native="submitForm('loginForm')"
                    placeholder="请输入手机号"
                    v-model.number="loginForm.phone"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    @keyup.enter.native="submitForm('loginForm')"
                    autocomplete="off"
                    placeholder="请输入密码"
                    type="password"
                    v-model="loginForm.password"
                  ></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 12px; margin-bottom: 0">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: space-around;
                    "
                  >
                    <el-button @click="submitForm('loginForm')" type="primary"
                      >登录
                    </el-button>
                    <!-- <wechat-login-button type="admin"></wechat-login-button> -->
                  </div>
                </el-form-item>
              </el-form>
              <el-row style="margin-bottom: 8px"> </el-row>
            </el-col>
          </el-card>
          <el-card style="margin-top: 80px; text-align: center" v-else>
            <img src="../assets/qy-qrcode.jpg" style="width: 230px" />
            <div slot="header">爱联网企业微信</div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import WechatLoginButton from "@/views/WechatLoginButton";

export default {
  name: "AdminLogin",
  components: { WechatLoginButton },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (value < 10000000000 || value > 99999999999) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      loading: false,
      sharedState: store.state,
      loginForm: {
        phone: "",
        password: "",
      },
      rules: {
        phone: [{ validator: checkPhone, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const path = "/tokens/admin";
          this.$axios
            .post(
              path,
              {},
              {
                auth: {
                  username: this.loginForm.phone.toString(), // 必须使用 username 作为键
                  password: this.loginForm.password,
                },
              }
            )
            .then((response) => {
              // this.$message.info('即将存储 token 到 localstorage')
              window.localStorage.setItem("admin-token", response.data.token);
              store.adminLoginAction();
              // console.log(
              //     JSON.parse(
              //         atob(
              //             window.localStorage.getItem('admin-token').split('.')[1]
              //         )
              //     )
              // )
              this.loading = false;
              this.$router.push("/admin");
              this.$message.success("登录成功，欢迎您！");
            })
            .catch((error) => {
              // eslint-disable-next-line eqeqeq
              console.log(error.response);
              this.loading = false;
              if (typeof error.response === "undefined") {
                this.$message.warning("服务器繁忙，请稍后再试");
                return false;
              }
              if (error.response.data.error_code === 1005) {
                this.$message.warning("手机号或密码错误，请确认后登录");
              }
              if (error.response.data.error_code === 1010) {
                this.$message.warning("账号已被禁用");
              }
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 0;
}

.home-image {
  max-width: 480px;
  margin-top: 20px;
}

@media (max-width: 700px) {
  .home-image {
    width: 300px;
  }
}
</style>
