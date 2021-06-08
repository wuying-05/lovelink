<template>
    <section>
        <el-row>
            <el-col :offset="1" :span="22">
                <el-card style="text-align: center;">
                    <div slot="header">我的爱好</div>
                    <el-col
                        :xs="{ span: 24, offset: 0 }"
                        :sm="{ span: 18, offset: 3 }"
                        :md="{ span: 18, offset: 4 }"
                        :lg="{ span: 18, offset: 4 }">
                        <el-form
                            label-position="top"
                            :model="hobbyForm"
                            label-width="80px"
                            ref="hobbyForm"
                            style="margin-top:16px; text-align:left"
                        >
                            <!-- <el-form-item label="勾选爱好（保存后不能修改，请认真操作，最多可以选5项）"> -->
                            <el-form-item label="选择爱好">
                                <el-checkbox-group v-model="hobbyForm.hobby" style="max-width:500px; padding: 10px" :max="99999">
                                    <el-checkbox-button style="padding: 10px" v-for="(item, index) in hobbyOptions" :label="item" :key="item" :value="index">{{ item }}</el-checkbox-button>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form>
                        <div style="text-align:center; margin-bottom: 20px;">
                            <el-button
                                :plain="false"
                                @click="saveHobbyForm('hobbyForm')"
                                type="primary"
                                >保存修改</el-button>
                        </div>
                    </el-col>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import store from '../store'
import { hobbyData } from '../data'
export default {
    name: 'Hobby',
    data () {
        return {
            sharedState: store.state,
            hobbyOptions: hobbyData,
            hobbyForm: {
                hobby: []
            }
        }
    },
    methods: {
        getUser (id) {
            const path = `/users/${id}/profile/hobby`
            this.$axios
                .get(path)
                .then(response => {
                    if (response.data.hobby !== null) {
                        this.hobbyForm.hobby = response.data.hobby.split(',')
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        },
        saveHobbyForm (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // eslint-disable-next-line camelcase
                    const user_id = this.sharedState.user_id
                    // eslint-disable-next-line camelcase
                    const path = `/users/${user_id}/profile/hobby`
                    const payload = {
                        hobby: this.hobbyForm.hobby.toString()
                    }
                    this.$axios
                        .put(path, payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            if(response.data.code==-1){
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                })
                                return
                            }
                            this.$message({
                                message: '资料已更新！',
                                type: 'success'
                            })
                            this.$router.push({
                                name: 'Profile',
                                params: { id: user_id }
                            })
                        })
                        .catch(error => {
                            console.log('error!', error.response)
                        })
                }
            })
        }
    },
    created () {
        // eslint-disable-next-line camelcase
        const user_id = this.sharedState.user_id
        this.getUser(user_id)
    }
}
</script>

<style>
.el-checkbox-button__inner {
    border-left: 1px solid #DCDFE6 !important;
}

</style>
