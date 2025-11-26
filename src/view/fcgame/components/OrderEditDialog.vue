<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="60%"
    @close="handleDialogClose"
    class="order-dialog"
    top="5"
  >
    <el-form ref="editForm" :model="formData" label-width="100px" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="原内容">
            <el-input
              type="textarea"
              :rows="5"
              v-model="formData.source_content"
              readonly
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="修改内容">
            <el-input
              type="textarea"
              :rows="5"
              v-model="formData.bet_content"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-button type="success" @click="reidentify" size="mini"
            >重新识别</el-button
          >
        </el-col>
      </el-row>

      <div class="dialog-table-container">
        <el-table
          :data="formData.order_details"
          border
          style="width: 100%"
          size="mini"
          max-height="400"
          highlight-current-row
        >
          <el-table-column label="游戏类型">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.game_type"
                placeholder="请选择游戏类型"
              >
                <el-option
                  v-for="item in gameTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="玩法">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.game_category"
                placeholder="请选择玩法"
              >
                <el-option label="福彩" :value="1"></el-option>
                <el-option label="体彩" :value="2"></el-option>
                <el-option label="排列三" :value="3"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="投注号码">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.bet_number"
                placeholder="投注号码"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="注数">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.bet_count"
                placeholder="注数"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="投注金额">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.bet_amount"
                placeholder="投注金额"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="倍数">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.multiple"
                placeholder="倍数"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="removeOrderDetail(scope.$index)"
                size="mini"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row>
        <el-col :span="12">
          <div style="padding: 8px 0">
            <span>总数量: {{ totalCount }}</span>
            <span style="margin-left: 20px"
              >金额合计: {{ totalBetAmount }}</span
            >
          </div>
        </el-col>
        <el-col :span="12">
          <el-button
            style="float: right"
            type="primary"
            @click="addOrderDetail"
            size="mini"
            >添加子订单</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveOrderEdit" size="small"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { updateFcgOrder, findFcgOrder } from "@/api/fcgame/fcg_order";

export default {
  name: "OrderEditDialog",
  props: {
    // 控制弹窗显示/隐藏
    value: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题
    title: {
      type: String,
      default: "编辑订单",
    },
    // 游戏类型选项
    gameTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        source_content: "",
        bet_content: "",
        order_details: [],
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    dialogTitle() {
      return this.title;
    },
    // 计算总数量
    totalCount() {
      return this.formData.order_details.length;
    },
    // 计算投注金额总合计
    totalBetAmount() {
      if (
        !this.formData.order_details ||
        this.formData.order_details.length === 0
      ) {
        return 0;
      }
      return this.formData.order_details.reduce((sum, item) => {
        return sum + (Number(item.bet_amount) || 0);
      }, 0);
    },
  },
  methods: {
    // 打开弹窗并加载数据
    async open(orderId) {
      try {
        const res = await findFcgOrder({ ID: orderId });
        if (res.code == 0) {
          // 构造编辑表单数据
          const order = res.data.refcg_order;
          this.formData = {
            ID: order.ID,
            order_no: order.order_no,
            bet_amount: order.bet_amount,
            source_content: order.bet_content,
            bet_content:
              order.is_ai_analysis == 1
                ? order.analysis_content
                : order.bet_content,
            order_details: order.order_details
              ? order.order_details.map((detail) => {
                  return {
                    ID: detail.ID,
                    game_category: detail.game_category,
                    game_type: detail.game_type,
                    bet_number: detail.bet_number || "",
                    bet_count: Number(detail.bet_count) || 0,
                    bet_amount: detail.bet_amount || 0,
                    multiple: detail.multiple || 1,
                    order_amount: detail.bet_amount * detail.multiple || 0, // 计算订单金额
                  };
                })
              : [],
          };
          this.visible = true;
        }
      } catch (error) {
        console.error("获取订单数据异常:", error);
        this.$message.error("获取订单数据异常");
      }
    },

    // 重新识别
    async reidentify() {
      try {
        // 保存原始内容，防止被覆盖
        const originalSourceContent = this.formData.source_content;

        const res = await findFcgOrder({
          ID: this.formData.ID,
          bet_content: this.formData.bet_content,
          action: "reidentify",
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "识别成功",
          });
          // 保存订单详情数据，但保留原始内容
          this.formData = res.data.refcg_order;
          this.formData.source_content = originalSourceContent;
        } else {
          this.$message.error("识别失败");
        }
      } catch (error) {
        console.error("重新识别异常:", error);
        this.$message.error("重新识别异常");
      }
    },

    // 添加子订单
    addOrderDetail() {
      this.formData.order_details.push({
        game_category_name: "",
        game_type_name: "",
        bet_number: "",
        bet_count: Number(0),
        bet_amount: 0,
        multiple: 1,
        order_amount: 0,
      });
    },

    // 删除子订单
    removeOrderDetail(index) {
      this.formData.order_details.splice(index, 1);
    },

    // 保存订单编辑
    async saveOrderEdit() {
      try {
        const res = await updateFcgOrder(this.formData);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "订单编辑成功",
          });
          this.visible = false;
          this.$emit("success");
        } else {
          this.$message({
            type: "error",
            message: res.msg || "订单编辑失败",
          });
        }
      } catch (error) {
        console.error("保存订单编辑异常:", error);
        this.$message.error("保存订单编辑异常");
      }
    },

    // 关闭弹窗时的处理
    async handleDialogClose() {
      await findFcgOrder(
        {
          ID: this.formData.ID,
          action: "cancel_edit",
        },
        { donNotShowLoading: true }
      );

      this.formData = {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        source_content: "",
        bet_content: "",
        order_details: [],
      };
    },
  },
};
</script>

<style scoped>
/* 订单编辑弹窗样式 */
.order-dialog {
  display: flex;
  flex-direction: column;
  margin-top: 2% !important;
}

.order-dialog ::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 auto !important;
  max-height: calc(100vh - 30px);
}

.order-dialog ::v-deep .el-dialog__body {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.dialog-table-container {
  max-width: 100%;
  overflow-x: auto;
}

.dialog-table-container ::v-deep .el-table {
  width: 100%;
  min-width: 800px;
}

@media screen and (max-width: 768px) {
  .order-dialog ::v-deep .el-dialog {
    width: 95% !important;
    max-height: calc(100vh - 20px);
  }

  .order-dialog ::v-deep .el-dialog__body {
    max-height: calc(100vh - 150px);
  }
}
</style>