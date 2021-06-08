<template>
  <!-- 身份认证 -->
  <el-container>
    <el-main class="editMain" v-loading="loading">
      <el-row style="margin-top: 38px" class="my-verift">
        <el-tabs :tab-position="tabPosition" v-model="activeTab">
          <el-tab-pane label="我的认证" name="verify">
            <section>
              <el-row>
                <el-col :offset="0" :span="24">
                  <el-card style="text-align: center">
                    <div slot="header">
                      <span>认证</span>
                    </div>
                    <el-row>
                      <el-col :offset="2" :lg="3" :md="3" :sm="16">
                        <img
                          src="../assets/icons/shiming.png"
                          style="padding: 20px; max-width: 130px"
                        />
                      </el-col>
                      <el-col
                        :offset="2"
                        :lg="9"
                        :md="6"
                        :sm="16"
                        style="padding: 0 20px; text-align: left"
                      >
                        <h4>实名认证</h4>
                        <span
                          >为了保证平台用户的真实性，需要进行实名认证，身份信息绝对保密，不对外公布。<br />
                          请上传完整、清晰的本人身份证人像面图片。
                        </span>
                      </el-col>
                      <el-col :lg="3" :md="3" :sm="16" style="padding: 48px">
                        <el-button
                          v-if="userData.id_confirmed === 1"
                          @click="startVerify"
                          >认证失败，请重新上传证件</el-button
                        >
                        <el-button v-else-if="userData.id_confirmed" disabled
                          >已经认证</el-button
                        >
                        <el-button @click="startVerify" v-else>
                          马上认证
                        </el-button>
                      </el-col>
                      <el-dialog
                        title="实名认证"
                        :visible.sync="idDialogVisible"
                        width="300px"
                      >
                        <el-form>
                          <el-form-item>
                            <el-upload
                              :action="idUploadUrl"
                              :headers="uploadHeaders"
                              accept="image/png, image/jpeg"
                              :limit="1"
                              :file-list="fileList"
                              :on-success="
                                (response, file) =>
                                  handleUploadSuccess(response, file, 'id')
                              "
                              :on-error="handleUploadError"
                              :before-upload="beforeIdCardUpload"
                            >
                              <el-button size="small">点击上传文件</el-button>
                              <div slot="tip" class="el-upload__tip">
                                只能上传JPG/PNG文件，且不超过2M
                              </div>
                            </el-upload>
                          </el-form-item>
                        </el-form>
                      </el-dialog>
                      <!-- <el-dialog
                                                title="微信扫描二维码完成验证"
                                                :visible.sync="qrDialogVisible"
                                                style="text-align: center" width="320px">
                                                <span><img :src="qrImage" width="280px"></span>
                                                <span slot="footer" class="dialog-footer">
                                                </span>
                                            </el-dialog> -->
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                      <el-col :lg="2" :md="3" :sm="16">
                        <img
                          src="../assets/icons/xueli.png"
                          style="padding: 20px; max-width: 100px"
                        />
                      </el-col>
                      <el-col
                        :offset="1"
                        :lg="5"
                        :md="5"
                        :sm="16"
                        style="padding: 0 20px; text-align: left"
                      >
                        <h4>学历认证</h4>
                        <!-- <span>认证婚姻信息，点亮左侧图标</span> -->
                      </el-col>

                      <el-col :lg="2" :md="2" :sm="16" style="padding: 48px 0">
                        <el-button @click="uploadDegree()">{{
                          checkStatus[userData.degree_confirmed + 1]
                        }}</el-button>
                      </el-col>
                      <el-dialog
                        title="婚姻状况认证"
                        :visible.sync="degreeDialogVisible"
                        width="300px"
                      >
                        <el-form>
                          <el-form-item>
                            <el-upload
                              :action="degreeUploadUrl"
                              :headers="uploadHeaders"
                              accept="image/png, image/jpeg"
                              :limit="1"
                              :on-success="
                                (response, file) =>
                                  handleUploadSuccess(response, file, 'degree')
                              "
                              :on-error="handleUploadError"
                              :before-upload="beforeDegreeUpload"
                            >
                              <el-button size="small">点击上传文件</el-button>
                              <div slot="tip" class="el-upload__tip">
                                只能上传JPG/PNG文件，且不超过2M
                              </div>
                            </el-upload>
                          </el-form-item>
                        </el-form>
                      </el-dialog>
                      <el-col :offset="1" :span="1" class="hidden-sm-and-down">
                        <hr
                          style="
                            width: 1px;
                            height: 120px;
                            border: none;
                            background-color: #d9d9d9;
                          "
                        />
                      </el-col>
                      <el-col :lg="2" :md="2" :sm="16">
                        <img
                          src="../assets/icons/hukou.png"
                          style="padding: 20px; max-width: 100px"
                        />
                      </el-col>
                      <el-col
                        :offset="1"
                        :lg="5"
                        :md="5"
                        :sm="16"
                        style="padding: 0 20px; text-align: left"
                      >
                        <h4>婚姻状况认证</h4>
                        <!-- <span>认证学历信息， 点亮左侧图标</span> -->
                      </el-col>
                      <el-col :lg="3" :md="3" :sm="16" style="padding: 48px 0">
                        <el-button @click="uploadHousehold()">{{
                          checkStatus[userData.household_confirmed + 1]
                        }}</el-button>
                      </el-col>
                      <el-dialog
                        title="学历认证"
                        :visible.sync="householdDialogVisible"
                        width="300px"
                      >
                        <el-form>
                          <el-form-item>
                            <el-upload
                              :action="householdUploadUrl"
                              :headers="uploadHeaders"
                              accept="image/png, image/jpeg"
                              :limit="1"
                              :on-success="
                                (response, file) =>
                                  handleUploadSuccess(
                                    response,
                                    file,
                                    'household'
                                  )
                              "
                              :on-error="handleUploadError"
                              :before-upload="beforeHouseholdUpload"
                            >
                              <el-button size="small">点击上传文件</el-button>
                              <div slot="tip" class="el-upload__tip">
                                只能上传JPG/PNG文件，且不超过2M
                              </div>
                            </el-upload>
                          </el-form-item>
                        </el-form>
                      </el-dialog>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </section>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import { checkStatus } from "../data";

// const token = localStorage.getItem("dating-token");//在QQ浏览器里面这句话不执行
export default {
  name: "Verified",
  data() {
    return {
      checkStatus: checkStatus,
      loading: false,
      qrDialogVisible: false,
      householdDialogVisible: false,
      degreeDialogVisible: false,
      activeTab: "verify",
      qrImage: "",
      tabPosition: "left",
      sharedState: store.state,
      idDialogVisible: false,
      userData: {
        id: "",
        householdImageUploaded: "",
        degreeImageUploaded: "",
        id_confirmed: "",
        household_confirmed: "",
        degree_confirmed: "",
      },
      fileList: [],
      // idUploadUrl: this.$axios.defaults.baseURL + `/users/${store.state.user_id}/uploads/id`,
      idUploadUrl:
        this.$axios.defaults.baseURL +
        `/users/${store.state.user_id}/profile/idcard`,
      householdUploadUrl:
        this.$axios.defaults.baseURL +
        `/users/${store.state.user_id}/uploads/household`,
      degreeUploadUrl:
        this.$axios.defaults.baseURL +
        `/users/${store.state.user_id}/uploads/degree`,
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem("dating-token")}`,
      },
    };
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.userData.id_confirmed = response.data.id_confirmed;
          this.userData.household_confirmed = response.data.household_confirmed;
          this.userData.degree_confirmed = response.data.degree_confirmed;
          this.userData.householdImageUploaded =
            response.data.household_image_uploaded;
          this.userData.degreeImageUploaded =
            response.data.degree_image_uploaded;
          this.userData.id = response.data.id;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    uploadDegree() {
      if (this.userData.degree_confirmed == 2)
        this.$message.success("已认证通过");
      else if (this.userData.degree_confirmed == 1)
        this.$message.success("已上传，请等待管理员审核");
      else this.degreeDialogVisible = true;
    },
    uploadHousehold() {
      if (this.userData.household_confirmed == 2)
        this.$message.success("已认证通过");
      else if (this.userData.household_confirmed == 1)
        this.$message.success("已上传，请等待管理员审核");
      else this.householdDialogVisible = true;
    },
    /* uploadZhengmian() {
      if (this.userData.id_confirmed == 2) this.$message.success("已认证通过");
      else if (this.userData.id_confirmed == 1)
        this.$message.success("已上传，请等待管理员审核");
      else this.idDialogVisible = true;
    }, */
    startVerify() {
      //this.loading = true
      const id = this.sharedState.user_id;
      this.idDialogVisible = true;
      // const path = `/users/${id}/setting/verify/start`
      // this.$axios
      //     .get(path)
      //     .then(response => {
      //         this.loading = false
      //         if(response.data.code==0){
      //             this.qrImage = response.data.data.qrcode_url
      //             this.qrDialogVisible = true
      //         }
      //     })
      //     .catch(error => {
      //         console.error(error)
      //         this.loading = false
      //     })
    },
    uploadImage(type) {
      // 暂未使用
      const id = this.sharedState.user_id;
      var path = "";
      if (type === "household") {
        path = `/users/${id}/uploads/household`;
      } else {
        path = `/users/${id}/uploads/degree`;
      }
      const formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      this.$axios
        .post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }.bind(this),
        })
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    },
    handleUploadSuccess(res, file, type) {
      this.householdDialogVisible = false;
      this.degreeDialogVisible = false;
      if (type == "household") {
        this.$message.success("上传成功！请等待管理员审核。");
        this.userData.household_confirmed = 1;
      } else if (type == "degree") {
        this.$message.success("上传成功！请等待管理员审核。");
        this.userData.degree_confirmed = 1;
        console.log(this.userData.degree_confirmed);
      } else {
        // 如果是上传身份证
        if (res.toString().includes("已完成")) {
          this.$message.success("上传成功！");
          this.userData.id_confirmed = true;
        } else {
          this.$message.success("认证失败！");
          this.userData.id_confirmed = 1;
          this.fileList = []; //清空上传列表，避免不能继续上传身份证
        }
        this.idDialogVisible = false;
      }
    },
    handleUploadError(err, file) {
      this.$message.error("上传失败，请稍后重试。");
      console.log(err);
      this.householdDialogVisible = false;
      this.degreeDialogVisible = false;
    },
    beforeIdCardUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    beforeDegreeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (this.userData.degree_confirmed == 1) {
        this.$message.error("您已上传过图片，请等待管理员审核!");
        return false;
      } else if (this.userData.degree_confirmed == 2) {
        this.$message.error("您已审核通过，无需上传");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    beforeHouseholdUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (this.userData.household_confirmed == 1) {
        this.$message.error("您已上传过图片，请等待管理员审核!");
        return false;
      } else if (this.userData.household_confirmed == 2) {
        this.$message.error("您已审核通过，无需上传");
        return false;
      }

      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
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
    changeActiveTab(name) {
      this.activeTab = name;
    },
  },
  created() {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id;
    this.getUser(user_id);
    const hash = this.$route.hash.substr(1);
    if (hash) {
      this.activeTab = this.$route.hash.substr(1);
    }
    if (this.isMobile()) {
      this.tabPosition = "top";
    }
  },
};
</script>

<style scoped>
.editMain {
  max-width: 1160px;
  margin: 0 auto;
}
.dialog {
  max-width: 400px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.my-verift {
  /* margin-left: 20px !important; */
  padding: 0 20px;
}
</style>
