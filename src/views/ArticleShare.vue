<template>
  <!-- 文章分享 -->
  <el-container>
    <el-main class="container">
      <el-tabs type="card" v-model="active">
        <el-tab-pane label="文章分享" name="record">
          <div class="search-row">
            <el-button type="primary" @click="handleEdit()">新建文章</el-button>
            <div class="r">
              <el-input
                v-model.trim="searchInput"
                placeholder="请输入关键词…"
                style="margin-right: 10px"
                clearable
                @clear="search"
              />
              <el-button
                @click.stop="search"
                type="primary"
                icon="el-icon-search"
              />
            </div>
          </div>
          <div>
            <el-table
              :hide-pagination="paginationHide"
              @select="select"
              @select-all="select"
              :data="tableData"
              ref="table"
              stripe
            >
              <!-- <el-table-column type="selection" width="50"></el-table-column> -->

              <el-table-column
                label="ID"
                type="index"
                :index="indexMethod"
                width="40"
                :fit="false"
              >
              </el-table-column>
              <!-- <el-table-column label="ID" show-overflow-tooltip width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.newId }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="标题" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="摘要" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.abstract }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="内容" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.content }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                  <span
                    ><el-tag :type="getType(scope.row.status)">{{
                      getStatus(scope.row.status)
                    }}</el-tag></span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                :width="sharedState.is_super_admin ? 460 : 400"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click.stop="handleRead(scope.$index, scope.row)"
                    >查看</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    :disabled="
                      !(
                        scope.row.status == 0 ||
                        scope.row.status == 2 ||
                        scope.row.status == null
                      )
                    "
                    @click.stop="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="sharedState.is_super_admin && scope.row.status == 1"
                    size="mini"
                    type="success"
                    plain
                    @click.stop="handlePass(scope.$index, scope.row)"
                    >通过</el-button
                  >
                  <el-button
                    v-if="sharedState.is_super_admin && scope.row.status == 3"
                    size="mini"
                    type="success"
                    plain
                    @click.stop="handleRefuse(scope.$index, scope.row)"
                    >拒绝</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click.stop="del(scope.row)"
                    >删除</el-button
                  >
                  <el-popover
                    placement="bottom"
                    title="分享文章二维码"
                    width="200"
                    trigger="click"
                    style="margin-left: 10px"
                  >
                    <!-- 生成二维码 -->
                    <div class="sg-qrcode">
                      <vue-qr
                        :text="sharePrefixUrl + scope.row.id"
                        :correctLevel="3"
                        :size="200"
                        :margin="10"
                        colorDark="black"
                        colorLight="white"
                        backgroundColor="white"
                        backgroundDimming="white"
                        :logoSrc="require('@/assets/logo.png')"
                        :logoScale="0.2"
                        :logoMargin="5"
                        logoBackgroundColor="white"
                      ></vue-qr>
                      <p>用手机扫码转发</p>
                      <p>文章链接：{{ sharePrefixUrl + scope.row.id }}</p>
                    </div>

                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-s-promotion"
                      slot="reference"
                      :disabled="scope.row.status != 3"
                      >分享</el-button
                    >
                  </el-popover>

                  <el-button
                    style="margin-left: 10px"
                    size="mini"
                    type="primary"
                    plain
                    @click.stop="handleEditRemarks(scope.$index, scope.row)"
                    >编辑备注</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="备注" width="140">
                <template slot-scope="scope">
                  <span>{{ scope.row.remarks }}</span>
                </template>
              </el-table-column>
              <el-table-column label="作者" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.row.author || "后台未提供" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="100">
                <template slot-scope="scope">
                  <span>{{
                    new Date(scope.row.create_time)
                      .toLocaleString("zh-Hans-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                      .replace(/\//g, "-")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="修改时间" width="100">
                <template slot-scope="scope">
                  <span>{{
                    new Date(scope.row.modify_time)
                      .toLocaleString("zh-Hans-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                      .replace(/\//g, "-")
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="row-bg" style="margin-top: 10px">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[50, 100]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </el-row>
            <!-- 创建文章---------------------------------------- -->
            <el-dialog
              width="1160px"
              :title="`${btnTitle}${'文章'}`"
              :visible.sync="dialogVisible"
            >
              <div>
                <div>
                  <el-form
                    ref="form"
                    :model="form"
                    label-width="60px"
                    size="mini"
                  >
                    <el-form-item label="标题">
                      <el-input
                        style="width: 300px"
                        v-model.trim="form.title"
                        maxlength="20"
                        placeholder="请输入不超过20个字"
                      />
                    </el-form-item>
                    <el-form-item label="摘要">
                      <el-input
                        style="width: 300px"
                        v-model.trim="form.abstract"
                        maxlength="20"
                        placeholder="请输入不超过20个字"
                      />
                    </el-form-item>
                    <el-form-item label="内容">
                      <wangEditor
                        v-model.trim="form.content"
                        :isClear="isClear"
                      ></wangEditor>
                    </el-form-item>
                    <!-- <el-form-item label="备注">
                      <el-input
                        v-model.trim="form.remarks"
                        maxlength="50"
                        placeholder="请输入不超过50个字"
                      />
                    </el-form-item> -->

                    <el-form-item>
                      <el-button type="" @click="saveArticle"
                        >保存草稿</el-button
                      >
                      <el-button type="primary" @click="submit"
                        >提交审核</el-button
                      >
                      <!-- <el-button type="danger" @click="del(form)"
                        >删除文章</el-button
                      > -->
                      <el-button
                        type="info"
                        plain
                        @click="dialogVisible = false"
                        >取消</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
                <div class="pre-share-card">
                  <div class="pre-title">{{ form.title }}</div>
                  <div class="pre-abstract">{{ form.abstract }}</div>
                  <img src="~@/assets/logo.png" />
                </div>
                <!-- <div style="width: 300px"></div> -->
              </div>
            </el-dialog>
            <!-- 编辑备注---------------------------------------- -->
            <el-dialog
              width="500px"
              title="编辑备注"
              :visible.sync="dialogVisibleRemarks"
            >
              <div>
                <div>
                  <el-form
                    ref="form"
                    :model="form"
                    label-width="60px"
                    size="mini"
                  >
                    <el-form-item label="备注">
                      <el-input
                        type="textarea"
                        v-model.trim="form.remarks"
                        maxlength="50"
                        show-word-limit
                        placeholder="请输入不超过50个字"
                      />
                    </el-form-item>

                    <el-form-item>
                      <el-button type="" @click="saveRemarks">确定</el-button>
                      <el-button
                        type="info"
                        plain
                        @click="dialogVisibleRemarks = false"
                        >取消</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import vueQr from "vue-qr"; //引入二维码生成组件
import wangEditor from "../components/wangEditor";
import store from "../store";
export default {
  name: "ArticleShare", // this is the name of the component
  components: {
    vueQr, //二维码生成组件
    wangEditor, //富文本框编辑器
  },
  data() {
    return {
      total:0,
      pages: 0,
      apiUrl: "https://lovelink.net.cn/v1",
      sharePrefixUrl: location.protocol + "//" + location.host + "/Article?id=",
      isClear: false, ///清空内容
      btnTitle: "",
      tableData: [
        /* {
          id: 1,
          title: "文章标题",
          abstract: "文章摘要",
          content: "文章内容",
        },
        {
          id: 2,
          title: "文章标题文章标题",
          abstract: "文章摘要文章摘要文章摘要",
          content: "文章内容文章内容文章内容",
        },
        {
          id: 3,
          title: "文章标题文章标题文章标题",
          abstract: "文章摘要文章摘要",
          content: "文章内容文章内容文章内容文章内容文章内容文章内容",
        },
        {
          id: 4,
          title: "文章标题",
          abstract: "文章摘要",
          content: "文章内容",
        },
        {
          id: 5,
          title: "文章标题",
          abstract: "文章摘要",
          content: "文章内容",
        }, */
      ],
      delButtonDisabled: false,
      load: null,
      dialogVisible: false,
      dialogVisibleRemarks: false,
      searchInput: "",
      currentPage: 1,
      pageSize: 50,
      paginationHide: false,
      form: {},
      sharedState: store.state,
      active: "record",
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化所有内容
    init() {
      // 搜索对应的老师名下的教学班列表________________________
      // 初始化获取文章列表
      this.loading();
      this.getArticleList((d) => {});
    },
    getType(type) {
      switch (type) {
        // 0: 草稿，1：完稿（提交待审核），2：拒绝状态，3：通过状态；
        case 0:
          return "info";
          break;
        case 1:
          return "warning";
          break;
        case 2:
          return "danger";
          break;
        case 3:
          return "success";
          break;
        default:
          return "info";
      }
    },
    getStatus(type) {
      switch (type) {
        // 0: 草稿，1：完稿（提交待审核），2：拒绝状态，3：通过状态；
        case 0:
          return "草稿";
          break;
        case 1:
          return "完稿(待审核)";
          break;
        case 2:
          return "拒绝";
          break;
        case 3:
          return "通过";
          break;
        default:
          return "草稿";
      }
    },
    //a)	获取文章列表接口（与模糊查找合并）
    getArticleList(c) {
      this.$axios
        .post(`${this.apiUrl}/admin/article/list`, {
          keyword: this.searchInput || "",
          page: this.currentPage,
          per_page: this.pageSize,
        })
        .then((d) => {
          this.hideLoading();
          this.dialogVisible = false;
          this.pages = d.data.pages || 0;
          this.tableData = d.data.data.length ? d.data.data : [];
          this.total=d.data.total;
          this.dialogVisible = false;
          this.dialogVisibleRemarks = false;

          // 处理成陈总想要的自然数序号从1-N衔接上----------------------------------------
          /* var aa = this.tableData;
          for (var i = 0, l = aa.length; i < l; i++) {
            var a = aa[i];
            a.newId = ((this.currentPage || 1) - 1) * this.pageSize + (i + 1);
          } */
          // ----------------------------------------
          c && c(d);
        })
        .catch((d) => {
          this.hideLoading();
          this.$message.error("获取文章列表失败");
          this.dialogVisible = false;
          this.dialogVisibleRemarks = false;
        });
    },
    //c)	提交文章接口
    addArticle(d, c) {
      this.$axios
        .post(`${this.apiUrl}/admin/articles/add`, d)
        .then((d) => {
          c && c(d);
        })
        .catch((d) => {
          this.$message.error("提交失败");
        });
    },
    //d)	修改文章接口
    updateArticle(d, c) {
      this.$axios
        .post(`${this.apiUrl}/admin/articles/update`, d)
        .then((d) => {
          c && c(d);
        })
        .catch((d) => {
          this.$message.error("修改失败");
        });
    },
    //e)	删除文章接口
    delArticle(d, c) {
      this.$axios
        .post(`${this.apiUrl}/admin/articles/delete`, d)
        .then((d) => {
          c && c(d);
        })
        .catch((d) => {
          this.$message.error("删除失败");
        });
    },
    // 显示加载动画
    loading(text = "加载中…") {
      this.load = this.$loading({ text: text });
    },
    // 隐藏加载动画
    hideLoading() {
      this.load && this.load.close();
    },
    // ----------------------------------------------------------------
    //当用户手动勾选数据行的 Checkbox 时触发的事件；当用户手动勾选全选 Checkbox 时触发的事件
    select(selection) {
      //   this.delButtonDisabled = selection.length === 0;
    },
    // 通过
    handlePass(index, row) {
      this.updateArticle({ id: row.id, status: 3 }, (d) => {
        this.$message.success("文章审核通过成功");
        this.init();
      });
    },
    // 拒绝
    handleRefuse(index, row) {
      this.updateArticle({ id: row.id, status: 2 }, (d) => {
        this.$message.success("文章拒绝通过");
        this.init();
      });
    },
    // 查看
    handleRead(index, row) {
      window.open(this.sharePrefixUrl + row.id); //跳转到文章
    },
    // 编辑备注
    handleEditRemarks(index = null, row = {}) {
      this.dialogVisibleRemarks = true;
      this.form = row;
      this.form = JSON.parse(JSON.stringify(this.form));
      this.form.remarks = "";
    },
    // 编辑一条记录
    handleEdit(index = null, row = {}) {
      this.dialogVisible = true;
      this.form = row;
      this.form = JSON.parse(JSON.stringify(this.form));
      this.btnTitle = index === null ? "添加" : "修改";
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getArticleList((d) => {});
    },
    indexMethod(index) {
      return ((this.currentPage || 1) - 1) * this.pageSize + (index + 1);
    },
    // 修改每页条数
    handleSizeChange(val) {
      // this.pageSize = val;
      this.delButtonDisabled = true;
      this.init();
    },
    // 切换页码
    handleCurrentChange(val) {
      // this.currentPage = val;
      this.delButtonDisabled = true;
      this.init();
    },
    del(row) {
      // console.log(row);
      this.$confirm("此操作将永久删除该文章，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading("删除中…");
          this.delArticle({ id: row.id }, (d) => {
            this.$message({
              type: "success",
              message: "删除【" + row.title + "】成功",
            });
            this.init();
          });
        })
        .catch(() => {
          // this.$message({ type: "info", message: "已取消删除" });
        });
    },
    // 报错提示
    __err(msg) {
      this.$message.error(msg);
      return true;
    },
    // 验证提交
    valid(id) {
      const _f = this.form;
      if (!_f.title) return this.__err("请填写" + "文章标题");
      if (!_f.abstract) return this.__err("请填写" + "文章摘要");
      if (!_f.content) return this.__err("请填写" + "文章内容");
      if (id) {
      }
    },
    // 编辑备注
    saveRemarks() {
      // if (this.valid(this.form.id)) return;
      // this.form.status = 0;
      const _f = this.form;
      if (!_f.remarks) return this.__err("请填写" + "备注内容");
      if (this.form.id) {
        //   修改
        this.updateArticle(this.form, (d) => {
          this.$message.success("备注编辑成功");
          this.init();
        });
      } else {
        //   添加
        this.addArticle(this.form, (d) => {
          this.$message.success("备注添加成功");
          this.init();
        });
      }
    },
    // 保存草稿
    saveArticle() {
      if (this.valid(this.form.id)) return;
      this.form.status = 0;
      if (this.form.id) {
        //   修改
        this.updateArticle(this.form, (d) => {
          this.$message.success("修改成功");
          this.init();
        });
      } else {
        //   添加
        this.addArticle(this.form, (d) => {
          this.$message.success("添加成功");
          this.init();
        });
      }
    },
    // 提交审核
    submit() {
      if (this.valid(this.form.id)) return;
      this.form.status = 1;
      if (this.form.id) {
        //   修改
        this.updateArticle(this.form, (d) => {
          this.$message.success("修改成功");
          this.init();
        });
      } else {
        //   添加
        this.addArticle(this.form, (d) => {
          this.$message.success("添加成功");
          this.init();
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
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

.search-row {
  display: flex;
  justify-content: space-between;
}
.search-row .r {
  display: flex;
  justify-content: flex-end;
}

.pre-share-card {
  padding: 10px;
  position: absolute;
  top: 60px;
  right: 20px;
  width: 230px;
  height: 110px;
  box-sizing: border-box;
  border: 2px solid #eee;
  box-shadow: 0 10px 30px #00000011;
  border-radius: 4px;
  &::before {
    content: "预览效果：";
    position: absolute;
    top: -30px;
    left: 0px;
  }
  img {
    width: 30px;
    height: 30px;
    box-shadow: 0 10px 30px #00000011;
    border-radius: 4px;
    /*父元素需要position: relative|absolute;*/
    position: absolute;
    margin: auto;
    right: 20px;
    bottom: 20px;
  }
  .pre-title {
    font-size: 14px;
    height: 40px;
    line-height: 1.2;
  }
  .pre-abstract {
    line-height: 1.2;
    margin-top: -5px;
    margin-right: 50px;
    color: #999;
  }
}
</style>
