<template>
  <el-container class="container">
    <el-main class="main" v-loading.fullscreen="loading">
      <el-row class="first">
        <img v-if="sharedState.is_authenticated" style="width: 100%;" src="../assets/home2.jpg" />
        <el-col
        v-if="!sharedState.is_authenticated"
          :lg="{ span: 7, offset: 2 }"
          :md="{ span: 8, offset: 2 }"
          :sm="{ span: 10, offset: 3 }"
          :xs="{ span: 20, offset: 1 }"
        >
          <img
            class="home-image"
            :screen-width="sharedState.is_authenticated"
            src="../assets/home.jpg"
          />
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
            v-if="!sharedState.is_authenticated"
          >
            <div slot="header" style="text-align: center">登录</div>
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
                <el-row>
                  <el-col :span="12">
                    <div style="text-align: left">
                      <router-link
                        :underline="false"
                        tag="el-link"
                        type="primary"
                        v-bind:to="{ name: 'ResetPassword' }"
                        >忘记密码？
                      </router-link>
                    </div>
                  </el-col>
                  <!--  <el-col :span="12">
                    <div style="text-align: right">
                      <router-link
                        :underline="false"
                        tag="el-link"
                        to="/register"
                        type="primary"
                        >现在注册
                      </router-link>
                    </div>
                  </el-col> -->
                </el-row>
                <el-form-item style="margin-top: 12px; margin-bottom: 0">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-evenly;
                      align-items: center;
                    "
                  >
                    <el-button @click="submitForm('loginForm')" type="primary"
                      >登录
                    </el-button>
                    <el-button @click="$router.push('/register')" type="primary"
                      >注册
                    </el-button>
                    <!-- <wechat-login-button type="user"></wechat-login-button> -->
                  </div>
                </el-form-item>
                <!-- <el-link>
                                    使用企业微信登录
                                    <el-image
                                        :src="require('../assets/icons/wechat.png')"
                                        style="width:26px; height:26px;vertical-align:middle;"
                                    ></el-image>
                                </el-link> -->
              </el-form>
              <!--                <hr style="border-width: 0.5px; margin: 12px 0 16px;" />-->
              <el-row style="margin-bottom: 8px">
                <!-- <el-col
                                    :span="10"
                                    style="margin-bottom: 4px; text-align: left;"
                                >
                                    <router-link tag="el-link" to="/" type="primary"
                                        >游客登录</router-link
                                    >
                                </el-col> -->
                <!-- <el-col :span="14">
                                    <div style="text-align: left">
                                        <span style="font-size: 14px; color: #52575d;"
                                            >其他登录方式：</span    >
                                        <el-link>
                                            <el-image
                                                :src="require('../assets/icons/wechat.png')"
                                                style="width:26px; height:26px;vertical-align:middle;"
                                            ></el-image>
                                        </el-link>
                                    </div>
                                </el-col> -->
              </el-row>
            </el-col>
          </el-card>
          <!-- <el-card style="margin-top:80px; text-align:center" v-else>
                        <div slot="header">欢迎加入企业微信</div>
                        <img
                                src="../assets/wechatwork.png"
                                style="width: 230px;"
                        />
                    </el-card> -->
        </el-col>
      </el-row>
      <el-row style="text-align: center; margin-top: 100px">
        <el-col :lg="6" :md="6" :sm="22">
          <img
            src="../assets/icons/pinpai.png"
            style="padding: 10px; max-width: 150px"
          />
          <p>实名认证</p>
        </el-col>
        <el-col :lg="6" :md="6" :sm="22">
          <img
            src="../assets/icons/yongxin.svg"
            style="padding: 20px; max-width: 130px"
          />
          <p>同省婚恋</p>
        </el-col>
        <el-col :lg="6" :md="6" :sm="22">
          <img
            src="../assets/icons/zhuanye.png"
            style="padding: 20px; max-width: 130px"
          />
          <p>精准推荐</p>
        </el-col>
        <el-col :lg="6" :md="6" :sm="22">
          <img
            src="../assets/icons/fuwu.svg"
            style="padding: 20px; max-width: 130px"
          />
          <p>专属客服</p>
        </el-col>
      </el-row>
      <el-row class="my-carousel" style="text-align: center; margin-top: 100px">
        <el-carousel :height="albumHeight" indicator-position="outside">
          <el-carousel-item v-for="item in photosUrl" :key="item.id">
            <el-image
              :src="ossUrl + '/carousels/' + item.photo_url"
              fit="cover"
              style="width: 100%; height: 100%"
              class="sg-banner-img-div"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-row>
      <!-- <el-row>
                <IndexPromote/>
            </el-row> -->
      <el-row>
        <el-card shadow="never">
          <el-col :span="2">
            <p></p>
          </el-col>
          <el-col :span="10">
            <p>北京爱联网科技有限公司</p>
            <p>地址：北京市怀柔区雁栖<br />经济开发区乐园大街17号</p>
            <p>邮箱：lovelink2020@163.com</p>
            <p>
              &copy; 2020 爱联网
              <a href="http://beian.miit.gov.cn/" target="_blank"
                >京ICP备17029066号</a
              >
            </p>
          </el-col>
          <el-col class="mobile-hide" :span="3">
            <p></p>
          </el-col>
          <el-col :span="10" class="qrcode-wrapper">
            <img
              src="../assets/offical-account-qrcode.jpg"
              style="max-width: 100px"
            />
            <p>欢迎关注公众号</p>
          </el-col>
          <el-col class="mobile-hide" :span="3">
            <p></p>
          </el-col>
          <el-col :span="10" class="qrcode-wrapper">
            <img src="../assets/qy-qrcode.jpg" style="max-width: 100px" />
            <p>欢迎关注企业微信</p>
          </el-col>
        </el-card>
      </el-row>
      <div id="amap"></div>
    </el-main>
  </el-container>
</template>
<script>
import store from "../store";
import IndexPromote from "../components/IndexPromote";
import WechatLoginButton from "@/views/WechatLoginButton";

export default {
  name: "Login",
  components: { WechatLoginButton, IndexPromote },
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
      ossUrl: store.ossUrl,
      photosUrl: [],
      albumHeight: "500px",
      loginForm: {
        phone: "",
        password: "",
      },
      avatars: [
        "girl0.jpg",
        "girl1.jpg",
        "girl2.jpg",
        "girl3.jpg",
        "boy0.jpg",
        "boy1.jpg",
        "boy2.jpg",
        "boy3.jpg",
      ],
      rules: {
        phone: [{ validator: checkPhone, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      amapGeolocation: null,
    };
  },
  methods: {
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const path = "/tokens";
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
              window.localStorage.setItem("dating-token", response.data.token);
              store.loginAction();
              // console.log(
              //     JSON.parse(
              //         atob(
              //             window.localStorage.getItem('dating-token').split('.')[1]
              //         )
              //     )
              // )
              this.loading = false;
              if (typeof this.$route.query.redirect === "undefined") {
                // this.$router.push("/recommend");
                this.$router.push("/active"); //登录后跳转到“我的活动”
                this.$message.success("登录成功，欢迎您！");
              } else {
                this.$router.push(this.$route.query.redirect);
              }
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
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    get_wechat_qrcode() {
      this.$axios.get("/admin/wechat/login").then((Response) => {
        console.log("微信二维码");
        console.log(Response);
      });
    },
    get_carousels() {
      const path = `/users/carousels`;
      this.$axios
        .get(path)
        .then((response) => {
          this.photosUrl = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 初始化高德地图及定位插件
     */
    _initAmapGeolocation() {
      const self = this;
      const mapObj = new AMap.Map("amap", {
        zoom: 10,
      });
      mapObj.plugin("AMap.Geolocation", function () {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          // timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });

        geolocation.getCurrentPosition(function (status, result) {
          if (status == "complete") {
            console.log("定位成功", result);
            // self.$message({
            //     message: result,
            //     type: 'success'
            // })
          } else {
            console.log("定位失败", result);
            // self.$message({
            //     message: result.message,
            //     type: 'error'
            // })
          }
        });
        // mapObj.addControl(geolocation);
        // geolocation.getCurrentPosition();
        // AMap.event.addListener(geolocation, 'complete', (complete) => {
        //     console.log(complete);
        //     self.$message({
        //         message: complete,
        //         type: 'success'
        //     })
        // });//返回定位信息
        // AMap.event.addListener(geolocation, 'error', (error) => {
        //     console.log(error);
        //     self.$message({
        //         message: error.message,
        //         type: 'error'
        //     })
        // });      //返回定位出错信息
      });

      mapObj.plugin("AMap.CitySearch", function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
          console.log(result);
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            console.log(result);
          }
        });
      });
    },
    /**
     * 获取当前经纬度，原生方法
     */
    getLocation() {
      navigator.geolocation.getCurrentPosition((res) => {
        console.log(res);
      });
    },
  },
  created() {
    if (this.isMobile()) {
      this.albumHeight = "150px";
    }
    this.get_carousels();
  },
  mounted() {
    // this._initAmapGeolocation()
    // this.getLocation()
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 0;
}

/* .first {
        height: 800px;
        padding: 0;
        margin: 0;
        background-image: url("../assets/home.jpg");
        background-repeat: no-repeat;
        background-size: 100%;
    } */

/* @media (max-width: 700px) {
        .first {
            padding: 0;
            margin: 0;
            height: 400px;
        }
    } */

.home-image {
  max-width: 480px;
  margin-top: 20px;
}

@media (max-width: 700px) {
  .home-image {
    width: calc(100vw - 45px);
  }
  .mobile-hide {
    display: none;
  }
  .qrcode-wrapper {
    width: 50% !important;
    /* margin: 0 20px; */
  }
  .my-carousel {
    margin-top: 4vh !important;
    padding: 0 10px;
  }
}

.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
}
.qrcode-wrapper p {
  margin: 6px 0 0 0;
}
.qy-qrcode-logined {
  margin-top: 60px;
  text-align: center;
}

/* banner满屏显示 */
/* .first img[screen-width] {
  width: 960px;
  height: 400px;
  max-width: initial;
  object-fit: cover;
}
@media (max-width: 700px) {
  .first img[screen-width] {
    width: 360px;
  }
} */
</style>
<style lang='scss' scoped>
.sg-banner-img-div {
  pointer-events: none;
}
</style>
