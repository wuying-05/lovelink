<template>
  <!-- 推荐设置 -->
  <section class="setRecommend">
    <el-row>
      <el-col :offset="1" :span="22">
        <el-card>
          <div slot="header" style="text-align: center">设置推荐条件</div>
          <el-form
            :disabled="times >= maxTimes"
            :model="recommendForm"
            label-position="top"
            ref="recommendForm"
            style="margin-top: 16px; text-align: left"
          >
            <!-- <el-form-item label="同省">
              <el-checkbox v-model="recommendForm.residence" label="家乡同省" border size="medium"></el-checkbox>
              <br />
              <el-checkbox v-model="recommendForm.location" label="工作同省" border size="medium"></el-checkbox>
            </el-form-item>-->
            <!-- <el-form-item label="年龄">
                            <el-checkbox-group v-model="recommendForm.age" :max="1">
                                <el-checkbox label="5" border size="medium">上下5岁</el-checkbox><br>
                                <el-checkbox label="10" border size="medium">上下10岁</el-checkbox>
                            </el-checkbox-group>
            </el-form-item>-->
            <el-form-item label="年龄">
              <el-col :span="10">
                <el-select v-model="recommendForm.startAge" class="age-select">
                  <el-option label="不限" value=""></el-option>
                  <el-option
                    :key="item"
                    :label="item + 19 + '岁'"
                    :value="item + 19"
                    v-for="item in 60"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col
                class="line"
                :span="2"
                style="
                  text-align: center;
                  padding-left: 5px;
                  padding-right: 5px;
                "
                >到</el-col
              >
              <el-col :span="10">
                <el-select v-model="recommendForm.endAge" class="age-select">
                  <el-option label="不限" value=""></el-option>
                  <el-option
                    :key="item"
                    :label="item + 19 + '岁'"
                    :value="item + 19"
                    v-for="item in 60"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="身高">
              <el-col :span="10">
                <el-select
                  v-model="recommendForm.startHeight"
                  class="height-select"
                >
                  <el-option label="不限" value=""></el-option>
                  <el-option
                    :key="item"
                    :label="item + 129 + ' 厘米'"
                    :value="item + 129"
                    v-for="item in 98"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center"
                >到</el-col
              >
              <el-col :span="10">
                <el-select
                  v-model="recommendForm.endHeight"
                  class="height-select"
                >
                  <el-option label="不限" value=""></el-option>
                  <el-option
                    :key="item"
                    :label="item + 129 + ' 厘米'"
                    :value="item + 129"
                    v-for="item in 98"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="学历">
              <el-checkbox-group
                v-model="recommendForm.degree"
                v-for="item in degreeOptions"
                v-bind:key="item.value"
              >
                <el-checkbox
                  border
                  size="medium"
                  :label="item.value"
                  :key="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="婚姻状况">
              <el-checkbox-group v-model="recommendForm.marriage" :max="1">
                <el-checkbox label="" value border size="medium"
                  >不限</el-checkbox
                >
                <br />
                <el-checkbox label="1" border size="medium">未婚</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="家乡">
              <div style="text-align: left">
                <el-cascader
                  :options="cityOptions"
                  size="large"
                  v-model="recommendForm.residence"
                ></el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="工作地">
              <div id style="text-align: left">
                <el-cascader
                  :options="cityOptions"
                  size="large"
                  v-model="recommendForm.location"
                ></el-cascader>
              </div>
            </el-form-item>

            <!-- <el-form-item label="爱好">
              <el-checkbox v-model="recommendForm.hobby" label="爱好相近" border size="medium"></el-checkbox>
            </el-form-item>-->
            <div>
              <span style="text-decoration: underline">{{
                userData.name
              }}</span>
              会员
              <span style="text-decoration: underline">{{ product.name }}</span>
              套餐 推荐开始于： {{ product.startTime }} 结束于：
              {{ product.endTime }}
            </div>
            <div style="text-align: center; margin: 20px 0">
              <el-button
                :plain="false"
                :disabled="userData.is_vip === false"
                @click="saveRecommendForm('recommendForm')"
                type="primary"
                >保存</el-button
              >
              <!-- <el-button
                :plain="false"
                @click="saveRecommendForm('recommendForm')"
                type="primary"
              >保存修改</el-button>-->
              <br />
              <p style="color: red; font-size: 14px">
                提示：修改各项条件后，最多可以保存{{ maxTimes }}次修改结果({{
                  maxTimes > times
                    ? "您还可以保存" + (maxTimes - times) + "次"
                    : "已到" + maxTimes + "次"
                }})
                <!-- 提示：修改各项条件后，最多可以保存3次修改结果。 -->
              </p>
              <br />
              <p
                v-if="userData.is_vip === false"
                @click="changeActiveTab('member')"
              >
                <a href="#!">开通会员即可解锁推荐选项设置</a>
              </p>
              <!-- <el-button>重置</el-button> -->
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { degreeOptions } from "../data";
import { provinceAndCityDataPlus } from "element-china-area-data";
import store from "../store";
export default {
  name: "RecommendOption",
  props: ["changeActiveTab"],
  data() {
    return {
      times: 0, //修改了的次数
      //   thisTimes: 0, //本次修改是第几次=times+1
      maxTimes: 3, //最多修改次数
      degreeOptions: degreeOptions,
      sharedState: store.state,
      cityOptions: provinceAndCityDataPlus,
      userData: {
        name: "",
        is_vip: "",
      },
      product: {
        name: "",
        startTime: "",
        endTime: "",
      },
      recommendForm: {
        location: [],
        residence: [],
        // age: [],
        startAge: "",
        endAge: "",
        startHeight: "",
        endHeight: "",
        degree: [],
        hobby: "",
        marriage: [],
      },
    };
  },
  /* watch: {
    recommendForm: {
      handler(newval, oldval) {
        //   修改过
        this.thisTimes = this.times + 1;
      },
      deep: true,
    },
  }, */
  methods: {
    getTime(id) {
      const path = `/product/${id}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.product.startTime = response.data.startTime;
          this.product.endTime = response.data.endTime;
          this.product.name = response.data.name;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getUser(id) {
      // eslint-disable-next-line no-template-curly-in-string
      const path = `/users/${id}`;
      this.$axios
        .get(path)
        .then((response) => {
          this.userData.name = response.data.name;
          this.userData.is_vip = response.data.is_vip;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getData(id) {
      const path = `/users/${id}/setting/recommend`;
      this.$axios
        .get(path)
        .then((response) => {
          this.times = response.data.times;
          if (response.data.residence !== null) {
            this.recommendForm.residence = response.data.residence.split(",");
          } else {
            this.recommendForm.residence = [""];
          }
          if (response.data.location !== null) {
            this.recommendForm.location = response.data.location.split(",");
          } else {
            this.recommendForm.location = [""];
          }
          this.recommendForm.hobby = response.data.hobby;
          //   if (response.data.age !== null) {
          //     this.recommendForm.age = response.data.age.split();
          //   }
          this.recommendForm.startAge = parseInt(response.data.startAge) || "";
          this.recommendForm.endAge = parseInt(response.data.endAge) || "";
          this.recommendForm.startHeight =
            parseInt(response.data.startHeight) || "";
          this.recommendForm.endHeight =
            parseInt(response.data.endHeight) || "";
          if (response.data.degree !== null) {
            this.recommendForm.degree = response.data.degree.split(",");
          }
          if (response.data.marriage !== null) {
            this.recommendForm.marriage = response.data.marriage.split();
          }
          if (response.data.age === "") {
            this.recommendForm.age = [];
          }
          if (!response.data.degree) {
            this.recommendForm.degree = [""];
          }
          if (!response.data.marriage) {
            this.recommendForm.marriage = [""];
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    saveRecommendForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line camelcase
          const user_id = this.sharedState.user_id;
          // eslint-disable-next-line camelcase
          const path = `/users/${user_id}/setting/recommend`;
          const payload = {
            residence: this.recommendForm.residence.toString(),
            location: this.recommendForm.location.toString(),
            startAge: this.recommendForm.startAge,
            endAge: this.recommendForm.endAge,
            startHeight: this.recommendForm.startHeight,
            endHeight: this.recommendForm.endHeight,
            degree: this.recommendForm.degree.toString(),
            hobby: this.recommendForm.hobby,
            marriage: this.recommendForm.marriage.toString(),
            // times: this.thisTimes, //提交修改次数
          };
          this.$axios
            .put(path, payload)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // handle success
              this.$message({
                // message: "推荐条件设置已更新！",
                message: "推荐条件保存成功！",
                type: "success",
              });
              this.getData(user_id); //刷新数据
              //   this.times = this.thisTimes; //刷新实际修改次数
              // this.$router.push({
              //     name: 'Profile',
              //     params: { id: user_id }
              // })
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
    this.getUser(user_id);
    this.getData(user_id);
    this.getTime(user_id);
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
</style>
