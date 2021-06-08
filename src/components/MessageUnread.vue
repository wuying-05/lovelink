<template>
  <!-- 推荐设置 -->
  <section class="setRecommend">
    <el-row>
      <div
        class="lay-item"
        style="width: 98%; padding-left: 1%; margin-top: 5px"
        v-for="(value, key) in mesList"
        :key="key"
      >
        <div
          class="lay-item-img"
          style="height: 65px; width: 65px; margin-top: 5px"
          @click="dumpUserPage(value.user_id)"
        >
          <img
            v-if="value.avatar === ''"
            src="../assets/email.jpg"
            style="width: 100%; border-radius: 10px"
          />
          <img
            v-if="value.avatar !== ''"
            :src="
              'https://ailianwang.oss-cn-beijing.aliyuncs.com/avatars/' +
              value.avatar
            "
            style="width: 100%; border-radius: 10px"
          />
        </div>
        <div class="lay-item-text">
          <div style="font-size: 13px; font-weight: bold">
            {{ value.inf }}
          </div>
          <div style="color: #333333; padding-top: 0.1%; font-size: 13px">
            有一条未读信息
          </div>
          <div style="color: #666666; padding-top: 0.1%; font-size: 11px">
            {{ value.tm }}
          </div>
        </div>

        <div
          @click="showMessage(value.content, value.id)"
          style="
            cursor: pointer;
            float: right;
            width: 60px;
            margin-right: 5px;
            height: 35px;
            border-radius: 6px;
            background-color: #3399ff;
            color: white;
            line-height: 35px;
            text-align: center;
            font-size: 12px;
          "
        >
          查看
        </div>

        <div
          @click="handleDelete(value.content, value.id)"
          style="
            cursor: pointer;
            float: right;
            margin-right: 15px;
            width: 60px;
            height: 35px;
            border-radius: 6px;
            background-color: #ff9966;
            color: white;
            line-height: 35px;
            text-align: center;
            font-size: 12px;
          "
        >
          删除
        </div>

        <div style="clear: both"></div>
      </div>
    </el-row>
    <el-row :lg="6" :sm="20" style="padding: 20px 0">
      <el-pagination
        v-if="pageData.pages > 1"
        :current-page="pageData.page"
        :page-count="pageData.pages"
        :size="pageData.per_page"
        @current-change="getData"
        background
        layout="prev, pager, next"
        small
      >
      </el-pagination>
    </el-row>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <span>{{ messageContent }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { degreeOptions } from "../data";
import store from "../store";
export default {
  name: "RecommendOption",
  props: [],
  data() {
    return {
      degreeOptions: degreeOptions,
      sharedState: store.state,
      showNotice: true,
      tabs: ["全部", "多次来信", "免费信", "按时间", "按条件"],
      mesList: [],
      activeTab: 0,
      dialogVisible: false,
      messageContent: "这是一段信息",
      pageData: {},
    };
  },
  methods: {
    dumpUserPage(id){
      if(id!==0){
        this.$router.push({name:'User',params:{id:id}})
      }
    },
    resetData() {
      this.mesList = [];
      this.getData();
    },
    /**
     * Parse the time to string
     * @param {(Object|string|number)} time
     * @param {string} cFormat
     * @returns {string | null}
     */
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (typeof time === "string") {
          if (/^[0-9]+$/.test(time)) {
            // support "1548221490638"
            time = parseInt(time);
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), "/");
          }
        }

        if (typeof time === "number" && time.toString().length === 10) {
          time = time * 1000;
        }
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
      };
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
      });
      return time_str;
    },
    handleDelete(mes, id) {
      this.$confirm("确认删除消息？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteMessage(id);
        })
        .catch(() => {});
    },
    deleteMessage(id) {
      const path = "/users/delete/message";
      let params = {
        message_id: id,
        message_type: "receive",
      };
      this.$axios
        .post(path, params)
        .then((response) => {
          if (response.status === 200) {
            this.mesList = [];
            this.getData();
            this.$message.success("已删除");
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((error) => {
          this.$message.error("删除失败");
        });
    },
    /**
     * @param {number} time
     * @param {string} option
     * @returns {string}
     */
    formatTime(time, option) {
      if (("" + time).length === 10) {
        time = parseInt(time) * 1000;
      } else {
        time = +time;
      }
      const d = new Date(time);
      const now = Date.now();

      const diff = (now - d) / 1000;

      if (diff < 30) {
        return "刚刚";
      } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
      } else if (diff < 3600 * 24 * 2) {
        return "1天前";
      }
      if (option) {
        return this.parseTime(time, option);
      } else {
        return (
          d.getMonth() +
          1 +
          "月" +
          d.getDate() +
          "日" +
          d.getHours() +
          "时" +
          d.getMinutes() +
          "分"
        );
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    showMessage(mes, id) {
      const path = "/users/check/info/" + this.sharedState.user_id;
      let params = {
        info_id: id,
        info_type: "receive",
      };
      this.$axios
        .post(path, params)
        .then((response) => {
          console.log("response.data.data:>>>>>",response);
          if (response.status === 200) {
            
            if (response.data.code !== 0) {
              this.$message.error(response.data.msg);
            } else {
              
              this.dialogVisible = true;
              this.messageContent = response.data.data.info;
              this.getData();
            }
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    },
    hiddenNotice() {
      this.showNotice = false;
    },
    changeActiveTab(name) {
      this.activeTab = name;
    },
    changeTab(key) {
      console.log(key);
      if (this.activeTab !== key) {
        this.page = 1;
        this.activeTab = key;
        this.mesList = [];
      }
    },

    getData(page = null) {
      let page_str = "&page=1";
      if (page) {
        page_str = "&page=" + page;
      } else if (this.pageData.page) {
        page_str = "&page=" + this.pageData.page;
      }
      const path =
        "/users/infos?userid=" +
        this.sharedState.user_id +
        "&type=unread" +
        page_str;
      this.$axios
        .get(path)
        .then((response) => {
          this.pageData = response.data.pagination;
          this.mesList = response.data.items;
          for (var i = 0; i < this.mesList.length; i++) {
            this.mesList[i].des = this.mesList[i].content.substring(0, 20);
            this.mesList[i].tm = this.formatTime(this.mesList[i].create_time);
          }
          console.log(this.mesList);
        })
        .catch((error) => {});
    },
  },

  created() {
    this.getData();
  },
};
</script>
<style lang="scss" scope>
@media (max-width: 700px) {
  .setRecommend {
    .age-select,
    .height-select {
      width: 100px;
    }
  }
}

.lay-item:hover {
  background: #cccccc;
  border-radius: 10px;
}
.lay-item {
  display: flex;
  align-items: center;
}

.lay-item-text {
  width: 90%;
  padding-left: 16px;
}

.lay-item-img {
}

.top {
  margin-top: 15px;
  padding: 0 30upx;
  width: 40%;
}

.tabs {
  display: flex;
  justify-content: space-between;
}

.tab {
  text-align: center;
  color: #333;
  height: 140upx;
  line-height: 80upx;
  font-size: 14px;
  margin-left: 5%;
  cursor: pointer;
}

.tab_active {
  height: 140upx;
  margin-left: 5%;
  text-align: center;
  font-size: 14px;
  border-bottom-color: #ff7a8e;
  color: #ff7a8e;
  border-bottom: 2px solid;
  cursor: pointer;
}
</style>
