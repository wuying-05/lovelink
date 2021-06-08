<template>
<!-- 手机端分享页 -->
  <el-container>
    <el-main
      class="detailMain"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <el-row>
        <el-col
          :xs="{ span: 24 }"
          :sm="{ span: 16, offset: 4 }"
          :md="{ span: 18, offset: 2 }"
          :lg="{ span: 18, offset: 3 }"
        >
          <div style="margin: 12px">
            <el-card>
              <el-row>
                <el-col :lg="6" :md="6" :sm="22" style="margin: 20px">
                  <router-link
                    :to="{ name: 'User', params: { id: userData.id } }"
                  >
                    <el-avatar
                      weight="square"
                      :size="180"
                      :src="avatarUrl"
                    ></el-avatar>
                  </router-link>
                </el-col>
                <el-col :lg="16" :md="16" :sm="22" style="padding: 10px">
                  <h4 style="margin: 0 0 12px">
                    {{ basicForm.name }}
                    <small style="font-size: 16px">{{
                      basicForm.gender
                    }}</small>
                    
                    <span class="right">
                      <router-link
                        :to="{ name: 'User', params: { id: userData.id } }"
                      >
                        <el-button type="danger">查看详细资料</el-button>
                      </router-link>
                    </span>
                  </h4>
                  <el-divider></el-divider>
                  <el-col :span="12">
                    <div>
                      <div class="profile-item">
                        <span class="title">年龄：</span>{{ basicForm.age }}岁
                      </div>
                      <div class="profile-item">
                        <span class="title">学历：</span>{{ basicForm.degree }}
                      </div>
                      <div class="profile-item">
                        <span class="title">职业：</span>{{ basicForm.job }}
                      </div>
                      <div class="profile-item">
                        <span class="title">家乡：</span
                        >{{ getCity(basicForm.residence) }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div style="margin-left: 10px">
                      <div class="profile-item">
                        <span class="title">身高：</span
                        >{{ basicForm.height }}厘米
                      </div>
                      <div class="profile-item">
                        <span class="title">婚姻状况：</span
                        >{{ basicForm.marriage }}
                      </div>
                      <div class="profile-item">
                        <span class="title">月收入：</span
                        >{{ basicForm.salary || 0 }}元
                      </div>
                      <div class="profile-item">
                        <span class="title">工作地：</span
                        >{{ getCity(basicForm.location) }}
                      </div>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store.js";
import wx from "weixin-js-sdk";
import { CodeToText } from "element-china-area-data";
import {
  genderData,
  jobData,
  jobOptions,
  marriageData,
  degreeData,
  salaryData,
  weightData,
  childrenData,
  houseData,
  carData,
  smokeData,
  drinkData,
  healthData,
  religionData,
  marryData,
  pictureData,
  houseFavourData,
  carFavourData,
  marriageFavourData,
} from "../data";
export default {
  name: "PromoteConfirm", // this is the name of the component
  data() {
    return {
      ossUrl: store.ossUrl,
      sharedState: store.state,
      loading: false,
      avatarUrl: "",
      user: "",
      jobOptions: jobOptions,
      jobData: jobData,
      marriageData: marriageData,
      genderData: genderData,
      degreeData: degreeData,
      salaryData: salaryData,
      weightData: weightData,
      childrenData: childrenData,
      houseData: houseData,
      carData: carData,
      smokeData: smokeData,
      drinkData: drinkData,
      healthData: healthData,
      religionData: religionData,
      marryData: marryData,
      pictureData: pictureData,
      userData: {
        id: "",
        id_confirmed: "",
        household_confirmed: "",
        degree_confirmed: "",
      },
      basicForm: {
        name: "",
        gender: "",
        age: "",
        marriage: "",
        location: [],
        salary: "",
        height: "",
        degree: "",
        job: "",
        bio: "",
      },
      wechatShare: {
        appId: "",
        timestamp: "",
        nonceStr: "",
        signature: "",
      },
    };
  },
  methods: {
    getUser(id, promote_id) {
      this.loading = true;
      const path = `/users/promote/confirm`;
      let params = {
        id,
        promote_id,
      };
      this.$axios
        .get(path, { params })
        .then((response) => {
          var avatarFilename;
          this.userData.id = response.data.meta.id;
          if (response.data.basic.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.basic.avatar;
          }
          this.avatarUrl = this.ossUrl + `/avatars/${avatarFilename}`;
          this.userData.id_confirmed = response.data.meta.id_confirmed;
          this.userData.household_confirmed =
            response.data.meta.household_confirmed;
          this.userData.degree_confirmed = response.data.meta.degree_confirmed;
          this.basicForm.name = response.data.basic.name;
          this.basicForm.gender =
            genderData[parseInt(response.data.basic.gender) - 1];
          this.basicForm.age = response.data.basic.age;
          this.basicForm.marriage = marriageData[response.data.basic.marriage];
          this.basicForm.salary = salaryData[response.data.basic.salary];
          this.basicForm.height = response.data.basic.height;
          this.basicForm.degree = degreeData[response.data.basic.degree];
          if (response.data.basic.location !== null) {
            this.basicForm.location = response.data.basic.location.split(",");
          }
          if (response.data.basic.residence !== null) {
            this.basicForm.residence = response.data.basic.residence.split(",");
          }
          var data = response.data.basic.job;
          var a = data[0];
          var b = data[1];
          let _self = this;
          this.jobOptions.forEach((item) => {
            if (item.value == a) {
              _self.basicForm.job = item.label;

              if (item.children && item.children.length) {
                item.children.forEach((child) => {
                  if (child.value == b) {
                    _self.basicForm.job += `/${child.label}`;
                  }
                });
              }
            }
          });
          this.loading = false;
        })
        .catch((error) => {
         
          console.log(error);
          this.loading = false;
        });
    },
    setWechatShare() {
      const thisform = this;
      const id = this.$route.query.id;
      const url = location.href.split("#")[0];
      let str2 = encodeURIComponent(url);
      const path = `/users/promote/wxshare?id=${id}&url=${str2}`;
      const jsApiList = [
        "updateAppMessageShareData", // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
        "updateTimelineShareData", // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
        // "onMenuShareWeibo", //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
      ]; // 必填，需要使用的JS接口列表
      this.$axios
        .get(path)
        .then((response) => {
          wx.config({
            debug: false, // 开启调试模式
            appId: response.data.wechat.appId, // 必填，公众号的唯一标识
            timestamp: response.data.wechat.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.wechat.noncestr, // 必填，生成签名的随机串
            signature: response.data.wechat.signature, // 必填，签名
            jsApiList: jsApiList,
          });
          var avatarFilename;
          if (response.data.basic.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.basic.avatar;
          }
          const avatarUrl = thisform.ossUrl + `/avatars/${avatarFilename}`;
          const name = response.data.basic.name;
          const gender = genderData[response.data.basic.gender];
          const age = response.data.basic.age;
          const marriage = marriageData[response.data.basic.marriage];
          // const salary = salaryData[response.data.basic.salary]
          // const height = response.data.basic.height
          const degree = degreeData[response.data.basic.degree];
          const userLocation =
            CodeToText[response.data.basic.location.split(",")[0]];
          const residence =
            CodeToText[response.data.basic.residence.split(",")[0]];
          let fstartAge = response.data.favour.startAge;
          let fendAge = response.data.favour.endAge;
          let fstartHeight = response.data.favour.startHeight;
          let fendHeight = response.data.favour.endHeight;
          let fsalary = salaryData[response.data.favour.salary];
          let fdegree = degreeData[response.data.favour.degree];
          let fhouse = houseFavourData[response.data.favour.house];
          let fcar = carFavourData[response.data.favour.car];
          let fmarriage = marriageFavourData[response.data.favour.marriage];
          if (response.data.favour.residence !== null) {
            // eslint-disable-next-line
            var fresidence =
              CodeToText[response.data.favour.residence.split(",")[0]];
          } else {
            // eslint-disable-next-line
            var fresidence = "不限";
          }
          if (response.data.favour.location !== null) {
            // eslint-disable-next-line
            var flocation =
              CodeToText[response.data.favour.location.split(",")[0]];
          } else {
            // eslint-disable-next-line
            var flocation = "不限";
          }
          let fchildren = childrenData[response.data.favour.children];
          let fdrink = drinkData[response.data.favour.drink];
          let fsmoke = smokeData[response.data.favour.smoke];
          let fpicture = pictureData[response.data.favour.picture];
          let fwhenMarry = marryData[response.data.favour.whenMarry];
          const title = `${name}|${gender}|${age}岁|${degree}|${marriage}|家乡：${residence}|工作地：${userLocation}`;
          // const desc = `择偶标准：${fstartAge}~${fendAge}岁|${fstartHeight}~${fendHeight}厘米|${fsalary}|${fdegree}|房：${fhouse}|车：${fcar}|${fmarriage}|家乡：${fresidence}|工作地：${flocation}|${fchildren}|${fdrink}|${fsmoke}|照片：${fpicture}|${fwhenMarry}`;

          if(response.data.favour.startAge===null || response.data.favour.startAge ===undefined){
            fstartAge = "不限";
          }

          if(fendAge===null || fendAge ===undefined){
            fendAge = "不限";
          }

          if(fstartHeight===null || fstartHeight ===undefined){
            fstartHeight = "不限";
          }
          if(fendHeight===null || fendHeight ===undefined){
            fendHeight = "不限";
          }

           if(fsalary===null || fsalary ===undefined){
            fsalary = "不限";
          }

          if(fdegree===null || fdegree ===undefined){
            fdegree = "不限";
          }

          if(fhouse===null || fhouse ===undefined){
            fhouse = "不限";
          }
          if(fcar===null || fcar ===undefined){
            fcar = "不限";
          }

          if(fmarriage===null || fmarriage ===undefined){
            fmarriage = "不限";
          }
          if(fresidence===null || fresidence ===undefined){
            fresidence = "不限";
          }
          if(flocation===null || flocation ===undefined){
            flocation = "不限";
          }
          if(fchildren===null || fchildren ===undefined){
            fchildren = "不限";
          }
          if(fdrink===null || fdrink ===undefined){
            fdrink = "不限";
          }

          if(fsmoke===null || fsmoke ===undefined){
            fsmoke = "不限";
          }
          if(fpicture===null || fpicture ===undefined){
            fpicture = "不限";
          }
          if(fwhenMarry===null || fwhenMarry ===undefined){
            fwhenMarry = "不限";
          }
          const desc = `择偶标准：${fstartAge}~${fendAge}岁|${fstartHeight}~${fendHeight}厘米|${fsalary}|${fdegree}|房：${fhouse}|车：${fcar}|${fmarriage}|家乡：${fresidence}|工作地：${flocation}|${fchildren}|${fdrink}|${fsmoke}|照片：${fpicture}|${fwhenMarry}`;
    

          wx.ready(function () {
            wx.checkJsApi({
              jsApiList: jsApiList,
              success: function (res) {
                //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
                wx.updateTimelineShareData({
                  title: title,
                  desc: desc,
                  link: location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: avatarUrl, // 分享图标
                  success: function () {},
                });
                wx.updateAppMessageShareData({
                  title: title, // 分享标题
                  desc: desc, // 分享描述
                  link: location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: avatarUrl, // 分享图标
                  success: () => {},
                });
              },
            });
          });
          wx.error(function (res) {
            console.log(res);
          });
        })
        .catch((error) => {});
    },
    getCity(location) {
      if (!location) return;
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
  },
  mounted() {
    this.setWechatShare();
  },
  created() {
    const id = this.$route.query.id;
    const promote_id = this.$route.query.promoteid;
    this.getUser(id, promote_id);
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate(to, from, next) {
    this.getUser(to.params.id);
    next();
  },
};
</script>

<style scoped>
.detailMain {
  max-width: 1160px;
  margin: 0 auto;
}

.profile-item {
  margin-bottom: 5px;
}

.title {
  color: #8c939d;
}

.small-title {
  color: #8c939d;
  font-size: 14px;
}

.right {
  float: right;
}

.title-line {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 16px;
  border-left: rgb(255, 122, 142) 4px solid;
  padding-left: 10px;
  top: 3px;
}

.title-line:first-of-type {
  margin-top: 0;
}

.profile-tag {
  margin: 5px;
}
</style>
