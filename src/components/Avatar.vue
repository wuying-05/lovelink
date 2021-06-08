<template>
  <section v-loading="pageLoading">
    <el-row>
      <el-col :offset="1" :span="22">
        <el-card>
          <div slot="header" style="text-align: center">
            <span>我的相册</span>
            <el-popover
              style="margin-left: 36px"
              placement="top-start"
              title="上传头像的注意事项"
              width="200"
              trigger="hover"
            >
              <div>1. 使用清晰的单人正面近照</div>
              <div>2. 照片为包括本人完整五官的近期照片</div>
              <div>
                3. 不能使用涉黄、涉政、公众照、网络照以及含联系方式的照片
              </div>
              <el-button size="small" slot="reference">照片上传说明</el-button>
            </el-popover>
          </div>
          <div>
            <span>我的头像</span>
            <!-- 显示裁剪后的图片 -->
            <p class="avatar">
              <img class="avatar-img" :src="avatarFile" alt="头像" />
            </p>
            <div>
              <!-- element 上传图片按钮 -->
              <el-upload
                class="upload-box"
                action=""
                drag
                :auto-upload="false"
                :show-file-list="false"
                :on-change="avatarUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传新头像</div>
                <div class="el-upload__tip">
                  支持JPG/PNG格式，单张图片最大支持2MB
                </div>
              </el-upload>
              <!-- vueCropper 剪裁图片实现-->
              <el-dialog
                title="图片剪裁"
                :visible.sync="avatarDialogVisible"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                append-to-body
              >
                <div class="cropper-content">
                  <div class="cropper" style="text-align: center">
                    <vueCropper
                      ref="cropper"
                      :img="option.img"
                      :outputSize="option.size"
                      :outputType="option.outputType"
                      :info="true"
                      :canScale="option.canScale"
                      :autoCrop="option.autoCrop"
                      :autoCropWidth="option.autoCropWidth"
                      :autoCropHeight="option.autoCropHeight"
                      :fixedBox="option.fixedBox"
                      :fixed="option.fixed"
                      :fixedNumber="option.fixedNumber"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :original="option.original"
                      :centerBox="option.centerBox"
                      :infoTrue="option.infoTrue"
                      :full="option.full"
                      :enlarge="option.enlarge"
                      :mode="option.mode"
                    >
                    </vueCropper>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="avatarDialogVisible = false"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="finishAvatarCrop"
                    :loading="cropLoading"
                    >确认</el-button
                  >
                </div>
              </el-dialog>
            </div>
            <el-divider></el-divider>
            <div style="padding: 0 0 18px">
              <span>我的相册</span>
            </div>
            <small v-if="photosUrl[0] === undefined"
              >暂无已上传图片。<br /><br
            /></small>
            <el-row style="padding: 20px 0" v-else>
              <el-col
                :lg="6"
                :md="8"
                :sm="12"
                :xs="24"
                v-for="photo in photosUrl"
                :key="photo.id"
                style="padding: 10px"
              >
                <el-card :body-style="{ padding: '10px' }">
                  <div style="text-align: center">
                    <el-image
                      :src="photo"
                      style="width: 180px; height: 160px; object-fit: cover"
                      :preview-src-list="photosUrl"
                    ></el-image>
                  </div>
                  <div class="bottom clearfix">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      class="button left"
                      @click="deletePhoto(photo)"
                      >删除</el-button
                    >
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div v-if="photosUrl.length !== 5">
              <!-- element 上传图片按钮 -->
              <el-upload
                class="upload-box"
                action=""
                drag
                :auto-upload="false"
                :show-file-list="false"
                :on-change="photoUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传新照片</div>
                <div class="el-upload__tip">
                  支持JPG/PNG格式，单张图片最大支持2MB
                </div>
              </el-upload>
              <!-- vueCropper 剪裁图片实现-->
              <el-dialog
                title="图片剪裁"
                :visible.sync="photoDialogVisible"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                append-to-body
              >
                <div class="cropper-content">
                  <div class="cropper" style="text-align: center">
                    <vueCropper
                      ref="cropper"
                      :img="option.img"
                      :outputSize="option.size"
                      :outputType="option.outputType"
                      :info="true"
                      :canScale="option.canScale"
                      :autoCrop="option.autoCrop"
                      :autoCropWidth="photoCropOption.autoCropWidth"
                      :autoCropHeight="photoCropOption.autoCropHeight"
                      :minCropBoxHeight="180"
                      :minCropBoxWdith="180"
                      :fixedBox="option.fixedBox"
                      :fixed="photoCropOption.fixed"
                      :fixedNumber="photoCropOption.fixedNumber"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :original="option.original"
                      :centerBox="photoCropOption.centerBox"
                      :infoTrue="option.infoTrue"
                      :full="photoCropOption.full"
                      :enlarge="option.enlarge"
                      :mode="option.mode"
                    >
                    </vueCropper>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="photoDialogVisible = false"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="finishPhotoCrop"
                    :loading="cropLoading"
                    >确认</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import store from "../store";
import { VueCropper } from "vue-cropper";
export default {
  name: "Avatar",
  components: { VueCropper },
  data() {
    return {
      sharedState: store.state,
      ossUrl: store.ossUrl,
      avatarFile: "",
      // photos: [],
      photosUrl: [],
      avatarDialogVisible: false,
      photoDialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        info: false, // 裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 180, // 默认生成截图框宽度
        autoCropHeight: 180, // 默认生成截图框高度
        minCropBoxWidth: 180,
        minCropBoxHeight: 180,
        // limitMinSize: [180, 180],
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        full: false, // 是否输出原图比例的截图
        enlarge: "1", // 图片根据截图框输出比例倍数
        mode: "contain", // 图片默认渲染方式
      },
      photoCropOption: {
        full: true, // 是否输出原图比例的截图
        fixed: true, // 是否开启截图框宽高固定比例
        centerBox: true, // 截图框是否被限制在图片里面
        fixedNumber: [4, 3], // 截图框的宽高比例
        autoCropWidth: 800, // 默认生成截图框宽度
        autoCropHeight: 600, // 默认生成截图框高度
      },
      // 防止重复提交
      cropLoading: false,
      pageLoading: false,
      imageUrl: "",
      dialogImageUrl: "",
      userAvatar: undefined,
      modifyDialog: false,
    };
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}/profile/image`;
      this.$axios
        .get(path)
        .then((response) => {
          var avatarFilename = "";
          var i;
          if (response.data.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.avatar;
          }
          this.avatarFile = this.ossUrl + `/avatars/${avatarFilename}`;
          // this.photos = response.data.photos
          for (i in response.data.photos) {
            this.photosUrl.push(
              this.ossUrl + `/photos/${response.data.photos[i]}`
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 上传按钮 限制图片大小
    avatarUpload(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过10MB!");
        return false;
      }
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        this.avatarDialogVisible = true;
      });
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finishAvatarCrop() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        this.cropLoading = true;

        // 把图片上传到服务器
        const id = this.sharedState.user_id;
        var path = `/users/${id}/profile/avatar`;
        const formData = new FormData();
        formData.append("file", data);
        this.$axios
          .put(path, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            // onUploadProgress: function (progressEvent) {
            //     this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            // }.bind(this)
          })
          .then((response) => {
            this.cropLoading = false;
            this.avatarDialogVisible = false;
            this.avatarFile =
              this.ossUrl + `/avatars/${response.data.avatarFilename}`;
            this.$message({
              message: "头像已更新！",
              type: "success",
            });
          })
          .catch((error) => {
            this.cropLoading = false;
            this.avatarDialogVisible = false;
            this.$message({
              message: "头像上传失败，请稍后再试！",
              type: "error",
            });
            console.error(error);
          });
      });
    },
    photoUpload(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过2MB!");
        return false;
      }

      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        this.photoDialogVisible = true;
      });
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finishPhotoCrop() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        this.cropLoading = true;

        // 把图片上传到服务器
        const id = this.sharedState.user_id;
        var path = `/users/${id}/profile/photos`;
        const formData = new FormData();
        formData.append("file", data);
        this.$axios
          .post(path, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.cropLoading = false;
            this.photoDialogVisible = false;
            this.photosUrl.push(
              this.ossUrl + `/photos/${response.data.photoFilename}`
            );
            this.$message({
              message: "图片已上传！",
              type: "success",
            });
          })
          .catch((error) => {
            this.cropLoading = false;
            this.photoDialogVisible = false;
            this.$message({
              message: "图片上传失败，请稍后再试！",
              type: "error",
            });
            console.error(error);
          });
      });
    },
    deletePhoto(url) {
      this.pageLoading = true;
      var filename = url.split("/").slice(-1)[0];
      const path = `/photos/${filename}`;
      this.$axios
        .delete(path)
        .then((response) => {
          this.pageLoading = false;
          this.$message.success("图片删除成功。");
          // var v = this.$axios.defaults.baseURL + `/photos/${filename}`
          this.photosUrl.splice(this.photosUrl.indexOf(url), 1);
        })
        .catch((error) => {
          this.pageLoading = false;
          this.$message.error("删除失败，请稍后再试！");
          console.error(error);
        });
    },
  },
  created() {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id;
    this.getUser(user_id);
  },
};
</script>
<style scoped>
.avatar-img {
  width: 180px;
  height: 180px;
  border: 1px solid #cccccc;
}
/* 截图 */
/* .cropper-content {} */
.cropper {
  width: auto;
  height: 600px;
}
.editMain {
  max-width: 1160px;
  margin: 0 auto;
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
</style>
