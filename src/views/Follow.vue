<template>
  <el-container>
    <el-main
      class="container"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <el-row>
        <el-card style="margin-bottom: 10px;">
          <img style="width: 100%;" src="../assets/follow.jpg" />
        </el-card>
        <el-card>
          <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="我关注的" name="following">
              <FollowUserCard
                :usersData="followingData"
                :getFollowing="getFollowing"
                :getMatchUsers="getMatchUsers"
                v-if="followingData[0] !== undefined"
              ></FollowUserCard>
              <el-row style="padding: 20px 0" v-else>暂无关注。</el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20">
                <el-pagination
                  :hide-on-single-page="true"
                  background
                  small
                  @current-change="handleFollowingPageChange"
                  layout="prev, pager, next"
                  :page-size="followingPageData.per_page"
                  :page-count="followingPageData.pages"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="关注我的" name="followers">
              <FollowUserCard
                :usersData="followersData"
                :getFollowing="getFollowing"
                :getMatchUsers="getMatchUsers"
                v-if="followersData[0] !== undefined"
              ></FollowUserCard>
              <el-row style="padding: 20px 0" v-else>暂无粉丝。</el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20">
                <el-pagination
                  :hide-on-single-page="true"
                  background
                  small
                  @current-change="handleFollowersPageChange"
                  layout="prev, pager, next"
                  :page-size="followersPageData.per_page"
                  :page-count="followersPageData.pages"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="匹配成功" name="matched">
              <el-alert
                v-if="!qrcodeUploaded"
                title="请在基本信息页面提交企业微信群二维码。如有疑问，请联系您的专属客服。"
                type="warning"
                :closable="false"
                effect="dark"
              >
              </el-alert>
              <FollowUserCard
                :matchUserPage="true"
                :usersData="matchUsersData"
                :getFollowing="getFollowing"
                :getMatchUsers="getMatchUsers"
                v-if="matchUsersData[0] !== undefined"
              ></FollowUserCard>
              <el-row style="padding: 20px 0" v-else
                >暂无匹配成功的用户。</el-row
              >
              <!-- <el-row style="padding:20px 0;" :lg="6" :sm="20">
                            <el-pagination
                            :hide-on-single-page=true
                            background
                            small
                            @current-change="handleMatchUsersPageChange"
                            layout="prev, pager, next"
                            :page-size="matchUsersPageData.per_page"
                            :page-count="matchUsersPageData.pages">
                            </el-pagination>
                        </el-row> -->
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import FollowUserCard from "../components/FollowUserCard";
import { jobData, jobOptions, degreeData, degreeOptions } from "../data";
export default {
  name: "Follow", // this is the name of the component
  components: { FollowUserCard },
  data() {
    return {
      jobOptions: jobOptions,
      loading: false,
      activeName: "following",
      sharedState: store.state,
      followingData: {},
      followersData: {},
      matchUsersData: {},
      followingPageData: {},
      followersPageData: {},
      qrcodeUploaded: "",
      ossUrl: store.ossUrl,
      scroll: 0,
      // matchUsersPageData: {}
    };
  },
  methods: {
    getQrcodeStatus() {
      // eslint-disable-next-line no-template-curly-in-string
      const path = "/users/me/profile/wechatwork_group";
      this.$axios
        .get(path)
        .then((response) => {
          this.qrcodeUploaded = response.data.is_uploaded;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getFollowing(id) {
      // eslint-disable-next-line no-template-curly-in-string
      this.loading = true;
      const path = `/users/${id}/following`;
      this.$axios
        .get(path)
        .then((response) => {
          this.followingData = response.data.users;
          this.followingPageData = response.data.pagination;
          this.followingData.forEach((element) => {
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
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    getFollowers(id) {
      // eslint-disable-next-line no-template-curly-in-string
      this.loading = true;
      const path = `/users/${id}/followers`;
      this.$axios
        .get(path)
        .then((response) => {
          this.followersData = response.data.users;
          this.followersPageData = response.data.pagination;
          this.followersData.forEach((element) => {
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
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    getMatchUsers(id) {
      // eslint-disable-next-line no-template-curly-in-string
      this.loading = true;
      const path = `/users/${id}/match`;
      this.$axios
        .get(path)
        .then((response) => {
          this.matchUsersData = response.data.users;
          this.matchUsersData.forEach((element) => {
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
          this.loading = false;
          // this.matchUsersPageData = response.data.pagination
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    handleFollowingPageChange(page) {
      this.loading = true;
      this.$axios
        .get(this.followingPageData.raw_url + "?page=" + page)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // 把返回的结果数据渲染到页面
          this.followingData = response.data.users;
          this.followingPageData = response.data.pagination;
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch((error) => {
          // handle error, 400 and 500
          console.log("error!", error.response);
          this.loading = false;
        });
    },
    handleFollowersPageChange(page) {
      this.loading = true;
      this.$axios
        .get(this.followersPageData.raw_url + "?page=" + page)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // 把返回的结果数据渲染到页面
          this.followersData = response.data.users;
          this.followersPageData = response.data.pagination;
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch((error) => {
          // handle error, 400 and 500
          console.log("error!", error.response);
          this.loading = false;
        });
    },
    handleTabClick(tab, event) {
      const userId = this.sharedState.user_id;
      if (tab.name === "matched") {
        if (this.matchUsersData[0] === undefined) {
          this.getMatchUsers(userId);
        }
      } else if (tab.name === "followers") {
        if (this.followersData[0] === undefined) {
          this.getFollowers(userId);
        }
      }
    },
    // handleMatchUsersPageChange (page) {
    //     this.loading = true
    //     this.$axios
    //         .get(this.matchUsersPageData.raw_url + '?page=' + page)
    //         // eslint-disable-next-line no-unused-vars
    //         .then(response => {
    //             // 把返回的结果数据渲染到页面
    //             this.matchUsersData = response.data.users
    //             this.matchUsersPageData = response.data.pagination
    //             window.scrollTo(0, 0)
    //             this.loading = false
    //         })
    //         .catch(error => {
    //             // handle error, 400 and 500
    //             console.log('error!', error.response)
    //             this.loading = false
    //         })
    // }
  },
  created() {
    const userId = this.sharedState.user_id;
    this.getFollowing(userId);
    this.getQrcodeStatus();
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
