<template>
    <div>
        <el-form
                :model="admin_info"
                :rules="rules"
                label-width="80px"
                ref="EditAdmin"
                status-icon
                style="max-width: 550px"
        >
            <el-form-item label="姓名" prop="name">
                <el-input v-model="admin_info.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="admin_info.gender">
                    <el-radio-button label="1">男士</el-radio-button>
                    <el-radio-button label="2">女士</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model.number="admin_info.age"></el-input>
            </el-form-item>
            <el-form-item align="left" label="学历" prop="degree">
                <el-select
                        placeholder="请选择学历"
                        v-model="admin_info.degree"
                >
                    <el-option label="大专" value="1"></el-option>
                    <el-option label="本科" value="2"></el-option>
                    <el-option label="研究生" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model.number="admin_info.phone"></el-input>
            </el-form-item>
                <el-form-item label="微信号" prop="wechat_id">
                    <el-input v-model.number="admin_info.wechat_id"></el-input>
                </el-form-item>
<!--            <el-form-item autocomplete="off" label="密码" prop="pass">-->
<!--                <el-input-->
<!--                        autocomplete="off"-->
<!--                        v-model="admin_info.pass"-->
<!--                ></el-input>-->
<!--            </el-form-item>-->
            <el-form-item style="text-align:center;">
                <el-button @click="delete_remote" type="danger">删除</el-button>
                <el-button @click="save_remote()" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'SuperAdminEdit',
        props: {
            id: {
                required: true,
                default: null,
            }
        },
        data() {
            let checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.addForm.pass2 !== '') {
                        this.$refs.addAdmin.validateField('pass2')
                    }
                    callback()
                }
            }
            return {

                admin_info: {},
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, message: '最少两个字符', trigger: 'blur'},
                        {max: 20, message: '最长20个字符', trigger: 'blur'}
                    ],
                    phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                    // pass: [
                    //     {required: true, validator: checkPass, trigger: 'blur'},
                    //     {min: 6, message: '密码长度至少为6位', trigger: 'blur'}
                    // ],
                    gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
                    age: [{required: true, message: '请输入年龄', trigger: 'blur'}],
                    degree: [{required: true, message: '请选择学历', trigger: 'blur'}],
                    wechat_id: [],
                }
            }
        },
        watch: {
            id: {
                immediate:true,
                handler(new_) {
                    this.admin_info = {}
                    if (new_) {
                       this.get_remote(new_)
                    }
                }
            }
        },
        methods: {
            save_remote() {
                this.loading = true
                this.$refs['EditAdmin'].validate(valid => {
                    if (valid) {
                        if (this.admin_info.age < 18){
                            this.$message.error("年龄不能小于18岁")
                            return
                        }
                        if (this.admin_info.age > 70){
                            this.$message.error("年龄不能高于70岁")
                            return
                        }
                        this.$axios.post("/admin/update",this.admin_info).then(()=>{
                            this.$message.success("更新成功");
                            this.loading = false;
                        }).finally(this.commit)
                    } else {
                        this.loading = false
                        return false
                    }
                })
            },
            delete_remote(){
                this.$confirm("删除后无法恢复").then(()=>{
                    this.$axios.delete("/admin/delete/"+this.admin_info.id).then(()=>{
                        this.$message.success("删除成功")
                    }).finally(this.commit)
                })

            },
            get_remote(admin_id){
                this.$axios.get("/admin/search/"+admin_id).then((Response=>{
                    console.log(Response)
                    if (Response.data.id){
                        this.admin_info = Response.data
                    }else {
                        this.$message.error("拉取用户信息失败")
                    }
                }))
            },
            commit(){
                console.log("提交数据")
                this.$emit("edited")
            }

        }
    }
</script>

<style scoped>

</style>
