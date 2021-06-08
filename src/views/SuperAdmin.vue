<template>
  <el-container class="container">
    <el-main class="main-container" style="padding:0;" element-loading-text="加载中" v-loading="loading">
      <el-row style="width: 100%;margin:auto;">
        <el-header>
          <el-button @click="addAdminHandle" class="header-add" size="middle"
                     style="margin-right: 260px; font-size: 18px;" type="primary">添加管理员
          </el-button>
        </el-header>
        <el-table
            :data="tableData"
            style="width: 100%;font-size:12px;">
<!--          <el-table-column-->
<!--              align="center"-->
<!--              label="ID"-->
<!--              prop="id"-->
<!--              width="60">-->
<!--          </el-table-column>-->
          <el-table-column
              align="center"
              label="ID"
              prop="newId"
              width="60">
          </el-table-column>

          <el-table-column
              align="center"
              label="姓名"
              prop="name"
              width="80">
          </el-table-column>
          <el-table-column
              align="center"
              label="性别"
              prop="gender"
              width="60">
            <template slot-scope="scope">
              {{ scope.row.gender == '1' ? '男士' : '女士' }}
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="年龄"
              prop="age"
              width="60">
          </el-table-column>
          <el-table-column
              align="center"
              label="学历"
              prop="degree"
              width="80">
            <template slot-scope="scope">
              {{ scope.row.degree == '1' ? '大专' : scope.row.degree == '2' ? '本科' : '研究生' }}
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="手机号"
              prop="phone"
              width="100">
          </el-table-column>
          <el-table-column
              align="center"
              label="微信号"
              prop="wechat_id">
          </el-table-column>
          <el-table-column
              align="center"
              label="开通人数"
              prop="open_count"
              width="100">
          </el-table-column>
          <el-table-column
              align="center"
              label="开通次数"
              prop="open_times"
              width="100">
          </el-table-column>
          <el-table-column
              align="center"
              label="入驻时间"
              prop="create_datetime"
              width="130">
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              prop="action"
              width="280">
            <template slot-scope="scope">
              <el-button
                  @click="handleEditPermission(scope.row.id)"
                  size="mini"
                  v-if="scope.row.active && !scope.row.package_permission">开启套餐权限
              </el-button>
              <el-button
                  @click="handleEditPermission(scope.row.id)"
                  size="mini"
                  type="danger"
                  v-if="scope.row.active && scope.row.package_permission">关闭套餐权限
              </el-button>
              <el-button
                  @click="handleBanUser(scope.row.id)"
                  size="mini"
                  type="success"
                  v-if="!scope.row.active">解禁
              </el-button>
              <el-button
                  @click="handleBanUser(scope.row.id)"
                  size="mini"
                  type="danger"
                  v-else>禁用
              </el-button>
              <el-button
                  @click="showPasswordDialog(scope.row.id)"
                  size="mini"
                  v-if="scope.row.active">修改密码
              </el-button>
              <el-button
                  @click="editAdmin(scope.row.id)"
                  size="mini"
                  v-if="scope.row.active">编辑
              </el-button>
              <el-button
                  @click="removeAdminwechat(scope.row.id)"
                  size="mini"
                  v-if="scope.row.wechat">清除微信绑定
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :hide-on-single-page=true
            :page-count="pageData.pages"
            :page-size="pageData.per_page"
            @current-change="getUsers"
            background
            layout="prev, pager, next"
            small>
        </el-pagination>
        <el-dialog :visible.sync="dialogFormVisible" title="修改密码" width="30%">
          <el-form :model="changePasswordForm">
            <el-form-item label="输入新密码">
              <el-input autocomplete="off" v-model="changePasswordForm.password"></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" slot="footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading="saveLoading" @click="changePassword()" type="primary">提交</el-button>
          </div>
        </el-dialog>
      </el-row>
    </el-main>

    <el-dialog :modal="false"
               :visible.sync="showAddDialog"
               title="创建管理员账号"
               width="500px">
      <el-form
          :model="addForm"
          :rules="rules"
          label-width="80px"
          ref="addAdmin"
          status-icon
          style="max-width: 550px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio-button label="1">男士</el-radio-button>
            <el-radio-button label="2">女士</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="addForm.age"></el-input>
        </el-form-item>
        <el-form-item align="left" label="学历" prop="degree">
          <el-select
              placeholder="请选择学历"
              v-model="addForm.degree"
          >
            <el-option label="大专" value="1"></el-option>
            <el-option label="本科" value="2"></el-option>
            <el-option label="研究生" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="微信号" prop="wechat_id">
          <el-input v-model.number="addForm.wechat_id"></el-input>
        </el-form-item>
        <el-form-item autocomplete="off" label="密码" prop="pass">
          <el-input
              autocomplete="off"
              v-model="addForm.pass"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button @click="submitForm('addAdmin')" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="editDialog" title="编辑管理员" width="500px">
      <super-admin-edit :id="editingAdminId" v-if="editDialog" v-on:edited="listen_admin_edit"></super-admin-edit>
    </el-dialog>
  </el-container>
</template>

<script>
import store from '../store.js'
import SuperAdminEdit from './SuperAdminEdit'

export default {
  name: 'SuperAdmin',
  components: {SuperAdminEdit},
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
      showAddDialog: false,
      editDialog: false,
      addForm: {
        name: null,
        gender: null,
        age: null,
        degree: null,
        phone: null,
        wechat_id: null

      },
      sharedState: store.state,
      activeIndex: '1',
      loading: false,
      pageData: {},
      tableData: [],
      changePasswordForm: {
        password: ''
      },
      dialogFormVisible: false,
      saveLoading: false,
      currentPasswordId: '',
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 2, message: '最少两个字符', trigger: 'blur'},
          {max: 20, message: '最长20个字符', trigger: 'blur'}
        ],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        pass: [
          {required: true, validator: checkPass, trigger: 'blur'},
          {min: 6, message: '密码长度至少为6位', trigger: 'blur'}
        ],
        gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
        age: [{required: true, message: '请输入年龄', trigger: 'blur'}],
        degree: [{required: true, message: '请选择学历', trigger: 'blur'}],
        wechat_id: [],
      },
      editingAdminId: {},
    }
  },
  methods: {
    listen_admin_edit() {
      this.editDialog = false
      this.getUsers(null, false);
    },
    getUsers(page = null, showmessage = true) {
      this.loading = true
      let page_str = '';
      if (page) {
        page_str = '?page=' + page;
      } else if (this.pageData.page) {
        page_str = '?page=' + this.pageData.page;
      }
      const path = '/admin/admins' + page_str
      this.$axios.get(path).then(response => {
        this.tableData = response.data.users
        this.pageData = response.data.pagination
        if (showmessage) {
          if (response.data.users.length === 0) {
            this.$message.info('暂无相关结果。')
          } else {
            // this.$message.success('管理员列表已更新！')
          }
        }
        // 处理成陈总想要的自然数序号从1-N衔接上----------------------------------------
        var aa = this.tableData, pageSize = 12;
        for (var i = 0, l = aa.length; i < l; i++) {
          var a = aa[i];
          a.newId = ((page || 1) - 1) * pageSize + (i + 1);
        }
        window.scrollTo(0, 0);
        this.loading = false;
      }).catch(error => {
        console.log('error!', error.response)
        this.loading = false;
      })
    },
    handleEditPermission(id) {
      this.loading = true
      const path = `/admin/admins/${id}/permission`
      this.$axios
          .put(path)
          .then(response => {
            this.getUsers(null, false);
            this.loading = false
            /* this.$message({
                message: '套餐权限已更新',
                type: 'success',
                duration: 1000
            }) */
          })
          .catch(error => {
            this.loading = false
            console.error(error)
          })
    },
    handleBanUser(id) {
      this.loading = true
      const path = `/admin/admins/${id}/active`
      this.$axios
          .put(path)
          .then(response => {
            this.getUsers(null, false);
            this.loading = false
            // this.$message.success('激活状态已更新！')
          })
          .catch(error => {
            this.loading = false
            console.error(error)
          })
    },
    editAdmin(admin_id) {
      this.editingAdminId = admin_id
      this.editDialog = true
    },
    removeAdminwechat(admin_id) {
      this.$confirm('是否确认清除？')
          .then(_ => {
            this.loading = true
            const path = '/admin/admins/delete/wechat'
            const payload = {
              id: admin_id
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                  this.$message.success('清除成功!')
                  this.getUsers(null, false)
                })
                .catch(error => {
                  // handle error, 400 and 500
                  console.log('error!', error.response)
                  this.loading = false
                })
          })
          .catch(_ => {
          });
    },
    showPasswordDialog(id) {
      this.dialogFormVisible = true
      this.currentPasswordId = id
    },
    changePassword() {
      this.saveLoading = true
      const path = `/admin/admins/${this.currentPasswordId}/password`
      const payload = {
        password: this.changePasswordForm.password
      }
      if (this.changePasswordForm.password.length < 6) {
        this.$message.error('密码长度至少需要6个字符');
        this.saveLoading = false;
        return false;
      }
      this.$axios
          .put(path, payload)
          .then(response => {
            this.saveLoading = false;
            this.getUsers(null, false);
            this.$message.success('密码已更新！');
            this.dialogFormVisible = false;
          })
          .catch(error => {
            this.saveLoading = false;
            this.dialogFormVisible = false;
            console.error(error);
          })
    },
    addAdminHandle() {
      this.showAddDialog = true
    },
    submitForm() {
      this.loading = true
      this.$refs['addAdmin'].validate(valid => {
        if (valid) {
          if (!Number.isInteger(this.addForm.age)) {
            this.$message.error('请输入正确的年龄')
            this.loading = false
            return false
          }
          if (this.addForm.age < 18 || this.addForm.age > 70) {
            this.$message.error('年龄范围需要在18~70之间')
            this.loading = false
            return false
          }
          const path = '/admin/register'
          const payload = {
            gender: this.addForm.gender,
            birthday: this.addForm.birthday,
            degree: this.addForm.degree,
            age: this.addForm.age,
            name: this.addForm.name,
            phone: this.addForm.phone,
            password: this.addForm.pass,
            wechat_id: this.addForm.wechat_id
          }
          this.$axios.post(path, payload)
              .then(response => {
                // 注册成功
                this.$message({
                  showClose: true,
                  message: '管理员创建成功！',
                  type: 'success',
                  duration: 1000,
                  center: true
                })
                this.showAddDialog = false
                this.getUsers(null, false);

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
  created() {
    if (!this.sharedState.is_super_admin) {
      this.$router.push('/admin/vip')
    }
    this.getUsers()
  }
}
</script>
<style>
.main-container {
  width: 940px;
}

.header-add {
  margin: 0 5px;
  float: right;
}

.el-message {
  min-width: 250px !important;
}

.el-message--warning {
  width: 250px !important;

}
</style>
