<template>
  <el-container>
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :xs="{ span: 24 }"
          :sm="{ span: 16, offset: 4 }"
          :md="{ span: 12, offset: 5 }"
          :lg="{ span: 10, offset: 7 }"
        >
          <el-card>
            <el-form
              :model="registerForm"
              :rules="rules"
              ref="registerForm"
              label-width="80px"
              style="max-width: 550px"
              status-icon
            >
              <el-tag
                style="font-size: 20px; margin: 24px 16px 32px"
                effect="light"
                >注册账号</el-tag
              >
              <el-form-item label="昵称" prop="name"
                ><el-input v-model="registerForm.name"></el-input
              ></el-form-item>
              <el-form-item label="手机号" prop="phone"
                ><el-input v-model.number="registerForm.phone"></el-input
              ></el-form-item>
              <el-form-item label="验证码" prop="clientCode" autocomplete="off">
                <el-input v-model.number="registerForm.clientCode">
                  <el-button
                    slot="append"
                    :disabled="isDisabled"
                    @click="sendCode('registerForm')"
                    >{{ buttonText }}</el-button
                  >
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass" autocomplete="off">
                <el-input
                  autocomplete="off"
                  type="password"
                  v-model="registerForm.pass"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="pass2" autocomplete="off">
                <el-input
                  autocomplete="off"
                  type="password"
                  v-model="registerForm.pass2"
                ></el-input>
              </el-form-item>

              <el-tag
                style="font-size: 20px; margin: 24px 16px 32px"
                effect="light"
                >完善基本资料</el-tag
              >
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="registerForm.gender">
                  <el-radio-button label="1">男士</el-radio-button>
                  <el-radio-button label="2">女士</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="婚姻状况" prop="marriage">
                <el-radio-group v-model="registerForm.marriage">
                  <el-radio-button label="1">未婚</el-radio-button>
                  <el-radio-button label="2">离异</el-radio-button>
                  <el-radio-button label="3">丧偶</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  :default-value="new Date(1990, 0, 1)"
                  prefix-icon="none"
                  v-model="registerForm.birthday"
                  type="date"
                  placeholder="请选择生日"
                  placeholder-class=""
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="身高" prop="height">
                <el-select
                  placeholder="请选择身高"
                  v-model="registerForm.height"
                >
                  <el-option
                    :key="item"
                    :label="item + 130 + '厘米'"
                    :value="item + 130"
                    v-for="item in 99"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="家乡" prop="residence">
                <el-cascader
                  popper-class="sg-mobile-cascader"
                  :options="cityOptions"
                  size="large"
                  v-model="registerForm.residence"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="工作地" prop="location">
                <el-cascader
                  popper-class="sg-mobile-cascader"
                  :options="cityOptions"
                  size="large"
                  v-model="registerForm.location"
                ></el-cascader>
              </el-form-item>
              <el-form-item align="left" label="学历" prop="degree">
                <el-select
                  placeholder="请选择您的真实学历"
                  v-model="registerForm.degree"
                >
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in degreeOptions.slice(1, 6)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职业" prop="job"
                ><el-cascader
                  :options="jobOptions"
                  size="large"
                  v-model="registerForm.job"
                ></el-cascader
              ></el-form-item>
              <!-- <el-form-item label="月收入" prop="salary">
								<el-select placeholder="选择真实的月收入" v-model="registerForm.salary">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in salaryOptions"></el-option>
								</el-select>
							</el-form-item> -->

              <!-- <el-form-item class="qy-qrcode">
                <img src="../assets/qy-qrcode.jpg" style="max-width: 100px" />
                <p>欢迎关注企业微信</p>
              </el-form-item> -->
              <el-form-item style="text-align: center"
                ><el-button @click="submitForm('registerForm')" type="primary"
                  >注册</el-button
                ></el-form-item
              >
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Birthday from "../components/Birthday";
import { regionData, CodeToText } from "element-china-area-data";
import { salaryOptions, degreeOptions, jobOptions } from "../data";
export default {
  name: "Register",
  components: { Birthday },
  props: {
    wechat_id: "",
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.pass2 !== "") {
          this.$refs.registerForm.validateField("pass2");
        }
        callback();
      }
    };
    var checkPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      cityOptions: regionData,
      salaryOptions: salaryOptions,
      degreeOptions: degreeOptions,
      jobOptions: jobOptions,
      registerPhone: "",
      registerForm: {
        gender: "",
        marriage: "",
        birthday: "",
        residence: [],
        location: [], // 三个数字表示的三级地址
        salary: "",
        height: 170,
        degree: "",
        job: "",
        name: "",
        pass: "",
        pass2: "",
        clientCode: "", // 用户输入的验证码
        code: "", // 实际的正确验证码
        phone: "",
      },
      buttonText: "发送验证码",
      isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true,
      rules: {
        name: [
          { required: true, message: "输入你在网站昵称", trigger: "blur" },
          { min: 2, message: "昵称最少两个字", trigger: "blur" },
          { max: 8, message: "昵称最长8个字", trigger: "blur" },
        ],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        pass: [
          { required: true, validator: checkPass, trigger: "blur" },
          { min: 6, message: "密码长度至少为6位", trigger: "blur" },
        ],
        pass2: [{ required: true, validator: checkPass2, trigger: "blur" }],
        clientCode: [{ required: true, validator: checkCode, trigger: "blur" }],
        gender: [
          { required: true, message: "请选择你的性别", trigger: "blur" },
        ],
        birthday: [
          { required: true, message: "请选择你的出生日期", trigger: "blur" },
        ],
        marriage: [
          { required: true, message: "请选择你的婚姻状态", trigger: "blur" },
        ],
        location: [
          { required: true, message: "请选择你的工作地", trigger: "blur" },
        ],
        residence: [
          { required: true, message: "请选择你的家乡", trigger: "blur" },
        ],
        // salary: [{ required: true, message: '请选择你的工资范围', trigger: 'blur' }],
        degree: [
          { required: true, message: "请选择你的学历", trigger: "blur" },
        ],
        job: [{ required: true, message: "请输入你的工作", trigger: "blur" }],
        height: [
          { required: true, message: "请选择你的身高", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getCity(location) {
      // eslint-disable-next-line no-unused-vars
      var province = CodeToText[location[0]];
      var city = CodeToText[location[1]];
      var district = CodeToText[location[2]];
      if (province === "全部") {
        return "中国";
      } else if (city === "undefined") {
        return province;
      } else if (district === "undefined") {
        return province + "/" + city;
      } else {
        return province + "/" + city + "/" + district;
      }
    },
    submitForm(formName) {
      this.loading = true;
      if (this.registerForm.phone !== this.registerPhone) {
        this.$message.error("注册手机号与验证手机号不一致，请更正。");
        this.loading = false;
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const path = "/register";
          const payload = {
            gender: this.registerForm.gender,
            marriage: this.registerForm.marriage,
            birthday: this.registerForm.birthday,
            location: this.registerForm.location.toString(),
            residence: this.registerForm.residence.toString(),
            location_cn: this.getCity(this.registerForm.location),
            residence_cn: this.getCity(this.registerForm.residence),
            // salary: this.registerForm.salary,
            degree: this.registerForm.degree,
            job: this.registerForm.job,
            height: this.registerForm.height,
            name: this.registerForm.name,
            phone: this.registerForm.phone,
            code: this.registerForm.clientCode,
            password: this.registerForm.pass,
            wechat: this.wechat_id,
          };
          this.$axios
            .post(path, payload)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // 注册成功
              this.$message({
                showClose: true,
                // message: "注册成功，请登录！",
                message: "恭喜您，您已经成功注册为本网站会员，请登录网站！",
                type: "success",
                duration: 5000,
                center: true,
              });
              this.$router.push("/login");
              this.loading = false;
            })
            .catch((error) => {
              if (error.response.data.error_code === 1000) {
                this.$message({
                  showClose: true,
                  message: "该手机号已注册，请直接登录",
                  type: "info",
                  duration: 5000,
                  center: true,
                });
                this.loading = false;
                return false;
              }
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    sendCode(formName) {
      this.$refs[formName].validateField("phone", (valid) => {
        if (valid === "") {
          let time = 60;
          this.buttonText = "验证码已发送";
          this.isDisabled = true;
          if (this.flag) {
            this.flag = false;
            // eslint-disable-next-line prefer-const
            let timer = setInterval(() => {
              time--;
              this.buttonText = time + " 秒";
              if (time === 0) {
                clearInterval(timer);
                this.buttonText = "重新获取";
                this.isDisabled = false;
                this.flag = true;
              }
            }, 1000);
          }
          // eslint-disable-next-line standard/object-curly-even-spacing
          const path = "/code/verify";
          this.registerPhone = this.registerForm.phone;
          const payload = {
            phone: Number(this.registerForm.phone),
          };
          this.$axios
            .post(path, payload)
            .then((response) => {
              if (response.data.error_code === 0) {
                //this.registerForm.code = response.data.code
                this.$message({
                  showClose: true,
                  message: "短信已发送，请注意查收",
                  type: "info",
                  duration: 5000,
                  center: true,
                });
              }
            })
            .catch((error) => {
              if (error.response.data.error_code === 1002) {
                this.$message({
                  showClose: true,
                  message: "短信发送过于频繁，请稍后再试",
                  type: "warning",
                  duration: 5000,
                  center: true,
                });
              } else if (error.response.data.error_code === 1003) {
                this.$message({
                  showClose: true,
                  message: "该手机号不存在，请输入正确的手机号",
                  type: "warning",
                  duration: 5000,
                  center: true,
                });
              } else if (error.response.data.error_code === 999) {
                this.$message({
                  showClose: true,
                  message: "短信功能异常，请联系客服",
                  type: "warning",
                  duration: 5000,
                  center: true,
                });
              }
            });
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    birthdayHandler(data) {
      this.registerForm.birthday =
        data.year + "-" + data.month + "-" + data.day;
    },
  },
  mounted() {
    this.registerForm.birthday = "1990-01-01";
  },
};
</script>

<style scoped>
i {
  content: none !important;
  font-size: 0 !important;
  display: none !important;
}
</style>

<style lang='scss'>
@media (max-width: 700px) {
  /* 三级联动菜单的宽度调整 */
  .sg-mobile-cascader {
    .el-cascader-menu,
    .el-scrollbar__wrap,
    .el-cascader-menu__list {
      min-width: initial !important;
      width: 120px;
    }
  }
}
.qy-qrcode{
    text-align: center;
    img{
    margin-bottom: -10px;
    }
    p{
    line-height: 0px;
    }
}
</style>