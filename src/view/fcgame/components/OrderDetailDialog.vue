<template>
  <el-dialog title="订单信息" :visible.sync="visible" width="60%" center class="order-detail-dialog" top="5">
    <div class="detail-section">
      <h3>投注文本</h3>
      原文本: <code style="white-space: pre-wrap;"><br>{{ orderData.content }}<br></code><br>

      AI调整: <code style="white-space: pre-wrap;"><br>{{ orderData.ai_content }}<br></code><br>

      AI分析: <code style="white-space: pre-wrap;"><br>{{ orderData.re_ai_content }}<br></code><br>
    </div>

    <div class="detail-section">
      <h3>LLM报文</h3>
      <code>{{ orderData.msg }}</code>
    </div>

    <div class="detail-section">
      <h3>投注金额</h3>
      <span>总金额:{{ orderData.total_amount }}</span>
    </div>

    <!-- 显示split数据 -->
    <div v-if="orderData.split && orderData.split.length > 0" class="detail-section">
      <h3>拆分信息</h3>
      <el-table :data="orderData.split" size="small" border style="width: 100%">
        <el-table-column prop="bet_number" label="投注号码" align="center"></el-table-column>
        <el-table-column prop="game_category" label="彩种" align="center" width="100">
          <template slot-scope="scope">
            {{ $utils.getGameCategoryName(scope.row.game_category) }}
          </template>
        </el-table-column>
        <el-table-column prop="game_type" label="玩法" align="center" width="100">
          <template slot-scope="scope">
            {{ getGameTypeName(scope.row.game_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="bet_num" label="投注数量" align="center"></el-table-column>
        <el-table-column prop="bet_amount" label="投注金额" align="center"></el-table-column>
        <el-table-column prop="split_number" label="拆分信息" align="center">
          <template slot-scope="scope">
            <div class="split-numbers">
              {{ scope.row.split_number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="average_amount" label="平均金额" align="center"></el-table-column>
        <el-table-column prop="split_count" label="拆分数量" align="center"></el-table-column>
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
import { findFcgOrder } from "@/api/fcgame/fcg_order";

export default {
  name: "OrderDetailDialog",
  props: {
    // 控制弹窗显示/隐藏
    value: {
      type: Boolean,
      default: false
    },
    // 游戏类型选项
    gameTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      orderData: {
        content: "",
        total_amount: "",
        split: [],
        msg: ""
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
    async open(orderId) {
      try {
        const res = await findFcgOrder({ ID: orderId, action: "split_info", "orderDetailState": "1" });
        if (res.code == 0) {
          // 保存订单详情数据
          this.orderData = res.data;
          this.visible = true;
        } else {
          this.$message.error("获取订单详情失败");
        }
      } catch (error) {
        console.error("获取订单详情异常:", error);
        this.$message.error("获取订单详情异常");
      }
    },

    // 获取玩法名称
    getGameTypeName(typeId) {
      // 创建缓存对象
      if (!this._gameTypeCache) {
        this._gameTypeCache = {};
      }

      // 如果缓存中存在，直接返回
      if (this._gameTypeCache[typeId] !== undefined) {
        return this._gameTypeCache[typeId];
      }

      // 查找并缓存结果
      const type = this.gameTypes.find((item) => item.value === typeId);
      const result = type ? type.label : "未知";
      this._gameTypeCache[typeId] = result;
      return result;
    },
  },
  beforeDestroy() {
    // 清理缓存，避免内存泄漏
    if (this._gameTypeCache) {
      this._gameTypeCache = null;
    }
  }
};
</script>

<style scoped>
/* 订单拆分详情弹窗样式 */
.order-detail-dialog {
  margin-top: 2%;
}

.order-detail-dialog ::v-deep .el-dialog {
  margin: 0 auto !important;
  max-height: calc(100vh - 30px);
}

.order-detail-dialog ::v-deep .el-dialog__body {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.detail-section {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
}

.detail-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
  font-size: 16px;
}

.detail-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}

.split-numbers {
  word-break: break-all;
  white-space: normal;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style>