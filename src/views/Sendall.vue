<template>
  <el-container>
    <el-main class="detailMain">
      <el-row>
        <el-col :lg="24" :md="24" :sm="22">
          <div style="margin: 12px">
            <el-card>
              <el-row style="margin-left: 20px">
                <el-button @click="addTemplate()" size="small" type="primary"
                  >创建</el-button
                >
              </el-row>
              <el-row style="margin-left: 20px">
                <el-tabs :tab-position="tabPosition" v-model="activeTab">
                  <el-tab-pane label="已发送" name="send">
                    <el-row>
                      <div
                        style="
                          width: 100%;
                          height: 1px;
                          background-color: #f4f4f4;
                        "
                      ></div>
                      <div
                        style="width: 98%; margin-left: 2%; margin-top: 1%"
                        v-for="(value, key) in mesList"
                        :key="key"
                      >
                        <div style="float: left; height: 100px; width: 80px">
                          <img src="../assets/email.jpg" style="width: 100%" />
                        </div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            color: #3399ff;
                            font-size: 17px;
                            font-weight: bold;
                          "
                        >
                          管理员信
                        </div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            font-size: 15px;
                          "
                          v-html="value.content"
                        ></div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            font-size: 15px;
                          "
                        >
                          时间:{{ value.tm }}
                        </div>
                        <div
                          @click="showMessage(value.content)"
                          style="
                            cursor: pointer;
                            float: right;
                            margin-right: 4%;
                            margin-top: -1.5%;
                            width: 90px;
                            height: 35px;
                            background-color: #3399ff;
                            color: white;
                            line-height: 35px;
                            text-align: center;
                            font-size: 14px;
                          "
                        >
                          点击查看
                        </div>
                        <div style="clear: both"></div>
                        <div
                          style="
                            width: 110%;
                            height: 1px;
                            background-color: #cccccc;
                            margin-top: 3px;
                            margin-left: -10%;
                          "
                        ></div>
                      </div>
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
                      >
                      </el-pagination>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="未发送" name="unsend">
                    <el-row>
                      <div
                        style="
                          width: 100%;
                          height: 1px;
                          background-color: #f4f4f4;
                        "
                      ></div>
                      <div
                        style="width: 98%; margin-left: 2%; margin-top: 1%"
                        v-for="(value, key) in saveMes"
                        :key="key"
                      >
                        <div style="float: left; height: 100px; width: 80px">
                          <img src="../assets/email.jpg" style="width: 100%" />
                        </div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            color: #3399ff;
                            font-size: 17px;
                            font-weight: bold;
                          "
                        >
                          草稿信息
                        </div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            font-size: 15px;
                          "
                          v-html="value.content"
                        ></div>
                        <div
                          style="
                            padding-left: 9%;
                            padding-top: 1%;
                            font-size: 15px;
                          "
                        >
                          时间:{{ value.createtime }}
                        </div>
                        <div
                          @click="reMessage(value.content, key)"
                          style="
                            cursor: pointer;
                            float: right;
                            margin-right: 4%;
                            margin-top: -1.5%;
                            width: 90px;
                            height: 35px;
                            background-color: #3399ff;
                            color: white;
                            line-height: 35px;
                            text-align: center;
                            font-size: 14px;
                          "
                        >
                          发送
                        </div>
                        <div
                          @click="delsave(key, value.content)"
                          style="
                            cursor: pointer;
                            float: right;
                            margin-right: 4%;
                            margin-top: -1.5%;
                            width: 90px;
                            height: 35px;
                            background-color: #3399ff;
                            color: white;
                            line-height: 35px;
                            text-align: center;
                            font-size: 14px;
                          "
                        >
                          编辑
                        </div>
                        <div style="clear: both"></div>
                        <div
                          style="
                            width: 110%;
                            height: 1px;
                            background-color: #cccccc;
                            margin-top: 3px;
                            margin-left: -10%;
                          "
                        ></div>
                      </div>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-row>
              <el-row style="margin-left: 20px">
                <!--<el-input
				  type="textarea"
				  :rows="8"
				  :cols="70"
				  maxlength="200"
				  show-word-limit
				  v-model="messageDate"
				  placeholder="发送全站信息"
				></el-input>-->
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog title="" :visible.sync="dialogVisible" width="60%">
      <span v-html="messageContent"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisible2" width="60%">
      <wangEditor v-model.trim="messageDate"></wangEditor>
      <!--<el-checkbox v-model="messageTop" label="在她的信件列表置顶(开通钻石会员免费使用)" style="margin-top: 20px;" border size="small"></el-checkbox>-->
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          letter-spacing: 30px;
        "
      >
        <el-button type="primary" @click="sendMessage()">发信息</el-button>
        <el-button type="primary" @click="saveMessage()">保存草稿</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogVisible3"
      :before-close="handleClose"
      width="60%"
    >
      <wangEditor v-model.trim="messageDate"></wangEditor>
      <!--<el-checkbox v-model="messageTop" label="在她的信件列表置顶(开通钻石会员免费使用)" style="margin-top: 20px;" border size="small"></el-checkbox>-->
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          letter-spacing: 30px;
        "
      >
        <el-button type="primary" @click="sendMessage()">发信息</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogVisible4"
      :before-close="handleClose"
      width="60%"
    >
      <wangEditor v-model.trim="messageDate"></wangEditor>
      <!--<el-checkbox v-model="messageTop" label="在她的信件列表置顶(开通钻石会员免费使用)" style="margin-top: 20px;" border size="small"></el-checkbox>-->
      <div class="dialog-footer" slot="footer">
        <el-button @click="delsave2()" style="float: left">删 除</el-button>
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button @click="delsave3()" type="primary">保 存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
// import postscribe from 'postscribe'
import store from "../store.js";
import wangEditor from "../components/wangEditor";
import { Loading } from 'element-ui';

export default {
  name: "User", // this is the name of the component
  components: {
    wangEditor, //富文本框编辑器
  },
  props: {
    user_id: {
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
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
      showTemplate: true,
      templateData: [],
      tid: 0,
      tabPosition: "top",
      activeTab: "send",
      mesList: [],
      pageData: {},
      messageContent: "",
      saveMes: [],
      key: 0,
      dialogVisible4: false,
    };
  },
  methods: {
    getData(page = null) {
      let page_str = "?page=1";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      const path = "/admin/get/infos" + page_str;
      this.$axios
        .get(path)
        .then((response) => {
          this.pageData = response.data.pagination;
          this.mesList = response.data.items;
          for (var i = 0; i < this.mesList.length; i++) {
            this.mesList[i].des = this.mesList[i].content.substring(0, 20);
            this.mesList[i].tm = this.GMTToStr(this.mesList[i].create_time);
          }
        })
        .catch((error) => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
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
    sendMessage() {
      if (this.messageDate == "") {
        alert("发送信息不能为空");
        return;
      }
      let loadingInstance = Loading.service({ fullscreen: true, text:"正在发送中，请等待..." });
      let path = "/admin/send/infos";
      let params = {
        content: this.messageDate,
      };
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      this.$axios
        .post(path, params)
        .then((response) => {
          Loading.service({ fullscreen: true }).close();
          if (this.dialogVisible3 == true) {
            let data = JSON.parse(sessionStorage.getItem("mes4"));
            data.splice(this.key, 1);
            sessionStorage.setItem("mes4", JSON.stringify(data));
            this.loadSave();
          }
          if (response.data.error_code == 0) {
            this.$message.success("发送成功！");
            this.getData()
          } else {
            this.$message.info(response.data.msg);
          }
        })
        .catch((error) => {
          Loading.service({ fullscreen: true }).close();
          this.$message.warning("发送失败 请检查网络。");
        });
    },

    saveMessage() {
      if (this.messageDate == "") {
        alert("发送信息不能为空");
        return;
      }
      let data = JSON.parse(sessionStorage.getItem("mes4"));

      if (data == null) {
        data = [];
      }
      console.log(data.length);
      var d = new Date();
      let newdata = [
        {
          content: this.messageDate,
          createtime: d.toLocaleString("chinese", { hour12: false }),
        },
      ];
      console.log(newdata);
      data[data.length] = newdata;

      sessionStorage.setItem("mes4", JSON.stringify(data));
      this.$message.success("保存成功！");
      this.dialogVisible2 = false;
      this.loadSave();
    },
    loadSave() {
      this.saveMes = JSON.parse(sessionStorage.getItem("mes4"));
      for (var i = 0; i < this.saveMes.length; i++) {
        this.saveMes[i] = this.saveMes[i][0];
        console.log(this.saveMes[i]);
        this.saveMes[i].des = this.saveMes[i].content.substring(0, 20);
      }
    },
    showMessage(mes) {
      this.dialogVisible = true;
      this.messageContent = mes;
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
    addTemplate() {
      this.dialogVisible2 = true;
      this.messageDate = "";
    },
    reMessage(mes, key) {
      this.dialogVisible3 = true;
      this.messageDate = mes;
      this.key = key;
    },
    delsave(key, content) {
      this.key = key;
      this.dialogVisible4 = true;
      this.messageDate = content;
      return;
      this.$confirm("确认删除？")
        .then((_) => {
          let data = JSON.parse(sessionStorage.getItem("mes4"));
          data.splice(key, 1);
          sessionStorage.setItem("mes4", JSON.stringify(data));
          this.loadSave();
        })
        .catch((_) => {});
    },
    delsave2() {
      this.$confirm("确认删除？")
        .then((_) => {
          let data = JSON.parse(sessionStorage.getItem("mes4"));
          data.splice(this.key, 1);
          sessionStorage.setItem("mes4", JSON.stringify(data));
          this.loadSave();
          this.dialogVisible4 = false;
        })
        .catch((_) => {});
    },
    delsave3() {
      let data = JSON.parse(sessionStorage.getItem("mes4"));
      var d = new Date();
      let newdata = [
        {
          content: this.messageDate,
          createtime: d.toLocaleString("chinese", { hour12: false }),
        },
      ];
      data[this.key] = newdata;
      console.log(newdata);
      console.log(data);
      sessionStorage.setItem("mes4", JSON.stringify(data));
      this.loadSave();
      this.dialogVisible4 = false;
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
    this.loadSave();
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

