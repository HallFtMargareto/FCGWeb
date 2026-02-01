<template>
  <div>
    <div class="search-term">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline" size="mini">
        <el-form-item label="账号">
          <el-input placeholder="账号" v-model="searchInfo.userName" clearable></el-input>
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

        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addUser" type="primary" style="margin-left: 200px">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column label="UID" min-width="50" prop="ID"></el-table-column>
      <el-table-column label="账号" min-width="150" prop="userName"></el-table-column>
      <el-table-column label="账号名称" min-width="150" prop="nickName"></el-table-column>

      <el-table-column label="所属角色" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.authority.authorityName }}
        </template>
      </el-table-column>

      <!-- <el-table-column label="用户角色" min-width="150">
        <template slot-scope="scope">
          <el-cascader
            @change="changeAuthority(scope.row)"
            v-model="scope.row.authority.authorityId"
            :options="authOptions"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              emitPath: false,
            }"
            filterable
            disabled
          ></el-cascader>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="头像" min-width="50">
        <template slot-scope="scope">
          <div :style="{ textAlign: 'center' }">
            <CustomPic :picSrc="scope.row.headerImg" />
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="UUID" min-width="250" prop="uuid"></el-table-column>

      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <el-table-column label="状态" min-width="120" align="center">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-tag size="small"
              :type="scope.row.status === 1 ? 'success' : scope.row.status === 2 ? 'info' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : scope.row.status === 2 ? '禁用' : '锁定' }}
            </el-tag>

            <el-dropdown @command="(command) => changeUserStatus(scope.row, command)" style="margin-left: 5px;">
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

      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-popover placement="top" width="160" v-model="scope.row.visible">
            <p>确定要删除此用户吗</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteUser(scope.row)">确定</el-button>
            </div>
            <el-button type="text" icon="el-icon-delete" size="small" slot="reference">删除</el-button>

            <el-button type="text" size="small" slot="reference" @click="changePwd(scope.row)">重置密码</el-button>

          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
      :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>

    <el-dialog :visible.sync="addUserDialog" custom-class="user-dialog" title="新增后台用户" width="25%">
      <el-form :rules="rules" ref="userForm" :model="userInfo" size="mini">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="userInfo.username" placeholder="请填写登录用户名"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" label-width="80px" prop="password">
          <el-input v-model="userInfo.password" placeholder="请填写登录密码"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="nickName">
          <el-input v-model="userInfo.nickName" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" label-width="80px" prop="authorityId">
          <el-cascader v-model="userInfo.authorityId" :options="authOptions" :show-all-levels="false"
            style="width: 100%" :props="{
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              disabled: 'disabled',
              emitPath: false,
              expandTrigger: 'hover',
            }" filterable></el-cascader>
        </el-form-item>

        <el-form-item label="所属组织" label-width="80px" v-if="this.$store.state.user.userInfo.perm['host']"
          prop="tenantId">
          <el-select v-model="userInfo.tenantId" placeholder="请选择" style="width: 100%" clearable>
            <el-option v-for="item in reslist.tenants" :key="item.ID" :label="item.platform_name"
              :value="item.ID"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="头像" label-width="80px">
          <div style="display: inline-block" @click="openHeaderChange">
            <img
              class="header-img-box"
              v-if="userInfo.headerImg"
              :src="userInfo.headerImg"
            />
            <div v-else class="header-img-box">从媒体库选择</div>
          </div>
        </el-form-item> -->
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="closeAddUserDialog">取 消</el-button>
        <el-button @click="enterAddUserDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :targetKey="`headerImg`" />

    <el-dialog :visible.sync="showPassword" @close="clearPassword" title="修改密码" width="25%">
      <el-form :model="pwdModify" :rules="rulePwd" label-width="80px" ref="modifyPwdForm">
        <el-form-item :minlength="6" label="新密码" prop="newPassword">
          <el-input show-password v-model="pwdModify.newPassword"></el-input>
        </el-form-item>
        <el-form-item :minlength="6" label="确认密码" prop="confirmPassword">
          <el-input show-password v-model="pwdModify.confirmPassword"></el-input>
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
const path = process.env.VUE_APP_BASE_API;
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import ChooseImg from "@/components/chooseImg";
import { formatTimeToStr } from "@/utils/date";
export default {
  name: "Api",
  mixins: [infoList],
  components: { ChooseImg },
  data() {
    return {
      listApi: this.$api.getUserList,
      path: path,
      authOptions: [],
      addUserDialog: false,
      userInfo: {
        username: "",
        password: "",
        nickName: "",
        headerImg: "",
        authorityId: "",
        tenantId: undefined,
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, message: "最低3位字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "最低6位字符", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请输入账号名称", trigger: "blur" },
        ],
        authorityId: [
          { required: true, message: "请选择账号所属角色", trigger: "blur" },
        ],
        tenantId: [
          { required: true, message: "请选择账号所属组织", trigger: "blur" },
        ],
      },

      showPassword: false,
      pwdModify: {},
      rulePwd: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" },
          {
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
      reslist: {},
    };
  },
  filters: {
    formatDate: function (time) {
      if (time != null && time != "") {
        var date = new Date(time);
        return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
      } else {
        return "";
      }
    },
  },
  computed: {
    ...mapGetters("user", ["token"]),
  },
  methods: {
    closeCasc() {
      this.$refs.cascaderHandle.dropDownVisible = false;
    },
    openHeaderChange() {
      this.$refs.chooseImg.open();
    },
    setOptions(authData) {
      this.authOptions = [];
      this.setAuthorityOptions(authData, this.authOptions);
    },
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
    async deleteUser(row) {
      const res = await this.$api.deleteUser({ id: row.ID });
      if (res.code == 0) {
        this.getTableData();
        row.visible = false;
      }
    },
    async changeUserStatus(row, status) {
      const statusMap = { 1: "启用", 2: "禁用", 3: "锁定" };
      this.$confirm(`确定要${statusMap[status]}该用户吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            ...row,
            status: parseInt(status),
          };
          const res = await this.$api.setUserInfo(req);
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async enterAddUserDialog() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.register(this.userInfo);
          if (res.code == 0) {
            this.$message({ type: "success", message: "创建成功" });
          }
          await this.getTableData();
          this.closeAddUserDialog();
        }
      });
    },
    closeAddUserDialog() {
      this.$refs.userForm.resetFields();
      this.addUserDialog = false;
    },
    handleAvatarSuccess(res) {
      this.userInfo.headerImg = res.data.file.url;
    },
    async addUser() {
      if (this.$store.state.user.userInfo.perm["host"]) {
        const nres = await this.$api.getSysTenantList({
          page: 1,
          pageSize: 999,
          filter: "mini",
        });
        this.reslist.tenants = nres.data.list;
      }
      this.addUserDialog = true;
    },
    async changeAuthority(row) {
      const res = await this.$api.setUserAuthority({
        uuid: row.uuid,
        authorityId: row.authority.authorityId,
      });
      if (res.code == 0) {
        this.$message({ type: "success", message: "角色设置成功" });
      }
    },
    changePwd(row) {
      this.showPassword = true;
      this.userInfo = row;
    },
    savePassword() {
      this.$refs.modifyPwdForm.validate((valid) => {
        if (valid) {
          this.$api
            .changePassword({
              username: this.userInfo.userName,
              password: this.pwdModify.newPassword,
              newPassword: this.pwdModify.newPassword,
            })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("修改密码成功！");
              }
              this.showPassword = false;
            });
        } else {
          return false;
        }
      });
    },
    clearPassword() {
      this.pwdModify = {
        password: "",
        newPassword: "",
        confirmPassword: "",
      };
      this.$refs.modifyPwdForm.clearValidate();
    },
    onSubmit() {
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
  },
  async created() {
    this.getTableData();
    const res = await this.$api.getAuthorityList({ page: 1, pageSize: 999 });
    this.setOptions(res.data.list);
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown {
  overflow: hidden;
  height: 30px;
}

.button-box {
  padding: 10px 20px;

  .el-button {
    float: right;
  }
}

.user-dialog {
  .header-img-box {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 200px;
    cursor: pointer;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>