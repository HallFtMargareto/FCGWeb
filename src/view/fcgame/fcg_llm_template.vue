<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="所属组织">
          <TenantSelect v-model="searchInfo.tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable>
          </TenantSelect>
        </el-form-item>
        <el-form-item label="场景" prop="scene">
          <el-select v-model="searchInfo.scene" clearable>
            <el-option value="order_parse" label="order_parse"></el-option>
            <el-option value="order_analysis" label="order_analysis"></el-option>
            <el-option value="order_mark" label="order_mark"></el-option>
            <el-option value="pre_loss_analysis" label="pre_loss_analysis"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="场景">
          <el-input v-model="searchInfo.scene" placeholder="请输入" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="供应商">
          <el-input v-model="searchInfo.provider" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchInfo.enabled" clearable placeholder="请选择">
            <el-option :value="true" label="启用"></el-option>
            <el-option :value="false" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板编码">
          <el-input v-model="searchInfo.code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input v-model="searchInfo.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </searchform>
      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button type="primary" icon="el-icon-plus" @click="createRow">新增</el-button>
        <el-button type="danger" plain icon="el-icon-delete" :disabled="multipleSelection.length === 0"
          @click="batchDelete">批量删除</el-button>
        <el-button icon="el-icon-refresh" @click="reloadConfig">刷新内存配置</el-button>
      </el-form>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id || scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板名称" prop="name" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="模板编码" prop="code" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="租户ID" prop="tenant_id" min-width="100"></el-table-column>
      <el-table-column label="场景" prop="scene" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商" prop="provider" min-width="120"></el-table-column>
      <el-table-column label="模型" prop="model_name" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="优先级" prop="priority" min-width="90">
      </el-table-column>
      <el-table-column label="状态" prop="enabled" min-width="90">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.enabled" true-text="启用" false-text="禁用"></booltag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新时间" prop="updated_at" min-width="160" sortable="custom"></el-table-column> -->
      <el-table-column label="创建时间" prop="created_at" min-width="160" sortable="custom"></el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗？" confirm-button-text="确定" cancel-button-text="取消"
            @confirm="deleteRow(scope.row)">
            <el-button type="text" size="small" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="openDialog" width="900px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" size="mini">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="所属组织">
              <TenantSelect v-model="formData.tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable>
              </TenantSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场景" prop="scene">
              <el-select v-model="formData.scene" clearable>
                <el-option value="order_parse" label="order_parse"></el-option>
                <el-option value="order_analysis" label="order_analysis"></el-option>
                <el-option value="order_mark" label="order_mark"></el-option>
                <el-option value="pre_loss_analysis" label="pre_loss_analysis"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编码" prop="code">
              <el-input v-model="formData.code" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="formData.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="provider">
              <el-select v-model="formData.provider" width="100" clearable>
                <el-option value="volcengine" label="volcengine"></el-option>
                <el-option value="openrouter" label="openrouter"></el-option>
                <el-option value="deepseek" label="deepseek"></el-option>
                <el-option value="aliyun_bailian" label="aliyun_bailian"></el-option>
                <el-option value="openai_compatible" label="openai_compatible"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="model_name">
              <el-input v-model="formData.model_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Key">
              <el-input v-model="formData.api_key" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Key 环境变量">
              <el-input v-model="formData.api_key_env_var" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API Base URL">
              <el-input v-model="formData.api_base_url" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统提示词">
              <el-input v-model="formData.default_system_prompt" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重试次数">
              <el-input v-model.number="formData.max_retries" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请求超时(秒)">
              <el-input v-model.number="formData.request_timeout" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大Token">
              <el-input v-model.number="formData.max_tokens" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Temperature">
              <el-input v-model="formData.default_temperature" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Top P">
              <el-input v-model="formData.default_top_p" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级">
              <el-input v-model.number="formData.priority" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Content-Type">
              <el-input v-model="formData.content_type" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证前缀">
              <el-input v-model="formData.auth_prefix" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="响应格式">
              <el-input v-model="formData.response_format" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="思维模式">
              <el-input v-model="formData.thinking_mode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态">
              <el-switch v-model="formData.enabled"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="openDialog = false">取消</el-button>
        <el-button size="mini" type="primary" @click="enterDialog">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createFCGLLMTemplate,
  deleteFCGLLMTemplate,
  deleteFCGLLMTemplateByIds,
  updateFCGLLMTemplate,
  findFCGLLMTemplate,
  getFCGLLMTemplateList,
  reloadFCGLLMTemplate,
} from "@/api/fcgame/fcg_llm_template";
import infoList from "@/mixins/infoList";

export default {
  name: "fcg_llm_template",
  mixins: [infoList],
  data() {
    return {
      listApi: getFCGLLMTemplateList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: this.getDefaultFormData(),
      formRules: {
        scene: [{ required: true, message: "请填写场景", trigger: "blur" }],
        code: [{ required: true, message: "请填写模板编码", trigger: "blur" }],
        name: [{ required: true, message: "请填写模板名称", trigger: "blur" }],
        provider: [{ required: true, message: "请填写供应商", trigger: "blur" }],
        model_name: [{ required: true, message: "请填写模型名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    getDefaultFormData() {
      return {
        id: undefined,
        tenant_id: 0,
        scene: "order_parse",
        code: "",
        name: "",
        provider: "deepseek",
        api_key: "",
        api_key_env_var: "",
        api_base_url: "",
        model_name: "",
        default_system_prompt: "",
        max_retries: 1,
        request_timeout: 120,
        content_type: "application/json",
        auth_prefix: "Bearer ",
        default_temperature: 0,
        default_top_p: 0,
        max_tokens: 0,
        response_format: "json_object",
        thinking_mode: "",
        priority: 100,
        enabled: true,
      };
    },
    getRowId(row) {
      return row.id || row.ID;
    },
    normalizeFormData(data) {
      return {
        ...this.getDefaultFormData(),
        ...(data || {}),
      };
    },
    onQuery() {
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    sortChange(row) {
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    createRow() {
      this.type = "create";
      this.dialogTitle = "新增模板";
      this.formData = this.getDefaultFormData();
      this.openDialog = true;
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      });
    },
    async editRow(row) {
      const id = this.getRowId(row);
      if (!id) {
        this.$message.error("无效的模板ID");
        return;
      }
      this.type = "update";
      this.dialogTitle = "编辑模板";
      const res = await findFCGLLMTemplate({ ID: id });
      if (res.code === 0) {
        const detail =
          res.data && typeof res.data === "object"
            ? res.data.fcgLLMTemplate || res.data.reFCGLLMTemplate || res.data
            : {};
        this.formData = this.normalizeFormData(detail);
        this.openDialog = true;
        this.$nextTick(() => {
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        });
      }
    },
    async deleteRow(row) {
      const id = this.getRowId(row);
      if (!id) {
        this.$message.error("无效的模板ID");
        return;
      }
      const res = await deleteFCGLLMTemplate({ id });
      if (res.code === 0) {
        this.$message.success("删除成功");
        if (this.tableData.length === 1 && this.page > 1) {
          this.page -= 1;
        }
        this.getTableData();
      }
    },
    async batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择需要删除的数据");
        return;
      }
      this.$confirm("确定批量删除所选模板吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const ids = this.multipleSelection
          .map((item) => this.getRowId(item))
          .filter(Boolean);
        if (ids.length === 0) {
          this.$message.warning("未找到可用ID");
          return;
        }
        const res = await deleteFCGLLMTemplateByIds({ ids });
        if (res.code === 0) {
          this.$message.success("批量删除成功");
          this.getTableData();
        }
      });
    },
    async reloadConfig() {
      const res = await reloadFCGLLMTemplate();
      if (res.code === 0) {
        this.$message.success("刷新成功");
      }
    },
    async enterDialog() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let res;
        if (this.type === "create") {
          const payload = this.normalizeFormData(this.formData);
          delete payload.id;
          res = await createFCGLLMTemplate(payload);
        } else {
          const payload = this.normalizeFormData(this.formData);
          if (!payload.id && payload.ID) {
            payload.id = payload.ID;
          }
          res = await updateFCGLLMTemplate(payload);
        }
        if (res && res.code === 0) {
          this.$message.success("操作成功");
          this.openDialog = false;
          this.getTableData();
        }
      });
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style scoped></style>
