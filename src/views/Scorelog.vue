<template>
  <el-container>
    <el-main
      class="container"
      element-loading-text="加载中"
      v-loading="loading"
    >
      <div class="">
        <el-card style="margin-bottom: 10px; padding: 10px 0">
          <el-form
            :inline="true"
            :model="searchForm"
            label-width="50px"
            ref="searchForm"
          >
            <el-form-item>
              <el-input
                placeholder="ID"
                size="small"
                style="width: 100px"
                v-model="searchForm.id"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                label="up"
                border
                size="small"
                v-model="searchForm.addscore"
                >增加积分的会员</el-checkbox
              >
              <el-checkbox
                label="down"
                border
                size="small"
                v-model="searchForm.delscore"
                >减少积分的会员</el-checkbox
              >
            </el-form-item>
            <el-form-item>
              <el-button
                :plain="false"
                @click="getData()"
                icon="el-icon-search"
                size="small"
                type="primary"
                >搜索</el-button
              >
              <el-button :plain="false" @click="resetSearchForm()" size="small"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-row>
            <el-table :data="mesList" style="width: 100%">
              <el-table-column
                align="center"
                label="会员ID"
                prop="0"
                width="70"
              ></el-table-column>
              <el-table-column
                align="center"
                label="昵称"
                prop="1"
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                label="增加积分"
                prop="2"
                v-if=""
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                label="减少积分"
                prop="6"
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                label="增加积分时间"
                prop="tm"
                width="150"
              ></el-table-column>
              <el-table-column
                align="center"
                label="备注"
                prop="4"
                width="150"
              ></el-table-column>
              <el-table-column
                align="center"
                label="操作"
                prop="degree_image_url"
                width="170px"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="addTemplate(scope.row[4], scope.row[5])"
                    size="mini"
                    >编辑备注</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row :lg="6" :sm="20" style="padding: 20px 0">
            <el-pagination
              :current-page="pageData.page"
              :page-count="pageData.pages"
              :size="pageData.per_page"
              @current-change="getData"
              background
              layout="prev, pager, next"
              small
            ></el-pagination>
          </el-row>
        </el-card>
        <el-dialog
          :visible.sync="showTemplate"
          size="mini"
          title="编辑备注"
          width="300px"
        >
          <el-form>
            <el-form-item label=""
              ><el-input
                rows="4"
                type="textarea"
                placeholder="输入不超过50个字符"
                v-model="editTemplate"
              ></el-input
            ></el-form-item>
          </el-form>
          <div class="dialog-footer" slot="footer">
            <el-button @click="submitTemplate(0)">取 消</el-button>
            <el-button @click="submitTemplate(1)" type="primary"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import postscribe from 'postscribe'
import store from "../store.js";

export default {
  name: "Scorelog", // this is the name of the component
  props: {
    user_id: {
      default: 0,
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
      albumHeight: "500px",
      wechatworkGroupUrl: "",
      message_user_id: 0,
      messageDate: "",
      messageTop: "",
      templateData: [],
      tid: 0,
      pageData: {},
      mesList: [],
      searchForm: {
        id: "",
        addscore: "",
        delscore: "",
        type: "",
      },
      showTemplate: false,
      editTemplate: "",
    };
  },
  methods: {
    submitTemplate(val) {
      if (val == 0) {
        this.showTemplate = false;
      }
      if (val == 1) {
        const path = "/users/score/des";
        let params = {
          content: this.editTemplate,
          tid: this.tid,
        };
        this.$axios
          .post(path, params)
          .then((response) => {
            if (response.data.error_code == 0) {
              this.$message.success("操作成功！");
              this.editTemplate = "";
              this.showTemplate = false;
              this.getData();
            }
          })
          .catch((error) => {});
      }
    },
    resetSearchForm() {
      this.searchForm.id = "";
      this.searchForm.addscore = "";
      this.searchForm.delscore = "";
    },
    addTemplate(content, col) {
      this.showTemplate = true;
      this.editTemplate = "";
      console.log(col);
      this.tid = col;
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
    GMTToStr(time) {
      let date = new Date(time);
      let tm = date.getTime();
      date = new Date(tm - 8 * 60 * 60 * 1000);
      let Str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      return Str;
    },

    getData(page = null) {
      let page_str = "?page=1";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      if (
        this.searchForm.addscore == true &&
        this.searchForm.delscore != true
      ) {
        this.searchForm.type = "up";
      } else if (
        this.searchForm.addscore != true &&
        this.searchForm.delscore == true
      ) {
        this.searchForm.type = "down";
      } else {
        this.searchForm.type = "";
      }
      const path =
        "/users/score/list" +
        page_str +
        "&uid=" +
        this.searchForm.id +
        "&filter_type=" +
        this.searchForm.type;
      this.$axios
        .get(path)
        .then((response) => {
          if (response.data.code === 0) {

            this.pageData = response.data.data.pagination;
            this.mesList = response.data.data.items;
            for (var i = 0; i < this.mesList.length; i++) {
              this.mesList[i].tm = this.GMTToStr(this.mesList[i][3]);
              if (this.mesList[i][2] > 0) {
              } else {
                this.mesList[i][6] = this.mesList[i][2];
                this.mesList[i][2] = "";
              }
            }
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {});
    },
  },
  created() {
    // eslint-disable-next-line camelcase
    let user_id = 0;
    if (this.user_id) {
      user_id = this.user_id;
    } else {
      user_id = this.$route.params.id;
    }
    this.message_user_id = user_id;
    if (this.isMobile()) {
      this.albumHeight = "150px";
    }
    this.getData();
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

