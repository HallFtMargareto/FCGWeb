<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="5" @search="onQuery">

        <el-form-item label="用户名称">
          <el-input v-model="searchInfo.nick_name" placeholder="用户名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="会话名称">
          <el-input v-model="searchInfo.group_name" placeholder="群组名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="投注号码">
          <el-input v-model="searchInfo.bet_number" placeholder="投注号码" clearable></el-input>
        </el-form-item>

        <el-form-item label="原始内容">
          <el-input v-model="searchInfo.bet_content" placeholder="原始内容" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="期号ID">
          <el-input v-model="searchInfo.issue_id" placeholder="期号ID" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="识别难度">
          <el-select v-model="searchInfo.risk_level" placeholder="请选择识别难度">
            <el-option label="容易" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
            <el-option label="极难" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单筛选">
          <el-select v-model="activeFilter" @change="filterOrders">
            <el-option label="全部" value="all"></el-option>
            <el-option label="待开奖" value="pending"></el-option>
            <el-option label="已开奖" value="opened"></el-option>
            <el-option label="已中奖" value="won"></el-option>
            <el-option label="未中奖" value="lost"></el-option>
            <el-option label="已撤单" value="cancelled"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="期号">
          <el-input v-model="searchInfo.issue_no" placeholder="冗余的期号，便于查询" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="追号组ID（若属于追号则有值）">
          <el-input v-model="searchInfo.trace_id" placeholder="追号组ID（若属于追号则有值）" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="若为组合/拆单的顶层单，可记录父ID">
          <el-input v-model="searchInfo.parent_order_id" placeholder="若为组合/拆单的顶层单，可记录父ID" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="投注数量">
          <el-input v-model.number="searchInfo.bet_count" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="用户账号">
          <el-input v-model="searchInfo.user_name" placeholder="用户账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="业务单号">
          <el-input v-model="searchInfo.order_no" placeholder="业务单号" clearable></el-input>
        </el-form-item>

        <el-form-item label="投注金额">
          <el-input v-model="searchInfo.bet_amount" placeholder="投注总金额" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="倍数">
          <el-input v-model.number="searchInfo.multiple" placeholder="请输入" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="订单状态" prop="order_status">
          <el-select v-model="searchInfo.order_status" placeholder="请选择">
            <el-option label="待支付" value="0"></el-option>
            <el-option label="待开奖" value="1"></el-option>
            <el-option label="已开奖" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="searchInfo.pay_status" placeholder="请选择">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="支付失败" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付渠道">
          <el-input v-model="searchInfo.pay_channel" placeholder="支付渠道(余额/微信/支付宝/第三方)" clearable></el-input>
        </el-form-item>

        <el-form-item label="支付流水号">
          <el-input v-model="searchInfo.transaction_id" placeholder="支付流水号" clearable></el-input>
        </el-form-item>

        <el-form-item label="支付时间">
          <datepicker v-model="searchInfo.payment_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item>

        <el-form-item label="中奖总金额">
          <el-input v-model="searchInfo.win_amount" placeholder="中奖总金额" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="派奖状态（0=未派奖,1=待派奖,2=派奖中,3=已派奖,4=派奖失败）" prop="award_status">
          <el-select v-model="searchInfo.award_status" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item> -->


        <!-- <el-form-item label="实际派奖时间">
          <datepicker v-model="searchInfo.award_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item> -->


        <el-form-item label="撤单类型" prop="cancel_type">
          <el-select v-model="searchInfo.cancel_type" placeholder="请选择">
            <el-option label="用户取消" :value="0"></el-option>
            <el-option label="系统超时" :value="1"></el-option>
            <el-option label="风控" :value="2"></el-option>
            <el-option label="人工" :value="3"></el-option>
          </el-select>
        </el-form-item>


        <!-- <el-form-item label="退款金额（分）">
          <el-input v-model="searchInfo.refund_amount" placeholder="退款金额（分）" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="退款状态" prop="refund_status">
          <el-select v-model="searchInfo.refund_status" placeholder="请选择">
            <el-option label="无退款" :value="0"></el-option>
            <el-option label="退款中" :value="1"></el-option>
            <el-option label="已退款" :value="2"></el-option>
            <el-option label="退款失败" :value="3"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="下单来源">
          <el-input v-model="searchInfo.source" placeholder="下单来源(APP,WEB,第三方渠道等)" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="clientIp">
          <el-input v-model="searchInfo.client_ip" placeholder="clientIp" clearable></el-input>
        </el-form-item> -->



        <!-- <el-form-item label="deviceId">
          <el-input v-model="searchInfo.device_id" placeholder="deviceId" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="风控分">
          <el-input v-model.number="searchInfo.risk_score" placeholder="请输入" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="乐观/悲观锁标志（简易）" prop="is_locked">
          <el-select v-model="searchInfo.is_locked" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="乐观锁版本号(更新时+1)">
          <el-input v-model.number="searchInfo.version" placeholder="请输入" clearable></el-input>
        </el-form-item> -->



        <!-- <el-form-item label="扩展字段（备用）">
          <el-input v-model="searchInfo.ext" placeholder="扩展字段（备用）" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="开始时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>

        <el-form-item label="导出">
          <el-button v-if="userInfo.perm['system.export']" @click="exportExcel"
            icon="el-icon-sold-out">导出EXCEL</el-button>
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <!-- <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button> -->
        <!-- <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button> -->
      </el-form>
    </div>


    <!-- 订单状态标签页 -->
    <div>
      <el-row :gutter="24">

        <el-col :span="7">
          <!-- 订单状态标签页 -->
          <el-tabs v-model="statusTabState" @tab-click="handleStatusTabClick">
            <el-tab-pane label="全部订单" name="all"></el-tab-pane>
            <el-tab-pane label="待识别" name="0"></el-tab-pane>
            <el-tab-pane label="识别失败" name="1"></el-tab-pane>
            <el-tab-pane label="识别成功" name="2"></el-tab-pane>
            <el-tab-pane label="未中奖" name="3"></el-tab-pane>
            <el-tab-pane label="已中奖" name="4"></el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="17">
          <!-- 玩法类型标签页 -->
          <el-tabs v-model="tabState" @tab-click="handleClick">
            <el-tab-pane v-for="item in gameTypes" :key="item.value" :label="item.label"
              :name="String(item.value)"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- table -->
    <div class="card-container" v-if="groupedTableData">
      <div v-if="!groupedTableData || groupedTableData.length === 0" class="empty-state">
        暂无订单数据
      </div>

      <el-card v-for="(orderGroup, index) in groupedTableData" :key="index" class="order-card" shadow="hover">
        <div class="card-title">
          <div style="flex: 1; text-align: left;">
            <span style="margin-right: 5px;">【{{ orderGroup.group_name }}】</span>
            <span style="margin-right: 5px;">{{ orderGroup.user_info }} :</span>
            <span class="chat-content">{{ orderGroup.chat_content }}</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <el-button @click="infoRow(orderGroup)" type="text" size="mini" icon="el-icon-warning-outline">
              订单信息
            </el-button>
            <el-button v-if="userInfo.perm['system.update']" @click="editRow(orderGroup)" type="text" size="mini"
              icon="el-icon-edit">
              编辑
            </el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
              title="确定要撤销这个订单吗？" @confirm="deleteRow(orderGroup)" v-if="userInfo.perm['system.delete']">
              <el-button type="text" size="mini" icon="el-icon-delete" slot="reference" style="color: red;">
                撤单
              </el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="card-content">
          <!-- 左侧：订单信息 -->
          <!-- <el-tag size="small"></el-tag> -->
          <div class="left-panel">
            <el-descriptions :column="2" size="mini" border :labelStyle="{ width: '100px' }">
              <el-descriptions-item label="ID">{{ orderGroup.ID }}</el-descriptions-item>
              <el-descriptions-item label="总金额">
                ¥ {{ orderGroup.total_bet_amount }}
              </el-descriptions-item>
              <el-descriptions-item label="识别次数">{{ orderGroup.version }}</el-descriptions-item>
              <el-descriptions-item label="代理佣金">¥ {{ orderGroup.commission }}</el-descriptions-item>
              <el-descriptions-item label="识别难度">
                {{ getRiskLevelText(orderGroup.risk_score) }}
              </el-descriptions-item>
              <el-descriptions-item label="总投注">
                {{ orderGroup.total_bet_count }}
              </el-descriptions-item>
              <el-descriptions-item label="识别耗时">{{ orderGroup.message ? orderGroup.message.llmcons_at : ""
              }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{ orderGroup.source }}</el-descriptions-item>
              <el-descriptions-item label="期号">{{ orderGroup.issue_no || orderGroup.issue_no_display
              }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ orderGroup.created_at }}</el-descriptions-item>
              <el-descriptions-item label="单号">{{ orderGroup.order_no }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 右侧：子订单表格 -->
          <div class="right-panel">
            <el-table :data="orderGroup.order_details" size="small" border style="width: 100%" highlight-current-row>
              <el-table-column prop="seq" label="序号" align="center"></el-table-column>
              <el-table-column prop="game_category_name" label="游戏类型" align="center"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="game_type_name" label="玩法" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="bet_number" label="投注号码" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="bet-number-clear">{{ scope.row.bet_number }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bet_count" label="注数" align="center"></el-table-column>
              <el-table-column prop="bet_amount" label="投注金额" align="center">
                <template slot-scope="scope">
                  ¥ {{ scope.row.bet_amount }}
                </template>
              </el-table-column>
              <el-table-column prop="multiple" label="倍数" align="center"></el-table-column>
              <!-- <el-table-column prop="order_amount" label="订单金额" align="center"></el-table-column> -->
              <el-table-column prop="win_amount" label="中奖金额" align="center">
                <template slot-scope="scope">
                  <span :class="{ 'win-amount': scope.row.win_amount > 0 }">
                    {{ scope.row.win_amount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="win_status" label="中奖状态" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.win_amount > 0 ? 'success' : 'info'" size="mini">
                    {{ scope.row.win_amount > 0 ? '中奖' : '未中奖' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <uploadexcel ref="uploadexcel" action="FcgOrder"></uploadexcel>

    <!-- 订单修改弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="openDialog" width="60%" @close="handleDialogClose"
      class="order-dialog">
      <el-form ref="editForm" :model="editFormData" label-width="100px" size="mini">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="订单总金额">
              <el-input v-model.number="editFormData.bet_amount" placeholder="请输入订单总金额"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <!-- <el-form-item label="投注内容">
              <el-input v-model="editFormData.bet_content" disabled></el-input>
            </el-form-item> -->
            <div style="text-align: center;">{{ editFormData.bet_content }}</div>
          </el-col>
        </el-row>

        <el-row>
          <el-button type="primary" @click="addOrderDetail" size="mini">添加子订单</el-button>
        </el-row>
        <div class="dialog-table-container">
          <el-table :data="editFormData.order_details" border style="width: 100%" size="mini" max-height="400"
            highlight-current-row>
            <el-table-column label="游戏类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.game_type" placeholder="请选择游戏类型">
                  <el-option v-for="item in gameTypes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="玩法">
              <template slot-scope="scope">
                <el-select v-model="scope.row.game_category" placeholder="请选择玩法">
                  <el-option label="福彩" :value="1"></el-option>
                  <el-option label="体彩" :value="2"></el-option>
                  <el-option label="排列三" :value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="投注号码">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bet_number" placeholder="投注号码"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="注数">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.bet_count" placeholder="注数"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="投注金额">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bet_amount" placeholder="投注金额"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="倍数">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.multiple" placeholder="倍数"></el-input>
              </template>
            </el-table-column>

            <!-- <el-table-column label="订单金额">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.order_amount" placeholder="订单金额"></el-input>
              </template>
            </el-table-column> -->

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="removeOrderDetail(scope.$index)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveOrderEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 订单拆分详情弹窗 -->
    <el-dialog title="订单信息" :visible.sync="orderDetailDialogVisible" width="60%" center>
      <div class="detail-section">
        <h3>投注文本</h3>
        <code>{{ orderDetailData.content }}</code>
      </div>

      <div class="detail-section">
        <h3>投注金额</h3>
        <span>总金额:{{ orderDetailData.total_amount }}</span>
      </div>

      <!-- 显示split数据 -->
      <div v-if="orderDetailData.split && orderDetailData.split.length > 0" class="detail-section">
        <h3>拆分信息</h3>
        <el-table :data="orderDetailData.split" size="small" border style="width: 100%">
          <el-table-column prop="bet_number" label="投注号码" align="center"></el-table-column>
          <el-table-column prop="game_category" label="彩种" align="center" width="100">
            <template slot-scope="scope">
              {{ getGameCategoryName(scope.row.game_category) }}
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
          <!-- <el-table-column prop="ava_amount" label="单个号码金额" align="center"></el-table-column> -->
        </el-table>
      </div>

      <div class="detail-section">
        <h3>LLM报文</h3>
        <code>{{ orderDetailData.msg }}</code>
      </div>
    </el-dialog>

    <!-- 右侧漂浮操作按钮 -->
    <div class="float-operations">
      <!-- 返回顶部按钮 -->
      <!-- <el-button class="float-btn top-btn" type="primary" icon="el-icon-top" circle size="small"
        @click="handleBackToTop" title="返回顶部"></el-button> -->

      <!-- 查看风控订单按钮 -->
      <el-button style="margin-left: 0 !important;" class="float-btn risk-btn" type="primary" icon="el-icon-s-release"
        circle @click="openRiskOrderDialog" title="风控订单"></el-button>
    </div>

    <!-- 风控订单弹窗 -->
    <el-dialog :title="'风控号码'" :visible.sync="riskOrderDialogVisible" width="50%" top="10vh">
      <!-- 查询表单 -->
      <el-form :inline="true" style="margin-bottom: 20px">
        <el-form-item label="彩票种类">
          <el-select v-model="riskOrderSearchInfo.category" placeholder="彩票种类">
            <el-option label="福彩" value="1"></el-option>
            <el-option label="体彩" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRiskOrderList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="riskOrderList" style="width: 100%" height="500px">
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <el-table-column prop="bet_number" label="号码"></el-table-column>
        <el-table-column prop="split_number" label="拆分号码"></el-table-column>
        <el-table-column prop="total_amount" label="金额">
          <template slot-scope="scope">
            {{ scope.row.total_amount }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount_new" label="转出金额">
          <template slot-scope="scope">
            {{ scope.row.total_amount_new }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="create_time" label="添加时间" width="180">
          <template slot-scope="scope">
            {{ formatTimeToStr(scope.row.create_time) }}
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 分页组件 -->
      <!-- <div class="pagination-container" style="margin-top: 20px;">
        <el-pagination background layout="prev, pager, next, jumper" :total="riskOrderTotal" :page-size="10"
          @current-change="handleRiskOrderPageChange"></el-pagination>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  createFcgOrder,
  deleteFcgOrder,
  updateFcgOrder,
  findFcgOrder,
  getFcgOrderList,
  batchFcgOrderOperation,
  getFcgOrderSummary,
} from "@/api/fcgame/fcg_order";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import { formatTimeToStr } from "@/utils/date";
export default {
  name: "fcg_order",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
    // 处理表格数据，将订单按主订单分组
    groupedTableData() {
      if (!this.tableData || this.tableData.length === 0) {
        return [];
      }

      // 缓存游戏类型和玩法名称，避免重复计算
      const gameCategoryCache = {};
      const gameTypeCache = {};

      return this.tableData.map(order => {
        const groupName = order.message ? order.message.session_name : '未知群';
        const userInfo = order.user ? (order.user.nickname || order.user.username) : order.username || '未知用户';
        const chatContent = order.bet_content || '';

        // 处理子订单数据
        const orderDetails = order.order_details && order.order_details.length > 0
          ? order.order_details.map((detail, index) => ({
            ...detail,
            seq: detail.seq || (index + 1),
            game_category_name: gameCategoryCache[detail.game_category] || (gameCategoryCache[detail.game_category] = this.getGameCategoryName(detail.game_category)),
            game_type_name: gameTypeCache[detail.game_type] || (gameTypeCache[detail.game_type] = this.getGameTypeName(detail.game_type)),
            win_status: detail.win_amount > 0 ? '中奖' : '未中奖'
          }))
          : [];

        return {
          ...order,
          group_name: groupName,
          user_info: userInfo,
          chat_content: chatContent,
          issue_no_display: order.issue_no || '',
          total_bet_count: order.bet_count || 0,
          total_bet_amount: order.bet_amount || 0,
          order_details: orderDetails
        };
      });
    },

  },
  data() {
    return {
      // 风控订单弹窗相关
      riskOrderDialogVisible: false,
      riskOrderList: [],
      riskOrderTotal: 0,
      riskOrderCurrentPage: 1,
      riskOrderSearchInfo: {
        category: ''
      },

      // 订单详情弹窗相关
      orderDetailDialogVisible: false,
      orderDetailData: {},


      listApi: getFcgOrderList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      activeFilter: 'all',
      // 防抖定时器
      searchDebounceTimer: null,
      formData: {
        order_no: "",
        user_id: undefined,
        issue_id: undefined,
        issue_no: "",
        trace_id: undefined,
        parent_order_id: undefined,
        bet_content: "",
        bet_count: undefined,
        bet_amount: undefined,
        multiple: undefined,
        order_status: true,
        pay_status: true,
        pay_channel: "",
        transaction_id: "",
        win_amount: undefined,
        award_status: true,
        cancel_type: true,
        refund_amount: undefined,
        refund_status: true,
        source: "",
        client_ip: "",
        device_id: "",
        risk_score: undefined,
        is_locked: true,
        version: undefined,
        ext: "",

      },
      // 添加编辑订单相关的数据
      editFormData: {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: []
      },
      tabState: '0',
      statusTabState: 'all',
      gameTypes: [
        { value: 0, label: '全部玩法' },
        { value: 1, label: '单选' },
        { value: 2, label: '组三(对子)' },
        { value: 3, label: '组六(无重复)' },
        { value: 4, label: '组六四码' },
        { value: 5, label: '组六五码' },
        { value: 6, label: '组六六码' },
        { value: 7, label: '组六七码' },
        { value: 8, label: '组六八码' },
        { value: 9, label: '组三四码' },
        { value: 10, label: '组三五码' },
        { value: 11, label: '组三六码' },
        { value: 12, label: '组三七码' },
        { value: 13, label: '组三八码' },
        { value: 14, label: '独胆' },
        { value: 15, label: '一码不定位' },
        { value: 16, label: '一码定位' },
        { value: 17, label: '两码不定位(双飞)' },
        { value: 18, label: '两码定位' },
        { value: 19, label: '复试重复号' },
        { value: 20, label: '复试(三不同号)' },
        { value: 21, label: '包对子' },
        { value: 22, label: '包对一' },
        { value: 23, label: '豹子' },
      ],
    };
  },
  methods: {
    async infoRow(row) {
      const orderId = row.order_id || row.ID;
      const res = await findFcgOrder({ ID: orderId, action: "split_info" });
      console.log(res);
      if (res.code == 0) {
        // 保存订单详情数据
        this.orderDetailData = res.data;
        // 解析msg字段中的JSON字符串
        // this.orderDetailData.parsedMsg = res.data.msg;
        // 显示弹窗
        this.orderDetailDialogVisible = true;
      }
    },
    // 返回顶部功能
    handleBackToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },

    // 打开风控订单弹窗
    openRiskOrderDialog() {
      this.riskOrderDialogVisible = true;
      this.riskOrderCurrentPage = 1;
      // this.loadRiskOrderList();
    },

    // 加载风控订单列表
    loadRiskOrderList() {
      this.searchRiskOrderList();
    },

    // 搜索风控订单列表
    async searchRiskOrderList() {
      try {
        const searchParams = {
          page: 1,
          pageSize: 10000,
          action: 'risk_management',
          ...this.riskOrderSearchInfo
        };

        const res = await getFcgOrderList(searchParams);
        if (res.code === 0) {
          this.riskOrderList = res.data.order_list || [];
        } else {
          this.$message.error('获取风控订单列表失败');
        }
      } catch (error) {
        console.error('获取风控订单列表异常:', error);
        this.$message.error('获取风控订单列表异常');
      }
    },

    // 风控订单分页变化
    handleRiskOrderPageChange(page) {
      this.riskOrderCurrentPage = page;
      this.loadRiskOrderList();
    },

    // 获取风险级别文本
    getRiskLevelText(score) {
      const numScore = parseInt(score) || 0;
      if (numScore >= 0 && numScore <= 20) return '容易';
      if (numScore >= 21 && numScore <= 40) return '一般';
      if (numScore >= 41 && numScore <= 60) return '困难';
      if (numScore >= 61 && numScore <= 100) return '极难';
      return '未知';
    },

    // 订单筛选功能
    filterOrders(filterType) {
      this.activeFilter = filterType;

      // 清除之前的筛选条件
      delete this.searchInfo.order_status;
      delete this.searchInfo.win_flag;

      // 根据筛选类型设置查询条件
      switch (filterType) {
        case 'pending': // 待开奖
          this.searchInfo.order_status = 2;
          break;
        case 'opened': // 已开奖
          this.searchInfo.order_status = 3;
          break;
        case 'won': // 已中奖
          this.searchInfo.win_flag = 1;
          break;
        case 'lost': // 未中奖
          this.searchInfo.win_flag = 0;
          break;
        case 'cancelled': // 已撤单
          this.searchInfo.order_status = 4;
          break;
        case 'all':
        default:
          // 全部状态，不添加筛选条件
          break;
      }

      // 重置页码并重新获取数据
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },

    handleClick(tab) {
      if (tab.name == 0) {
        this.searchInfo.game_type = undefined
      } else {
        this.searchInfo.game_type = tab.name;
      }
      this.getTableData();
    },

    // 处理订单状态标签页点击
    handleStatusTabClick(tab) {
      if (tab.name === 'all') {
        delete this.searchInfo.order_status;
      } else {
        this.searchInfo.order_status = tab.name;
      }
      this.getTableData();
    },
    // 格式化时间戳为标准时间格式
    formatTimestamp(timestamp) {
      if (!timestamp || timestamp === "0001-01-01 00:00:00") return '';
      // 如果是时间戳（数字），转换为毫秒
      const time = typeof timestamp === 'number' ? timestamp * 1000 : timestamp;
      return formatTimeToStr(time, "yyyy-MM-dd hh:mm:ss");
    },
    // 获取订单状态类型
    getOrderStatusType(status) {
      const statusMap = {
        0: 'warning', // 待支付
        1: 'info',    // 待开奖  
        2: 'success', // 已开奖
        3: 'danger'   // 已取消
      };
      return statusMap[status] || 'info';
    },
    // 获取订单状态文本
    getOrderStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待开奖',
        2: '已开奖',
        3: '已取消'
      };
      return statusMap[status] || '待开奖';
    },
    // 获取支付状态类型
    getPayStatusType(status) {
      const statusMap = {
        0: 'info',    // 未支付
        1: 'success', // 已支付
        2: 'danger'   // 支付失败
      };
      return statusMap[status] || 'info';
    },
    // 获取支付状态文本
    getPayStatusText(status) {
      const statusMap = {
        0: '未支付',
        1: '已支付',
        2: '支付失败'
      };
      return statusMap[status] || '已支付';
    },
    onQuery() {
      // 清除之前的定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      // 设置新的防抖定时器
      this.searchDebounceTimer = setTimeout(() => {
        this.summary = {};
        this.showSummary = false;
        this.page = 1;
        this.pageSize = 10;
        this.getTableData();
      }, 300); // 300ms防抖延迟
    },
    createRow() {
      this.formData = {};
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑订单";
      // 使用订单的原始ID，而不是可能被明细覆盖的ID
      const orderId = row.order_id || row.ID;
      const res = await findFcgOrder({ ID: orderId });
      if (res.code == 0) {
        // 构造编辑表单数据
        const order = res.data.refcg_order;
        this.editFormData = {
          ID: order.ID,
          order_no: order.order_no,
          bet_amount: order.bet_amount,
          bet_content: order.bet_content,
          order_details: order.order_details ? order.order_details.map(detail => {
            return {
              ID: detail.ID,
              game_category: detail.game_category,
              game_type: detail.game_type,
              bet_number: detail.bet_number || '',
              bet_count: Number(detail.bet_count) || 0,
              bet_amount: detail.bet_amount || 0,
              multiple: detail.multiple || 1,
              order_amount: detail.bet_amount * detail.multiple || 0 // 计算订单金额
            };
          }) : []
        };
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      // 使用订单的原始ID，而不是可能被明细覆盖的ID
      const orderId = row.order_id || row.ID;
      const res = await deleteFcgOrder({ ID: orderId });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        if (this.tableData.length == 1) {
          this.page--;
        }
        this.getTableData();
      }
    },
    async enterDialog() {
      let res;
      switch (this.type) {
        case "create":
          res = await createFcgOrder(this.formData);
          break;
        case "update":
          res = await updateFcgOrder(this.formData);
          break;
        default:
          this.$message({
            type: "error",
            message: "操作类型错误",
          });
          return false;
      }
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "操作成功"
        })
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCommand(command) {
      this.$confirm('是否要执行批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择需要操作的数据",
          });
          return;
        }
        this.multipleSelection && this.multipleSelection.map((item) => {
          // 使用订单的原始ID，而不是可能被明细覆盖的ID
          ids.push(item.order_id || item.ID);
        });

        const res = await batchFcgOrderOperation({
          ids,
          'command': command
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getTableData();
        }
      })
    },
    // 获取游戏类型名称
    getGameCategoryName(categoryId) {
      const categoryMap = {
        1: '福彩',
        2: '体彩',
        3: '排列三',
      };
      return categoryMap[categoryId] || '未知';
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
      const type = this.gameTypes.find(item => item.value === typeId);
      const result = type ? type.label : '未知';
      this._gameTypeCache[typeId] = result;
      return result;
    },

    sortChange(row) {
      //自定义排序要设置两个属性prop="field-name" sortable="custom"
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    async getSummaryList() {
      const res = await getFcgOrderSummary(this.searchInfo);
      let keys = Object.keys(res.data.summary);
      for (let key of keys) {
        this.summary[key] = res.data.summary[key];
      }
      this.showSummary = true;
    },
    getSummaries(param) {
      const sums = [];
      const { columns } = param;
      let that = this;
      columns.forEach((column, index) => {
        sums[index] =
          that.summary[column.property] != null
            ? that.summary[column.property]
            : null;
      });
      // sums[0] = "合计";
      return sums;
    },
    importExcel() {
      //触发upLoad组件内部点击事件，弹出文件选择框
      this.$refs.uploadexcel.chooseFile();
    },
    async exportExcel() {
      this.searchInfo.action = "fcg_order";
      await this.$api.getExcel(this.searchInfo);
    },
    // 添加子订单
    addOrderDetail() {
      this.editFormData.order_details.push({
        game_category_name: '',
        game_type_name: '',
        bet_number: '',
        bet_count: Number(0),
        bet_amount: 0,
        multiple: 1,
        order_amount: 0
      });
    },
    // 删除子订单
    removeOrderDetail(index) {
      this.editFormData.order_details.splice(index, 1);
    },
    // 保存订单编辑
    async saveOrderEdit() {
      const res = await updateFcgOrder(this.editFormData);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "订单编辑成功"
        });
        this.openDialog = false;
        this.getTableData();
      } else {
        this.$message({
          type: "error",
          message: res.msg || "订单编辑失败"
        });
      }
    },
    // 关闭弹窗时的处理
    handleDialogClose() {
      this.editFormData = {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: []
      };
    }
  },
  async created() {
    // 性能监控：记录组件创建时间
    if (process.env.NODE_ENV === 'development') {
      console.time('fcg_order component created');
    }

    // 检查URL查询参数中的状态
    const status = this.$route.query.status;
    if (status) {
      // 设置状态标签页
      this.statusTabState = status;
      // 设置搜索条件
      this.searchInfo.order_status = status;
    }

    await this.getTableData();
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd('fcg_order component created');
    }
  },
  beforeDestroy() {
    // 清理缓存，避免内存泄漏
    if (this._gameTypeCache) {
      this._gameTypeCache = null;
    }

    // 清理防抖定时器
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
  }
};
</script>


<style scoped>
/* 右侧漂浮操作按钮样式 */
.float-operations {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* 漂浮按钮通用样式 */
.float-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.float-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
}

/* 特定按钮样式 */
.top-btn {
  background-color: #409EFF;
}

.top-btn:hover {
  background-color: #66b1ff;
}

.risk-btn {
  background-color: #DE776F;
}

.risk-btn:hover {
  background-color: #DE776F;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  margin-top: -20px;
}

.kl_content {
  background-color: #409eff !important;
}

.btg {
  width: 80px;
  height: 35px;
  border-bottom: none;
  margin-right: 3px !important;
}

.btg {
  width: 80px;
  height: 35px;
  border-bottom: none;
  margin-right: 3px !important;
}

/* 搜索区域样式 */
.search-term {
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.btn-form-inline {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

.search-term .el-form-item {
  margin-bottom: 18px;
}

.search-term .el-form-item__label {
  font-weight: 600;
  color: #606266;
}

/* 标签样式优化 */
.el-tag {
  font-weight: 500;
}

/* 风险级别标签样式 */
.risk-level-tag {
  font-size: 12px;
  font-weight: 600;
}

/* 分页样式 */
.el-pagination {
  margin-top: 30px;
  text-align: right;
}

/* Excel风格表格样式 */
.excel-table-container {
  margin: 20px 0;
  width: 100%;
  overflow-x: auto;
}

.excel-table {
  border-collapse: collapse !important;
  width: 100%;
  font-size: 12px;
  min-width: 100%;
  /* 防止表格太小 */
  max-width: 100%;
  /* 防止表格过宽 */
}

.excel-table .el-table__header th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #e4e7ed;
  text-align: center;
  white-space: nowrap;
}

.excel-table .el-table__body td {
  padding: 6px 8px;
  border: 1px solid #e4e7ed;
  font-size: 12px;
  vertical-align: middle;
}

/* 确保所有列都有边框 */
.excel-table .el-table th,
.excel-table .el-table td {
  border-right: 1px solid #e4e7ed !important;
}

.excel-table .el-table th:last-child,
.excel-table .el-table td:last-child {
  border-right: 1px solid #e4e7ed !important;
}

/* 群信息区域样式 */
.group-info {
  font-weight: 600;
  color: #409eff;
  word-break: break-all;
}

.user-info {
  font-weight: 500;
  color: hsl(220, 86%, 39%);
  word-break: break-all;
}

.chat-content {
  color: #446CF9;
}

/* 投注号码样式 - 更清晰的显示 */
.bet-number-clear {
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  font-weight: 600;
  /* background-color: #f0f9ff; */
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #1f2937;
  border: 1px solid #e1f5fe;
  word-break: break-all;
  line-height: 1.4;
}

/* 操作按钮区域 */
.operation-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.operation-buttons .el-button {
  margin: 0;
  padding: 4px 8px;
  font-size: 12px;
}

/* 中奖金额样式 */
.win-amount {
  color: #67c23a !important;
  font-weight: 600;
}

/* 文本溢出处理 */
.excel-table .el-table__body td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.excel-table .el-table__body td:hover {
  background-color: #f5f7fa;
}

/* 操作按钮样式 */
.danger-btn {
  color: #f56c6c !important;
}

.danger-btn:hover {
  background-color: #fef0f0 !important;
}

/* 空状态样式 */
.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* Card布局样式 */
.card-container {
  margin: 20px 0;
}

.order-card {
  margin-bottom: 20px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
}

.card-header .el-button {
  padding: 6px 12px;
  font-size: 12px;
}

.card-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
}

/* 固定描述列表label宽度 */
.left-panel ::v-deep .el-descriptions__label {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
  text-align: center;
}

.left-panel {
  width: 700px;
  min-width: 600px;
  height: 300px;
  overflow-y: auto;
}

.right-panel {
  flex: 1;
  min-width: 400px;
  height: 300px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 1400px) {
  .left-panel {
    width: 500px;
    min-width: 500px;
    max-height: 350px;
    overflow-y: auto;
  }

  .right-panel {
    min-width: 300px;
    max-height: 350px;
    overflow-y: auto;
  }
}

@media screen and (max-width: 1200px) {
  .card-content {
    flex-direction: row;
  }

  .left-panel {
    width: 400px;
    min-width: 400px;
    height: 350px;
    overflow-y: auto;
  }

  .right-panel {
    min-width: 350px;
    height: 350px;
    overflow-y: auto;
  }
}

@media screen and (max-width: 992px) {
  .card-content {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 400px;
    overflow-y: auto;
  }
}

/* 订单编辑弹窗样式 */
.order-dialog {
  display: flex;
  flex-direction: column;
  margin-top: 5%;
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

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  color: #606266;
  margin-right: 5px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.orders-section {
  margin-top: 15px;
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
