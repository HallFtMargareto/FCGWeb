<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">
        <el-form-item label="账号">
          <el-input v-model="searchInfo.userName" placeholder="登录账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="用户角色">
          <el-cascader v-model.number="searchInfo.authorityId" :options="authOptions" :show-all-levels="false" :props="{
            checkStrictly: true,
            label: 'authorityName',
            value: 'authorityId',
            disabled: 'disabled',
            emitPath: false,
            expandTrigger: 'hover',
          }" @change="closeCasc" ref="cascaderHandle" filterable clearable></el-cascader>
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button @click="createRow" icon="el-icon-plus" type="primary">新增</el-button>
      </el-form>
    </div>

    <!-- 用户列表表格 -->
    <el-table :data="tableData" border stripe>
      <el-table-column label="ID" prop="ID" sortable width="80"></el-table-column>

      <el-table-column label="账号" prop="username" min-width="150"></el-table-column>

      <el-table-column label="昵称" prop="nick_name" min-width="120"></el-table-column>

      <!-- host 账号可查看所有组织的用户，显示所属组织列 -->
      <el-table-column label="所属组织" min-width="150" v-if="userInfo.perm['host']">
        <template slot-scope="scope">
          {{ getTenantName(scope.row.tenant_id) }}
        </template>
      </el-table-column>

      <el-table-column label="关联会话" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.session_names }}
        </template>
      </el-table-column>

      <!-- 初始账号标识 -->
      <!-- <el-table-column label="初始账号" width="90" align="center">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.is_first" true-text="是" false-text="否"></booltag>
        </template>
      </el-table-column> -->

      <!-- 账号状态，支持下拉切换 -->
      <el-table-column label="状态" min-width="130" align="center">
        <template slot-scope="scope">
          <div class="status-cell">
            <el-tag size="small" :type="statusTagType(scope.row.status)">
              {{ statusText(scope.row.status) }}
            </el-tag>
            <el-dropdown @command="(command) => changeUserStatus(scope.row, command)" class="status-dropdown">
              <el-button type="text" size="small">
                状态<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1" :disabled="scope.row.status === 1">启用</el-dropdown-item>
                <el-dropdown-item command="2" :disabled="scope.row.status === 2">禁用</el-dropdown-item>
                <el-dropdown-item command="3" :disabled="scope.row.status === 3">锁定</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button @click="editRow(scope.row)" type="text" size="small" icon="el-icon-edit">编辑</el-button>

          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定要删除该用户吗？" @confirm="deleteRow(scope.row)">
            <el-button type="text" size="small" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>

          <el-button @click="changePwd(scope.row)" type="text" size="small" icon="el-icon-key">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
      :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>

    <!-- 新建/编辑用户弹窗 -->
    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" width="30%" ref="dialog">

      <!-- 创建时才显示账号输入框 -->
      <el-form-item label="登录账号" prop="userName" v-if="type === 'create'">
        <el-input v-model="formData.userName" placeholder="请输入登录用户名" clearable></el-input>
      </el-form-item>

      <!-- 创建时才显示密码输入框 -->
      <el-form-item label="登录密码" prop="passWord" v-if="type === 'create'">
        <el-input v-model="formData.passWord" placeholder="请输入登录密码" show-password></el-input>
      </el-form-item>

      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="formData.nickName" placeholder="请输入用户昵称" clearable></el-input>
      </el-form-item>

      <!-- 编辑时才显示状态选择 -->
      <el-form-item label="账号状态" prop="status" v-if="type === 'update'">
        <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="正常" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
          <el-option label="锁定" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <!-- host 账号创建时选择所属组织 -->
      <el-form-item label="所属组织" prop="tenantId" v-if="type === 'create' && userInfo.perm['host']">
        <TenantSelect v-model="formData.tenantId" placeholder="请选择所属组织" clearable style="width: 100%"></TenantSelect>
      </el-form-item>

      <!-- 创建时选择关联会话，支持多选，按所属组织过滤会话列表 -->
      <el-form-item label="关联会话" prop="sessionId" v-if="type === 'create'">
        <FcgContactSelect v-model="formData.sessionId" :tenant-id="formData.tenantId" multiple placeholder="请选择关联会话"
          clearable></FcgContactSelect>
      </el-form-item>
    </dialogform>

    <!-- 重置密码弹窗 -->
    <el-dialog :visible.sync="showPassword" @close="clearPassword" title="重置密码" width="25%">
      <el-form :model="pwdModify" :rules="rulePwd" label-width="80px" ref="modifyPwdForm" size="mini">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdModify.newPassword" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdModify.confirmPassword" show-password placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer" style="text-align: center">
        <el-button @click="showPassword = false">取 消</el-button>
        <el-button @click="savePassword" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createFcgTenantUser,
  deleteFcgTenantUser,
  updateFcgTenantUser,
  findFcgTenantUser,
  getFcgTenantUserList,
  resetFcgTenantUserPassword,
} from "@/api/fcgame/fcg_tenant_user";
import infoList from "@/mixins/infoList";
import FcgContactSelect from "@/components/fcgContactSelect/index.vue";
import { mapGetters } from "vuex";

export default {
  name: "fcg_tenant_user",
  mixins: [infoList],
  components: { FcgContactSelect },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapGetters("gameInfo", ["tenants"]),
    // 根据操作类型动态返回表单校验规则
    formRules() {
      if (this.type === "create") {
        return {
          userName: [
            { required: true, message: "请输入登录账号", trigger: "blur" },
            { min: 3, message: "最低3位字符", trigger: "blur" },
          ],
          passWord: [
            { required: true, message: "请输入登录密码", trigger: "blur" },
            { min: 6, message: "最低6位字符", trigger: "blur" },
          ],
          nickName: [
            { required: true, message: "请输入用户昵称", trigger: "blur" },
          ],
        };
      }
      // 编辑模式下不强制校验字段（空值不更新）
      return {};
    },
  },
  data() {
    return {
      listApi: getFcgTenantUserList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      authOptions: [], // 角色级联选项
      formData: {
        userName: "",
        passWord: "",
        nickName: "",
        authorityId: "",
        headerImg: "",
        tenantId: undefined,
        // 关联会话，多选模式为数组
        sessionId: [],
        status: 1,
      },
      // 重置密码弹窗相关
      showPassword: false,
      pwdModify: {
        id: undefined,
        newPassword: "",
        confirmPassword: "",
      },
      rulePwd: {
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" },
          {
            // 校验两次密码是否一致
            validator: (rule, value, callback) => {
              if (value !== this.pwdModify.newPassword) {
                callback(new Error("两次密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 关闭搜索区域的角色级联下拉框
    closeCasc() {
      this.$refs.cascaderHandle.dropDownVisible = false;
    },
    // 将角色列表转换为级联选择器所需的数据结构
    setOptions(authData) {
      this.authOptions = [];
      this.setAuthorityOptions(authData, this.authOptions);
    },
    // 递归构建角色级联选项
    setAuthorityOptions(AuthorityData, optionsData) {
      AuthorityData &&
        AuthorityData.map((item) => {
          if (item.children && item.children.length) {
            const option = {
              authorityId: item.authorityId,
              authorityName: item.authorityName,
              children: [],
            };
            this.setAuthorityOptions(item.children, option.children);
            optionsData.push(option);
          } else {
            const option = {
              authorityId: item.authorityId,
              authorityName: item.authorityName,
            };
            optionsData.push(option);
          }
        });
    },
    // 根据状态值获取标签类型
    statusTagType(status) {
      const map = { 1: "success", 2: "info", 3: "danger" };
      return map[status] || "info";
    },
    // 根据状态值获取状态文本
    statusText(status) {
      const map = { 1: "正常", 2: "禁用", 3: "锁定" };
      return map[status] || "未知";
    },
    // 根据tenant_id获取组织名称
    getTenantName(tenantId) {
      if (!tenantId || !this.tenants || this.tenants.length === 0) {
        return "";
      }
      const tenant = this.tenants.find((t) => t.ID === tenantId);
      return tenant ? tenant.platform_name : "";
    },
    // 查询按钮回调
    onQuery() {
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    // 打开新建弹窗
    createRow() {
      this.formData = {
        userName: "",
        passWord: "",
        nickName: "",
        authorityId: "",
        headerImg: "",
        tenantId: undefined,
        // 关联会话，多选模式为数组
        sessionId: [],
        status: 1,
      };
      this.type = "create";
      this.dialogTitle = "新建下级账号";
      this.openDialog = true;
    },
    // 打开编辑弹窗，先获取用户详情
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑下级账号";
      const res = await findFcgTenantUser({ id: row.ID });
      if (res.code == 0) {
        this.formData = res.data.user;
        this.openDialog = true;
      }
    },
    // 删除用户
    async deleteRow(row) {
      const res = await deleteFcgTenantUser({ id: row.ID });
      if (res.code == 0) {
        this.$message({ type: "success", message: "删除成功" });
        // 当前页只剩一条数据时，删除后回退一页
        if (this.tableData.length == 1) {
          this.page--;
        }
        this.getTableData();
      }
    },
    // 弹窗确认回调，根据类型调用创建或更新接口
    async enterDialog() {
      let res;
      switch (this.type) {
        case "create":
          res = await createFcgTenantUser(this.formData);
          break;
        case "update":
          // 更新时只提交可更新字段
          res = await updateFcgTenantUser({
            id: this.formData.ID,
            nickName: this.formData.nickName,
            headerImg: this.formData.headerImg,
            authorityId: this.formData.authorityId,
            status: this.formData.status,
          });
          break;
        default:
          this.$message({ type: "error", message: "操作类型错误" });
          return false;
      }
      if (res.code == 0) {
        this.$message({ type: "success", message: "操作成功" });
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    // 切换用户状态（启用/禁用/锁定）
    async changeUserStatus(row, status) {
      const statusMap = { 1: "启用", 2: "禁用", 3: "锁定" };
      this.$confirm(`确定要${statusMap[status]}该用户吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await updateFcgTenantUser({
            id: row.ID,
            status: parseInt(status),
          });
          if (res.code == 0) {
            this.$message({ type: "success", message: "操作成功" });
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消操作" });
        });
    },
    // 打开重置密码弹窗
    changePwd(row) {
      this.pwdModify = {
        id: row.ID,
        newPassword: "",
        confirmPassword: "",
      };
      this.showPassword = true;
    },
    // 提交重置密码
    savePassword() {
      this.$refs.modifyPwdForm.validate(async (valid) => {
        if (valid) {
          const res = await resetFcgTenantUserPassword({
            id: this.pwdModify.id,
            newPassword: this.pwdModify.newPassword,
          });
          if (res.code == 0) {
            this.$message({ type: "success", message: "重置密码成功" });
            this.showPassword = false;
          }
        }
      });
    },
    // 关闭重置密码弹窗时清空表单
    clearPassword() {
      this.pwdModify = {
        id: undefined,
        newPassword: "",
        confirmPassword: "",
      };
      this.$refs.modifyPwdForm && this.$refs.modifyPwdForm.clearValidate();
    },
  },
  async created() {
    // 获取用户列表
    await this.getTableData();
  },
};
</script>

<style scoped>
.search-term {
  padding: 20px;
  background-color: #f5f7fa;
  margin-bottom: 20px;
  border-radius: 4px;
}

.btn-form-inline {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dropdown {
  overflow: hidden;
  height: 30px;
  margin-left: 5px;
}
</style>
