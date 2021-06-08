<template>
  <section>
    <el-row>
      <el-col :offset="1" :span="22">
        <el-card>
          <div slot="header" style="text-align: center">
            <span>设置可见条件</span>
          </div>
          <el-form
            :model="form1"
            label-width="85px"
            ref="form1"
            style="margin-top: 16px"
          >
            <el-row>
              <el-form-item
                ><div class="sg-mobile-head-title">
                  请设置您联系方式(其为您的企业微信群二维码)的可见条件，只有符合条件的会员可见您的联系方式。
                </div></el-form-item
              >
            </el-row>
            <!--                        <el-row style="text-align: center">-->
            <!--                            <el-form-item v-bind:label="stateText">-->
            <!--                                <div style="text-align: left;">-->
            <!--                                    <el-switch-->
            <!--                                      v-model="form1.isopen"-->
            <!--                                      active-color="#13ce66"-->
            <!--                                      inactive-color="#ff4949">-->
            <!--                                    </el-switch>-->
            <!--                                </div>-->
            <!--                            </el-form-item>-->
            <!--                        </el-row>-->

            <el-row v-if="form1.isopen">
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="年龄">
                  <el-col :span="6">
                    <el-select class="sg-mobile-select" v-model="form1.start_age" clearable>
                      <el-option label="不限" :value="0"></el-option>
                      <el-option
                        :key="item"
                        :value="item"
                        :label="item + '岁'"
                        v-for="item in 69"
                        v-if="item > 21"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col class="line sg-mobile-to" :span="2" style="text-align: center"
                    >到</el-col
                  >
                  <el-col :span="6">
                    <el-select class="sg-mobile-select" v-model="form1.end_age" clearable>
                      <el-option label="不限" :value="0"></el-option>
                      <el-option
                        :key="item"
                        :value="item"
                        :label="item + '岁'"
                        v-for="item in 69"
                        v-if="item > 21"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="身高">
                  <el-col :span="6">
                    <el-select class="sg-mobile-select" v-model="form1.start_height" clearable>
                      <el-option label="不限" :value="0"></el-option>
                      <el-option
                        :key="item"
                        :label="item + 129 + '厘米'"
                        :value="item + 129"
                        v-for="item in 98"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col class="line sg-mobile-to" :span="2" style="text-align: center"
                    >到</el-col
                  >
                  <el-col :span="6">
                    <el-select class="sg-mobile-select" v-model="form1.end_height" clearable>
                      <el-option label="不限" :value="0"></el-option>
                      <el-option
                        :key="item"
                        :label="item + 130 + ' 厘米'"
                        :value="item + 129"
                        v-for="item in 98"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form1.isopen">
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="婚姻状况">
                  <el-select v-model="form1.marriage" multiple clearable>
                    <el-option label="不限" value=""></el-option>
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-for="item in marriageOptions"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="学历">
                  <el-select v-model="form1.degree" multiple clearable>
                    <!-- <el-option label="不限" value="5"></el-option> -->
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-for="item in degreeOptions"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form1.isopen">
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="是否带小孩">
                  <el-select v-model="form1.children" multiple clearable>
                    <el-option label="不限" value=""></el-option>
                    <el-option label="没有小孩" value="1"></el-option>
                    <el-option label="小孩不住一起" value="2"></el-option>
                    <el-option label="小孩住一起" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="购房情况">
                  <el-select v-model="form1.house" multiple clearable>
                    <el-option label="不限" value=""></el-option>
                    <el-option label="租房" value="1"></el-option>
                    <el-option label="住公司" value="2"></el-option>
                    <el-option label="和家人同住" value="3"></el-option>
                    <el-option label="已经购房" value="4"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form1.isopen">
              <el-col :lg="12" :md="12" :sm="24">
                <el-form-item label="是否有照片">
                  <el-select v-model="form1.picture" multiple clearable>
                    <el-option label="不限" value=""></el-option>
                    <el-option label="有照片" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align: center"
              ><el-button
                :plain="false"
                @click="saveForm1('form1')"
                type="primary"
                >保存修改</el-button
              ></el-row
            >
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { regionData } from "element-china-area-data";
import {
  salaryOptions,
  degreeOptions,
  genderOptions,
  marriageOptions,
  jobOptions,
} from "../data";
import store from "../store";
export default {
  name: "WxPrivicy",
  data() {
    return {
      stateText: "公开",
      sharedState: store.state,
      cityOptions: regionData,
      salaryOptions: salaryOptions,
      degreeOptions: degreeOptions,
      marriageOptions: marriageOptions,
      genderOptions: genderOptions,
      jobOptions: jobOptions,
      form1: {
        userid: -1,
        isopen: true,
        start_age: null,
        end_age: null,
        start_height: null,
        end_height: null,
        salary: [],
        degree: [],
        location: [],
        residence: [],
        house: [],
        car: [],
        marriage: [],
        children: [],
        drink: [],
        smoke: [],
        picture: [],
        whenMarry: [],
      },
    };
  },
  methods: {
    getWxprivicy(id) {
      const path = `/users/${id}/setting/getWxprivicy`;
      this.$axios
        .get(path)
        .then((response) => {
          this.form1.start_age = response.data.start_age || 0;
          this.form1.end_age = response.data.end_age || 0;
          this.form1.start_height = response.data.start_height || 0;
          this.form1.end_height = response.data.end_height || 0;
          if (!response.data.salary)
            this.form1.salary = response.data.salary.split(",");
          if (!response.data.degree) {
            this.form1.degree = [""];
          } else {
            this.form1.degree = response.data.degree.split(",");
          }
          if (!response.data.house) {
            this.form1.house = [""];
          } else {
            this.form1.house = response.data.house.split(",");
          }
          if (!response.data.car) {
            this.form1.car = [""];
          } else {
            this.form1.car = response.data.car.split(",");
          }
          if (!response.data.marriage) {
            this.form1.marriage = [""];
          } else {
            this.form1.marriage = response.data.marriage.split(",");
          }
          if (response.data.residence !== null) {
            this.form1.residence = response.data.residence.split(",");
          }
          if (response.data.location !== null) {
            this.form1.location = response.data.location.split(",");
          }
          if (!response.data.children) {
            this.form1.children = [""];
          } else {
            this.form1.children = response.data.children.split(",");
          }
          if (!response.data.drink)
            this.form1.drink = response.data.drink.split(",");
          if (!response.data.smoke)
            this.form1.smoke = response.data.smoke.split(",");
          if (!response.data.picture) {
            this.form1.picture = [""];
          } else {
            this.form1.picture = response.data.picture.split(",");
          }
          if (!response.data.whenMarry) {
            this.form1.whenMarry = [""];
          } else {
            this.form1.whenMarry = response.data.whenMarry.split(",");
          }
        })
        .catch((error) => {
          console.error("wx log", error);
        });
    },
    saveForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const user_id = this.sharedState.user_id;
          const path = `/users/${user_id}/setting/setWxprivicy`;
          const payload = {
            userid: this.form1.userid,
            isopen: this.form1.isopen ? 1 : 0,
            start_age: this.form1.start_age || 0,
            end_age: this.form1.end_age || 0,
            start_height: this.form1.start_height || 0,
            end_height: this.form1.end_height || 0,
            salary: this.form1.salary.join(","),
            degree: this.form1.degree.join(","),
            house: this.form1.house.join(","),
            car: this.form1.car.join(","),
            marriage: this.form1.marriage.join(","),
            residence: this.form1.residence.toString(),
            location: this.form1.location.toString(),
            children: this.form1.children.join(","),
            drink: this.form1.drink.join(","),
            smoke: this.form1.smoke.join(","),
            picture: this.form1.picture.join(","),
            whenMarry: this.form1.whenMarry.join(","),
          };
          this.$axios
            .put(path, payload)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // handle success
              this.$message({
                message: "资料已更新！",
                type: "success",
              });
              this.getWxprivicy(this.sharedState.user_id);
            })
            .catch((error) => {
              // handle error, 400 and 500
              console.log("error!", error.response);
            });
        }
      });
    },
  },
  created() {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id;
    this.form1.userid = user_id;
    this.getWxprivicy(user_id);
  },
  watch: {
    "form1.isopen"(val) {
      if (val) this.stateText = "公开";
      else this.stateText = "不公开";
    },
  },
};
</script>
<style>
.el-col-10 {
  width: auto !important;
}
@media screen and (max-width: 800px) {
  .sg-mobile-head-title {
    /*当宽度<800px的样式*/
    margin-left: -90px;
    line-height: 20px;
  }
  .sg-mobile-to{
    /* height: 30px;
    width: 90px; */
    margin-left: 40px;
	margin-right: 5px;
  }
  .sg-mobile-select{
	  width: 80px;
  }
}
</style>
