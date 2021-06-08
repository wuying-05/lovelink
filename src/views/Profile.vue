/* eslint-disable no-unused-vars */
<template>
<!-- 推荐 -->
  <el-container>
    <el-main class="editMain" v-loading="loading">
      <el-row style="margin-top: 48px">
        <el-tabs :tab-position="tabPosition">
          <el-tab-pane label="基本信息">
            <section class="personal">
              <el-row>
                <el-col :offset="1" :span="22">
                  <el-card :body-style="{ padding: '36px 10px 24px 12px' }">
                    <div slot="header" style="text-align: center">基本信息</div>
                    <el-col>
                      <el-form
                        :rules="rules"
                        :model="basicForm"
                        label-width="100px"
                        ref="basicForm"
                        :inline="true"
                        style="margin-top: 20px"
                      >
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="用户昵称" prop="name">
                              <el-input
                                class="form-item-input"
                                v-model="basicForm.name"
                              ></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="性别" prop="gender">
                              <div class="form-item-tips">
                                <el-select
                                  class="form-item-input"
                                  placeholder="请选择性别"
                                  v-model="basicForm.gender"
                                  :disabled="basicForm.gender_updated"
                                >
                                  <el-option
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    v-for="item in genderOptions"
                                  ></el-option>
                                </el-select>
                                <!-- <el-tooltip class="tooltip" effect="dark" content="性别仅可修改一次" placement="top-end">
																			<i class="el-icon-warning"></i>
																		</el-tooltip> -->
                                <span style="color: red">只能修改一次</span>
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="生日" prop="birthday">
                              <div class="form-item-tips">
                                <el-date-picker
                                  prefix-icon="none"
                                  v-model="basicForm.birthday"
                                  :disabled="basicForm.birthday_updated"
                                  type="date"
                                  placeholder="选择出生日期"
                                  :picker-options="pickerOptions"
                                  value-format="yyyy-MM-dd"
                                  style="width: 200px"
                                >
                                </el-date-picker>
                                <!-- <el-tooltip class="tooltip" effect="dark" content="生日仅可修改一次" placement="top-end">
																			<i class="el-icon-warning"></i>
																		</el-tooltip> -->
                                <span style="color: red">只能修改一次</span>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="身高" prop="height">
                              <div class="form-item-tips">
                                <el-select
                                  class="form-item-input"
                                  placeholder="请选择身高"
                                  v-model="basicForm.height"
                                  :disabled="basicForm.height_updated"
                                >
                                  <el-option
                                    :key="item"
                                    :label="item + 130 + '厘米'"
                                    :value="item + 130 + '厘米'"
                                    v-for="item in 99"
                                  ></el-option>
                                </el-select>
                                <!-- <el-tooltip class="tooltip" effect="dark" content="身高仅可修改一次" placement="top-end">
																			<i class="el-icon-warning"></i>
																		</el-tooltip> -->
                                <span style="color: red">只能修改一次</span>
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="婚姻状况" prop="marriage">
                              <div class="form-item-tips">
                                <el-select
                                  placeholder="请选择婚姻状况"
                                  v-model="basicForm.marriage"
                                  :disabled="basicForm.marriage_updated"
                                  style="width: 200px"
                                >
                                  <el-option
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    v-for="item in marriageOptions"
                                  ></el-option>
                                  <!-- <el-option label="未婚" value="0"></el-option>
																			<el-option label="离异" value="1"></el-option>
																			<el-option label="丧偶" value="2"></el-option> -->
                                </el-select>
                                <span style="color: red">只能修改一次</span>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="学历" prop="degree">
                              <el-select
                                class="form-item-input"
                                placeholder="请选择您的真实学历"
                                v-model="basicForm.degree"
                              >
                                <el-option
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  v-for="item in degreeOptions.slice(1, 6)"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="家乡" prop="residence">
                              <div class="form-item-tips sg-mobile-cascader-pc-width">
                                <el-cascader
                                  popper-class="sg-mobile-cascader "
                                  :options="cityOptions"
                                  size="large"
                                  v-model="basicForm.residence"
                                  :disabled="basicForm.residence_updated"
                                ></el-cascader>
                                <!-- <el-tooltip class="tooltip" effect="dark" content="家乡仅可修改一次" placement="top-end">
																			<i class="el-icon-warning"></i>
																		</el-tooltip> -->
                                <span class="sg-mobile-only-one-time" style="color: red">只能修改一次</span>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="工作地" prop="location">
                              <el-cascader
                                popper-class="sg-mobile-cascader"
                                :disabled="basicForm.location_updated"
                                class="form-item-input"
                                :options="cityOptions"
                                size="large"
                                v-model="basicForm.location"
                              ></el-cascader>
                              <span class="sg-mobile-only-one-time" style="color: red">只能修改一次</span>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="职业" prop="job">
                              <!-- <el-input placeholder="请选择您的职业" v-model="basicForm.job"></el-input> -->
                              <!-- <el-select v-model="basicForm.job" placeholder="请选择您的职业">
																		<el-option
																			:key="item.value"
																			:label="item.label"
																			:value="item.value"
																			v-for="item in jobOptions"
																		></el-option>
																	</el-select> -->
                              <el-cascader
                                class="form-item-input"
                                :options="jobOptions"
                                size="large"
                                v-model="basicForm.job"
                              ></el-cascader>
                            </el-form-item>
                          </el-col>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="月收入" prop="salary">
                              <!-- <el-select
																		placeholder="选择真实的月收入"
																		v-model="basicForm.salary"
																	>
																		<el-option
																			:key="item.value"
																			:label="item.label"
																			:value="item.value"
																			v-for="item in salaryOptions"
																		></el-option>
																	</el-select> -->
                              <el-input
                                placeholder="请输入月收入(元)"
                                class="form-item-input"
                                v-model="basicForm.salary"
                                type="number"
                                @input="handleSalaryInput"
                              >
                                <template slot="append">元</template>
                              </el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :lg="12" :md="12" :sm="24">
                            <el-form-item label="微信号" prop="wechat">
                              <div class="form-item-input input-wechat">
                                <el-input
                                  placeholder="输入微信号"
                                  v-model="basicForm.wechat"
                                ></el-input>
                                <span class="tips">(可选填)</span>
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <!-- <el-form-item label="真实姓名" prop="realname">
                                                    <el-input v-model="basicForm.realname" placaholder="输入真实姓名"></el-input>
                                                </el-form-item> -->
                        <!-- <el-form-item label="年龄">
                                                    <el-input
                                                    v-model="basicForm.age"
                                                    :picker-options="pickerOptions"
                                                    disabled>
                                                    </el-input>
                                                </el-form-item> -->
                        <!-- <el-form-item label="（可选填）" prop="wechat">
													<el-input placeholder="输入微信号" style="visibility: hidden"></el-input>
												</el-form-item> -->
                        <!-- <el-form-item label="微信号" style="visibility: hidden">
                                                    <el-input placeholder="输入微信号"></el-input>
                                                </el-form-item> -->
                        <el-form-item
                          label="企业微信群二维码"
                          prop="wechatwork_group"
                          label-width="150px"
                        >
                          <!-- <el-input placeholder="输入企业微信群号" v-model="basicForm.wechatwork_group"></el-input> -->
                          <span v-if="wechatworkGroupUrl">
                            <img :src="wechatworkGroupUrl" width="200px" />
                            <el-upload
                              class="upload-demo"
                              :headers="uploadHeaders"
                              :action="qrcodeUploadUrl"
                              accept="image/png, image/jpeg"
                              :limit="1"
                              :on-success="handleUploadSuccess"
                              :on-error="handleUploadError"
                              :before-upload="beforeUpload"
                            >
                              <el-button size="small" type="primary"
                                >点击重新上传二维码</el-button
                              >
                              <div slot="tip" class="el-upload__tip" style="line-height:20px">
                                对外联系方式，请确保上传，只能上传jpg/png文件，且不超过500kb。可以请本人专属客服帮助上传。
                              </div>
                            </el-upload>
                          </span>
                          <el-upload
                            v-else
                            class="upload-demo"
                            drag
                            :headers="uploadHeaders"
                            :action="qrcodeUploadUrl"
                            accept="image/png, image/jpeg"
                            :limit="1"
                            :on-success="handleUploadSuccess"
                            :on-error="handleUploadError"
                            :before-upload="beforeUpload"
                          >
                            <i class="el-icon-upload"></i>
                            <!-- <div class="el-upload__text" v-if="basicForm.wechatwork_group"><em>点击重新上传二维码图片</em></div> -->
                            <div class="el-upload__text">
                              <em>点击上传二维码图片</em>
                            </div>
                            <div class="el-upload__tip" slot="tip">
                              只能上传jpg/png文件，且不超过500kb。可以请本人专属客服帮助上传。
                            </div>
                          </el-upload>
                        </el-form-item>
                        <el-form-item
                          label="我的心里话"
                          prop="bio"
                          style="text-align: center; width: 100%"
                        >
                          <el-input
                            type="textarea"
                            :rows="8"
                            :cols="70"
                            maxlength="200"
                            show-word-limit
                            v-model="basicForm.bio"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </el-col>
                    <div style="text-align: center">
                      <el-button
                        :plain="false"
                        @click="saveBasicForm('basicForm')"
                        type="primary"
                        >保存修改</el-button
                      >
                      <el-button
                        :plain="false"
                        @click="resetBasicForm('basicForm')"
                        type="primary"
                        >重置</el-button
                      >
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </section>
          </el-tab-pane>
          <el-tab-pane label="生活资料"><Life /></el-tab-pane>
          <el-tab-pane label="头像和相册"><Avatar /></el-tab-pane>
          <el-tab-pane label="我的爱好"><Hobby /></el-tab-pane>
          <el-tab-pane label="择偶意向"><Favour /></el-tab-pane>
        </el-tabs>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Hobby from "../components/Hobby";
import Life from "../components/Life";
import Favour from "../components/Favour";
import Avatar from "../components/Avatar";
// import marriageOptions from '../options'
import { regionData, CodeToText } from "element-china-area-data";
import {
  salaryOptions,
  degreeOptions,
  genderOptions,
  marriageOptions,
  jobOptions,
} from "../data";
import store from "../store";

// const token = localStorage.getItem("dating-token");//在QQ浏览器里面这句话不执行

export default {
  name: "Profile",
  components: { Hobby, Life, Favour, Avatar },
  data() {
    // 验证工资不可超过9位数
    const validateSalary = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的工资"));
      } else if (parseInt(value) >= 10e8) {
        callback(new Error("月收入不可超过9位数"));
      }

      callback();
    };

    return {
      inputmoney: "",
      is_Mobile: "",
      loading: false,
      sharedState: store.state,
      ossUrl: store.ossUrl,
      wechatworkGroupUrl: "",
      tabPosition: "left",
      qrcodeUploadUrl:
        this.$axios.defaults.baseURL +
        `/users/${store.state.user_id}/profile/wechatwork_group`,
      uploadHeaders: { Authorization: `Bearer ${localStorage.getItem("dating-token")}` },
      heightRange: Array(100).keys(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      basicForm: {
        name: "",
        gender: "",
        birthday: "",
        age: "",
        wechat: "",
        marriage: "",
        location: [],
        residence: [],
        salary: "",
        height: "",
        degree: "",
        job: "",
        bio: "",
        wechatwork_group: "",
        birthday_updated: false,
        gender_updated: false,
        height_updated: false,
        marriage_updated: false,
        residence_updated: false,
      },
      cityOptions: regionData,
      salaryOptions: salaryOptions,
      degreeOptions: degreeOptions,
      marriageOptions: marriageOptions,
      genderOptions: genderOptions,
      jobOptions: jobOptions,
      rules: {
        name: [{ required: true, message: "请输入你的昵称", trigger: "blur" }],
        gender: [
          { required: true, message: "请选择你的性别", trigger: "blur" },
        ],
        birthday: [
          { required: true, message: "请选择你的出生日期", trigger: "blur" },
        ],
        marriage: [
          { required: true, message: "请选择你的婚姻状况", trigger: "blur" },
        ],
        wechatwork_group: [
          {
            required: false,
            message: "请输入你的企业微信群号",
            trigger: "blur",
          },
        ],
        location: [
          { required: true, message: "请选择你的工作地", trigger: "blur" },
        ],
        residence: [
          { required: true, message: "请选择你的家乡", trigger: "blur" },
        ],
        salary: [{ validator: validateSalary, trigger: "change" }],
        degree: [
          { required: true, message: "请选择你的学历", trigger: "blur" },
        ],
        job: [{ required: true, message: "请输入你的工作", trigger: "blur" }],
        height: [
          { required: true, message: "请选择你的身高", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getUser(id) {
      this.loading = true;
      const path = `/users/${id}/profile/basic`;
      this.$axios
        .get(path)
        .then((response) => {
          this.inputmoney = response.data.salary;
          this.basicForm.salary = response.data.salary;
          this.basicForm.name = response.data.name;
          this.basicForm.birthday = response.data.birthday;
          this.basicForm.age = response.data.age;
          this.basicForm.gender = response.data.gender;
          this.basicForm.marriage = response.data.marriage;
          this.basicForm.salary = response.data.salary;
          this.basicForm.height = response.data.height + "厘米";
          this.basicForm.degree = response.data.degree;
          this.basicForm.bio = response.data.bio;
          this.basicForm.wechat = response.data.wechat;
          // this.basicForm.job = response.data.job ? response.data.job.split(',') : [];
          this.basicForm.job = response.data.job;
          this.basicForm.birthday_updated = response.data.birthday_updated;
          this.basicForm.gender_updated = response.data.gender_updated;
          this.basicForm.height_updated = response.data.height_updated;
          this.basicForm.marriage_updated = response.data.marriage_updated;
          this.basicForm.residence_updated = response.data.residence_updated;
          this.basicForm.location_updated = response.data.location_updated;
          this.basicForm.wechatwork_group = response.data.wechatwork_group;
          if (response.data.residence !== null) {
            this.basicForm.residence = response.data.residence.split(",");
          }
          if (response.data.location !== null) {
            this.basicForm.location = response.data.location.split(",");
          }
          this.copy_basicForm = JSON.parse(JSON.stringify(this.basicForm));
          if (response.data.wechatwork_group !== null) {
            this.wechatworkGroupUrl =
              this.ossUrl +
              `/wechatworkgroup/${response.data.wechatwork_group}`;
          }
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
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
    saveBasicForm(formName) {
      const thisform = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          // eslint-disable-next-line camelcase
          const user_id = this.sharedState.user_id;
          // eslint-disable-next-line camelcase
          const path = `/users/${user_id}/profile/basic`;
          const payload = {
            location: thisform.basicForm.location.toString(),
            location_cn: thisform.getCity(thisform.basicForm.location),
            residence: thisform.basicForm.residence.toString(),
            residence_cn: thisform.getCity(thisform.basicForm.residence),
            name: thisform.basicForm.name,
            gender: thisform.basicForm.gender,
            marriage: thisform.basicForm.marriage,
            birthday: thisform.basicForm.birthday,
            // salary: this.inputmoney,
            salary: thisform.basicForm.salary,
            degree: thisform.basicForm.degree,
            height: thisform.basicForm.height.slice(0, 3),
            job: thisform.basicForm.job,
            bio: thisform.basicForm.bio,
            wechat: thisform.basicForm.wechat ? thisform.basicForm.wechat : "",
            wechatwork_group: thisform.basicForm.wechatwork_group
              ? thisform.basicForm.wechatwork_group
              : "",
          };
          this.$axios
            .put(path, payload)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              this.$message({
                message: "基本资料已更新！",
                type: "success",
              });
              this.getUser(user_id);
              this.loading = false;
            })
            .catch((error) => {
              // handle error
              this.$message({
                message: "操作失败，请稍后重试。",
                type: "error",
              });
              this.loading = false;
              console.log(error.response);
            });
        }
      });
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
    handleUploadSuccess(res, file) {
      this.loading = false;
      this.$message.success("上传成功！");
      this.wechatworkGroupUrl =
        this.ossUrl + `/wechatworkgroup/${res.filename}`;
      this.basicForm.wechatwork_group = res.filename;
    },
    handleUploadError(err, file) {
      this.loading = false;
      this.$message.error("上传失败，请稍后重试。");
      console.log(err);
    },
    beforeUpload(file) {
      this.loading = true;
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG && !isPNG) {
      //     this.$message.error('上传图片只能是 JPG/PNG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    resetBasicForm() {
      // 重置表单
      this.basicForm = JSON.parse(JSON.stringify(this.copy_basicForm));
      this.wechatworkGroupUrl = null;
    },
    /**
     * 输入月收入时
     */
    handleSalaryInput(salary) {
      if (salary > 10e8) {
        this.basicForm.salary = salary.slice(0, 9);
      }
    },
  },
  created() {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id;
    this.getUser(user_id);
    if (this.isMobile()) {
      this.tabPosition = "top";
      this.is_Mobile = "mobile_style";
    } else {
      this.is_Mobile = "";
    }
  },
};
</script>

<style>
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
.input {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
}
.form-item-input {
  width: 260px;
}
.input-wechat {
  display: flex;
  align-items: center;
}
.input-wechat .tips {
  margin-left: 4px;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.65);
}
.form-item-tips {
  position: relative;
  display: flex;
  align-items: center;
  width: 260px;
}
.form-item-tips span {
  margin-left: 4px;
  flex-shrink: 0;
  color: red;
}
/* .form-item-tips {
	position: relative;
	width: 200px;
	display: flex;
	align-items: center;
}
.form-item-tips span {
	position: absolute;
	right: -88px;
} */
.form-item-tips .tooltip {
  margin-left: 8px;
}

.mobile_style {
  left: 0px !important;
}
.mobile_style .el-cascader-menu {
  min-width: 80px !important;
  max-width: 160px;
}
.form-item-tips span {
  color: #ccc;
}
.sg-mobile-cascader-pc-width input{
  width: 260px;
}
</style>

<style lang='scss'  >
@media (max-width: 700px) {
  /* 三级联动菜单的宽度调整 */
  .sg-mobile-cascader {

    .el-cascader-menu,
    .el-scrollbar__wrap,
    .el-cascader-menu__list {
      min-width: initial !important;
      width: 120px;
    }
  }
  .sg-mobile-only-one-time{
    position: absolute;
    top: 33px;
    left: 0;
  }
}
</style>