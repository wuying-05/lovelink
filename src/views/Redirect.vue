<template>
    <el-container class="container">
        <el-main>
            <el-row>
                <el-col
                    :xs="{ span: 24 }"
                    :sm="{ span: 16, offset: 4 }"
                    :md="{ span: 12, offset: 5 }"
                    :lg="{ span: 10, offset: 7 }"
                >
                    <el-card>
                        <div v-if="showPhoneForm">
                            <el-tag
                            style="font-size: 20px;margin: 24px 16px 32px;"
                            effect="light"
                            >绑定手机号</el-tag
                        >
                            <p v-if="sharedState.is_authenticated">手机号已绑定。</p>
                            <el-form
                            v-else
                            :model="phoneForm"
                            :rules="rules"
                            ref="phoneForm"
                            label-width="80px"
                            style="max-width: 550px"
                            status-icon
                        >
                                <el-form-item label="手机号" prop="phone">
                                    <el-input v-model.number="phoneForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" prop="code" autocomplete="off">
                                    <el-input v-model.number="phoneForm.code">
                                    <el-button slot="append" :disabled="isDisabled" @click="sendCode('phoneForm')">{{ buttonText }}</el-button>
                                    </el-input>
                                </el-form-item>
                                <el-form-item style="text-align:center;">
                                <el-button @click="checkPhone('phoneForm', authid)" type="primary"
                                    >提交</el-button
                                >
                            </el-form-item>
                            </el-form>
                        </div>
                        <div v-if="showRegisterForm">
                            <el-tag
                                style="font-size: 20px;margin: 24px 16px 32px;"
                                effect="light"
                                >填写基本资料</el-tag
                            >
                            <el-form
                                :model="registerForm"
                                :rules="rules"
                                ref="registerForm"
                                label-width="80px"
                                style="max-width: 550px"
                                status-icon
                            >
                                <el-form-item label="我是一位" prop="gender">
                                    <el-radio-group v-model="registerForm.gender">
                                        <el-radio-button label="男士">男士</el-radio-button>
                                        <el-radio-button label="女士">女士</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="婚姻状况" prop="marriage">
                                    <el-radio-group v-model="registerForm.marriage">
                                        <el-radio-button label="未婚">未婚</el-radio-button>
                                        <el-radio-button label="离异">离异</el-radio-button>
                                        <el-radio-button label="丧偶">丧偶</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="我的生日" prop="birthday">
                                    <el-date-picker
									prefix-icon='none'
                                    v-model="registerForm.birthday"
                                    type="date"
                                    placeholder="选择出生日期"
                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="工作城市" prop="location">
                                        <el-cascader
                                            :options="cityOptions"
                                            size="large"
                                            v-model="registerForm.location"
                                        ></el-cascader>
                                </el-form-item>
                                <el-form-item label="家乡"  prop="residence">
                                        <el-cascader
                                            :options="cityOptions"

                                            size="large"
                                            v-model="registerForm.residence"
                                        ></el-cascader>
                                </el-form-item>
                                <el-form-item label="每月收入" prop="salary">
                                    <el-select
                                        placeholder="选择真实的月收入"
                                        v-model="registerForm.salary"
                                    >
                                        <el-option
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            v-for="item in salaryOptions"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item align="left" label="我的学历" prop="degree">
                                    <el-select
                                        placeholder="请选择您的真实学历"
                                        v-model="registerForm.degree"
                                    >
                                        <el-option
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            v-for="item in degreeOptions.slice(1, 6)"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="我的职业" prop="job">
                                    <el-select v-model="registerForm.job" placeholder="请选择您的职业">
                                        <el-option
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            v-for="item in jobOptions"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="真实身高" prop="height">
                                    <el-select
                                        placeholder="请选择身高"
                                        v-model="registerForm.height"
                                    >
                                        <el-option
                                            :key="item"
                                            :label="item + 130 + ' 厘米'"
                                            :value="item + 130"
                                            v-for="item in 99"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="昵称" prop="name" style="max-width:300px">
                                    <el-input v-model="registerForm.name"></el-input>
                                </el-form-item>
                                <el-form-item style="text-align:center;">
                                    <el-button @click="submitForm('registerForm')" type="primary"
                                        >提交</el-button
                                    >
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import store from '../store'
import { regionData, CodeToText } from 'element-china-area-data'
import { salaryOptions, degreeOptions, jobOptions } from '../data'
export default {
    name: 'Redirect',
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
                    if (value !== this.phoneForm.code) {
                        callback(new Error('请输入正确的验证码'))
                    } else {
                        callback()
                    }
                }
            }, 1000)
        }
        return {
            code: '',
            endpage: '',
            authid: '',
            sharedState: store.state,
            showPhoneForm: true,
            showRegisterForm: false,
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                }
            },
            cityOptions: regionData,
            salaryOptions: salaryOptions,
            degreeOptions: degreeOptions,
            jobOptions: jobOptions,
            phoneForm: {
                // clientCode: '', // 用户输入的验证码
                code: '', // 实际的正确验证码
                phone: ''
            },
            registerForm: {
                gender: '',
                marriage: '',
                birthday: '',
                residence: [],
                location: [], // 三个数字表示的三级地址
                salary: '',
                height: 170,
                degree: '',
                job: '',
                name: ''
            },
            buttonText: '发送验证码',
            isDisabled: false, // 是否禁止点击发送验证码按钮
            flag: true,
            rules: {
                name: [
                    { required: true, message: '输入你在网站昵称', trigger: 'blur' },
                    { min: 2, message: '昵称最少两个字', trigger: 'blur' },
                    { max: 8, message: '昵称最长8个字', trigger: 'blur' }
                ],
                phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
                code: [{ required: true, validator: checkCode, trigger: 'blur' }],
                // clientCode: [{ required: true, trigger: 'blur' }],
                gender: [{ required: true, message: '请选择你的性别', trigger: 'blur' }],
                birthday: [{ required: true, message: '请选择你的出生日期', trigger: 'blur' }],
                marriage: [{ required: true, message: '请选择你的婚姻状态', trigger: 'blur' }],
                location: [{ required: true, message: '请选择你的工作地', trigger: 'blur' }],
                residence: [{ required: true, message: '请选择你的家乡', trigger: 'blur' }],
                salary: [{ required: true, message: '请选择你的工资范围', trigger: 'blur' }],
                degree: [{ required: true, message: '请选择你的学历', trigger: 'blur' }],
                job: [{ required: true, message: '请输入你的工作', trigger: 'blur' }],
                height: [{ required: true, message: '请选择你的身高', trigger: 'blur' }]
            }
        }
    },
    methods: {
        getAuthId (code, endpage) {
            const path = `/auth/wechatwork/${code}/${endpage}`
            this.$axios
                .post(path)
                // eslint-disable-next-line no-unused-vars
                .then(response => {
                    this.authid = response.data.authid
                    if (response.data.exist === true) {
                        // this.$message.success('欢迎回来！')
                        window.localStorage.setItem('dating-token', response.data.token)
                        store.loginAction()
                        this.$router.push('/' + endpage)
                    }else {
                      store.loginActionZZ()
                      // this.$router.push('/' + endpage)
                    }
                    this.$message.success('获取企业微信身份成功。')
                })
                .catch(error => {
                    if (!this.sharedState.is_authenticated) {
                        this.$message.error('获取企业微信身份信息失败，请稍后重试。')
                    }
                    console.log(error.response)
                })
        },
        checkPhone (formName, authid) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const path = `/auth/wechatwork/check/${authid}`
                    const payload = {
                        phone: this.phoneForm.phone
                    }
                    this.$axios
                        .post(path, payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            // 注册成功
                            if (response.data.exist === true) {
                                this.$message.success('手机号绑定成功！')
                                window.localStorage.setItem('dating-token', response.data.token)
                                store.loginAction()
                                this.$router.push('/' + this.endpage)
                            } else {
                                this.$message.info('检测到您是新注册用户，请填写资料！')
                                this.showPhoneForm = false
                                this.showRegisterForm = true
                            }
                        })
                        .catch(error => {
                            this.$message({
                                message: '手机号绑定失败，请稍后重试。',
                                type: 'error'
                            })
                            console.log(error.response)
                        })
                } else {
                    return false
                }
            })
        },
        submitForm (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const path = '/auth/wechatwork/profile'
                    const payload = {
                        authid: this.authid,
                        gender: this.registerForm.gender,
                        marriage: this.registerForm.marriage,
                        birthday: this.registerForm.birthday,
                        location: this.registerForm.location.toString(),
                        residence: this.registerForm.residence.toString(),
                        location_cn: this.getCity(this.registerForm.location),
                        residence_cn: this.getCity(this.registerForm.residence),
                        salary: this.registerForm.salary,
                        degree: this.registerForm.degree,
                        job: this.registerForm.job,
                        height: this.registerForm.height,
                        name: this.registerForm.name,
                        phone: this.phoneForm.phone
                    }
                    this.$axios
                        .post(path, payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            // 注册成功
                            this.$message({
                                showClose: true,
                                message: '资料提交成功！',
                                type: 'success',
                                center: true
                            })
                            window.localStorage.setItem('dating-token', response.data.token)
                            store.loginAction()
                            this.$router.push('/' + this.endpage)
                        })
                        .catch(error => {
                            this.$message({
                                message: '操作失败，请稍后重试。',
                                type: 'error'
                            })
                            console.log(error.response)
                        })
                } else {
                    return false
                }
            })
        },
        getCity (location) {
            // eslint-disable-next-line no-unused-vars
            var province = CodeToText[location[0]]
            var city = CodeToText[location[1]]
            var district = CodeToText[location[2]]
            if (province === '全部') {
                return '中国'
            } else if (city === 'undefined') {
                return province
            } else if (district === 'undefined') {
                return province + '/' + city
            } else {
                return province + '/' + city + '/' + district
            }
        },
        sendCode (formName) {
            this.$refs[formName].validateField('phone', valid => {
                if (valid === '') {
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
                    // eslint-disable-next-line standard/object-curly-even-spacing
                    const path = '/code/verify'
                    const payload = {
                        phone: Number(this.phoneForm.phone)
                    }
                    this.$axios
                        .post(path, payload)
                        .then(response => {
                            if (response.data.error_code === 0) {
                                this.phoneForm.code = response.data.code
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
                    return false
                }
            })
        }
    },
    created () {
        this.code = new URL(location.href).searchParams.get('code') // why this.code = this.$route.query.code not working?
        this.endpage = this.$route.params.endpage
        this.getAuthId(this.code, this.endpage)
    }
}
</script>
