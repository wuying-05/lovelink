<template>
    <el-row style="padding:20px 0;">
        <el-col :lg="6" :md="8" :sm="12" :xs="24" v-for="(user, index) in usersData" :key="user.id" style="padding:10px;">
            <el-card :body-style="{ padding: '10px' }">
            <div style="text-align: center">
                <router-link :to="{ name: 'User', params: { id: user.id }}">
                    <img :src="require(`../assets/photos/${ user.avatar }`)" style="width: 228px; height: 160px; object-fit: cover">
                </router-link>
            </div>
            <div style="padding: 10px 0;">
                {{ user.name }}
                <img src="../assets/icons/shiming.png" style="padding-left: 10px;max-width: 28px;" v-if="user.id_confirmed"/>
                <img src="../assets/icons/hukou.png" style="padding-left: 10px;max-width: 30px;" v-if="user.household_confirmed"/>
                <img src="../assets/icons/xueli.png" style="padding-left: 10px;max-width: 30px;" v-if="user.degree_confirmed"/>
                <div style="height: 35px;">
                <el-tag class="tag" size="mini" effect="plain" type="danger">{{ user.age }}岁</el-tag>
                <el-tag class="tag" size="mini" effect="plain" type="danger">{{ user.height }}厘米</el-tag>
                <el-tag class="tag" size="mini" effect="plain" type="danger">{{ degreeData[user.degree] }}</el-tag>
                <el-tag class="tag" size="mini" effect="plain" type="danger">{{ jobData[user.job] }}</el-tag>
                <el-tag class="tag" size="mini" effect="plain" type="danger">{{ getCity(user.location.split(',')) }}</el-tag>
                </div>
            </div>
            <div class="bottom clearfix">
                    <el-button size="mini" type="info" icon="el-icon-star-on" class="button left"
                        v-if="user.followed_by_current_user"
                        @click="unFollow(user.id, index)"
                        >取消关注</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-star-off" class="button left"
                    v-else
                    @click="follow(user.id, index)"
                    :loading="followLoading && indexClicked  === index"
                    >关注</el-button>
                    <router-link :to="{ name: 'User', params: { id: user.id }}">
                        <el-button size="mini" type="primary" icon="el-icon-s-home" class="button right">主页</el-button>
                    </router-link>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import store from '../store'
import { regionDataPlus, CodeToText } from 'element-china-area-data'
import { jobData, salaryData, degreeData, marriageData, marriageOptions, degreeOptions, salaryOptions } from '../data'
export default {
    name: 'FollowUserCard',
    props: ['usersData', 'getFollowing', 'getMatchUsers'],
    data () {
        return {
            sharedState: store.state,
            followLoading: false,
            indexClicked: '',
            cityOptions: regionDataPlus,
            jobData: jobData,
            salaryData: salaryData,
            salaryOptions: salaryOptions,
            degreeData: degreeData,
            degreeOptions: degreeOptions,
            marriageOptions: marriageOptions,
            marriageData: marriageData
        }
    },
    methods: {
        getCity (location) {
            // eslint-disable-next-line no-unused-vars
            var province = CodeToText[location[0]]
            var city = CodeToText[location[1]]
            return province + '/' + city
        },
        follow (id, index) {
            this.followLoading = true
            this.indexClicked = index
            const path = `/users/me/followers/${id}`
            this.$axios
                .post(path)
                .then(response => {
                    this.usersData[index].followed_by_current_user = true
                    this.$message.success('已关注')
                    // todo 判断如果当前 route 是 follow 页面
                    this.getFollowing(this.sharedState.user_id)
                    this.getMatchUsers(this.sharedState.user_id)
                    this.followLoading = false
                })
                .catch(error => {
                    // eslint-disable-next-line
                    console.log(error)
                    this.followLoading = false
                })
        },
        unFollow (id, index) {
            const path = `/users/me/followers/${id}`
            this.$axios
                .delete(path)
                .then(response => {
                    this.usersData[index].followed_by_current_user = false
                    // todo 判断如果当前 route 是 follow 页面
                    this.getFollowing(this.sharedState.user_id)
                    this.getMatchUsers(this.sharedState.user_id)
                    this.$message.success('已取消关注')
                })
                .catch(error => {
                    // eslint-disable-next-line
                    console.log(error)
                })
        }
    },
    created () {
    }
}
</script>

<style scoped>
    .tag {
        margin: 2px;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .left {
        float: left;
    }

    .right {
        float: right;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .grey {
        color: #8c939d;
    }
</style>
