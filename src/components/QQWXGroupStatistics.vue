<template>
  <el-container>
    <el-main class="container" v-loading="loading" element-loading-text="加载中">
      <div class="">
        <el-card style="margin-bottom: 10px; padding: 10px 0">
          <div slot="header" class="clearfix">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="6">
                <div class="grid-content bg-purple"><span>群推广数据统计</span></div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light"></div>
              </el-col>
            </el-row>
          </div>

          <el-form
              :model="searchForm"
              label-width="50px"
              ref="searchForm"
              :inline=true
          >
            <el-row :gutter="5">
              <el-col :span="4">
                <el-form-item prop="weight">
                  <el-select v-model="searchForm.adminid" size="small" placeholder="来源" clearable>
                    <el-option label="qq" value="0">qq</el-option>
                    <el-option label="微信" value="1">微信</el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item>
                  <el-button
                      :plain="false"
                      @click="submitSearchForm()"
                      type="primary"
                      icon="el-icon-search"
                  >搜索
                  </el-button
                  >
                  <el-button
                      :plain="false"
                      @click="resetSearchForm()"
                  >重置
                  </el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row v-if="idSearchResult">
            <el-table
                :data="tableData"
                style="width: 100%">
<!--              <el-table-column-->
<!--                  prop="id"-->
<!--                  label="ID">-->

<!--              </el-table-column>-->
                <el-table-column label="ID" prop="newId" width="50"></el-table-column>
              <el-table-column
                  prop="name"
                  label="名称">
              </el-table-column>
              <el-table-column
                  prop="qqtotal"
                  label="qq群总数">
              </el-table-column>
              <el-table-column
                  prop="qqaval"
                  label="不重复qq群数"
              >
              </el-table-column>

              <el-table-column
                  prop="yucun"
                  label="预存群数">
              </el-table-column>

              <el-table-column
                  prop="queren"
                  label="通过群数">
              </el-table-column>

              <el-table-column
                  prop="huoyue"
                  label="活跃群数">
              </el-table-column>

              <el-table-column
                  prop="huoyue2"
                  label="活跃群总人数">
              </el-table-column>

              <el-table-column
                  prop="wxtotal"
                  label="微信群总数">
              </el-table-column>
              <el-table-column
                  prop="wxaval"
                  label="不重复微信群数">
              </el-table-column>




            </el-table>
          </el-row>
        </el-card>
      </div>
      <el-row style="padding:20px 0;" :lg="6" :sm="20">
        <el-pagination
            background
            small
            :hide-on-single-page=true
            @current-change="submitSearchForm"
            layout="prev, pager, next"
            :size="pageData.per_page"
            :page-count="pageData.pages"
            :current-page="pageData.page">
        </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from '../store'

export default {
  name: 'QQWXGroupStatistics', // this is the name of the component
  components: {},
  data() {
    return {
      idSearchResult: false,
      loading: false,
      store: store,
      sharedState: store.state,
      showResult: false,
      showDialog: false,
      clickAction: '',
      searchForm: {
        adminid: ''
      }, resultData: {},
      pageData: {},
      tableData: {},
      statusList: [{id: 0, state: '预存'}, {id: 1, state: '通过'}]
    }
  },
  methods: {
    addGroup() {
      this.resetDialogData()
      this.clickAction = 'addGroup'
      this.showDialog = true
    },
    queryExist() {
      this.resetDialogData()
      this.clickAction = 'queryExist'
      this.showDialog = true
    },
    statusChange(val, row, column) {
      var method = '';
      const path = '/admin/qqwxgroup/update'
      const payload = {
        id: row.id,
        status: val
      }
      this.$axios
          .post(path, payload)
          .then(response => {
            this.$message.success('操作成功！')
          })
          .catch(error => {
            console.log('error!', error.response)
            this.$message.info('操作失败！')
            row[column.property] = !row[column.property]
          })
    },
    typeFormat(row, column) {
      if (row[column.property] === 0) {
        return 'QQ'
      } else {
        return '微信'
      }
    },
    statusFormat(row, column) {
      if (row[column.property] === 0) {
        return '预存'
      } else {
        return '通过'
      }
    },
    checkAdminActive(id) {
      // eslint-disable-next-line no-template-curly-in-string
      const path = `/admin/admins/${id}/active`
      this.$axios
          .get(path)
          .then(response => {
            if (!response.data.active) {
              this.store.adminLogoutAction()
            }
          })
          .catch(error => {
            console.error(error)
          })
    },
    limitAdminPages() {
      // 如果当前用户是普通管理员，而且 pageData.pages 的值大于 10，重置为 10
      // if (!this.sharedState.is_super_admin && this.pageData.pages > 10) {
      //     this.pageData.pages = 10
      // }
    },
    resetDialogData() {
      this.addForm.gid = ''
      this.addForm.gname = ''
      this.addForm.type = 0
      this.addForm.status = 0
    },
    handleSubmit() {
      if (this.clickAction == 'addGroup') {
        this.submitAdd()
      } else if (this.clickAction == 'queryExist') {
        this.submitQuery()
      }
    },
    submitQuery() {
      const path = '/admin/qqwxgroup/queryExist'
      const payload = {
        gid: this.addForm.gid,
        gname: this.addForm.gname,
        type: this.addForm.type,
        //status: this.addForm.status
      }
      if (payload.gid && payload.gname && payload.type) {

      } else {
        this.$message.error("请正确填写")
        return
      }
      this.$axios.post(path, payload).then(response => {
        var num = response.data.data.items
        if (num == 0)
          return this.$message.success('查询成功！查询到' + num + '条记录。')
        else this.$message.info('共查询到' + num + '条记录！')
      })
          .catch(error => {
            console.log('error!', error.response)
            this.$message.info('操作失败！')
          })
    },
    submitAdd() {
      const path = '/admin/qqwxgroup/add'
      const payload = {
        gid: this.addForm.gid,
        gname: this.addForm.gname,
        type: this.addForm.type,
        status: this.addForm.status
      }
      this.$axios
          .post(path, payload)
          .then(response => {
            this.$message.success('操作成功！')
            this.showDialog = false
            this.submitSearchForm(null, false)
          })
          .catch(error => {
            console.log('error!', error.response)
            this.$message.info('操作失败！')
          })
    },
    submitSearchForm(page = null, showmessage = true) {
      this.loading = true;
      let page_str = '';
      if (page) {
        page_str = '?page=' + page;
      } else if (this.pageData.page) {
        page_str = '?page=' + this.pageData.page;
      }
      const path = '/admin/qqwxgroup/getStatistics' + page_str;
      const payload = {
        adminid: this.searchForm.adminid
      }
      this.$axios
          .post(path, payload)
          .then(response => {
            if (showmessage) {
              if (response.data.rows.length === 0) {
                // this.$message.info('暂无相关结果。')
              } else {
                // this.$message.success('搜索结果已更新！')
              }
            }
            // 把返回的搜索结果数据渲染到页面
            console.log(response)
            this.idSearchResult = true
            this.tableData = response.data.rows
            this.pageData = response.data.pagination
            this.loading = false

            // 处理成陈总想要的自然数序号从1-N衔接上----------------------------------------
            var aa = this.tableData,pageSize = 12;
            for (var i = 0, l = aa.length; i < l; i++) {
              var a = aa[i];
              a.newId = ((page || 1) - 1) * pageSize + (i + 1);
            }
          })
          .catch(error => {
            // handle error, 400 and 500
            console.log('error!', error.response)
            this.loading = false
          })
    },
    resetSearchForm() {
      this.$refs['searchForm'].resetFields()
    }
  },
  created() {
    const adminId = this.sharedState.admin_id
    this.checkAdminActive(adminId)
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

/* .image {
  width: 100%;
  display: block;
} */

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.el-message {
  min-width: 250px !important;
}

.el-message--warning {
  width: 250px !important;

}
</style>
