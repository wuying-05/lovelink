<template>
  <div class="register-promoter-wrap">
    <div class="inner-wrap">
      <div class="re-title">注册成为推广员</div>
      <div class="re-sub">* 姓名和手机号为必填项</div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <p class="form-label">姓名</p>
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <p class="form-label">手机号</p>
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')"
            >立即注册</el-button
          >
          <el-button type="primary" size="small" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "RegisterPromoter",
  data() {
    return {
      form: {
        openid: "",
        name: "",
        phone: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      lock: false,
    };
  },
  created() {
    if (this.$route.query.code && this.$route.query.state >= 0) {
      this.getData();
    } else {
      const appid = "wxed3e5e820e4d6f19";
      const url = "lovelink.net.cn";
      let state = 0;
      const redirect_uri = `http://${url}/register-promoter`
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    }
  },
  methods: {
    getData() {
      this.$http
        .post("http://wechat.lovelink.net.cn/api/weChat/openid", {
          code: this.$route.query.code,
        })
        .then(({ data }) => {
          if (data.state !== "ok") {
            this.$message.warning(data.msg);
          } else if (data.msg) {
            this.form.openid = data.msg;
            this.form.name = data.data.name;
            this.form.phone = data.data.phone;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.lock) {
            return;
          }
          this.lock = true;
          this.$http
            .post("http://wechat.lovelink.net.cn/api/register", {
              ...this.form,
            })
            .then(({ data }) => {
              if (data.state !== "ok") {
                this.$message.warning(data.msg);
              } else {
                this.$message.success(data.msg);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    resetForm(formName) {
      this.lock = false;
      this.form.name = "";
      this.form.phone = "";
    },
  },
};
</script>
<style scoped>
.register-promoter-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #44a6ec;
}
.register-promoter-wrap .inner-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: white;
  width: 75%;
  min-width: 300px;
  height: 80%;
  min-height: 300px;
  padding: 0 30px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
}
.re-title {
  letter-spacing: 2px;
  font-size: 24px;
  font-weight: 500;
}
.re-sub {
  font-size: 0.8rem;
  margin-top: 10px;
}
.el-form {
  width: 100%;
  margin-top: 30px;
}
.form-label {
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
}
.btn-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
}
</style>