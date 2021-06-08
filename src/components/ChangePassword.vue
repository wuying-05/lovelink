<template>
    <section v-loading="loading">
        <el-row>
            <el-col :offset="1" :span="22">
                <el-card shadow="hover">
                    <div slot="header" style="text-align:center">修改密码</div>
                    <div style="padding: 10px 64px;">
                        <el-steps
                            :active="activeStep"
                            finish-status="success"
                            process-status="finish"
                        >
                            <el-step icon="el-icon-position" title="验证"></el-step>
                            <el-step icon="el-icon-unlock" title="修改"></el-step>
                            <el-step icon="el-icon-check" title="完成"></el-step>
                        </el-steps>
                    </div>
                    <el-row justify="center" type="flex">
                        <el-form
                            :model="verifyForm"
                            label-width="100px"
                            ref="verifyForm"
                            style="margin: 16px 0;"
                            v-if="activeStep === 0"
                            :rules="rules"
                        >
                            <el-form-item label="手机号" style="margin-top: 20px;">
                                {{
                                    verifyForm.phone.substring(0, 3) +
                                        '****' +
                                        verifyForm.phone.substring(
                                            verifyForm.phone.length - 4,
                                            verifyForm.phone.length
                                        )
                                }}
                                <el-button
                                    v-model.number="verifyForm.phone"
                                    :disabled="isDisabled"
                                    @click="inquiryPassword('verifyForm')"
                                    :style="{ marginLeft: '20px' }"
                                    >{{ buttonText }}</el-button
                                >
                            </el-form-item>
                            <el-form-item label="验证码" prop="clientCode">
                                <el-input v-model.number="verifyForm.clientCode"></el-input>
                            </el-form-item>
                            <div align="center">
                                <el-button
                                    @click="checkCode('verifyForm')"
                                    style="margin-top: 12px;"
                                    >下一步</el-button
                                >
                            </div>
                        </el-form>
                        <el-form
                            :model="passwordForm"
                            label-width="100px"
                            ref="passwordForm"
                            style="margin: 16px 0;"
                            v-else-if="activeStep === 1"
                            :rules="rules"
                        >
                            <el-form-item label="新密码" prop="newPass1">
                                <el-input v-model="passwordForm.newPass1"
                                autocomplete="off"
                                type="password"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="newPass2">
                                <el-input v-model="passwordForm.newPass2"
                                autocomplete="off"
                                type="password"
                                ></el-input>
                            </el-form-item>
                            <div align="center">
                                <el-button
                                    @click="savePassword('passwordForm')"
                                    style="margin-top: 12px;"
                                    >下一步</el-button
                                >
                            </div>
                        </el-form>
                        <el-form
                            label-width="100px"
                            v-else
                        >
                            <p style="padding: 10px 30px; margin: 44px 0;">密码已经成功修改。</p>
                            <!-- <el-alert
                                center
                                show-icon
                                style="padding: 10px 30px; margin: 24px 0;"
                                title="密码已成功修改成功"
                                type="success"
                            ></el-alert> -->
                            <div align="center">
                                <el-button
                                    @click="finishStep"
                                    style="margin-top: 12px;"
                                    >完成</el-button
                                >
                            </div>
                        </el-form>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import store from '../store'
export default {
    name: 'ChangePassword',
    data () {
        var checkCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'))
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字'))
                } else {
                    callback()
                }
            }, 1000)
        }
        // var checkPass = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入密码'))
        //     } else if (value.length() < 6) {
        //         callback(new Error('密码长度至少6位'))
        //     } else {
        //         // if (this.passwordForm.newPassword2 !== '') {
        //         //     this.$refs.passwordForm.validateField('newPassword2')
        //         // }
        //         callback()
        //     }
        // }
        // var checkPass2 = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请再次输入密码'))
        //     } else if (value !== this.passwordForm.newPassword) {
        //         callback(new Error('两次输入密码不一致!'))
        //     } else {
        //         callback()
        //     }
        // }
        return {
            loading: false,
            sharedState: store.state,
            activeStep: 0,
            buttonText: '发送验证码',
            isDisabled: false, // 是否禁止点击发送验证码按钮
            flag: true,
            verifyForm: {
                phone: '',
                clientCode: '',
                serverCode: ''
            },
            passwordForm: {
                newPass1: '',
                newPass2: ''
            },
            rules: {
                newPass1: [
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                ],
                newPass2: [{ required: true, message: '请再次输入密码' }],
                clientCode: [{ required: true, validator: checkCode }]
            }
        }
    },
    methods: {
        inquiryPassword(formName) {
            const path = '/reset/inquiry/password'
            const payload = {
                id: this.sharedState.user_id
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                    console.log(response)
                    if (response.data.error_code === 0) {
                        //this.isDisabled = false;
                        this.sendCode(formName)
                    }
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.data.error_code === 1010) {
                        this.$message({
                            showClose: true,
                            message: error.response.data.msg,
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                        this.isDisabled = true;
                    }
                })
        },
        getUser (id) {
            this.loading = true
            const path = `/users/${id}`
            this.$axios
                .get(path)
                .then(response => {
                    this.verifyForm.phone = response.data.phone
                    this.loading = false
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
        },
        // eslint-disable-next-line no-unused-vars
        sendCode (formName) {
            let time = 60
            this.buttonText = '验证码已发送'
            this.isDisabled = true
            if (this.flag) {
                this.flag = false
                // eslint-disable-next-line prefer-const
                let timer = setInterval(() => {
                    time--
                    this.buttonText = time + ' 秒'
                    if (time === 0) {
                        clearInterval(timer)
                        this.buttonText = '重新获取'
                        this.isDisabled = false
                        this.flag = true
                    }
                }, 1000)
            }
            const path = '/code/verify'
            const payload = {
                phone: Number(this.verifyForm.phone)
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                    if (response.data.error_code === 0) {
                        this.verifyForm.serverCode = response.data.code
                        this.$message({
                            showClose: true,
                            message: '短信已发送，请注意查收',
                            type: 'info',
                            duration: 5000,
                            center: true
                        })
                    }
                })
                .catch(error => {
                    console.log(error.response)
                    if (error.response.data.error_code === 1002) {
                        this.$message({
                            showClose: true,
                            message: '短信发送过于频繁，请稍后再试',
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                    } else if (error.response.data.error_code === 1003) {
                        this.$message({
                            showClose: true,
                            message: '该手机号不存在，请输入正确的手机号',
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                    } else if (error.response.data.error_code === 999) {
                        this.$message({
                            showClose: true,
                            message: '短信功能异常，请联系客服',
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                    }
                })
        },
        checkCode (formName) {
            this.$refs[formName].validateField('clientCode', valid => {
                if (valid === '') {
                    
                    if (this.activeStep++ > 2) this.activeStep = 0
                } else {
                    this.$message({
                        showClose: true,
                        message: '验证码错误，请输入正确的验证码',
                        type: 'error',
                        center: true
                    })
                }
            })
        },
        savePassword (formName) {
            this.$refs[formName].validateField(
                ['newPass', 'newPass2'],
                valid => {
                    if (this.passwordForm.newPass1 !== this.passwordForm.newPass2) {
                        this.$message.error('两次密码不一致，请检查')
                        return false
                    }
                    if(this.passwordForm.newPass1.length<6){
                        this.$message.error('密码长度不能小于6')
                        return false
                    }
                    if (valid === '') {
                        this.loading = true
                        const path = '/reset/password'
                        const payload = {
                            phone: Number(this.verifyForm.phone),
                            // phone: 13823332664,
                            new_password: this.passwordForm.newPass1,
                            code:this.verifyForm.clientCode
                        }
                        this.$axios
                            .post(path, payload)
                            // eslint-disable-next-line no-unused-vars
                            .then(response => {
                                this.$message({
                                    showClose: true,
                                    message: '密码修改成功',
                                    type: 'success',
                                    center: true
                                })
                                // 验证成功
                                if (this.activeStep++ > 2) this.activeStep = 0
                                this.loading = false
                                this.verifyForm.clientCode=""
                                this.passwordForm.newPass1=""
                                this.passwordForm.newPass2=""
                            })
                            .catch(error => {
                                if (error) {
                                    this.$message({
                                        showClose: true,
                                        message: '未知错误',
                                        type: 'info',
                                        duration: 5000,
                                        center: true
                                    })
                                }
                                this.loading = false
                            })
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入密码',
                            type: 'error',
                            center: true
                        })
                    }
                }
            )
        },
        finishStep () {
            this.activeStep = 0
        }
    },
    created () {
        // eslint-disable-next-line camelcase
        const user_id = this.sharedState.user_id
        this.getUser(user_id)
        //this.inquiryPassword(user_id)
        //this.isDisabled = true;
    },mounted(){

    }
}
</script>
