<template>
  <el-container>
    <el-dialog
      title="企业微信群号"
      :visible.sync="dialogVisible"
      style="text-align: center"
      :modal="false"
    >
      <img
        v-bind:src="wechatworkGroupUrl"
        style="max-width: 300px; max-height: 300px"
        v-bind:onerror="'this.src=\'' + ossUrl + '/default-avatar.png\''"
      />
    </el-dialog>
    <el-main
      class="detailMain"
    >
      <!-- <el-alert
            :title="'你们配对成功啦，对方的企业微信群号是' + basicForm.wechatwork_group"
            type="success"
            v-if="followEachOther && basicForm.wechatwork_group">
            <title></title>
        </el-alert> -->
      <el-row>
        <!-- <el-col :lg="showguide ? 18: 24" :md="showguide ? 18: 24" :sm="22"> -->
        <el-col :lg="24" :md="24" :sm="22">
          <div style="margin: 12px">
            <el-card>
              <el-row>
                <el-col :lg="6" :md="6" :sm="22" style="margin: 20px">
                  <!-- <el-avatar weight="square" :size="180" :src="avatarFile">
                            </el-avatar> -->
                  <span
                    class="el-avatar el-avatar--square"
                    style="height: 180px; width: 180px; line-height: 180px"
                  >
                    <img
                      :src="avatarFile"
                      v-bind:onerror="
                        'this.src=\'' + ossUrl + '/default-avatar.png\''
                      "
                      style="object-fit: cover"
                    />
                  </span>
                </el-col>
                <el-col :lg="16" :md="16" :sm="22" style="padding: 10px">
                  <h4 style="margin: 0 0 12px">
                    {{ basicForm.name }}
                    <small style="font-size: 16px">{{
                      basicForm.gender
                    }}</small>
                    <!-- <img src="../assets/icons/shiming.png" title="已通过实名认证" style="padding-left: 10px;max-width: 28px;" v-if="userData.id_confirmed === true"/>
                                <img src="../assets/icons/hukou.png" style="padding-left: 10px;max-width: 30px;" title="已通过户口认证"  v-if="userData.household_confirmed==2"/>
                                <img src="../assets/icons/xueli.png" title="已通过学历认证" style="padding-left: 10px;max-width: 30px;" v-if="userData.degree_confirmed==2"/> -->
                    <span
                      class="right"
                      v-if="showguide && sharedState.user_id !== userData.id"
                    >
                      <el-button
                        icon="el-icon-star-on"
                        type="info"
                        v-if="followedByCurrentUser"
                        @click="unFollow(userData.id)"
                        >取消关注</el-button
                      >
                      <el-button
                        icon="el-icon-star-off"
                        type="primary"
                        v-else
                        @click="follow(userData.id)"
                        >关注</el-button
                      >
                    </span>
                  </h4>
                  <div
                    style="margin-bottom: 10px; display: flex"
                    class="confirm-tags"
                  >
                    <div
                      v-bind:class="{ info: userData.id_confirmed }"
                      class="grey middle"
                    >
                      实名认证
                    </div>
                    <div
                      v-bind:class="{ info: userData.degree_confirmed }"
                      class="grey middle"
                    >
                      学历认证
                    </div>
                    <div
                      v-bind:class="{ info: userData.household_confirmed }"
                      class="grey middle"
                    >
                      婚姻状况认证
                    </div>
                  </div>
                  爱联网ID：{{ userData.id }}
                  <el-button
                    style="padding: 6px 10px"
                    @click="showwechatworkgroup"
                    :disabled="contactAbility"
                    >联系方式</el-button
                  >
                  <el-divider></el-divider>
                  <el-col v-if="!this.loading " :span="12">
                    <div>
                      <div class="profile-item">
                        <span class="title">年龄：</span>
                        {{ basicForm.age }}岁
                      </div>
                      <div class="profile-item">
                        <span class="title">学历：</span>
                        {{ basicForm.degree }}
                      </div>
                      <div class="profile-item">
                        <span class="title">职业：</span>
                        {{ basicForm.job }}
                      </div>
                      <div class="profile-item">
                        <span class="title">家乡：</span>
                        {{ getCity(basicForm.residence) }}
                      </div>
                    </div>
                  </el-col>
                  <el-col v-if="!this.loading " :span="12">
                    <div style="margin-left: 10px">
                      <div class="profile-item">
                        <span class="title">身高：</span>
                        {{ basicForm.height }}厘米
                      </div>
                      <div class="profile-item">
                        <span class="title">婚姻状况：</span>
                        {{ basicForm.marriage }}
                      </div>
                      <div class="profile-item" style="display: flex">
                        <span class="title">月收入：</span>
                        {{ basicForm.salary || 0 }}元
                      </div>
                      <div class="profile-item">
                        <span class="title">工作地：</span>
                        {{ getCity(basicForm.location) }}
                      </div>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </el-card>
          </div>
          <div style="margin: 12px">
            <el-card :body-style="{ padding: '25px' }">
              <el-row>
                <div class="title-line title"><p>我的照片</p></div>
                <div v-if="photosUrl[0] !== undefined">
                  <el-carousel
                    :height="albumHeight"
                    indicator-position="outside"
                  >
                    <el-carousel-item v-for="photo in photosUrl" :key="photo.id"
                      ><el-image :src="photo"></el-image
                    ></el-carousel-item>
                  </el-carousel>
                </div>
                <div style="text-align: center; margin: 20px 20px" v-else>
                  <el-carousel
                    :height="albumHeight"
                    indicator-position="outside"
                    v-if="basicForm.gender === '男士'"
                  >
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/boy0.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/boy1.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/boy2.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/boy3.jpg')"
                      ></el-image
                    ></el-carousel-item>
                  </el-carousel>
                  <el-carousel
                    :height="albumHeight"
                    indicator-position="outside"
                    v-else
                  >
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/girl0.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/girl1.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/girl2.jpg')"
                      ></el-image
                    ></el-carousel-item>
                    <el-carousel-item
                      ><el-image
                        :src="require('../assets/photos/girl3.jpg')"
                      ></el-image
                    ></el-carousel-item>
                  </el-carousel>
                </div>
                <div class="title-line title"><p>我的资料</p></div>
                <el-tag effect="plain" class="profile-tag" type="info"
                  >{{ basicForm.age }}岁</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >{{ basicForm.height }}厘米</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info">{{
                  basicForm.degree
                }}</el-tag>
                <el-tag effect="plain" class="profile-tag" type="info">{{
                  basicForm.marriage
                }}</el-tag>
                <el-tag effect="plain" class="profile-tag" type="info">{{
                  basicForm.job
                }}</el-tag>
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="basicForm.salary > 0"
                  >月收入：{{ basicForm.salary }}元</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >家乡：{{ getCity(basicForm.residence) }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >工作地：{{ getCity(basicForm.location) }}</el-tag
                >
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="lifeForm.weight"
                  >{{ lifeForm.weight }}</el-tag
                >
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="lifeForm.health"
                  >{{ lifeForm.health }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info" v-if="lifeForm.drink">{{
                  lifeForm.drink
                }}</el-tag>
                <el-tag effect="plain" class="profile-tag" type="info" v-if="lifeForm.smoke">{{
                  lifeForm.smoke
                }}</el-tag>
                <el-tag effect="plain" class="profile-tag" type="info" v-if="lifeForm.car">{{
                  lifeForm.car
                }}</el-tag>
                <el-tag effect="plain" class="profile-tag" type="info" v-if="lifeForm.house">{{
                  lifeForm.house
                }}</el-tag>
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="lifeForm.children"
                  >{{ lifeForm.children }}</el-tag
                >
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="lifeForm.religion"
                  >{{ lifeForm.religion }}</el-tag
                >
                <div
                  class="title-line title"
                  v-if="hobbyForm.hobby && hobbyForm.hobby.length"
                >
                  <p>我的爱好</p>
                </div>
                <!-- <span v-if="hobbyForm.hobby[0]"><br><br></span> -->
                <div v-if="hobbyForm.hobby && hobbyForm.hobby.length">
                  <!-- <span class="small-title">我的爱好</span> -->
                  <el-tag effect="plain"
                    class="profile-tag"
                    type="info"
                    v-for="item in hobbyForm.hobby"
                    :key="item.id"
                    >{{ item }}</el-tag
                  >
                </div>
                <div class="title-line title"><p>择偶意向</p></div>
                <el-tag effect="plain" class="profile-tag" type="info"
                  >年龄：{{
                    favourForm.startAge > 0
                      ? `${favourForm.startAge}岁`
                      : "不限"
                  }}~{{
                    favourForm.endAge > 0 ? `${favourForm.endAge}岁` : "不限"
                  }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >身高：{{
                    favourForm.startHeight > 0
                      ? `${favourForm.startHeight}厘米`
                      : "不限"
                  }}~{{
                    favourForm.endHeight > 0
                      ? `${favourForm.endHeight}厘米`
                      : "不限"
                  }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >最低学历：{{ favourForm.degree }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >婚姻状况：{{ favourForm.marriage }}</el-tag
                >
                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="favourForm.whenMarry"
                  >{{ favourForm.whenMarry }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >月收入：{{ favourForm.salary }}</el-tag
                >
                <!-- <el-tag effect="plain" class="profile-tag" type="info" v-if="favourForm.location[0]">工作地：{{ getCity(favourForm.location) }}</el-tag>
                            <el-tag effect="plain" class="profile-tag" type="info" v-if="favourForm.residence[0]">家乡：{{ getCity(favourForm.residence) }}</el-tag> -->
                <!-- <el-tag effect="plain" class="profile-tag" type="info">{{ favourForm.weight }}</el-tag> -->
                <el-tag effect="plain" class="profile-tag" type="info"
                  >购车：{{ favourForm.car }}</el-tag
                >
                <el-tag effect="plain" class="profile-tag" type="info"
                  >购房：{{ favourForm.house }}</el-tag
                >

                <el-tag effect="plain"
                  class="profile-tag"
                  type="info"
                  v-if="favourForm.children"
                  >{{ favourForm.children }}</el-tag
                >
                <!-- <el-tag effect="plain" class="profile-tag" type="info" v-if="favourForm.smoke">{{ favourForm.smoke }}</el-tag>
								<el-tag effect="plain" class="profile-tag" type="info" v-if="favourForm.drink">{{ favourForm.drink }}</el-tag> -->
                <!-- <el-tag effect="plain" class="profile-tag" type="info">{{ favourForm.health }}</el-tag> -->
                <!-- <el-tag effect="plain" class="profile-tag" type="info">{{ favourForm.religion }}</el-tag> -->
                <!-- <el-tag effect="plain" class="profile-tag" type="info" v-if="favourForm.picture">照片：{{ favourForm.picture }}</el-tag> -->
                <div class="title-line title" v-if="basicForm.bio">
                  <p>我的心里话</p>
                </div>
                <span>{{ basicForm.bio }}</span>
              </el-row>
            </el-card>
          </div>
        </el-col>
        <!-- <el-col :lg="6" :md="6" :sm="22" v-if="showguide">
                 <div style="margin:12px;text-align: center">
                    <el-card>
                        <div style="text-align: center; margin: 20px 0;">
                            <el-tag effect="plain" effect="plain" style="padding: 0 30px;font-size: 18px;"
                                >爱联网会员</el-tag
                            >
                        </div>
                        <el-form :model="vipForm" ref="ruleForm" class="demo-ruleForm">
                            <el-form-item prop="resource">
                                <el-radio-group v-model="vipForm.vipName" style="color: #8c939d;">
                                    <el-radio class="radio-option" label="认证初级会员：￥100"></el-radio>
                                    <el-radio class="radio-option" label="认证中级会员：￥300"></el-radio>
                                    <el-radio class="radio-option" label="认证高级会员：￥500"></el-radio>
                                    <el-radio class="radio-option" label="普通初级会员：￥200"></el-radio>
                                    <el-radio class="radio-option" label="普通中级会员：￥400"></el-radio>
                                    <el-radio class="radio-option" label="普通高级会员：￥600"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                        <div style="margin-left: 12px;">
                            <div class="profile-item">
                                <span style="color: #8c939d;">认证初级会员：￥100</span>
                            </div>
                            <div class="profile-item">
                                <span style="color: #8c939d;">认证中级会员：￥300</span>
                            </div>
                            <div class="profile-item">
                                <span style="color: #8c939d;">认证高级会员：￥500</span>
                            </div>
                            <div class="profile-item">
                                <span style="color: #8c939d;">普通初级会员：￥200</span>
                            </div>
                            <div class="profile-item">
                                <span style="color: #8c939d;">普通中级会员：￥400</span>
                            </div>
                            <div class="profile-item">
                                <span style="color: #8c939d;">普通高级会员：￥600</span>
                            </div>
                            <br>
                            <small>非认证用户每种套餐价格增加100元，扫描二维码联系管理员开通。</small>
                            <br><br>
                            <img
                            src="../assets/qrcode.png"
                            style="max-width: 100px;"
                            />
                            <el-button type="danger">立刻开通</el-button>
                        </div>
                    </el-card>
                </div>
                <div style="margin:12px; text-align: center" v-if="basicForm.wechatwork_group">
                    <el-card>
                        <div style="margin: 20px 0;">
                            <el-tag effect="plain" effect="plain" style="padding: 0 30px;font-size: 18px;"
                                >企业微信群二维码</el-tag
                            >
                        </div>
                            <small>扫描二维码加入该用户的企业微信群</small>
                            <br><br>
                            <img
                            :src="wechatworkGroupUrl"
                            style="max-width: 220px;"
                            />
                            <el-button type="danger">立刻开通</el-button>
                    </el-card>
                </div>
            </el-col> -->
      </el-row>
      <!-- <el-card>
            <div id="external_form"></div>
        </el-card> -->
    </el-main>
  </el-container>
</template>

<script>
// import postscribe from 'postscribe'
import store from "../store.js";
import { CodeToText } from "element-china-area-data";
import {
  jobOptions,
  marriageFavourData,
  houseFavourData,
  carFavourData,
  genderData,
  jobData,
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
} from "../data";
export default {
  name: "User", // this is the name of the component
  props: {
    user_id: {
      default: 0,
      required: false,
    },
    showguide: {
      default: true,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      loading: false,
      sharedState: store.state,
      ossUrl: store.ossUrl,
      user: "",
      avatarFile: "",
      photosUrl: [],
      albumHeight: "500px",
      followedByCurrentUser: "",
      followEachOther: "",
      jobData: jobData,
      marriageData: marriageData,
      marriageFavourData: marriageFavourData,
      genderData: genderData,
      degreeData: degreeData,
      salaryData: salaryData,
      weightData: weightData,
      childrenData: childrenData,
      houseData: houseData,
      carData: carData,
      houseFavourData: houseFavourData,
      carFavourData: carFavourData,
      smokeData: smokeData,
      drinkData: drinkData,
      healthData: healthData,
      religionData: religionData,
      marryData: marryData,
      pictureData: pictureData,
      // registerForm:registerForm,
      userData: {
        id: "",
        id_confirmed: "",
        household_confirmed: "",
        degree_confirmed: "",
      },
      lifeForm: {
        weight: "",
        children: "",
        religion: "",
        health: "",
        house: "",
        car: "",
        smoke: "",
        drink: "",
      },
      basicForm: {
        name: "",
        gender: "",
        age: "",
        marriage: "",
        location: [],
        residence: [],
        salary: "",
        height: "",
        degree: "",
        job: [],
        bio: "",
        wechatwork_group: "",
      },
      favourForm: {
        startAge: "",
        endAge: "",
        startHeight: "",
        endHeight: "",
        salary: "",
        degree: "",
        location: [],
        residence: [],
        house: "",
        car: "",
        marriage: "",
        children: "",
        drink: "",
        smoke: "",
        picture: "",
        whenMarry: "",
      },
      hobbyForm: {
        hobby: [],
      },
      wechatworkGroupUrl: "",
      jobOptions: jobOptions,
      // 是否有权限查看联系方式
      contactAbility: false,
    };
  },
  methods: {
    getUser(id) {
      const self = this;
      this.loading = true;
      const path = `/users/${id}/details`;
      this.$axios
        .get(path)
        .then((response) => {
          var avatarFilename = "";
          var i;
          if (response.data.basic.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.basic.avatar;
          }
          this.avatarFile = this.ossUrl + `/avatars/${avatarFilename}`;
          for (i in response.data.photo.photos) {
            this.photosUrl.push(
              this.ossUrl + `/photos/${response.data.photo.photos[i]}`
            );
          }
          this.userData.id = response.data.meta.id;
          this.userData.id_confirmed = response.data.meta.id_confirmed;
          this.userData.household_confirmed =
            response.data.meta.household_confirmed;
          this.userData.degree_confirmed = response.data.meta.degree_confirmed;
          this.basicForm.name = response.data.basic.name;
          this.basicForm.gender =
            genderData[parseInt(response.data.basic.gender) - 1];
          this.basicForm.age = response.data.basic.age;
          this.basicForm.marriage =
            marriageData[parseInt(response.data.basic.marriage) - 1];
          this.basicForm.salary = response.data.basic.salary || 0;
          this.basicForm.height = response.data.basic.height;
          this.basicForm.wechatwork_group =
            response.data.basic.wechatwork_group;
          if (response.data.basic.wechatwork_group !== null) {
            this.wechatworkGroupUrl =
              this.ossUrl +
              `/wechatworkgroup/${response.data.basic.wechatwork_group}`;
          }
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
          // console.log(this.jobOptions[a]),
          // for(var i ;i++ ;i< this.jobOptions[a].length){
          // 	// if(this.jobOptions[a].children[i].value==b){

          // 	// 	console.log(i)
          // 	// }
          // },
          this.jobOptions.forEach((item) => {
            if (item.value == a) {
              self.basicForm.job = item.label;

              if (item.children && item.children.length) {
                item.children.forEach((child) => {
                  if (child.value == b) {
                    // self.basicForm.job += `/${child.label}`
                    self.basicForm.job = child.label; //显示为第二级目录
                  }
                });
              }
            }
          });
          // this.basicForm.job = this.jobOptions[a].label;
          this.basicForm.bio = response.data.basic.bio;
          this.lifeForm.weight = response.data.life.shape;
          // if(this.lifeForm.weight&&this.lifeForm.weight.indexOf('公斤') == -1) this.lifeForm.weight = this.weightData[response.data.life.shape];
          if (
            this.lifeForm.weight &&
            this.lifeForm.weight.indexOf("公斤") == -1
          )
            this.lifeForm.weight += "公斤";
          this.lifeForm.children =
            childrenData[parseInt(response.data.life.children) - 1];
          this.lifeForm.religion =
            religionData[parseInt(response.data.life.religion) - 1];
          this.lifeForm.health =
            healthData[parseInt(response.data.life.health) - 1];
          this.lifeForm.house =
            houseData[parseInt(response.data.life.house) - 1];
          this.lifeForm.car = carData[parseInt(response.data.life.car) - 1];
          this.lifeForm.smoke =
            smokeData[parseInt(response.data.life.smoke) - 1];
          this.lifeForm.drink =
            drinkData[parseInt(response.data.life.drink) - 1];
          this.favourForm.startAge = response.data.favour.startAge;
          this.favourForm.endAge = response.data.favour.endAge;
          this.favourForm.startHeight = response.data.favour.startHeight;
          this.favourForm.endHeight = response.data.favour.endHeight;
          this.favourForm.salary = response.data.favour.salary
            ? salaryData[parseInt(response.data.favour.salary)]
            : "不限";
          this.favourForm.degree = response.data.favour.degree
            ? degreeData[parseInt(response.data.favour.degree)]
            : "不限";
          this.favourForm.house = response.data.favour.house
            ? houseFavourData[parseInt(response.data.favour.house)]
            : "不限";
          this.favourForm.car = response.data.favour.car
            ? carFavourData[parseInt(response.data.favour.car)]
            : "不限";
          this.favourForm.marriage = response.data.favour.marriage
            ? marriageFavourData[parseInt(response.data.favour.marriage)]
            : "不限";
          if (response.data.favour.residence) {
            this.favourForm.residence = response.data.favour.residence.split(
              ","
            );
          }
          if (response.data.favour.location) {
            this.favourForm.location = response.data.favour.location.split(",");
          }
          this.favourForm.children =
            childrenData[parseInt(response.data.favour.children) - 1];
          // this.favourForm.drink = drinkData[response.data.favour.drink];
          // this.favourForm.smoke = smokeData[response.data.favour.smoke];
          // this.favourForm.picture = pictureData[response.data.favour.picture];
          this.favourForm.whenMarry =
            marryData[parseInt(response.data.favour.whenMarry) - 1];
          // 我的爱好----------------------------------------
          if (response.data.hobby && response.data.hobby.hobby) {
            this.hobbyForm.hobby = response.data.hobby.hobby.split(",");
          }
          this.loading = false;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.loading = false;
        });
    },
    showwechatworkgroup() {
      this.dialogVisible = true;
    },
    getFollowStatus(id) {
      const path = `/users/me/follow/status/${id}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.followedByCurrentUser = response.data.is_following;
          this.followEachOther = response.data.is_follow_each_other;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    follow(id) {
      this.loading = true;
      const path = `/users/me/followers/${id}`;
      this.$axios
        .post(path)
        .then((response) => {
          this.followedByCurrentUser = true;
          this.loading = false;
          this.$message.success("已关注");
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.loading = false;
        });
    },
    unFollow(id) {
      this.loading = true;
      const path = `/users/me/followers/${id}`;
      this.$axios
        .delete(path)
        .then((response) => {
          this.followedByCurrentUser = false;
          this.loading = false;
          this.$message.success("关注已取消");
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.loading = false;
        });
    },
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
     * 获取是否可以查看联系方式的权限
     */
    // getContactAbility(id) {
    //   const self = this;
    //   const path = `/users/wechat/${id}`;
    //   this.$axios
    //     .get(path)
    //     .then((response) => {
    //       console.log('response: response:[esponse.data.visable]'+esponse.data.visable);
    //       self.contactAbility = response.data.visable == false;
    //     })
    //     .catch((error) => {
    //       console.log('getContactAbility: error');
    //       console.log(error);
    //     });
    // },
  },
  created() {
    // eslint-disable-next-line camelcase
    let user_id = 0;
    if (this.user_id) {
      user_id = this.user_id;
    } else {
      user_id = this.$route.params.id;
    }
    this.getUser(user_id);
    this.getContactAbility(user_id);
    if (this.sharedState.is_authenticated && this.showguide) {
      this.getFollowStatus(user_id);
    }
    if (this.isMobile()) {
      this.albumHeight = "150px";
    }
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate(to, from, next) {
    this.getUser(to.params.id);
    if (this.sharedState.is_authenticated) {
      this.getFollowStatus(to.params.id);
    }
    next();
  },
  // mounted: function () {
  //     /* eslint-disable no-useless-escape */
  //     postscribe('#external_form', '<script type="text/javascript" src="http://www.wenjuan.com/iframe/5ebd1f7392beb5213fe37a76/"><\/script>')
  // }
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

/* .title-line:before {
    content: "";
    position: absolute;
    left: 0;
    top: 3px;
    width: 4px;
    height: 16px;
    background: rgb(255, 122, 142);
} */

.profile-tag {
  height: auto !important;
  margin: 3px;
}

.radio-option {
  margin-bottom: 10px;
  font-size: 14px;
}
.grey {
  width: 100px;
  height: auto;
  padding: 5px;
  margin: 5px;
  background-color: #f1f1f1;
  color: #ccc;
  border-radius: 100px;
}
.info {
  width: 100px;
  height: auto;
  padding: 5px;
  margin: 5px;
  background-color: rgb(247, 146, 17);
  color: #fff;
  border-radius: 100px;
}
.middle {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #c0c4cc;
}
.el-icon-arrow-down:before {
  display: none !important;
  content: none !important;
}
</style>
<style lang='scss' scoped>
/* .el-tag--plain.el-tag--info {
    border-color: transparent;
} */
</style>

