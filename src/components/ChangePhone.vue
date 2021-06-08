<template>
    <section v-loading="loading">
        <el-row>
            <el-col :offset="1" :span="22">
                <el-card shadow="hover">
                    <div slot="header" style="text-align:center">修改手机号</div>
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
                            <el-form-item label="手机号" style="margin-top: 20px;" prop="oldPhone">
                                {{
                                    verifyForm.oldPhone.substring(0, 3) +
                                        '****' +
                                        verifyForm.oldPhone.substring(
                                            verifyForm.oldPhone.length - 4,
                                            verifyForm.oldPhone.length
                                        )
                                }}
                                <el-button
                                    v-model.number="verifyForm.oldPhone"
                                    :disabled="isDisabled"
                                    @click="inquiryPhone('verifyForm', 'oldPhone', verifyForm.oldPhone)"
                                    :style="{ marginLeft: '20px' }"
                                    >{{ buttonText }}</el-button
                                >
                            </el-form-item>
                            <el-form-item label="验证码" prop="clientCode1">
                                <el-input v-model.number="verifyForm.clientCode1"></el-input>
                            </el-form-item>
                            <div align="center">
                                <el-button
                                    @click="checkCode('verifyForm', 'clientCode1')"
                                    style="margin-top: 12px;"
                                    >下一步</el-button
                                >
                            </div>
                        </el-form>
                        <el-form
                            :model="newPhoneForm"
                            label-width="100px"
                            ref="newPhoneForm"
                            style="margin: 16px 0;"
                            v-else-if="activeStep === 1"
                            :rules="rules"
                        >
                            <el-form-item label="新手机号" style="margin-top: 20px;" prop="newPhone">
                                <el-input v-model.number="newPhoneForm.newPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" prop="clientCode2">
                                <el-input v-model.number="newPhoneForm.clientCode2">
                                <el-button slot="append"
                                :disabled="isDisabled2"
                                style="padding: 3px 5px"
                                @click="sendCode('newPhoneForm', 'newPhone', newPhoneForm.newPhone)">
                                    {{ buttonText2 }}</el-button>
                                </el-input>
                            </el-form-item>
                            <div align="center">
                                <el-button
                                    @click="savePhone('newPhoneForm')"
                                    style="margin-top: 12px;"
                                    >下一步</el-button
                                >
                            </div>
                        </el-form>
                        <el-form
                            label-width="100px"
                            v-else
                        >
                            <p style="padding: 10px 30px; margin: 44px 0;">手机号修改成功。</p>
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
    name: 'ChangePhone',
    data () {
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
            }, 0)
        }
        return {
            loading: false,
            sharedState: store.state,
            activeStep: 0,
            buttonText: '发送验证码',
            isDisabled: false, // 是否禁止点击发送验证码按钮
            flag: true,
            buttonText2: '发送验证码',
            isDisabled2: false, // 是否禁止点击发送验证码按钮
            flag2: true,
            serverCode: '',
            verifyForm: {
                oldPhone: '',
                clientCode1: ''
            },
            newPhoneForm: {
                newPhone: '',
                clientCode2: ''
            },
            rules: {
                clientCode1: [{ required: true, validator: checkCode }],
                newPhone: [{ required: true, validator: checkPhone }],
                clientCode2: [{ required: true, validator: checkCode }]
            }
        }
    },
    methods: {
        inquiryPhone(formName, fieldName, phone) {
            const path = '/reset/inquiry/changePhone'
            const payload = {
                id: this.sharedState.user_id
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                    console.log(response)
                    if (response.data.error_code === 0) {
                        //this.isDisabled = false;
                        this.sendCode(formName, fieldName, phone)
                    }
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.data.error_code === 1011) {
                        this.$message({
                            showClose: true,
                            message: error.response.data.msg,
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                        this.isDisabled2 = true;
                    }
                })
        },getUser (id) {
            this.loading = true
            const path = `/users/${id}`
            this.$axios
                .get(path)
                .then(response => {
                    this.verifyForm.oldPhone = response.data.phone
                    this.loading = false
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
        },
        // eslint-disable-next-line no-unused-vars
        sendCode (formName, fieldName, phone) {
            this.$refs[formName].validateField(fieldName, valid => {
                if (fieldName === 'oldPhone' || valid === '') {
                    if (fieldName === 'oldPhone') {
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
                    } else {
                        let time = 60
                        this.buttonText2 = '验证码已发送'
                        this.isDisabled2 = true
                        if (this.flag2) {
                            this.flag2 = false
                            // eslint-disable-next-line prefer-const
                            let timer = setInterval(() => {
                                time--
                                this.buttonText2 = time + ' 秒'
                                if (time === 0) {
                                    clearInterval(timer)
                                    this.buttonText2 = '重新获取'
                                    this.isDisabled2 = false
                                    this.flag2 = true
                                }
                            }, 1000)
                        }
                    }
                    const path = '/code/verify'
                    const payload = {
                        phone: Number(phone)
                    }
                    this.$axios
                        .post(path, payload)
                        .then(response => {
                            if (response.data.error_code === 0) {
                                this.serverCode = response.data.code
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
                } else {
                    console.log(valid)
                    return false
                }
            })
        },
        checkCode (formName, fieldName) {
            this.$refs[formName].validateField(fieldName, valid => {
                console.log(valid)
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
        savePhone (formName) {
            this.$refs[formName].validateField(
                ['newPhone'],
                // eslint-disable-next-line no-unused-vars
                valid => {
                    const path = '/reset/phone'
                    const payload = {
                        phone: Number(this.verifyForm.oldPhone),
                        // phone: 13823332664,
                        new_phone: Number(this.newPhoneForm.newPhone),
                        code:this.verifyForm.clientCode1,
                        new_code:this.newPhoneForm.clientCode2,
                    }
                    this.$axios
                        .post(path, payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            if(response.data.code==0){
                                this.$message({
                                showClose: true,
                                message: '手机号修改成功',
                                type: 'success',
                                center: true
                                })
                                // 验证成功
                                if (this.activeStep++ > 2) this.activeStep = 0
                                this.verifyForm.clientCode1 = ''
                                this.newPhoneForm.newPhone = ''
                                this.newPhoneForm.clientCode2 = ''
                                this.serverCode = ''
                                this.buttonText = '发送验证码'
                                this.buttonText2 = '发送验证码'
                                this.getUser(this.sharedState.user_id)
                                this.isDisabled2 = false
                            }else{
                                this.$message.info({
                                    showClose: true,
                                    message: response.data.msg,
                                    type: 'success',
                                    center: true
                                })
                            }
                            
                        })
                        .catch(error => {
                            console.log(error)
                           
                                this.$message({
                                    showClose: true,
                                    message: error.response.msg,
                                    type: 'warning',
                                    duration: 5000,
                                    center: true
                                })
                            
                        })
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
    }
}
</script>
