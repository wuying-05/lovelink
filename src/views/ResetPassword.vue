<template>
    <section v-loading="loading">
        <el-row class="passwordForm">
            <el-col :lg="12" :md="12" :sm="24" :xs="24">
                <el-card shadow="hover">
                    <div slot="header" style="text-align:center">密码重置</div>
                    <div style="padding: 10px 64px;">
                        <el-steps
                            :active="activeStep"
                            finish-status="success"
                            process-status="finish"
                        >
                            <el-step icon="el-icon-position" title="验证"></el-step>
                            <el-step icon="el-icon-unlock" title="重设"></el-step>
                            <el-step icon title="完成"></el-step>
                        </el-steps>
                    </div>
                    <el-row justify="center" type="flex">
                    <el-form
                        style="margin: 16px 0;"
                        :model="codeForm"
                        ref="codeForm"
                        label-width="100px"
                        v-if="activeStep === 0"
                        :rules="rules"
                    >
                        <el-form-item label="手机号" style="margin-top: 20px;" prop="phone">
                            <el-input v-model.number="codeForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="验证码"
                            prop="clientCode"
                        >
                            <el-input v-model.number="codeForm.clientCode">
                                <el-button slot="append"
                                        :disabled="isDisabled"
                                        style="padding: 3px 5px"
                                        @click="sendCode('codeForm')">
                                            {{ buttonText }}</el-button>
                            </el-input>
                        </el-form-item>
                        <div align="center">
                            <el-button
                                type="primary"
                                @click="checkCode('codeForm')"
                                style="margin-top: 24px;"
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
                        <el-form-item
                            label="新密码"
                            style="margin-top: 20px;"
                            prop="newPassword"
                        >
                            <el-input v-model="passwordForm.newPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="newPassword2">
                            <el-input v-model="passwordForm.newPassword2"></el-input>
                        </el-form-item>
                        <div align="center">
                            <el-button
                                type="primary"
                                @click="savePassword('passwordForm')"
                                style="margin-top: 12px;"
                                >下一步</el-button
                            >
                        </div>
                    </el-form>
                    <el-form label-width="100px" v-else>
                        <p style="padding: 10px 30px; margin: 44px 0;">密码重置成功。</p>
                        <div align="center">
                            <el-button
                                @click="finish"
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
export default {
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
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'))
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字'))
                } else {
                    if (value < 10000000000 || value > 99999999999) {
                        callback(new Error('请输入正确的手机号'))
                    } else {
                        callback()
                    }
                }
            }, 1000)
        }
        var checkPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.passwordForm.newPassword2 !== '') {
                    this.$refs.passwordForm.validateField('newPassword2')
                }
                callback()
            }
        }
        var checkPass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            activeStep: 0,
            loading: false,
            buttonText: '发送验证码',
            isDisabled: false, // 是否禁止点击发送验证码按钮
            flag: true,
            codeForm: {
                phone: '',
                clientCode: '',
                code: ''
            },
            passwordForm: {
                newPassword: '',
                newPassword2: ''
            },
            rules: {
                phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
                newPassword: [
                    { required: true, validator: checkPass, trigger: 'blur' },
                    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
                ],
                newPassword2: [{ required: true, validator: checkPass2, trigger: 'blur' }],
                clientCode: [{ required: true, validator: checkCode, trigger: 'blur' }]
            }
        }
    },
    methods: {
        // eslint-disable-next-line no-unused-vars
        sendCode (formName) {
            this.$refs[formName].validateField('phone', valid => {
                if (valid === '') {
                    // eslint-disable-next-line standard/object-curly-even-spacing
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
                        phone: Number(this.codeForm.phone)
                    }
                    this.$axios
                        .post(path, payload)
                        .then(response => {
                            if (response.data.code === 0) {
                                //this.codeForm.code = response.data.code
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
                                    type: 'error',
                                    duration: 5000,
                                    center: true
                                })
                            } else if (error.response.data.error_code === 1006) {
                                this.$message({
                                    showClose: true,
                                    message: '该手机号尚未注册，请输入正确的手机号',
                                    type: 'error',
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
                }
            })
        },
        checkCode (formName) {
            this.$refs[formName].validateField('clientCode', valid => {
                this.loading = true
                if (valid === '') {
                    if (this.activeStep++ > 2) this.activeStep = 0
                    
                    this.loading = false
                } else {
                    this.$message({
                        showClose: true,
                        message: '验证码错误，请输入正确的验证码',
                        type: 'error',
                        center: true
                    })
                    this.loading = false
                }
            })
        },
        savePassword (formName) {
            this.$refs[formName].validateField(
                ['newPassword', 'newPassword2'],
                valid => {
                    if (valid === '') {
                        this.loading = true
                        const path = '/reset/password'
                        const payload = {
                            phone: Number(this.codeForm.phone),
                            // phone: 15150834267,
                            code: this.codeForm.clientCode,
                            new_password: this.passwordForm.newPassword
                        }
                        this.$axios
                            .post(path, payload)
                            .then(response => {
                                this.$message({
                                    showClose: true,
                                    message: '密码重置成功',
                                    type: 'success',
                                    center: true
                                })
                                // 验证成功
                                this.loading = false
                                if (this.activeStep++ > 2) this.activeStep = 0
                            })
                            .catch(error => {
                                if (error) {
                                    this.$message({
                                        showClose: true,
                                        message: error.response.data.msg,
                                        type: 'info',
                                        duration: 5000,
                                        center: true
                                    })
                                }
                            })
                        this.loading = false
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
        finish () {
            this.activeStep = 0
            this.codeForm.phone=''
            this.codeForm.clientCode=''
            this.codeForm.code=''
            this.passwordForm.newPassword=''
            this.passwordForm.newPassword2=''
        }
    }
}
</script>

<style scoped>
.passwordForm {
    display: flex;
    justify-content: center;
}
</style>
