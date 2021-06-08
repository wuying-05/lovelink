<template>
  <el-container>
    <el-main
      class="container"
      style="max-width: 1180px"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <div class="">
        <el-card style="margin-bottom: 10px;">
          <img style="width: 100%;" src="../assets/promote.jpg" />
          
          <!--  <el-col class="qy-qrcode">
            <img src="../assets/qy-qrcode.jpg" />
            <p>欢迎关注企业微信</p>
          </el-col> -->
        </el-card>
        <el-card>
          同省婚恋（推荐）
          <span class="grey"> 异性 | 工作同省 | 上下10岁 </span>
        </el-card>
      </div>
      <UserCard :usersData="resultData" v-if="showResult" :from="1"></UserCard>
      <el-row style="padding: 20px 0" :lg="6" :sm="20">
        <el-pagination
          :hide-on-single-page="true"
          background
          small
          @current-change="handlePageChange"
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
import { jobOptions } from "../data";
export default {
  name: "Promote", // this is the name of the component
  components: { UserCard },
  data() {
    return {
      ossUrl: store.ossUrl,
      loading: false,
      sharedState: store.state,
      jobOptions: jobOptions,
      showResult: false,
      resultData: {},
      pageData: {},
      scroll: 0,
    };
  },
  methods: {
    getUsers() {
      // eslint-disable-next-line no-template-curly-in-string
      this.loading = true;
      const path = "/users/promote";
      this.$axios
        .get(path)
        .then((response) => {
          this.resultData = response.data.users;
          this.pageData = response.data.pagination;
          this.resultData.forEach((element) => {
            if (element.avatar) {
              element.avatarFile = this.ossUrl + `/avatars/${element.avatar}`;
            } else {
              element.avatarFile = "/static/img/default-avatar.a77a9fc1.png";
            }

            let data = element.job.split(",");
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
                element.job = item.label;

                if (item.children && item.children.length) {
                  item.children.forEach((child) => {
                    if (child.value == b) {
                      // element.job += `/${child.label}`;
                      element.job = child.label; //显示为第二级目录
                    }
                  });
                }
              }
            });
          });
          this.showResult = true;
          if (response.data.users.length === 0) {
            this.$message.info("暂无相关用户。");
          } else {
            // this.$message.success('推广列表已更新！')
          }
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    handlePageChange(page) {
      this.loading = true;
      const path = "/users/promote";
      this.$axios
        .get(path + "?page=" + page)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // 把返回的结果数据渲染到页面
          this.showResult = true;
          this.resultData = response.data.users;
          this.pageData = response.data.pagination;
          if (response.data.users.length === 0) {
            this.$message.info("暂无相关数据。");
          } else {
            // this.$message.success('推广列表已更新！')
          }
          this.resultData.forEach((element) => {
            if (element.avatar) {
              element.avatarFile = this.ossUrl + `/avatars/${element.avatar}`;
            } else {
              element.avatarFile = "/static/img/default-avatar.a77a9fc1.png";
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
                      // element.job += `/${child.label}`;
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
          // handle error, 400 and 500
          console.log("error!", error.response);
          this.loading = false;
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
    this.getUsers();
  },
};
</script>

<style scoped>
.grey {
  color: #8c939d;
}
</style>

<style lang='scss' scoped>
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
