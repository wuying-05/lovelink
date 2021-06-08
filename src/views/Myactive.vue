<template>
  <!-- 我的活动 -->
  <el-container>
    <el-main class="container">
      <el-row>
        <el-card style="margin-bottom: 10px; padding: 0">
          <img style="width: 100%;" src="../assets/myactive.jpg" />
        </el-card>
        <el-row style="padding: 20px 0">
          <el-col   :md="6"  :key="user.id">
            <el-card class="sg-card" :body-style="{ padding: '10px' }">
              <div style="text-align: center">
                <router-link
                  target="_blank"
                  :to="{ name: 'User', params: { id: user.id } }"
                >
                  <img
                    :src="user.avatarFile + '?t=' + nowtimestamp"
                    style="width: 228px; height: 160px; object-fit: cover"
                    v-bind:onerror="
                      'this.src=\'' + ossUrl + '/default-avatar.png\''
                    "
                  />
                </router-link>
              </div>
              <div style="padding: 10px 0">
                {{ user.name }}
                <img
                  src="../assets/icons/shiming.png"
                  style="padding-left: 10px; max-width: 28px"
                  v-if="user.id_confirmed"
                />
                <img
                  src="../assets/icons/hukou.png"
                  style="padding-left: 10px; max-width: 30px"
                  v-if="user.household_confirmed"
                />
                <img
                  src="../assets/icons/xueli.png"
                  style="padding-left: 10px; max-width: 30px"
                  v-if="user.degree_confirmed"
                />
                <div>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ user.age }}岁
                  </el-tag>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ user.height }}厘米
                  </el-tag>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ degreeData[user.degree] }}
                  </el-tag>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ marriageData[Number(user.marriage) - 1] }}
                  </el-tag>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ user.job }}
                  </el-tag>
                  <el-tag class="tag" size="mini" effect="plain" type="danger"
                    >{{ getCity(user.location) }}
                  </el-tag>
                </div>
              </div>
              <div>
                <div class="bottom clearfix">
                  <span class="small-title">点击数：</span
                  >{{ user.promote_click }}
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-s-share"
                    class="button right"
                    @click="getPromoteData(sharedState.admin_id, user.id)"
                    >分享
                  </el-button>
                </div>
                <p style="font-size: 12px">
                  点击分享，识别二维码，进入简介页面，通过微信分享本人的主页信息。
                </p>
              </div>
              <el-dialog
                title="推广链接和二维码"
                :visible.sync="promoteDialogVisible"
                style="text-align: center"
                width="400px"
              >
                <el-input
                  size="medium"
                  readonly
                  :value="promoteData.promoteUrl"
                ></el-input>
                <span><img :src="promoteData.promoteQR" width="220px" /></span>
              </el-dialog>
            </el-card>
          </el-col>
		  <el-col class="sg-content" :sm="24" :md="18"  style="padding: 10px;">
		    <p style="margin-top: 0px; margin-bottom: 10px; font-size: 20px">
		      我的积分：<span style="color: #eb6a1a">{{
		        integralAndSearchNum.totalIntegral
		      }}</span>
		    </p>
		    <p style="margin-top: 5px; font-size: 20px">
		      本周新增积分：<span style="color: #eb6a1a">{{
		        integralAndSearchNum.curWeekIntegral
		      }}</span>
		    </p>
		    <p
		      style="
		        margin-top: 5px;
		        font-size: 20px;
		        line-height: 1.5;
		        display: flex;
		        flex-direction: column;
		      "
		    >
		      积分规则：
		      <span
		        style="
		          color: #eb6a1a;
		          padding: 0 5px;
		          text-indent: 2em;
		          margin-top: 10px;
		          text-align: justify;
		          font-size: 18px;
		        "
		      >
		        为有积分的会员提供搜索功能。在公众号上注册推广员，推广本平台的活动海报，会获得积分。有一人通过推广员的海报关注公众号，推广员自动加10分。粉丝取消关注，自动减10分。
		      </span>
		      <span
		        style="
		          color: #eb6a1a;
		          padding: 0 5px;
		          text-indent: 2em;
		          text-align: justify;
		          font-size: 18px;
		        "
		      >
		        有积分的会员，根据所处的积分范围，用自己的积分数除以除数，所得结果为享有单次搜索最多能够显示出来的会员数量；根据所处的本周新增积分范围，本周享有相应的搜索次数。
		      </span>
		    </p>
		      </el-col>
        </el-row>
		<div
		  class="sg-table chec_table"
		  :style="check() ? 'width: 100%;display:flex;justify-content: space-between;' : 'width: 100%'"
		>
		  <el-row :style="check() ? 'width: 46%' : 'width:100%'" style="padding: 10px 0;">
		    <el-table :data="personData.list" border>
		      <el-table-column
		        type="index"
		        label="规则ID"
				width="100"
		        align="center"
		      >
		      </el-table-column>
		      <el-table-column
		        label="积分"
		        align="center"
		      >
		        <template slot-scope="scope">
		          <span
		            >{{ scope.row.start_refer_score }} -
		            {{
		              scope.row.end_refer_score == "-1"
		                ? "无限"
		                : scope.row.end_refer_score
		            }}</span
		          >
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="search_peo_rate"
		        label="除数"
				width="100"
		        align="center"
		      >
		      </el-table-column>
		    </el-table>
		  </el-row>
		  <el-row
		    :style="check() ? 'width: 46%' : 'width: 100%'"
			style="padding: 10px 0;"
		  >
		    <el-table :data="numData.list" border>
		      <el-table-column
		        type="index"
		        label="规则ID"
		        align="center"
				width="100"
		      >
		      </el-table-column>
		      <el-table-column label="本周新增积分" align="center">
		        <template slot-scope="scope">
		          <span
		            >{{ scope.row.start_refer_score }} -
		            {{
		              scope.row.end_refer_score == "-1"
		                ? "无限"
		                : scope.row.end_refer_score
		            }}</span
		          >
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="search_num"
		        label="搜索次数"
		        align="center"
				width="100"
		      >
		      </el-table-column>
		    </el-table>
			</el-row>
			</div>
          <el-card class="sg-card" style="padding: 20px 0; margin-top: 10px">
            <el-form :inline="true" :model="searchForm" ref="searchForm">
              <div style="display: inline-block">
                <el-form-item prop="startAge" style="width: 70px">
                  <el-input size="small" v-model.number="searchForm.startAge"
                    ><i slot="suffix">岁</i>
                  </el-input>
                </el-form-item>
                _
                <el-form-item prop="endAge" style="width: 70px">
                  <el-input size="small" v-model.number="searchForm.endAge"
                    ><i slot="suffix">岁</i></el-input
                  >
                </el-form-item>
              </div>
              <div style="display: inline-block">
                <el-form-item prop="startHeight" style="width: 70px">
                  <el-input size="small" v-model.number="searchForm.startHeight"
                    ><i slot="suffix">厘米</i>
                  </el-input>
                </el-form-item>
                _
                <el-form-item prop="endHeight" style="width: 70px">
                  <el-input size="small" v-model.number="searchForm.endHeight"
                    ><i slot="suffix">厘米</i>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item prop="degree">
                <el-select
                  placeholder="学历"
                  size="small"
                  clearable
                  v-model="searchForm.degree"
                  style="width: 170px"
                >
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in degreeOptions"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="marriage">
                <el-select
                  placeholder="婚姻状况"
                  size="small"
                  clearable
                  v-model="searchForm.marriage"
                  style="width: 170px"
                >
                  <el-option label="未婚" value="1"></el-option>
                  <el-option label="离异" value="2"></el-option>
                  <el-option label="丧偶" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="homeCity">
                <el-cascader
                  popper-class="s-mobile-cascader"
                  :options="cityOptions"
                  placeholder="家乡"
                  size="small"
                  v-model="searchForm.residence"
                  style="width: 170px"
                ></el-cascader>
              </el-form-item>
              <el-form-item prop="workCity">
                <el-cascader
                  popper-class="s-mobile-cascader"
                  :options="cityOptions"
                  placeholder="工作地"
                  size="small"
                  v-model="searchForm.location"
                  style="width: 170px"
                ></el-cascader>
              </el-form-item>
              <el-form-item id="searchActive">
                <el-button
                  :plain="false"
                  @click="search()"
                  :disabled="isClickSearch"
                  icon="el-icon-search"
                  type="primary"
                  size="small"
                >
                  搜索
                </el-button>
                <el-button
                  :plain="false"
                  size="small"
                  @click="resetSearchForm()"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
            <div>
              本周还有<span style="color: rgb(235, 106, 26)">
                {{ integralAndSearchNum.searchNum || 0 }}</span
              >
              次搜索机会
            </div>
          </el-card>
          <UserCard
            :usersData="resultData"
            v-if="showResult"
            :from="1"
          ></UserCard>
          <el-row :lg="6" :sm="20" style="padding: 20px 0">
            <el-pagination
              :current-page="pageData.page"
              :hide-on-single-page="true"
              :page-count="pageData.pages"
              :size="pageData.per_page"
              @current-change="submitSearchForm"
              background
              layout="prev, pager, next"
              small
            ></el-pagination>
          </el-row>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import UserCard from "../components/UserCard";
//  const currentPageUrl = process.env.NODE_ENV === 'production' ? '' : 'https://lovelink.net.cn/'
const currentPageUrl = "https://lovelink.net.cn/v1";
import { regionDataPlus, CodeToText } from "element-china-area-data";
import {
  jobOptions,
  jobData,
  salaryData,
  degreeData,
  marriageData,
  marriageOptions,
  degreeOptions,
  salaryOptions,
} from "../data";
import { provinceAndCityDataPlus } from "element-china-area-data";
export default {
  name: "myActive",
  data() {
    return {
      phone: "",
      personData: {
        list: null,
        page: null,
        pages: null,
        total: null,
      },
      numData: {
        list: null,
        page: null,
        pages: null,
        total: null,
      },
      user: {},
      staticFile: [
        "avatar.jpg",
        "avatar-boy.jpg",
        "boy0.jpg",
        "boy1.jpg",
        "boy2.jpg",
        "boy3.jpg",
        "girl0.jpg",
        "girl1.jpg",
        "girl2.jpg",
        "girl3.jpg",
        "default-avatar.png",
      ],
      ossUrl: store.ossUrl,
      sharedState: store.state,
      nowtimestamp: new Date().getTime(),
      followLoading: false,
      indexClicked: "",
      jobOptions: jobOptions,
      cityOptions: provinceAndCityDataPlus,
      jobData: jobData,
      salaryData: salaryData,
      salaryOptions: salaryOptions,
      degreeData: degreeData,
      degreeOptions: degreeOptions,
      marriageOptions: marriageOptions,
      marriageData: marriageData,
      promoteDialogVisible: false,
      promoteData: {
        promoteUrl: "",
        promoteQR: "",
      },
      searchForm: {
        startHeight: "",
        endHeight: "",
        startAge: "",
        endAge: "",
        location: [],
        residence: [],
        marriage: "",
        degree: "",
      },
      showResult: false,
      pageData: {},
      integralAndSearchNum: {
        totalIntegral: 0, // 总积分
        curWeekIntegral: 0, // 本周新增积分
        searchNum: 0, // 可搜索的次数
        people: 0, // 可搜索数量
      },
      isClickSearch: false, // 是否点击查询
      scroll: 0,
    };
  },
  watch: {},
  methods: {
    check() {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array(
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      );
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    searchByPerson(page = 1, showmessage = true) {
      let path = `${currentPageUrl}/search/search_peo_rule`;
      this.$axios
        .post(path, { isvalid: 1 })
        .then((response) => {
          this.personSearchResult = true;
          if (!response.data)
            return (this.personData.list = {
              isvalid: 1,
            });
          this.personData.list = response.data.data;
          this.personData.pages = response.data.pages;
          this.personData.total = response.data.total;
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
        return province + "/" + city;
        //return province + '/' + city + '/' + district;
      }
    },
    getPromoteData(from, to) {
      const path = `/users/promote/link?from=${from}&to=${to}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.promoteData.promoteUrl = response.data.promote_url;
          this.promoteData.promoteQR = response.data.qrcode_url;
          this.promoteDialogVisible = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getUser() {
      const self = this;
      let id = this.sharedState.user_id;
      this.user.id = id;
      const path = `/users/${id}/details`;
      this.$axios
        .get(path)
        .then((response) => {
          let avatarFilename = "";
          if (response.data.basic.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.basic.avatar;
          }
          this.user.avatarFile = this.ossUrl + `/avatars/${avatarFilename}`;
          this.user.id_confirmed = response.data.meta.id_confirmed;
          this.user.household_confirmed =
            response.data.meta.household_confirmed;
          this.user.degree_confirmed = response.data.meta.degree_confirmed;
          this.user.age = response.data.basic.age;
          this.user.height = response.data.basic.height;
          this.user.degree = response.data.basic.degree;
          this.user.marriage = response.data.basic.marriage;
          if (response.data.basic.location) {
            this.user.location = response.data.basic.location.split(",");
          }

          let data = response.data.basic.job;
          var a = data[0];
          var b = data[1];
          this.jobOptions.forEach((item) => {
            if (item.value == a) {
              self.user.job = item.label;

              if (item.children && item.children.length) {
                item.children.forEach((child) => {
                  if (child.value == b) {
                    // self.user.job += `/${child.label}`;
                    self.user.job = child.label; //显示为第二级目录
                  }
                });
              }
            }
          });

          this.user.promote_click = response.data.meta.promote_click;

          this.$forceUpdate();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    search() {
      if (this.integralAndSearchNum.searchNum === 0) {
        this.$message.error("本周新增积分不足");
        return;
      }
      this.isClickSearch = true;
      localStorage.setItem("searchForm", JSON.stringify(this.searchForm));
      this.submitSearchForm(1);
    },
    submitSearchForm(page = null, showmessage = true) {
      this.showResult = false;
      const startAge = this.searchForm.startAge;
      const endAge = this.searchForm.endAge;
      const startHeight = this.searchForm.startHeight;
      const endHeight = this.searchForm.endHeight;
      if (startAge !== "") {
        if (!Number.isInteger(startAge)) {
          this.$message.error("请输入正确的年龄范围开始值");
          this.isClickSearch = false;
          return false;
        }
        if (endAge === "" || !Number.isInteger(endAge)) {
          this.$message.error("请输入正确的的年龄范围结束值");
          this.isClickSearch = false;
          return false;
        }
        if (startAge > endAge) {
          this.$message.error("年龄范围开始值应该大于结束值");
          this.isClickSearch = false;
          return false;
        }
      }
      if (startHeight !== "") {
        if (!Number.isInteger(startHeight)) {
          this.$message.error("请输入正确的身高范围开始值");
          this.isClickSearch = false;
          return false;
        }
        if (endHeight === "" || !Number.isInteger(endHeight)) {
          this.$message.error("请输入正确的的身高范围结束值");
          this.isClickSearch = false;
          return false;
        }
        if (startHeight > endHeight) {
          this.$message.error("身高范围开始值应该大于结束值");
          this.isClickSearch = false;
          return false;
        }
      }
      if (
        this.searchForm.residence.length == 0 &&
        this.searchForm.location == 0
      ) {
        this.$message.error("家乡跟工作地至少选择一个");
        this.isClickSearch = false;
        return false;
      }
      const payload = {
        page: page || this.pageData.page,
        per_page: 12, // this.integralAndSearchNum.people
        // start_age: this.searchForm.startAge,
        // end_age: this.searchForm.endAge,
        // start_height: this.searchForm.startHeight,
        // end_height: this.searchForm.endHeight,
        residence: this.searchForm.residence.toString(),
        location: this.searchForm.location.toString(),
        marriage: this.searchForm.marriage,
        degree: this.searchForm.degree,
      };
      if (this.searchForm.startAge && this.searchForm.endAge) {
        payload["start_age"] = this.searchForm.startAge;
        payload["end_age"] = this.searchForm.endAge;
      }
      if (this.searchForm.startHeight && this.searchForm.endHeight) {
        payload["start_height"] = this.searchForm.startHeight;
        payload["end_height"] = this.searchForm.endHeight;
      }
      this.$axios
        .post(`/search/new_users_list`, payload)
        // .get(`${currentPageUrl}/search/users`)
        .then((response) => {
          console.log(document.getElementById("searchActive").offsetTop);
          // 把返回的搜索结果数据渲染到页面
          if (response.data.code == -1) {
            this.$message.error(response.data.msg);
            this.isClickSearch = false;
            return false;
          }
          this.getIntegralAndSearchNum(); // 更新搜索次数
          this.resultData = response.data.users;
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

          this.pageData = response.data.pagination;
          this.limitAdminPages();
          if (response.data.users.length === 0) {
            this.$message.error("暂无相关结果。");
          } else {
          }
          document.querySelector("#app").scrollTop =
            document.getElementById("searchActive").offsetTop + 200;
          this.showResult = true;
        })
        .catch((error) => {
          // handle error, 400 and 500
          this.isClickSearch = false;
          console.log("error!", error);
        });
    },
    limitAdminPages() {
      // 如果当前用户是普通管理员，而且 pageData.pages 的值大于 10，重置为 10
      if (!this.sharedState.is_super_admin && this.pageData.pages > 10) {
        this.pageData.pages = 10;
      }
    },
    resetSearchForm() {
      this.$refs["searchForm"].resetFields();
      this.searchForm.location = [];
      this.searchForm.residence = [];
    },
    getIntegralAndSearchNum() {
      this.$axios
        .post(`${currentPageUrl}/search/integralAndSearchNum`, {
          userid: this.sharedState.user_id,
        })
        .then((res) => {
          this.isClickSearch = false;
          this.integralAndSearchNum.totalIntegral = res.data.data.score || 0;
          this.integralAndSearchNum.curWeekIntegral =
            res.data.data.new_week_score || 0;
          this.integralAndSearchNum.searchNum = res.data.data.num || 0;
          this.integralAndSearchNum.people = res.data.data.people || 0;
        })
        .catch((e) => {
          this.isClickSearch = false;
          this.$message.error(res.data.msg);
        });
    },
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
  created() {
    let searchForm = localStorage.getItem("searchForm");
    if (searchForm) {
      this.searchForm = JSON.parse(searchForm);
    }
    this.getUser();
    // console.log(this.check(), 'ss')
    this.getIntegralAndSearchNum();
  },
  mounted() {
    this.searchByPerson();
    let path = `${currentPageUrl}/search/search_num_rule`;
    this.$axios
      .post(path, {
        isvalid: 1,
      })
      .then((response) => {
        if (!response.data)
          return (this.numData.list = {
            num_rule_id: "",
            isvalid: "",
            search_num: "",
          });
        this.numData.list = response.data.data;
        this.numData.pages = response.data.pages;
        this.numData.total = response.data.total;
      })
      .catch((error) => {});
  },
  components: {
    UserCard,
  },
};
</script>

<style lang='scss'>
@media (max-width: 800px) {
  .sg-card,.sg-content,.sg-table {
    width: calc(100% - 40px)!important;
    margin-left: 20px;
  }
  #searchActive{
    display: block;
  }
}
// 移动端的效果
@media (max-width: 700px) {
  /* 三级联动菜单的宽度调整 */
  .s-mobile-cascader {
    .el-cascader-menu,
    .el-scrollbar__wrap,
    .el-cascader-menu__list {
      min-width: initial !important;
      width: 170px;
    }
  }
}

.tag {
  margin: 2px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.left {
  float: left;
}

.right {
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.grey {
  color: #8c939d;
}

/* .el-tag--plain.el-tag--danger {
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	  max-width: 120px;
	} */
.qy-qrcode {
  text-align: center;

  img {
    width: 200px;
    // object-fit: contain;
    // margin-bottom: -10px;
  }

  p {
    line-height: 0px;
  }
}
</style>
