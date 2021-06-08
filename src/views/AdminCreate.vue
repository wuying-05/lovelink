<template>
    <el-container>
        <el-main v-loading="loading">
            <el-row>
                <el-col
                    :xs="{ span: 24 }"
                    :sm="{ span: 16, offset: 4 }"
                    :md="{ span: 12, offset: 5 }"
                    :lg="{ span: 10, offset: 7 }"
                >
                    <el-card>
                        <el-tag
                            style="font-size: 20px;margin: 24px 16px 32px;"
                            effect="light"
                            >创建管理员账号</el-tag
                        >
                        <el-form
                            :model="registerForm"
                            :rules="rules"
                            ref="registerForm"
                            label-width="80px"
                            style="max-width: 550px"
                            status-icon
                        >
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="registerForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="registerForm.gender">
                                    <el-radio-button label="1">男士</el-radio-button>
                                    <el-radio-button label="2">女士</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="年龄" prop="age">
                                <el-input v-model.number="registerForm.age"></el-input>
                            </el-form-item>
                            <el-form-item align="left" label="学历" prop="degree">
                                <el-select
                                    placeholder="请选择学历"
                                    v-model="registerForm.degree"
                                >
                                    <el-option label="大专" value="1"></el-option>
                                    <el-option label="本科" value="2"></el-option>
                                    <el-option label="研究生" value="3"></el-option>
                                    <!-- <el-option
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        v-for="item in degreeOptions"
                                    ></el-option> -->
                                </el-select>
                            </el-form-item>
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model.number="registerForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="pass" autocomplete="off">
                                <el-input
                                    autocomplete="off"
                                    v-model="registerForm.pass"
                                ></el-input>
                            </el-form-item>
                                <!-- <el-form-item label="婚姻状况" prop="marriage">
                                    <el-radio-group v-model="registerForm.marriage">
                                        <el-radio-button label="0">未婚</el-radio-button>
                                        <el-radio-button label="1">离异</el-radio-button>
                                        <el-radio-button label="2">丧偶</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="我的生日" prop="birthday">
                                    <el-date-picker
                                    v-model="registerForm.birthday"
                                    type="date"
                                    placeholder="选择出生日期"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item> -->
                                <!-- <el-form-item label="工作城市" prop="location">
                                        <el-cascader
                                            :options="cityOptions"
                                            size="large"
                                            v-model="registerForm.location"
                                        ></el-cascader>
                                </el-form-item>
                                <el-form-item label="家乡" prop="residence">
                                        <el-cascader
                                            :options="cityOptions"
                                            size="large"
                                            v-model="registerForm.residence"
                                        ></el-cascader>
                                </el-form-item> -->
                                <!-- <el-form-item label="每月收入" prop="salary">
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
                                </el-form-item> -->
                                <!-- <el-form-item label="我的职业" prop="job">
                                    <el-select v-model="registerForm.job" placeholder="请选择您的职业">
                                        <el-option
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            v-for="item in jobOptions"
                                        ></el-option>
                                    </el-select>
                                </el-form-item> -->
                            <!-- <el-form-item label="确认密码" prop="pass2" autocomplete="off">
                                <el-input
                                    autocomplete="off"
                                    type="password"
                                    v-model="registerForm.pass2"
                                ></el-input>
                            </el-form-item> -->
                            <el-form-item style="text-align:center;">
                                <el-button @click="submitForm('registerForm')" type="primary"
                                    >创建</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
// import { regionData } from 'element-china-area-data'
// import { salaryOptions, degreeOptions, jobOptions } from '../data'
import store from '../store.js'
export default {
    name: 'AdminCreate',
    data () {
        // var checkPhone = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('手机号不能为空'))
        //     }
        //     setTimeout(() => {
        //         if (!Number.isInteger(value)) {
        //             callback(new Error('请输入数字'))
        //         } else {
        //             if (value < 10000000000 || value > 99999999999) {
        //                 callback(new Error('请输入正确的手机号'))
        //             } else {
        //                 callback()
        //             }
        //         }
        //     }, 1000)
        // }
        var checkPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.registerForm.pass2 !== '') {
                    this.$refs.registerForm.validateField('pass2')
                }
                callback()
            }
        }
        // var checkPass2 = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请再次输入密码'))
        //     } else if (value !== this.registerForm.pass) {
        //         callback(new Error('两次输入密码不一致!'))
        //     } else {
        //         callback()
        //     }
        // }
        return {
            sharedState: store.state,
            loading: false,
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                }
            },
            // cityOptions: regionData,
            // salaryOptions: salaryOptions,
            // degreeOptions: degreeOptions,
            // jobOptions: jobOptions,
            registerPhone: '',
            registerForm: {
                gender: '',
                // marriage: '',
                age: '',
                // residence: [],
                // location: [], // 三个数字表示的三级地址
                // salary: '',
                // height: 170,
                degree: '',
                // job: '',
                name: '',
                pass: '',
                // pass2: '',
                phone: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, message: '最少两个字符', trigger: 'blur' },
                    { max: 20, message: '最长20个字符', trigger: 'blur' }
                ],
                phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                pass: [
                    { required: true, validator: checkPass, trigger: 'blur' },
                    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
                ],
                // pass2: [{ required: true, validator: checkPass2, trigger: 'blur' }],
                // clientCode: [{ required: true, validator: checkCode, trigger: 'blur' }],
                gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
                age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
                // marriage: [{ required: true, message: '请选择你的婚姻状态', trigger: 'blur' }],
                // location: [{ required: true, message: '请选择你的工作地', trigger: 'blur' }],
                // residence: [{ required: true, message: '请选择你的家乡', trigger: 'blur' }],
                // salary: [{ required: true, message: '请选择你的工资范围', trigger: 'blur' }],
                degree: [{ required: true, message: '请选择学历', trigger: 'blur' }]
                // job: [{ required: true, message: '请输入你的工作', trigger: 'blur' }],
                // height: [{ required: true, message: '请选择你的身高', trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitForm (formName) {
            this.loading = true
            // if (this.registerForm.phone !== this.registerPhone) {
            //     this.$message.error('注册手机号与验证手机号不一致，请更正。')
            //     this.loading = false
            //     return false
            // }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (!Number.isInteger(this.registerForm.age)) {
                        this.$message.error('请输入正确的年龄')
                        this.loading = false
                        return false
                    }
                    if (this.registerForm.age < 18 || this.registerForm.age > 70) {
                        this.$message.error('年龄范围需要在18~70之间')
                        this.loading = false
                        return false
                    }
                    const path = '/admin/register'
                    const payload = {
                        gender: this.registerForm.gender,
                        // marriage: this.registerForm.marriage,
                        birthday: this.registerForm.birthday,
                        // location: this.registerForm.location.toString(),
                        // residence: this.registerForm.residence.toString(),
                        // location_cn: this.getCity(this.registerForm.location),
                        // residence_cn: this.getCity(this.registerForm.residence),
                        // salary: this.registerForm.salary,
                        degree: this.registerForm.degree,
                        // job: this.registerForm.job,
                        // height: this.registerForm.height,
                        name: this.registerForm.name,
                        phone: this.registerForm.phone,
                        password: this.registerForm.pass
                    }
                    this.$axios
                        .post(path, payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            // 注册成功
                            this.$message({
                                showClose: true,
                                message: '管理员创建成功！',
                                type: 'success',
                                duration: 5000,
                                center: true
                            })
                            this.$router.push('/admin/super/admin')
                            this.loading = false
                        })
                        .catch(error => {
                            console.log(error.response)
                            this.loading = false
                            if (typeof error.response === 'undefined') {
                                this.$message.warning('服务器繁忙，请稍后再试')
                                return false
                            }
                            if (error.response.data.error_code === 1000) {
                                this.$message.warning('手机号已注册或格式不正确')
                            }
                        })
                } else {
                    this.loading = false
                    return false
                }
            })
        }
    },
    created () {
        if (!this.sharedState.is_super_admin) {
            this.$router.push('/admin/vip')
        }
    }
}
</script>

<style scoped></style>
