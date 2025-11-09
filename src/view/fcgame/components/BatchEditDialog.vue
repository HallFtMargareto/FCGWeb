<template>
  <el-dialog
    title="批量编辑投注内容"
    :visible.sync="visible"
    width="70%"
    top="5vh"
    :close-on-click-modal="false"
  >
    <div style="max-height: 60vh; overflow-y: auto">
      <div v-if="formData.orders.length === 0" class="empty-state">
        暂无识别失败的订单数据
      </div>
      <div
        v-for="order in formData.orders"
        :key="order.id"
        style="
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ebeef5;
          border-radius: 4px;
        "
      >
        <div style="margin-bottom: 8px; font-weight: bold; color: #409eff">
          订单ID: {{ order.id }}
        </div>
        <el-input
          type="textarea"
          :rows="3"
          v-model="order.bet_content"
          placeholder="请输入投注内容"
        ></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button
        type="primary"
        @click="submitBatchEdit"
        size="small"
        :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getFcgOrderList, batchFcgOrderOperation } from "@/api/fcgame/fcg_order";

export default {
  name: "BatchEditDialog",
  props: {
    // 控制弹窗显示/隐藏
    value: {
      type: Boolean,
      default: false
    },
    // 搜索条件
    searchInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        orders: [], // 格式: [{id: xx, bet_content: "xx"}]
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    // 打开弹窗并加载数据
    async open() {
      try {
        // 获取所有识别失败的订单数据
        const searchParams = {
          ...this.searchInfo,
          order_status: "1", // 识别失败
          page: 1,
          pageSize: 1000, // 获取足够多的数据
        };

        const res = await getFcgOrderList(searchParams);
        if (res.code === 0) {
          const failedOrders = res.data.list || [];

          // 格式化数据为批量编辑需要的格式
          this.formData.orders = failedOrders.map((order) => ({
            id: order.ID,
            bet_content: order.bet_content || "",
          }));

          this.visible = true;
        } else {
          this.$message.error("获取识别失败订单数据失败");
        }
      } catch (error) {
        console.error("获取识别失败订单数据异常:", error);
        this.$message.error("获取识别失败订单数据异常");
      }
    },
    
    // 提交批量编辑
    async submitBatchEdit() {
      try {
        this.loading = true;

        // 验证数据
        if (this.formData.orders.length === 0) {
          this.$message.warning("没有需要编辑的订单数据");
          return;
        }

        // 构建提交数据
        const submitData = this.formData.orders.map((order) => ({
          id: order.id,
          bet_content: order.bet_content,
        }));

        // 调用批量操作接口
        const res = await batchFcgOrderOperation({
          command: "batch_alter",
          bet_contents: submitData,
          ids: this.formData.orders.map((order) => order.id),
        });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "批量编辑成功",
          });

          // 关闭弹窗
          this.visible = false;

          // 通知父组件刷新数据
          this.$emit("success");
        } else {
          this.$message({
            type: "error",
            message: res.msg || "批量编辑失败",
          });
        }
      } catch (error) {
        console.error("批量编辑异常:", error);
        this.$message({
          type: "error",
          message: "批量编辑异常",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 批量编辑弹窗样式 */
.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>