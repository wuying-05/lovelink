<template>
  <el-container>
    <el-main
      class="container"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <el-row>
        <el-card style="margin-bottom: 10px;">
         <img style="width: 100%;" src="../assets/recommend.jpg" />
        </el-card>
        <el-card>
          精准推荐（可选推荐条件）
          <span class="grey">
            异性
            <!-- <span v-if="recommendSetting.location"> | 工作同省</span>
                <span v-if="recommendSetting.residence"> | 家乡同省</span>
                <span v-if="recommendSetting.age === '5'"> | 上下5岁</span>
                <span v-if="recommendSetting.age === '10'"> | 上下10岁</span>
                <span v-if="recommendSetting.degree === 'up'"> | 大专及以上</span>
                <span v-if="recommendSetting.degree === 'down'"> | 大专以下</span>
                <span v-if="recommendSetting.hobby"> | 爱好相近</span>
                <span v-if="recommendSetting.marriage === 'only'"> | 仅限未婚</span> -->
            <span>
              | 年龄:
              {{
                recommendData.startAge == ""
                  ? "不限"
                  : `${recommendData.startAge}岁`
              }}~{{
                recommendData.endAge == ""
                  ? "不限"
                  : `${recommendData.endAge}岁`
              }}</span
            >
            <span>
              | 身高:
              {{
                recommendData.startHeight == ""
                  ? "不限"
                  : `${recommendData.startHeight}厘米`
              }}~{{
                recommendData.endHeight == ""
                  ? "不限"
                  : `${recommendData.endHeight}厘米`
              }}</span
            >
            <span v-if="recommendDegree.length > 0">
              | 学历: {{ recommendDegree }}</span
            >
            <span>
              | 婚姻状况:
              {{ recommendData.marriage == "" ? "不限" : "仅限未婚" }}</span
            >
            <span> | 家乡: {{ getCity(recommendData.residence) }}</span>
            <span> | 工作地: {{ getCity(recommendData.location) }}</span>
          </span>
          <span class="right" v-if="userData.is_vip === false"
            ><router-link to="/setting#recommend"
              >解锁推荐选项</router-link
            ></span
          >
          <span class="right" v-else
            ><router-link to="/setting#recommend"
              >设置推荐条件</router-link
            ></span
          >
        </el-card>
      </el-row>
      <UserCard :usersData="resultData" v-if="showResult" :from="1"></UserCard>
      <el-row style="padding: 20px 0" :lg="6" :sm="20">
        <el-pagination
          :hide-on-single-page="true"
          background
          small
          @current-change="getRecommendUsers"
          layout="prev, pager, next"
          :page-size="pageData.per_page"
          :page-count="pageData.pages > 30 ? 30 : pageData.pages"
        >
        </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import UserCard from "../components/UserCard";
import { CodeToText } from "element-china-area-data";
import { jobData, jobOptions, degreeData, degreeOptions } from "../data";

export default {
  name: "Recommend", // this is the name of the component
  components: { UserCard },
  data() {
    return {
      degreeData: degreeData,
      degreeOptions: degreeOptions,
      ossUrl: store.ossUrl,
      loading: false,
      sharedState: store.state,
      jobOptions: jobOptions,
      showResult: false,
      userData: {
        name: "",
        is_vip: "",
      },
      resultData: {},
      pageData: {},
      recommendSetting: {
        location: "",
        residence: "",
        age: "",
        degree: "",
        hobby: "",
        marriage: "",
      },
      recommendData: {
        location: [],
        residence: [],
        startAge: "",
        endAge: "",
        startHeight: "",
        endHeight: "",
        degree: [],
        hobby: "",
        marriage: [],
      },
      scroll: 0,
    };
  },
  computed: {
    // todo: 要从 degreeOptions 来确定值
    recommendDegree() {
      const self = this;
      var res = "";

      this.recommendData.degree.forEach((item, index) => {
        self.degreeOptions.forEach((degreeDataItem) => {
          if (degreeDataItem.value == item) {
            res += degreeDataItem.label;

            if (index < self.recommendData.degree.length - 1) {
              res += "、";
            }
          }
        });
      });

      return res;
    },
  },
  methods: {
    getUser(id) {
      // eslint-disable-next-line no-template-curly-in-string
      const path = `/users/${id}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.userData.name = response.data.name;
          this.userData.is_vip = response.data.is_vip;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getRecommendData(id) {
      const path = `/users/${id}/setting/recommend`;
      this.$axios
        .get(path)
        .then((response) => {
          this.recommendData.location = response.data.location
            ? response.data.location.split(",")
            : [];
          this.recommendData.residence = response.data.residence
            ? response.data.residence.split(",")
            : [];
          this.recommendData.startAge = parseInt(response.data.startAge) || 0;
          this.recommendData.endAge = parseInt(response.data.endAge) || 0;
          this.recommendData.startHeight =
            parseInt(response.data.startHeight) || 0;
          this.recommendData.endHeight = parseInt(response.data.endHeight) || 0;
          this.recommendData.degree = response.data.degree
            ? response.data.degree.split(",")
            : [""];
          this.recommendData.hobby = response.data.hobby;
          this.recommendData.marriage = response.data.marriage || "";
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getRecommendUsers(page = null, showmessage = true) {
      // eslint-disable-next-line no-template-curly-in-string
      this.loading = true;
      let page_str = "";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      const path = "/users/recommend" + page_str;
      this.$axios
        .get(path)
        .then((response) => {
          this.resultData = response.data.users;
          this.pageData = response.data.pagination;
          this.resultData.forEach((element) => {
            if (element.avatar) {
              element.avatarFile = this.ossUrl + `/avatars/${element.avatar}`;
            } else {
              element.avatarFile = this.ossUrl + "/default-avatar.png";
            }

            let data = element.job.split(",");
            let self = this;
            var a = data[0];
            var b = data[1];
            this.jobOptions.forEach((item) => {
              if (item.value == a) {
                element.job = item.label;

                if (item.children && item.children.length) {
                  item.children.forEach((child) => {
                    if (child.value == b) {
                      // element.job += `/${child.label}`
                      element.job = child.label; //显示为第二级目录
                    }
                  });
                }
              }
            });
          });
          this.showResult = true;
          if (response.data.users.length === 0) {
            // this.$message.info('开通会员后可看到更多推荐内容。')
          }
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    getCity(location) {
      const province = CodeToText[location[0]];
      const city = CodeToText[location[1]];
      const district = CodeToText[location[2]];

      if (province === "全部" || !province) {
        return "中国";
      } else if (!city) {
        return province;
      } else if (!district) {
        return province + "/" + city;
      } else {
        return province + "/" + city + "/" + district;
      }
    },
  },
  created() {
    const userId = this.sharedState.user_id;
    this.getUser(userId);
    this.getRecommendData(userId);
    this.getRecommendUsers();
  },
  activated() {
    setTimeout(() => {
      this.$nextTick(() => {
        document.querySelector("#app").scrollTop = this.scroll;
      });
    }, 10);
  },
  beforeRouteLeave(to, from, next) {
    // ...
    // 组件离开的时候，获取页面滚动高度
    this.scroll = document.querySelector("#app").scrollTop;
    document.querySelector("#app").scrollTop = 0;
    next();
  },
};
</script>

<style scoped>
</style>
