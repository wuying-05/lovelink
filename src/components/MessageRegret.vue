<template>
  <!-- 推荐设置 -->
  <section class="setRecommend">
    <el-row>
	<div v-show="showNotice" style="background-color: #FFFFEB;border-color: #FDFBE8; width: 98%;line-height: 30px;font-size: 13px;text-align: center;border: 1px solid;">
		你的看信率:0%,低于全站平均水平,会影响每日收信数。请阅读异性给您的诚意来信。
		<div style="float: right;margin-right: 15px;font-size: 15px;margin-top: -2px;"
		@click="
		  hiddenNotice()
		"
		>x</div>
	</div>
	<div class="top">
		<div class="tabs">
			<div :class="[key == activeTab ? 'tab_active' : 'tab']" v-for="(value, key) in tabs" :key="key" @click="changeTab(key)">{{ value }}</div>
		</div>
	</div>
	<el-input  size="mini" class="search-input" placeholder="请输入对方昵称或ID" style="float: right;width: 35%;height: 30%;margin-top: -28px;font-size: 14px;">
		<el-button @click="searchUserWithId" icon="el-icon-search" slot="append" size="mini">搜索</el-button>
	</el-input>
	<div style="width: 100%;height: 1px;background-color: #F4F4F4;"></div>
		<div style="width: 98%;margin-left: 2%;margin-top: 1%;">
			<div style="float: left;height: 100px;width: 80px;"><img src="../assets/logo.png" style="width: 100%;height: 100%;"></div>
			<div style="padding-left: 9%;padding-top: 1%;color: #3399FF;font-size: 17px;font-weight: bold;">惊喜特惠</div>
			<div style="padding-left: 9%;padding-top: 1%;font-size: 15px;">信件一秒解锁,钻石会员助力脱单,现在开通立省250元</div>
			<div style="cursor:pointer;float: right;margin-right: 4%;margin-top: -1.5%;width: 90px;height: 35px;background-color: #3399FF;color: white;line-height: 35px;text-align: center;font-size: 14px;">点击查看</div>
			<div style="clear: both;"></div>
			<div style="width: 110%;height: 1px;background-color: #cccccc;margin-top: 3px;margin-left: -10%;"></div>
		</div>
		<div style="width: 98%;margin-left: 2%;margin-top: 1%;">
			<div style="float: left;height: 100px;width: 80px;"><img src="../assets/logo.png" style="width: 100%;height: 100%;"></div>
			<div style="padding-left: 9%;padding-top: 1%;color: #3399FF;font-size: 17px;font-weight: bold;">惊喜特惠</div>
			<div style="padding-left: 9%;padding-top: 1%;font-size: 15px;">信件一秒解锁,钻石会员助力脱单,现在开通立省250元</div>
			<div style="cursor:pointer;float: right;margin-right: 4%;margin-top: -1.5%;width: 90px;height: 35px;background-color: #3399FF;color: white;line-height: 35px;text-align: center;font-size: 14px;">点击查看</div>
			<div style="clear: both;"></div>
			<div style="width: 110%;height: 1px;background-color: #cccccc;margin-top: 3px;margin-left: -10%;"></div>
		</div>
    </el-row>
  </section>
</template>

<script>
import { degreeOptions } from "../data";
import { provinceAndCityDataPlus } from "element-china-area-data";
import store from "../store";
export default {
  name: "RecommendOption",
  props: [],
  data() {
    return {
      degreeOptions: degreeOptions,
      sharedState: store.state,
	  showNotice:true,
	  tabs: ['全部', '多次来信', '免费信', '按时间', '按条件'],
	  List: [],
	  activeTab: 0,
    };
  },
  methods: {
	  searchUserWithId(){
		  
	  },
		hiddenNotice(){
		  this.showNotice = false;
		},
		changeActiveTab (name) {
		    this.activeTab = name
		},
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
	changeTab(key) {
		console.log(key);
		if (this.activeTab !== key) {
			this.page = 1;
			this.activeTab = key;
			this.List = [];
		}
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
	cursor:pointer;
}

.tab_active {
	height: 140upx;
	margin-left: 5%;
	text-align: center;
	font-size: 14px;
	border-bottom-color: #FF7A8E;
	color: #FF7A8E;
	border-bottom: 2px solid;
	cursor:pointer;
}
</style>
