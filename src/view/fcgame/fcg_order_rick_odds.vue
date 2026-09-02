<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="9" @search="getChartData">
        <el-form-item label="期号">
          <IssueSelect v-model="chartIssueId" placeholder="请选择期号" clearable></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织" v-if="this.$store.state.user.userInfo.perm['host']">
          <TenantSelect v-model="tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable></TenantSelect>
        </el-form-item>

        <el-form-item label="彩票类型">
          <el-select v-model="game_category" placeholder="彩票类型" @change="categoryChange">
            <el-option label="福彩" :value="1"></el-option>
            <el-option label="体彩" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预亏损金额">
          <el-input v-model="ks_amount" placeholder="请输入预赔付金额" clearable></el-input>
        </el-form-item>

        <el-form-item label="转出单量">
          <el-input v-model.number="search_trans_count" placeholder="转出单量筛选" clearable></el-input>
        </el-form-item>

        <el-form-item label="风险比例">
          <el-input v-model="prate" placeholder="风险比例筛选" clearable></el-input>
        </el-form-item>

        <el-form-item label="拆分号码">
          <el-input v-model="split_number" placeholder="拆分号码筛选" @input="handleSplitNumberFilter" clearable></el-input>
        </el-form-item>

        <el-form-item label="拆分单量">
          <el-input v-model.number="batchThreshold" placeholder="拆分单量"></el-input>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="success" @click="generateContent" plain>生成内容</el-button>
          <el-button type="warning" @click="preLossRate" plain>预亏损率</el-button>
        </el-form-item>

        <el-form-item label="全部转出">
          <el-select v-model="all_trans" placeholder="全部转出">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
            <el-option label="90%" :value="90"></el-option>
            <el-option label="80%" :value="80"></el-option>
            <el-option label="70%" :value="70"></el-option>
            <el-option label="60%" :value="60"></el-option>
            <el-option label="50%" :value="50"></el-option>
            <el-option label="40%" :value="40"></el-option>
            <el-option label="30%" :value="30"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="10%" :value="10"></el-option>
          </el-select>
        </el-form-item>


        <!-- <el-divider content-position="center">号码过滤</el-divider> -->

        <!-- <el-form-item label="阈值比例">
                    <el-input v-model="alpha" :min="0" :max="1" :step="0.1" placeholder="请输入阈值比例"></el-input>
                </el-form-item>

                <el-form-item label="目标线比例">
                    <el-input v-model="beta" :min="0" :max="1" :step="0.1" placeholder="请输入目标线比例"></el-input>
                </el-form-item> -->

        <!-- <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item> -->

        <el-form-item> </el-form-item>

        <el-form-item label="百位过滤">
          <div class="combo-input">
            <el-input :disabled="isPosDisabled" v-model.number="hundredsNum" maxlength="10" class="left"
              placeholder="百位号码" />
            <div class="split">-</div>
            <el-input :disabled="isPosDisabled" v-model.number="hundredsCount" class="right" placeholder="单量" />
          </div>
        </el-form-item>

        <el-form-item label="十位过滤">
          <div class="combo-input">
            <el-input :disabled="isPosDisabled" v-model.number="tenthNum" maxlength="10" class="left"
              placeholder="十位号码" />
            <div class="split">-</div>
            <el-input :disabled="isPosDisabled" v-model.number="tenthCount" class="right" placeholder="单量" />
          </div>
        </el-form-item>

        <el-form-item label="个位过滤">
          <div class="combo-input">
            <el-input :disabled="isPosDisabled" v-model.number="onesNum" maxlength="10" class="left"
              placeholder="个位号码" />
            <div class="split">-</div>
            <el-input :disabled="isPosDisabled" v-model.number="onesCount" class="right" placeholder="单量" />
          </div>
        </el-form-item>

        <el-form-item label="独胆过滤">
          <div class="combo-input">
            <el-input :disabled="isDDDisabled" v-model.number="ddNum" maxlength="10" class="left" placeholder="独胆过滤" />
            <div class="split">-</div>
            <el-input :disabled="isDDDisabled" v-model.number="ddCount" class="right" placeholder="单量" />
          </div>
        </el-form-item>
      </searchform>
      <!-- <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form> -->
    </div>

    <div style="height: 100%" class="rick-data-info" v-if="
      rickDataInfo &&
      rickDataInfo.rick_order &&
      rickDataInfo.rick_order.length > 0
    ">
      <div v-if="transferSchemeList && transferSchemeList.length > 0" style="margin-bottom: 15px">
        <div v-for="item in transferSchemeList" :key="item.ID"
          style="margin-bottom: 10px; padding: 8px 15px; background-color: #f0f9eb; border: 1px solid #e1f3d8; border-radius: 4px; display: flex; flex-wrap: wrap; align-items: center; gap: 15px; font-size: 13px;">
          <div style="font-weight: bold; color: #67c23a; display: flex; align-items: center;">
            <i class="el-icon-s-order" style="margin-right: 4px;"></i>已转出方案
          </div>
          <div>
            <span style="color: #909399;">时间:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.created_at }}</span>
          </div>
          <div>
            <span style="color: #909399;">转出:</span>
            <span style="color: #303133; font-weight: bold; margin-left: 4px;">{{ item.total_count }}</span>单 /
            <span style="color: #f56c6c; font-weight: bold;">{{ item.total_amount }}</span>元
          </div>
          <div>
            <span style="color: #909399;">号码数:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.item_count }}</span>
          </div>
          <div>
            <span style="color: #909399;">快速转单:</span>
            <span
              :style="{ color: item.fast_trans ? '#67c23a' : '#909399', fontWeight: item.fast_trans ? 'bold' : 'normal', marginLeft: '4px' }">{{
                item.fast_trans ? '是' : '否' }}</span>
          </div>
          <div>
            <span style="color: #909399;">渠道转单:</span>
            <span
              :style="{ color: item.channel_id > 0 ? '#67c23a' : '#909399', fontWeight: item.channel_id > 0 ? 'bold' : 'normal', marginLeft: '4px' }">
              {{ item.channel_id > 0 ? '是' : '否' }}
            </span>
          </div>
          <div v-if="item.channel_id > 0">
            <span style="color: #909399;">渠道响应:</span>
            <code> {{ item.remark }} </code>
          </div>

          <div v-if="item.ks_amount > 0">
            <span style="color: #909399;">预亏损金额:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.ks_amount }}</span>
          </div>
          <div v-if="item.query_trans_count > 0">
            <span style="color: #909399;">转出单量过滤:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.query_trans_count }}</span>
          </div>

          <div v-if="item.filter_hundreds_num">
            <span style="color: #909399;">百位:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.filter_hundreds_num }} / {{
              item.filter_hundreds_count }}</span>
          </div>
          <div v-if="item.filter_tenth_num">
            <span style="color: #909399;">十位:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.filter_tenth_num }} / {{ item.filter_tenth_count
            }}</span>
          </div>
          <div v-if="item.filter_ones_num">
            <span style="color: #909399;">个位:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.filter_ones_num }} / {{ item.filter_ones_count
            }}</span>
          </div>
          <div v-if="item.filter_dd_num">
            <span style="color: #909399;">独胆:</span>
            <span style="color: #606266; margin-left: 4px;">{{ item.filter_dd_num }} / {{ item.filter_dd_count }}</span>
          </div>
          <!-- <div style="margin-left: auto;">
            <el-button type="text" @click="handleAppendTransfer(item)">追加转出</el-button>
          </div> -->
        </div>
      </div>
      <div class="total-info-with-button" v-if="rickDataInfo.total_info">
        <el-descriptions title="风控信息" :column="4" border>
          <el-descriptions-item label="总投注">{{
            rickDataInfo.total_info.totalBet
          }}</el-descriptions-item>
          <el-descriptions-item label="总佣金">{{
            rickDataInfo.total_info.totalCommission
          }}</el-descriptions-item>
          <el-descriptions-item label="净盘值">
            {{ rickDataInfo.total_info.netBank }}
          </el-descriptions-item>

          <el-descriptions-item label="博弈比例" :width="100">
            {{ gameRatio }}
          </el-descriptions-item>


          <el-descriptions-item label="号码数">{{
            rickDataInfo.total_info.totalCount
          }}</el-descriptions-item>
          <el-descriptions-item label="转出单量">{{
            rickDataInfo.total_info.totalOutOrder
          }}</el-descriptions-item>
          <el-descriptions-item label="转出总金额">
            {{ rickDataInfo.total_info.totalOutOrderAmount }}
          </el-descriptions-item>

          <!-- <el-descriptions-item label="阈值">{{ rickDataInfo.total_info.threshold }}</el-descriptions-item> -->
          <!-- <el-descriptions-item label="目标线">{{ rickDataInfo.total_info.targetLimit }}</el-descriptions-item> -->
          <!-- <el-descriptions-item label="总转移赔付">{{ rickDataInfo.total_info.totalTransferPayout
                    }}</el-descriptions-item>
                    <el-descriptions-item label="总转投金额">{{ rickDataInfo.total_info.totaltransferStake
                    }}</el-descriptions-item> -->
        </el-descriptions>
        <div class="button-column">
          <el-button v-if="channel_trans" type="primary" :disabled="multipleSelection.length === 0"
            :loading="fastTransferLoading" @click="handleChannelTransfer()" size="mini">
            渠道转单
          </el-button>
          <el-button v-if="fast_trans" type="warning" :disabled="multipleSelection.length === 0"
            :loading="fastTransferLoading" @click="handleFastTransfer(false)" size="mini">
            快速转单
          </el-button>
          <el-button :disabled="multipleSelection.length === 0" :loading="fastTransferLoading"
            @click="handleFastTransfer(true)" size="mini">
            模拟转出
          </el-button>
        </div>
      </div>
      <el-table :data="filteredRickOrder" style="width: 100%" border height="600px" highlight-current-row
        @selection-change="handleSelectionChange" @select="handleRowSelect" @select-all="handleSelectAll"
        @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="split_number" label="拆单号码" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]"></el-table-column>
        <el-table-column prop="split_count" label="号码数量" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]"></el-table-column>
        <el-table-column prop="exposure_amount" label="风险金额" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]"></el-table-column>
        <el-table-column prop="potential_payout" label="中奖赔付" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            -{{ scope.row.potential_payout }}
          </template>
        </el-table-column>
        <el-table-column prop="ks_amount" label="预亏损金额" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope"> -{{ scope.row.ks_amount }} </template>
        </el-table-column>
        <el-table-column prop="risk_ratio" label="风险比例" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]"></el-table-column>
        <!-- <el-table-column prop="threshold" label="阈值"></el-table-column> -->
        <!-- <el-table-column prop="target_limit" label="目标限额"></el-table-column> -->
        <!-- <el-table-column prop="transfer_payout" label="转移赔付额度" align="center"></el-table-column>
                <el-table-column prop="transfer_stake_hint" label="建议转投金额" align="center"></el-table-column> -->
        <!-- <el-table-column prop="avg_odds" label="平均赔率" align="center"></el-table-column> -->
        <el-table-column prop="trans_count" label="转出单量" align="center"></el-table-column>
        <el-table-column prop="trans_amount" label="转出金额" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]"></el-table-column>

        <el-table-column label="已转出单量" align="center">
          <template slot-scope="scope">
            <span class="risk-level-ORANGE">{{ scope.row.trans_ed_count }} / {{ scope.row.trans_ed_amount }}¥</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="risk_level" label="风险等级" align="center">
          <template slot-scope="scope">
            <span :class="'risk-level-' + scope.row.risk_level">{{
              scope.row.risk_level
            }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="bet_content" label="转出内容" align="center" width="250">
          <template slot="header">
            <span>转出内容</span>
            <i v-if="copy_trans" class="el-icon-document-copy" style="margin-left: 5px; cursor: pointer"
              @click="copyColumn"></i>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.bet_content }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 预亏损率弹窗 -->
    <el-dialog title="预亏损率数据" :visible.sync="showPreLossDialog" width="65%">
      <!-- 筛选区域 -->
      <div style="
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f5f7fa;
          border-radius: 4px;
        ">
        <el-form ref="form" class="demo-form-inline" :inline="true" size="mini" label-position="right">
          <el-form-item label="预亏损金额">
            <el-input v-model="preLossAmountMinFilter" placeholder="预亏损金额最小值" clearable @input="handlePreLossFilter"
              style="width: 150px"></el-input>
            -
            <el-input v-model="preLossAmountMaxFilter" placeholder="预亏损金额最大值" clearable @input="handlePreLossFilter"
              style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="转出总金额">
            <el-input v-model="transferAmountFilter" placeholder="转出总金额" clearable type="number"
              @input="handlePreLossFilter"></el-input>
          </el-form-item>

          <el-form-item>
            {{
              (sortedPreLossData.length > 0
                ? sortedPreLossData
                : filteredPreLossData
              ).length
            }}
            / {{ preLossData.length }} 条数据
          </el-form-item>

          <el-form-item label=" ">
            <el-button @click="clearPreLossFilters">重置</el-button>
            <el-button type="primary" @click="handleAIAnalysis" :loading="aiAnalysisLoading">AI分析</el-button>
          </el-form-item>
          <el-button @click="copyPreLossData" type="success">复制内容</el-button>
        </el-form>
      </div>

      <!-- AI分析内容显示区域 -->
      <div v-if="aiAnalysisContent" class="ai-analysis-container">
        <el-card class="ai-analysis-card" header="AI分析结果">
          <!-- 流式接收中显示原始文本，完成后显示渲染后的markdown -->
          <div v-if="!aiAnalysisCompleted" class="markdown-content raw-text">
            {{ aiAnalysisContent }}
          </div>
          <div v-else class="markdown-content" v-html="renderedMarkdown"></div>
        </el-card>
      </div>

      <el-table :data="sortedPreLossData.length > 0 ? sortedPreLossData : filteredPreLossData
        " border stripe highlight-current-row max-height="400" @sort-change="handlePreLossSortChange">
        <el-table-column type="index" label="序号" width="50" align="center" :index="preLossIndexMethod">
        </el-table-column>
        <el-table-column prop="PreLossAmount" label="预亏损金额" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.PreLossAmount).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="PreLossRate" label="预亏损百分比" align="center">
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.PreLossRate) * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column prop="PreLossValueUnit" label="预亏损值单元" align="center">
        </el-table-column>

        <el-table-column prop="TransferAmount" label="转出总金额" align="center">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.TransferAmount).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column width="150" prop="MaxLossAmount" label="最大亏损金额" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.MaxLossAmount).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column prop="Difference" label="差值" align="center">
        </el-table-column>

        <el-table-column prop="GameRatio" label="博弈比例" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.GameRatio) * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column prop="WinWaterRate" label="上水概率" align="center">
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.WinWaterRate) * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="OrderCount" label="号码数" align="center">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.OrderCount).toFixed(0) }}
          </template>
        </el-table-column>
        <el-table-column prop="CalAmount" label="号码单价" align="center" sortable="custom"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.CalAmount).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 模拟转出结果弹窗 -->
    <el-dialog title="模拟转出结果" :visible.sync="showSimulateDialog" width="70%" :close-on-click-modal="false">
      <!-- 汇总信息 -->
      <el-descriptions :column="4" border style="margin-bottom: 15px">
        <el-descriptions-item label="转出数量">
          <span class="summary-value">{{
            simulateSummary.totalTransCount || 0
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="转出金额">
          <span class="summary-value amount">{{
            simulateSummary.totalTransAmount || 0
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="中奖金额">
          <span class="summary-value amount">{{
            simulateSummary.totalWinAmount || 0
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="转出佣金">
          <span class="summary-value amount">{{
            simulateSummary.totalWaterAmount || 0
          }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="simulateResultData" border stripe max-height="500">
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="游戏类别" prop="game_category" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="primary">{{
              scope.row.game_category === 1 ? "福彩" : "体彩"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="转出号码" prop="split_number" align="center">
        </el-table-column>
        <el-table-column label="转出数量" prop="trans_count" align="center">
        </el-table-column>
        <el-table-column label="转出金额" prop="trans_amount" align="center">
        </el-table-column>
        <el-table-column label="中奖金额" prop="win_amount" align="center">
        </el-table-column>
        <el-table-column label="转出佣金" prop="water_amount" align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSimulateDialog = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 渠道选择弹窗 -->
    <channel-select-dialog ref="channelSelectDialog" v-model="showChannelSelectDialog" :game-category="game_category"
      @confirm="handleChannelConfirm" @cancel="handleChannelCancel"></channel-select-dialog>
  </div>
</template>

<script>
import {
  getFcgOrderSplitNumberList,
  batchFcgOrderSplitNumberOperation,
} from "@/api/fcgame/fcg_order_split_number";
import { preLossDataAnalysisSSE } from "@/api/fcgame/fcg_aianalysis";
import infoList from "@/mixins/infoList";
import { mapGetters, mapMutations } from "vuex";
import MarkdownIt from "markdown-it";
import ChannelSelectDialog from "@/view/fcgame/components/ChannelSelectDialog.vue";
import { MessageBox } from "element-ui";
export default {
  name: "fcg_order_split_number",
  mixins: [infoList],
  components: {
    ChannelSelectDialog,
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    // 渲染后的Markdown内容
    renderedMarkdown() {
      if (!this.aiAnalysisContent) return "";
      try {
        // 使用导入的markdown-it，配置更好的渲染选项
        const md = new MarkdownIt({
          html: true, // 允许HTML标签
          linkify: true, // 自动转换URL为链接
          typographer: true, // 启用一些语言中立的替换和引号美化
          breaks: true, // 转换换行符为<br>
        });
        return md.render(this.aiAnalysisContent);
      } catch (error) {
        console.error("Markdown渲染错误:", error);
        // 如果渲染失败，返回原始内容（转义HTML以防止XSS）
        return this.aiAnalysisContent
          .replace(/&/g, "&")
          .replace(/</g, "<")
          .replace(/>/g, ">")
          .replace(/"/g, '"')
          .replace(/'/g, "&#039;");
      }
    },
    // 创建双向绑定的计算属性
    alpha: {
      get() {
        return this.$store.state.common.alpha;
      },
      set(value) {
        this.setAlpha(value);
      },
    },
    beta: {
      get() {
        return this.$store.state.common.beta;
      },
      set(value) {
        this.setBeta(value);
      },
    },
    // 过滤后的预亏损数据
    filteredPreLossData() {
      if (!this.preLossData || this.preLossData.length === 0) {
        return [];
      }

      let filteredData = this.preLossData.filter((item) => {
        const preLossAmount = parseFloat(item.PreLossAmount) || 0;
        const transferAmount = parseFloat(item.TransferAmount) || 0;

        // 预亏损金额最小值筛选
        if (this.preLossAmountMinFilter && this.preLossAmountMinFilter !== "") {
          const minValue = parseFloat(this.preLossAmountMinFilter) || 0;
          if (preLossAmount < minValue) {
            return false;
          }
        }

        // 预亏损金额最大值筛选
        if (this.preLossAmountMaxFilter && this.preLossAmountMaxFilter !== "") {
          const maxValue = parseFloat(this.preLossAmountMaxFilter) || 0;
          if (preLossAmount > maxValue) {
            return false;
          }
        }

        // 转出总金额筛选
        if (this.transferAmountFilter && this.transferAmountFilter !== "") {
          const filterValue = parseFloat(this.transferAmountFilter) || 0;
          if (transferAmount > filterValue) {
            return false;
          }
        }

        return true;
      });

      // 如果有排序条件，对过滤后的数据进行排序
      if (this.preLossSortProp && this.preLossSortOrder) {
        filteredData = [...filteredData].sort((a, b) => {
          let valueA = a[this.preLossSortProp];
          let valueB = b[this.preLossSortProp];

          // 处理数字类型的排序
          if (
            this.preLossSortProp === "PreLossAmount" ||
            this.preLossSortProp === "PreLossRate" ||
            this.preLossSortProp === "TransferAmount" ||
            this.preLossSortProp === "OrderCount" ||
            this.preLossSortProp === "CalAmount" ||
            this.preLossSortProp === "GameRatio" ||
            this.preLossSortProp === "MaxLossAmount"
          ) {
            valueA = parseFloat(valueA) || 0;
            valueB = parseFloat(valueB) || 0;
          }

          if (this.preLossSortOrder === "ascending") {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        });
      }

      return filteredData;
    },
    // 根据风险比例和转出单量过滤后的订单数据（AND逻辑）
    filteredRickOrder() {
      if (
        !this.rickDataInfo.rick_order ||
        this.rickDataInfo.rick_order.length === 0
      ) {
        return [];
      }

      // 获取筛选条件
      const riskRatioFilter = this.prate ? parseFloat(this.prate) || 0 : null;
      const splitNumberFilter = this.split_number
        ? this.split_number.toString().trim()
        : null;
      // const transCountFilter = this.search_trans_count
      //   ? parseFloat(this.search_trans_count) || 0
      //   : null;

      // 如果没有任何筛选条件，返回所有数据
      if (riskRatioFilter === null && splitNumberFilter === null) {
        return this.rickDataInfo.rick_order;
      }
      // if (riskRatioFilter === null && transCountFilter === null) {
      //   return this.rickDataInfo.rick_order;
      // }

      return this.rickDataInfo.rick_order.filter((item) => {
        const riskRatio = parseFloat(item.risk_ratio) || 0;
        const splitNumber = item.split_number
          ? item.split_number.toString()
          : "";
        // const transCount = parseFloat(item.trans_count) || 0;

        // 根据存在的筛选条件进行AND逻辑筛选
        let passRiskRatio = true;
        let passSplitNumber = true;
        // let passTransCount = true;

        // 如果有风险比例筛选条件
        if (riskRatioFilter !== null) {
          passRiskRatio = riskRatio > riskRatioFilter;
        }

        // 如果有拆分号码筛选条件
        if (splitNumberFilter !== null) {
          passSplitNumber = splitNumber.includes(splitNumberFilter);
        }

        // 如果有转出单量筛选条件
        // if (transCountFilter !== null) {
        //   passTransCount = transCount > transCountFilter;
        // }

        // 返回同时满足所有条件的数据
        // return passRiskRatio && passTransCount;
        return passRiskRatio && passSplitNumber;
      });
    },
    // 独胆过滤是否禁用
    isDDDisabled() {
      return (
        (this.hundredsNum !== null && this.hundredsNum !== "") ||
        (this.tenthNum !== null && this.tenthNum !== "") ||
        (this.onesNum !== null && this.onesNum !== "")
      );
    },
    // 百位、十位、个位是否禁用
    isPosDisabled() {
      return this.ddNum !== null && this.ddNum !== "";
    },
  },
  data() {
    return {
      gameRatio: "0%",
      fast_trans: false,
      channel_trans: false,
      copy_trans: false,
      listApi: getFcgOrderSplitNumberList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      chartIssueId: 0,
      tenant_id: null,
      split_number: null,
      game_category: 1, // 默认福彩
      all_trans: 0, //是否全部转出
      maxValue: 0,
      // 期号列表
      lotteryIssueList: [],
      rickDataInfo: {},
      ks_amount: undefined,
      // 预亏损弹窗相关数据
      showPreLossDialog: false,
      preLossData: [],
      // 筛选相关数据
      preLossAmountMinFilter: "",
      preLossAmountMaxFilter: "",
      transferAmountFilter: "",
      // 排序相关数据
      sortProp: "",
      sortOrder: null,
      // 预亏损数据排序相关
      preLossSortProp: "",
      preLossSortOrder: null,
      sortedPreLossData: [],
      // 复制loading状态
      copyLoading: false,
      prate: null, //风险比例数字帅选
      search_trans_count: null, //转出单量
      batchThreshold: 50, // 批次拆分阈值
      aiAnalysisLoading: false, // AI分析加载状态
      aiAnalysisContent: "", // AI分析内容
      aiAnalysisCompleted: false, // AI分析是否完成
      fastTransferLoading: false, // 快速转出按钮加载状态
      showSimulateDialog: false, // 模拟转出结果弹窗显示状态
      simulateResultData: [], // 模拟转出结果数据
      simulateSummary: {
        totalTransCount: 0,
        totalTransAmount: 0,
        totalWinAmount: 0,
        totalWaterAmount: 0,
      }, // 模拟转出汇总数据

      //号码过滤
      hundredsNum: null,
      hundredsCount: null,
      tenthNum: null,
      tenthCount: null,
      onesNum: null,
      onesCount: null,
      ddNum: null,
      ddCount: null,
      showChannelSelectDialog: false,
      selectedChannelId: null,
      transferSchemeList: [],
    };
  },
  methods: {
    ...mapMutations("common", ["setAlpha", "setBeta"]),
    categoryChange() {
      this.getChartData()
    },
    // 更新排序后的预亏损数据
    updateSortedPreLossData() {
      this.sortedPreLossData = this.filteredPreLossData;
    },
    // 自定义序号方法，从1开始
    indexMethod(index) {
      return index + 1;
    },
    // 预亏损率表格的自定义序号方法，从1开始
    preLossIndexMethod(index) {
      return index + 1;
    },
    // 与亏损率
    async preLossRate() {
      const res = await getFcgOrderSplitNumberList({
        action: "pre_loss_rate",
        game_category: this.game_category,
        issue_id: this.chartIssueId,
        // alpha: this.alpha,
        // beta: this.beta,
        tenant_id: this.tenant_id,
        ks_amount: this.ks_amount,
      });
      if (res.code === 0 && res.data && res.data.pre_loss_list) {
        this.preLossData = res.data.pre_loss_list;
        // 清除之前的筛选条件
        this.clearPreLossFilters();
        this.showPreLossDialog = true;
      } else {
        this.$message.error(res.msg || "获取数据失败");
      }
    },

    // 追加转出
    async handleAppendTransfer(item) {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      if (this.tenant_id == 0) {
        this.$message.warning("请选择所属组织");
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({
          action: "rick_odds",
          game_category: this.game_category,
          issue_id: this.chartIssueId,
          tenant_id: this.tenant_id,
          addition: 1,

          // 使用 item 中的参数
          ks_amount: item.ks_amount,
          trans_count: item.query_trans_count,

          // 号码过滤参数
          hundredsNum: item.filter_hundreds_num,
          tenthNum: item.filter_tenth_num,
          onesNum: item.filter_ones_num,
          hundredsCount: item.filter_hundreds_count,
          tenthCount: item.filter_tenth_count,
          onesCount: item.filter_ones_count,
          ddNum: item.filter_dd_num,
          ddCount: item.filter_dd_count,
        });

        if (res.code === 0 && res.data) {
          this.rickDataInfo = res.data;
          this.fast_trans = res.data.fast_trans;
          this.channel_trans = res.data.channel_trans;
          this.copy_trans = res.data.copy_trans;
          //todo 本期转单方案数据
          this.transferSchemeList = res.data.transfer_scheme || [];
        } else {
          this.chartData = null;
          this.$message.error(res.msg || "获取数据失败");
        }
      } finally {
        this.chartLoading = false;
      }
    },

    // 获取图表数据
    async getChartData() {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      if (this.tenant_id == 0) {
        this.$message.warning("请选择所属组织");
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({
          action: "rick_odds",
          game_category: this.game_category,
          issue_id: this.chartIssueId,
          // alpha: this.alpha,
          // beta: this.beta,
          ks_amount: this.ks_amount,
          tenant_id: this.tenant_id,
          trans_count: this.search_trans_count,

          //号码过滤
          hundredsNum: this.hundredsNum,
          tenthNum: this.tenthNum,
          onesNum: this.onesNum,
          hundredsCount: this.hundredsCount,
          tenthCount: this.tenthCount,
          onesCount: this.onesCount,
          ddNum: this.ddNum,
          ddCount: this.ddCount,

          //全部转出
          all_trans: this.all_trans,
        });
        if (res.code === 0 && res.data) {
          this.rickDataInfo = res.data;

          this.fast_trans = res.data.fast_trans;
          this.channel_trans = res.data.channel_trans;
          this.copy_trans = res.data.copy_trans;
          //todo 本期转单方案数据
          this.transferSchemeList = res.data.transfer_scheme || [];

          this.gameRatio = res.data.game_ratio || 0;
        } else {
          this.chartData = null;
          this.$message.error(res.msg || "获取数据失败");
        }
      } finally {
        this.chartLoading = false;
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val && val.length > 0) {
        this.applyBetContent(val);
      }
    },

    handleSelectAll(selection) {
      this.multipleSelection = selection;
      if (selection && selection.length > 0) {
        this.applyBetContent(selection);
      }
    },

    handleRowSelect(selection, row) {
      if (row) {
        this.applyBetContent([row]);
      }
      this.multipleSelection = selection || [];
    },

    applyBetContent(items) {
      let prefix = this.game_category === 1 ? "福" : "体";
      items.forEach((item) => {
        const exposureAmount = parseFloat(item.exposure_amount);
        const betSuffix =
          !isNaN(exposureAmount) && exposureAmount <= 1
            ? "1元"
            : `${item.trans_count}单`;
        this.$set(
          item,
          "bet_content",
          `${prefix} ${item.split_number} ${betSuffix}`
        );
      });
    },

    // 处理表格排序变化
    handleSortChange({ prop, order }) {
      this.sortProp = prop;
      this.sortOrder = order;

      // 获取当前过滤后的数据进行排序
      const currentData = this.filteredRickOrder;

      if (!currentData || currentData.length === 0) {
        return;
      }

      // 创建数据副本进行排序
      const sortedData = [...currentData];

      if (order) {
        sortedData.sort((a, b) => {
          let valueA = a[prop];
          let valueB = b[prop];

          // 处理数字类型的排序
          if (
            prop === "exposure_amount" ||
            prop === "potential_payout" ||
            prop === "ks_amount" ||
            prop === "trans_amount" ||
            prop === "split_count" ||
            prop === "risk_ratio"
          ) {
            valueA = parseFloat(valueA) || 0;
            valueB = parseFloat(valueB) || 0;
          }

          // 处理拆单号码的排序（可能是数字或字符串）
          if (prop === "split_number") {
            // 尝试转换为数字，如果失败则按字符串排序
            const numA = parseFloat(valueA);
            const numB = parseFloat(valueB);
            if (!isNaN(numA) && !isNaN(numB)) {
              valueA = numA;
              valueB = numB;
            } else {
              // 字符串排序
              if (order === "ascending") {
                return valueA.toString().localeCompare(valueB.toString());
              } else {
                return valueB.toString().localeCompare(valueA.toString());
              }
            }
          }

          if (order === "ascending") {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        });
      }

      // 更新排序后的数据到原始数据，这样过滤后的数据也会保持排序
      this.$set(this.rickDataInfo, "rick_order", sortedData);
    },

    // 处理预亏损率弹窗表格排序变化
    handlePreLossSortChange({ prop, order }) {
      // 更新排序条件
      this.preLossSortProp = prop;
      this.preLossSortOrder = order;

      // 强制更新视图
      this.$forceUpdate();
    },

    // 处理预亏损数据筛选
    handlePreLossFilter() {
      // 这个方法主要用于触发计算属性的重新计算
      // 实际的筛选逻辑在 filteredPreLossData 计算属性中
    },

    // 处理拆分号码筛选
    handleSplitNumberFilter() {
      // 这个方法主要用于触发计算属性的重新计算
      // 实际的筛选逻辑在 filteredRickOrder 计算属性中
    },

    // 清除预亏损数据筛选
    clearPreLossFilters() {
      this.preLossAmountMinFilter = "";
      this.preLossAmountMaxFilter = "";
      this.transferAmountFilter = "";
      // 同时清除排序条件
      this.preLossSortProp = "";
      this.preLossSortOrder = null;
      // 清空排序后的数据
      this.sortedPreLossData = [];
      // 强制更新视图
      this.$forceUpdate();
    },

    // 生成内容按钮点击事件
    generateContent() {
      // 判断是否有选择数据
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }

      this.applyBetContent(this.multipleSelection);
    },

    // 生成批次内容
    generateBatchContent(validData) {
      let prefix = this.game_category === 1 ? "福" : "体";

      // 为每个号码计算批次信息
      const numberBatches = {};
      let totalTransCount = 0;
      let totalTransAmount = 0;

      validData.forEach((item) => {
        const number = item.split_number;
        const totalCount = parseInt(item.trans_count) || 0;
        const amount = parseFloat(item.trans_amount) || 0;
        const exposureAmount = parseFloat(item.exposure_amount);
        const useOneYuan =
          !isNaN(exposureAmount) && exposureAmount <= 1;
        if (totalCount <= 0) {
          return;
        }
        totalTransCount += totalCount;
        totalTransAmount += amount;

        if (totalCount <= this.batchThreshold) {
          // 不需要拆分，直接添加到第一批次
          if (!numberBatches[1]) {
            numberBatches[1] = [];
          }
          numberBatches[1].push(
            `${number}/${useOneYuan ? "1元" : `${totalCount}单`}`
          );
        } else {
          // 需要拆分
          const batchCount = Math.ceil(totalCount / this.batchThreshold);
          let remainingCount = totalCount;

          for (let batchIndex = 1; batchIndex <= batchCount; batchIndex++) {
            if (!numberBatches[batchIndex]) {
              numberBatches[batchIndex] = [];
            }

            const countInThisBatch = Math.min(
              remainingCount,
              this.batchThreshold
            );
            numberBatches[batchIndex].push(
              `${number}/${useOneYuan ? "1元" : `${countInThisBatch}单`}`
            );
            remainingCount -= countInThisBatch;
          }
        }
      });

      // 生成多行内容
      const lines = [];
      const maxBatch = Math.max(...Object.keys(numberBatches).map(Number));

      for (let batchIndex = 1; batchIndex <= maxBatch; batchIndex++) {
        if (numberBatches[batchIndex] && numberBatches[batchIndex].length > 0) {
          const batchItems = numberBatches[batchIndex];
          const batchLines = [];

          // 当号码数量超过50个时换行
          for (let i = 0; i < batchItems.length; i += 50) {
            const chunk = batchItems.slice(i, i + 50);
            // 超过50个号码量换行的新行不需要拼接前缀
            batchLines.push(chunk.join(", "));
          }

          // 每个批次生成多行，每行最多50个号码
          batchLines.forEach((line) => {
            // 只有超出batchThreshold批次的那部分数据才拼接 福或者体字
            if (batchIndex > 1) {
              lines.push(`${prefix} ${line}`);
            } else {
              lines.push(" ");
              // lines.push(line);
              lines.push(`${prefix} ${line}`);
            }
          });

          // 在批次之间添加空白行（除了最后一个批次）
          if (batchIndex < maxBatch) {
            lines.push(" "); // 添加空白行
          }
        }
      }

      if (totalTransCount > 0) {
        lines.push(`总单量： ${totalTransCount}单，总金额：${parseFloat(totalTransAmount).toFixed(2)}元。`);
      }
      return lines.join("\n");
    },

    // 复制内容按钮点击事件
    async copyColumn() {
      // 防止重复点击
      if (this.copyLoading) {
        return;
      }

      // 过滤掉 bet_content 为空的数据
      const validData = this.multipleSelection.filter(
        (item) => item.bet_content && ((parseInt(item.trans_count) || 0) > 0)
      );

      // 如果没有有效数据，提示用户
      if (validData.length === 0) {
        this.$message.warning("没有可复制的内容");
        return;
      }

      // 生成批次格式的内容
      const contentToCopy = this.generateBatchContent(validData);

      try {
        // 复制到剪贴板 - 使用兼容的方法
        if (navigator.clipboard && window.isSecureContext) {
          // 在安全上下文中使用现代 clipboard API
          await navigator.clipboard.writeText(contentToCopy);
        } else {
          // 兼容旧浏览器或非安全上下文的实现
          const textarea = document.createElement("textarea");
          textarea.value = contentToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        // this.$message.success("复制成功");

        // 复制成功后弹窗确认是否保存方案
        try {
          await MessageBox.confirm("复制成功，是否保存复制方案？", "提示", {
            confirmButtonText: "保存",
            cancelButtonText: "不保存",
            type: "warning",
          });
          await this.sendTransferData(validData);
        } catch (e) {
          // 选择“不保存”或关闭弹窗不做任何处理
        }
      } catch (err) {
        this.$message.error("复制失败");
        console.error("复制失败:", err);
      }
    },

    // 发送转移数据到后台
    async sendTransferData(validData) {
      try {
        this.copyLoading = true;

        // 构建transfer_list数据
        const transfer_list = validData.map((item) => ({
          split_number: item.split_number,
          trans_count: item.trans_count,
          trans_amount: item.trans_amount,
          tenant_id: this.tenant_id,
        }));

        // 构建请求数据
        const requestData = {
          game_category: this.game_category,
          ids: [this.chartIssueId],
          issue_id: this.chartIssueId,
          command: "transfer",
          transfer_list: transfer_list,
        };

        const params = {
          ks_amount: this.ks_amount, //预亏损金额
          trans_count: this.search_trans_count, //转出单量
          hundredsNum: this.hundredsNum,
          tenthNum: this.tenthNum,
          onesNum: this.onesNum,
          hundredsCount: this.hundredsCount,
          tenthCount: this.tenthCount,
          onesCount: this.onesCount,
        };

        // 调用API接口
        const res = await batchFcgOrderSplitNumberOperation(requestData, params);

        if (res.code === 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg || "保存转出数据失败");
        }
      } catch (error) {
        this.$message.error("保存转出数据失败");
        console.error("保存转出数据失败:", error);
      } finally {
        this.copyLoading = false;
      }
    },

    // 点击渠道转单按钮
    async handleChannelTransfer() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }
      this.showChannelSelectDialog = true;
      // 通过 ref 调用组件的 open 方法
      this.$nextTick(() => {
        this.$refs.channelSelectDialog.open();
      });
    },

    // 确认选择通道
    handleChannelConfirm(channelId) {
      this.selectedChannelId = channelId;
      // 这里可以调用其他方法进行后续处理
      // 例如：执行渠道转单操作
      this.executeChannelTransfer();
    },

    // 取消选择通道
    handleChannelCancel() {
      this.selectedChannelId = null;
    },

    // 执行渠道转单操作
    async executeChannelTransfer() {
      try {
        this.fastTransferLoading = true;

        // 构建transfer_list数据
        const transfer_list = this.multipleSelection.map((item) => ({
          split_number: item.split_number,
          trans_count: item.trans_count,
          trans_amount: item.trans_amount,
          tenant_id: this.tenant_id,
        }));

        // 构建请求数据
        const requestData = {
          game_category: this.game_category,
          ids: [this.chartIssueId],
          issue_id: this.chartIssueId,
          command: "transfer",
          transfer_list: transfer_list,
          channel_id: this.selectedChannelId, // 添加选中的通道ID
        };

        const params = {
          ks_amount: this.ks_amount, //预亏损金额
          trans_count: this.search_trans_count, //转出单量
          hundredsNum: this.hundredsNum,
          tenthNum: this.tenthNum,
          onesNum: this.onesNum,
          hundredsCount: this.hundredsCount,
          tenthCount: this.tenthCount,
          onesCount: this.onesCount,
        };

        // 调用API接口
        const res = await batchFcgOrderSplitNumberOperation(requestData, params);

        if (res.code === 0) {
          this.$message.success("渠道转单成功");
          // 刷新数据
          this.getChartData();
        } else {
          this.$message.error(res.msg || "渠道转单失败");
        }
      } catch (error) {
        this.$message.error("渠道转单失败");
        console.error("渠道转单失败:", error);
      } finally {
        this.fastTransferLoading = false;
      }
    },

    // 处理快速转出按钮点击
    async handleFastTransfer(emulated) {
      // 判断是否有选择数据
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }

      // 调用快速转出方法
      await this.fastTransferData(this.multipleSelection, emulated);
    },

    // 快速转出数据到后台
    async fastTransferData(validData, emulated) {
      try {
        this.fastTransferLoading = true;

        // 构建transfer_list数据
        const transfer_list = validData.map((item) => ({
          split_number: item.split_number,
          trans_count: item.trans_count,
          trans_amount: item.trans_amount,
          tenant_id: this.tenant_id,
        }));

        // 构建请求数据
        const requestData = {
          game_category: this.game_category,
          ids: [this.chartIssueId],
          issue_id: this.chartIssueId,
          command: "transfer", // 使用fast_transfer命令
          transfer_list: transfer_list,
          fast_trans: true,
          emulated: emulated,
        };

        const params = {
          ks_amount: this.ks_amount, //预亏损金额
          trans_count: this.search_trans_count, //转出单量
          hundredsNum: this.hundredsNum,
          tenthNum: this.tenthNum,
          onesNum: this.onesNum,
          hundredsCount: this.hundredsCount,
          tenthCount: this.tenthCount,
          onesCount: this.onesCount,
        };

        // 调用API接口
        const res = await batchFcgOrderSplitNumberOperation(requestData, params);

        if (res.code === 0) {
          if (emulated) {
            // 模拟转出，显示结果弹窗
            this.simulateResultData = res.data.trans || [];
            // 计算汇总数据
            this.calculateSimulateSummary();
            this.showSimulateDialog = true;
          } else {
            this.$message.success("快速转出成功");
          }
        } else {
          this.$message.error(res.msg || "快速转出失败");
        }
      } catch (error) {
        this.$message.error("快速转出失败");
        console.error("快速转出失败:", error);
      } finally {
        this.fastTransferLoading = false;
      }
    },

    // 计算模拟转出汇总数据
    calculateSimulateSummary() {
      const data = this.simulateResultData;
      this.simulateSummary = {
        totalTransCount: data.reduce(
          (sum, item) => sum + (parseInt(item.trans_count) || 0),
          0
        ),
        totalTransAmount: data
          .reduce((sum, item) => sum + (parseFloat(item.trans_amount) || 0), 0)
          .toFixed(2),
        totalWinAmount: data
          .reduce((sum, item) => sum + (parseFloat(item.win_amount) || 0), 0)
          .toFixed(2),
        totalWaterAmount: data
          .reduce((sum, item) => sum + (parseFloat(item.water_amount) || 0), 0)
          .toFixed(2),
      };
    },

    // AI分析功能（使用SSE流式接收）
    handleAIAnalysis() {
      // 获取当前筛选后的数据
      const currentData =
        this.sortedPreLossData.length > 0
          ? this.sortedPreLossData
          : this.filteredPreLossData;

      // 检查是否有数据
      if (!currentData || currentData.length === 0) {
        this.$message.warning("没有可分析的数据");
        return;
      }

      // 清空之前的分析内容
      this.aiAnalysisContent = "";
      this.aiAnalysisLoading = true;
      this.aiAnalysisCompleted = false;

      // 构建markdown表格内容（与copyPreLossData方法相同的逻辑）
      let markdownTable =
        "根据以下的内容帮我分析出最合适的投资方案,并简要说明选择的原因\n\n";

      // 表头
      markdownTable +=
        "| 序号 | 预亏损金额 | 预亏损百分比 | 预亏损值单元 | 转出总金额 | 差值 | 博弈比例 | 上水概率 | 号码数 | 号码单价 |\n";

      // 分隔线
      markdownTable +=
        "|------|------------|--------------|--------------|------------|------|----------|----------|--------|----------|\n";

      // 数据行
      currentData.forEach((item, index) => {
        const row = [
          index + 1,
          parseFloat(item.PreLossAmount).toFixed(2),
          (parseFloat(item.PreLossRate) * 100).toFixed(2) + "%",
          item.PreLossValueUnit || "",
          parseFloat(item.TransferAmount).toFixed(2),
          item.Difference || "",
          (parseFloat(item.GameRatio) * 100).toFixed(2) + "%",
          (parseFloat(item.WinWaterRate) * 100).toFixed(2) + "%",
          parseFloat(item.OrderCount).toFixed(0),
          parseFloat(item.CalAmount).toFixed(2),
        ];

        markdownTable += "| " + row.join(" | ") + " |\n";
      });

      // 构建请求数据，使用markdown格式内容
      const requestData = {
        game_category: this.game_category,
        issue_id: this.chartIssueId,
        tenant_id: this.tenant_id,
        ks_amount: this.ks_amount,
        data: markdownTable, // 使用markdown格式内容而不是原始数据
      };

      // 调用SSE流式AI分析接口
      preLossDataAnalysisSSE(
        requestData,
        // onMessage: 接收到消息时的回调
        (message) => {
          // 确保message是字符串类型
          let content = message;
          if (typeof message !== "string") {
            content = String(message);
          }

          // 实时追加内容
          this.aiAnalysisContent += content;

          // 滚动到AI分析内容区域（首次接收消息时）
          if (this.aiAnalysisContent.length === content.length) {
            this.$nextTick(() => {
              const element = document.querySelector(".ai-analysis-container");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            });
          }
        },
        // onDone: 完成时的回调
        () => {
          this.aiAnalysisLoading = false;
          this.aiAnalysisCompleted = true;
          this.$message.success("AI分析完成");
        },
        // onError: 错误时的回调
        (error) => {
          this.aiAnalysisLoading = false;
          this.$message.error("AI分析请求失败: " + error.message);
          console.error("AI分析错误:", error);
        }
      );
    },

    // 显示分析结果
    showAnalysisResult(result) {
      // 使用Element UI的MessageBox显示分析结果
      this.$msgbox({
        title: "AI分析结果",
        message: this.$createElement("div", {
          domProps: {
            innerHTML: result.replace(/\n/g, "<br>"),
          },
          style: {
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          },
        }),
        showCancelButton: false,
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
      }).catch(() => { });
    },

    // 复制预亏损数据为markdown表格格式
    async copyPreLossData() {
      // 获取当前筛选后的数据
      const currentData =
        this.sortedPreLossData.length > 0
          ? this.sortedPreLossData
          : this.filteredPreLossData;

      // 检查是否有数据
      if (!currentData || currentData.length === 0) {
        this.$message.warning("没有可复制的数据");
        return;
      }

      try {
        // 构建markdown表格
        let markdownTable =
          "根据以下的内容帮我分析出最合适的投资方案,并简要说明选择的原因\n\n";

        // 表头
        markdownTable +=
          "| 序号 | 预亏损金额 | 预亏损百分比 | 预亏损值单元 | 转出总金额 | 差值 | 博弈比例 | 上水概率 | 号码数 | 号码单价 |\n";

        // 分隔线
        markdownTable +=
          "|------|------------|--------------|--------------|------------|------|----------|----------|--------|----------|\n";

        // 数据行
        currentData.forEach((item, index) => {
          const row = [
            index + 1,
            parseFloat(item.PreLossAmount).toFixed(2),
            (parseFloat(item.PreLossRate) * 100).toFixed(2) + "%",
            item.PreLossValueUnit || "",
            parseFloat(item.TransferAmount).toFixed(2),
            item.Difference || "",
            (parseFloat(item.GameRatio) * 100).toFixed(2) + "%",
            (parseFloat(item.WinWaterRate) * 100).toFixed(2) + "%",
            parseFloat(item.OrderCount).toFixed(0),
            parseFloat(item.CalAmount).toFixed(2),
          ];

          markdownTable += "| " + row.join(" | ") + " |\n";
        });

        // 复制到剪贴板
        if (navigator.clipboard && window.isSecureContext) {
          // 在安全上下文中使用现代 clipboard API
          await navigator.clipboard.writeText(markdownTable);
        } else {
          // 兼容旧浏览器或非安全上下文的实现
          const textarea = document.createElement("textarea");
          textarea.value = markdownTable;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        this.$message.success("复制成功");
      } catch (err) {
        this.$message.error("复制失败");
        console.error("复制失败:", err);
      }
    },
  },
  watch: {
    // 监听排序条件变化，更新排序后的数据
    preLossSortProp() {
      this.updateSortedPreLossData();
    },
    preLossSortOrder() {
      this.updateSortedPreLossData();
    },
    // 监听过滤条件变化，更新排序后的数据
    preLossAmountMinFilter() {
      this.updateSortedPreLossData();
    },
    preLossAmountMaxFilter() {
      this.updateSortedPreLossData();
    },
    transferAmountFilter() {
      this.updateSortedPreLossData();
    },
    // 监听原始数据变化，更新排序后的数据
    preLossData() {
      this.updateSortedPreLossData();
    },
    // 监听弹窗关闭，清空AI分析内容
    showPreLossDialog(newVal) {
      if (!newVal) {
        this.aiAnalysisContent = "";
        this.aiAnalysisCompleted = false;
      }
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.getChartData();
  },
};
</script>

<style scoped>
.chart-container {
  margin: 20px 0;
}

.chart {
  width: 100%;
  min-height: 400px;
}

.issue-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.data-summary {
  margin: 20px 0;
}

.summary-item {
  text-align: center;
  padding: 10px 0;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
}

.risk-level-YELLOW {
  color: #ffd700;
  font-weight: bold;
}

.risk-level-RED {
  color: #ff0000;
  font-weight: bold;
}

.risk-level-ORANGE {
  color: #ffa500;
  font-weight: bold;
}

.total-info-with-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.total-info-with-button .el-descriptions {
  flex: 1;
}

.total-info-with-button .el-button {
  margin-left: 20px;
  flex-shrink: 0;
}

.button-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 10px;
  margin-top: 20px;
  flex-shrink: 0;
}

.button-column .el-button {
  margin-left: 0;
}

/* 模拟转出弹窗汇总样式 */
.summary-value {
  font-weight: 600;
  color: #409eff;
  font-size: 13px;
}

.summary-value.amount {
  color: #67c23a;
  font-size: 14px;
}

/* 预亏损弹窗样式 */
.dialog-footer {
  text-align: center;
  padding: 20px 0 0 0;
}

/* 表格数字格式化 */
.el-table .cell {
  font-family: "Courier New", monospace;
}

/* 弹窗表格样式优化 */
.el-dialog__body {
  padding: 20px;
}

/* AI分析内容样式 */
.ai-analysis-container {
  margin-top: 20px;
}

.ai-analysis-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.markdown-content {
  line-height: 1.6;
  color: #333;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

/* 原始文本样式（流式接收时） */
.markdown-content.raw-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Courier New", monospace;
}

/* Markdown内容样式 */
.markdown-content h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}

.markdown-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 18px 0 8px 0;
  color: #67c23a;
  border-bottom: 1px solid #67c23a;
  padding-bottom: 3px;
}

.markdown-content h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0 6px 0;
  color: #e6a23c;
}

.markdown-content h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 14px 0 6px 0;
  color: #f56c6c;
}

.markdown-content p {
  margin: 10px 0;
  text-align: justify;
}

.markdown-content ul,
.markdown-content ol {
  margin: 10px 0;
  padding-left: 20px;
}

.markdown-content li {
  margin: 5px 0;
}

.markdown-content blockquote {
  margin: 15px 0;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-left: 4px solid #409eff;
  color: #606266;
}

.markdown-content code {
  background-color: #f5f7fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  color: #e6a23c;
}

.markdown-content pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 15px 0;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
  color: #333;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content th {
  background-color: #f5f7fa;
  font-weight: bold;
}

.markdown-content tr:nth-child(even) {
  background-color: #fafafa;
}

.markdown-content a {
  color: #409eff;
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content strong {
  font-weight: bold;
  color: #303133;
}

.markdown-content em {
  font-style: italic;
  color: #606266;
}

/* 组合文本框 */
.combo-input {
  display: flex;
  align-items: center;
}

.left .el-input__inner {
  width: 60px;
  text-align: center;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.right .el-input__inner {
  width: 120px;
  border-left: none;
  border-radius: 0 4px 0 4px;
}

.split {
  padding: 0 6px;
  color: #999;
}
</style>
