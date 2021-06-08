<template>
  <el-container>
    <el-main
        class="container"
        element-loading-text="加载中"
        v-loading="loading"
    >
      <div class="">
        <el-card style="margin-bottom: 10px; padding: 10px 0">
<!--          <div class="clearfix" slot="header">-->
<!--&lt;!&ndash;            <el-row class="row-bg" justify="end" type="flex">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-col :span="6">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="grid-content bg-purple">&ndash;&gt;-->
<!--&lt;!&ndash;                  <span>群推广管理</span>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-col :span="6">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="grid-content bg-purple-light"></div>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
<!--            </el-row>-->
<!--          </div>-->

          <el-form
              :inline="true"
              :model="searchForm"
              label-width="50px"
              ref="searchForm"
          >
            <el-row :gutter="5">
              <el-col :span="4">
                <el-form-item>
                  <el-input
                      clearable
                      placeholder="群名称"
                      size="small"
                      v-model="searchForm.gname"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input
                      clearable
                      placeholder="群号"
                      size="small"
                      v-model="searchForm.gid"
                  >
                  </el-input>
                </el-form-item>
              </el-col>


              <!--              <el-col :span="4">-->
              <!--                <el-form-item>-->
              <!--                  <el-input-->
              <!--                      clearable-->
              <!--                      placeholder="活跃人数"-->
              <!--                      size="small"-->
              <!--                      v-model="searchForm.hy_num"-->
              <!--                  >-->
              <!--                  </el-input>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :span="4">-->
              <!--                <el-form-item>-->
              <!--                  <el-input-->
              <!--                      clearable-->
              <!--                      placeholder="群人数"-->
              <!--                      size="small"-->
              <!--                      v-model="searchForm.num"-->
              <!--                  >-->
              <!--                  </el-input>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="4">
                <el-form-item prop="weight">
                  <el-select
                      clearable
                      placeholder="来源"
                      size="small"
                      v-model="searchForm.type"
                  >
                    <el-option label="qq" value="0">qq</el-option>
                    <el-option label="微信" value="1">微信</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="marriage">
                  <el-select
                      clearable
                      placeholder="状态"
                      size="small"
                      v-model="searchForm.status"
                  >
                    <el-option label="预存" value="0">预存</el-option>
                    <el-option label="通过" value="1">通过</el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item>
                  <el-select
                      clearable
                      placeholder="活跃度"
                      size="small"
                      v-model="searchForm.hy"
                  >
                    <el-option label="活跃" :value="true">活跃</el-option>
                    <el-option label="不活跃" :value="false">不活跃</el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item
                >
                  <el-input
                      placeholder="备注"
                      size="small"
                      v-model.trim="searchForm.remark"
                  ></el-input>
                </el-form-item>
              </el-col>

               </el-row>
            <el-row>

              <el-col :span="10">
                <el-form-item>
                   <el-button :plain="false" @click="addGroup()" type="success"
              >添加
              </el-button>
              <el-button :plain="false" @click="queryExist()" type="warning"
              >查重
              </el-button>
                  <el-button
                      :plain="false"
                      @click="submitSearchForm()"
                      icon="el-icon-search"
                      type="primary"
                      style="margin-left: 110px"
                  >搜索
                  </el-button>
                  <el-button :plain="false" @click="resetSearchForm()"
                  >重置
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="margin-left: 100px;margin-top: 5px">
                <el-tag>预存群数量：{{ mark.yucun }}</el-tag>&nbsp;&nbsp;
                <el-tag type="success">通过群数量：{{ mark.queren }}</el-tag>&nbsp;&nbsp;
                <el-tag type="success">活跃群数量：{{ mark.huoyue }}</el-tag>&nbsp;&nbsp;
                <el-tag type="success">活跃群人数：{{ mark.huoyue2 }}</el-tag>
              </el-col>
            </el-row>
            <el-dialog
                :title="dialogName"
                :visible.sync="showDialog"
                width="30%"
            >
              <el-fhandleSubmitorm :model="addForm" ref="form">
                <el-form-item label="群类型" prop="type">
                  <el-select
                      clearable
                      placeholder="类型"
                      size="small"
                      v-model="addForm.type"
                  >
                    <el-option :value="0" label="qq">qq</el-option>
                    <el-option :value="1" label="微信">微信</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="群名称" prop="gname">
                  <el-input
                      placeholder="请输入群名称"
                      v-model.trim="addForm.gname"
                  ></el-input>
                </el-form-item>
                <el-form-item
                    label="群号"
                    prop="gid"
                    v-if="this.addForm.type == 0"
                >
                  <el-input
                      placeholder="请输入群号"
                      v-model.trim="addForm.gid"
                  ></el-input>
                </el-form-item>


                <el-form-item
                    label="状态"
                    prop="status"
                    v-if="clickAction == 'addGroup'"
                >
                  <el-select
                      clearable
                      placeholder="状态"
                      size="small"
                      v-model="addForm.status"
                  >
                    <el-option :value="0" label="预存">预存</el-option>
                    <el-option :value="1" label="已通过">通过</el-option>
                  </el-select>
                </el-form-item>

              </el-fhandleSubmitorm>
              <div class="dialog-footer" slot="footer">
                <el-button
                    @click="handleSubmit"
                    class="btn-custom"
                    type="primary"
                >
                  确 定
                </el-button>
              </div>
            </el-dialog>
          </el-form>
          <el-row v-if="idSearchResult">
            <el-table :data="tableData" style="width: 100%; font-size: 12px">
              <el-table-column label="ID" prop="newId" width="50"></el-table-column>

              <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->

              <el-table-column label="群ID" prop="gid" align="center" width="85"></el-table-column>
              <el-table-column label="群名" prop="gname"  width="170" align="center"></el-table-column>
              <el-table-column :formatter="typeFormat" label="类型" prop="type" width="50">
              </el-table-column>
              <el-table-column label="状态" prop="status" align="center" width="100">
                <template slot-scope="scope">
                  <el-select
                      @change="statusChange($event, scope.row, scope.column)"
                      placeholder="状态"
                      v-model="scope.row.status"
                  >
                    <el-option
                        :key="item.id"
                        :label="item.state"
                        :value="item.id"
                        v-for="item in statusList"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="管理员" prop="adminname" width="100">
              </el-table-column>

              <el-table-column label="群人数" prop="num" width="70" align="center">
              </el-table-column>
              <!--              <el-table-column label="活跃群人数" prop="hy_num">-->
              <!--              </el-table-column>-->
              <el-table-column label="活跃度" prop="hy2"  width="70" align="center">
              </el-table-column>
              <el-table-column label="备注" prop="remark" align="center">
              </el-table-column>
              <el-table-column label="时间" prop="createtime" align="center" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.createtime }}</div>
                  <div>{{ scope.row.createtime2}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">

                   <el-button
                      @click="submitUpdate(scope.row)"
                      type="text"
                      size="small"
                  >编辑

                  </el-button
                  >
                  <el-button
                      @click="submitDelete(scope.row)"
                      type="text"
                      size="small"
                  >删除
                  </el-button
                  >


                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-card>
      </div>
      <el-row :lg="6" :sm="20" style="padding: 20px 0">
        <el-pagination
            :current-page="pageData.page"
            :hide-on-single-page="true"
            :page-count="pageData.pages"
            :size="pageData.per_page"
            @current-change="submitSearchForm"
            background
            layout="prev, pager, next"
            small
        >
        </el-pagination>
      </el-row>

      <el-dialog
          title="删除推广记录操作"
          :custom-class="dialog_recode_delete"
          :visible.sync="dialog_recode_delete"
          width="300px"
      >
        <DeleteQQWXGroup
            :id="dialog_recode_delete_id"
            v-if="dialog_recode_delete"
        ></DeleteQQWXGroup>
      </el-dialog>

      <el-dialog
          title="编辑"
          :visible.sync="updateVisible"
          width="30%"
          center>

        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="群人数">
            <el-input-number v-model="num" label="群人数"></el-input-number>
          </el-form-item>
          <!--          <el-form-item label="活跃人数">-->
          <!--            <el-input-number v-model="hy_num" label="活跃人数"></el-input-number>-->
          <!--          </el-form-item>-->
          <el-form-item label="活跃度">
            <el-radio v-model="hy" :label="true">活跃</el-radio>
            <el-radio v-model="hy" :label="false">不活跃</el-radio>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="remark" maxlength="50" placeholder="最多输入50个字符"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="goUpdate">保存</el-button>
          </el-form-item>
        </el-form>


      </el-dialog>


    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import DeleteQQWXGroup from '@/views/DeleteQQWXGroup';

export default {
  name: "QQWXGroup", // this is the name of the component
  components: {DeleteQQWXGroup},
  data() {
    return {
      mark: {
        yucun: "",
        queren: "",
        huoyue: "",
        huoyue2: "",
      },
      hy_num: 0,
      num: 0,
      hy: false,
      remark: "",
      dialog_recode_delete: false,
      updateVisible: false,
      updateVisibleId: "",
      dialog_recode_delete_id: "",
      idSearchResult: false,
      loading: false,
      store: store,
      sharedState: store.state,
      showResult: false,
      showDialog: false,
      clickAction: "",

      addForm: {
        gid: "",
        gname: "",
        type: 0,
        status: 0,

      },
      searchForm: {
        gid: "",
        gname: "",
        type: "",
        status: "",
        num: "",
        hy: "",
        remark: ""
      },
      resultData: {},
      pageData: {},
      tableData: {},
      statusList: [
        {id: 0, state: "预存"},
        {id: 1, state: "通过"},
      ],
      dialogName: "添加",
      rules: {
        type: [{required: true, message: "必填", trigger: "blur"}],
        gname: [{required: true, message: "必填", trigger: "blur"}],
        gid: [{required: true, message: "必填", trigger: "blur"}],
        status: [{required: true, message: "必填", trigger: "blur"}],
      },
    };
  },
  methods: {
    goUpdate() {
      var method = "";
      const path = "/admin/qqwxgroup/update2";
      const payload = {
        id: this.updateVisibleId,
        num: this.num,
        remark: this.remark,
        hy: this.hy,
        hy_num: this.hy_num,
      };
      let that = this;
      this.$axios
          .post(path, payload)
          .then((response) => {
            that.updateVisible = false;
            that.submitSearchForm(null, false);
            this.$message.success("操作成功！");
          })
          .catch((error) => {
            console.log("error!", error.response);
            that.submitSearchForm(null, false);
            that.updateVisible = false;
            this.$message.info("操作失败！");
          });
    },
    addGroup() {
      this.dialogName = "添加";
      this.resetDialogData();
      this.clickAction = "addGroup";
      this.showDialog = true;
    },
    queryExist() {
      this.dialogName = "查重";
      this.resetDialogData();
      this.clickAction = "queryExist";
      this.showDialog = true;
    },
    statusChange(val, row, column) {
      var method = "";
      const path = "/admin/qqwxgroup/update";
      const payload = {
        id: row.id,
        status: val,
      };
      this.$axios
          .post(path, payload)
          .then((response) => {
            this.$message.success("操作成功！");
          })
          .catch((error) => {
            console.log("error!", error.response);
            this.$message.info("操作失败！");
            row[column.property] = !row[column.property];
          });
    },
    typeFormat(row, column) {
      if (row[column.property] === 0) {
        return "QQ";
      } else {
        return "微信";
      }
    },
    statusFormat(row, column) {
      if (row[column.property] === 0) {
        return "预存";
      } else {
        return "通过";
      }
    },
    checkAdminActive(id) {
      // eslint-disable-next-line no-template-curly-in-string
      const path = `/admin/admins/${id}/active`;
      this.$axios
          .get(path)
          .then((response) => {
            if (!response.data.active) {
              this.store.adminLogoutAction();
            }
          })
          .catch((error) => {
            console.error(error);
          });
    },
    limitAdminPages() {
      // 如果当前用户是普通管理员，而且 pageData.pages 的值大于 10，重置为 10
      // if (!this.sharedState.is_super_admin && this.pageData.pages > 10) {
      //   this.pageData.pages = 10;
      // }
    },
    resetDialogData() {
      this.addForm.gid = "";
      this.addForm.gname = "";
      this.addForm.type = 0;
      this.addForm.status = 0;
    },
    handleSubmit() {
      if (this.clickAction == "addGroup") {
        this.submitAdd();
      } else if (this.clickAction == "queryExist") {
        this.submitQuery();
      }
    },
    submitQuery() {
      const path = "/admin/qqwxgroup/queryExist";
      const payload = {
        gid: this.addForm.gid,
        gname: this.addForm.gname,
        type: this.addForm.type,
        //status: this.addForm.status
      };
      if (!(payload.gid || payload.gname)) {
        this.$message.warning("请输入群号或群名称");
        return;
      }

      this.$axios
          .post(path, payload)
          .then((response) => {
            let num = response.data.data.items;
            if (num == 0) {
              return this.$message.success("查询成功！查询到" + num + "条记录。");
            } else {
              this.$message.info("共查询到" + num + "条记录！");
            }
          })
          .catch((error) => {
            this.$message.info("操作失败！");
          });
    },
    submitAdd() {
      const path = "/admin/qqwxgroup/add";
      const payload = {
        gid: this.addForm.gid,
        gname: this.addForm.gname,
        type: this.addForm.type,
        status: this.addForm.status,
      };
      if (!payload.gid) {
        this.$message.warning("请输入群号");
        return;
      }
      if (!payload.gname) {
        this.$message.warning("请输入群名称");
        return;
      }

      this.$axios
          .post(path, payload)
          .then((response) => {
            this.$message.success("操作成功！");
            this.showDialog = false;
            this.submitSearchForm(null, false);
          })
          .catch((error) => {
            console.log("error!", error.response);
            this.$message.info("操作失败！");
          });
    },
    submitSearchForm(page = null, showmessage = true) {
      this.loading = true;
      let page_str = "";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      const path = "/admin/qqwxgroup/getlist" + page_str;
      const payload = {
        gid: this.searchForm.gid,
        gname: this.searchForm.gname,
        type: this.searchForm.type,
        status: this.searchForm.status,
        num: this.searchForm.num,
        hy: this.searchForm.hy,
        remark: this.searchForm.remark,
      };
      this.$axios
          .post(path, payload)
          .then((response) => {
            if (showmessage) {
              if (response.data.rows.length === 0) {
                // this.$message.info("暂无相关结果。");
              } else {
                // this.$message.success('搜索结果已更新！')
              }
            }
            // 把返回的搜索结果数据渲染到页面
            console.log(response);
            this.idSearchResult = true;
            this.tableData = response.data.rows;
            // 处理成陈总想要的自然数序号从1-N衔接上----------------------------------------
            var aa = this.tableData,
                pageSize = 12;
            for (var i = 0, l = aa.length; i < l; i++) {
              var a = aa[i];
              a.newId = ((page || 1) - 1) * pageSize + (i + 1);
            }
            console.log(this.tableData);
            //   ----------------------------------------

            this.pageData = response.data.pagination;
            this.limitAdminPages();
            this.loading = false;
            this.mark = {
              "yucun": response.data.yucun,
              "queren": response.data.queren,
              "huoyue": response.data.huoyue,
              "huoyue2": response.data.huoyue2
            }
          })
          .catch((error) => {
            // handle error, 400 and 500
            console.log("error!", error.response);
            this.loading = false;
          });
    },
    resetSearchForm() {
      this.$refs["searchForm"].resetFields();
    },
    submitUpdate(row) {
      this.updateVisible = true
      this.updateVisibleId = row.id
      this.num = row.num
      this.hy = row.hy
      this.hy_num = row.hy_num
      this.remark = row.remark
    },
    submitDelete(row) {
      this.dialog_recode_delete = true
      this.dialog_recode_delete_id = row.id


      // this.$confirm("是否确认删除？")
      //   .then((_) => {
      //     this.loading = true;
      //     const path = "/admin/qqwxgroup/delete";
      //     const payload = {
      //       id: row.id,
      //     };
      //     this.$axios
      //       .post(path, payload)
      //       .then((response) => {
      //         this.$message.success("删除成功!");
      //         this.submitSearchForm(null, false);
      //       })
      //       .catch((error) => {
      //         // handle error, 400 and 500
      //         console.log("error!", error.response);
      //         this.loading = false;
      //       });
      //   })
      //   .catch((_) => {});
    },
  },
  created() {
    const adminId = this.sharedState.admin_id;
    this.checkAdminActive(adminId);
  },
};
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
  clear: both;
}

.dialog_recode_delete {
  border-radius: 20px;
}
</style>
