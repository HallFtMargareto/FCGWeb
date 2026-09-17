<template>
    <div>
        <div class="search-term">
            <searchform size="mini" :maxShow="4" @search="onQuery">

                <el-form-item label="期号">
                    <IssueSelect v-model="searchInfo.issue_id" :autoSelectFirst="false" placeholder="请选择期号" clearable>
                    </IssueSelect>
                </el-form-item>

                <template v-if="userInfo.perm['host']">
                    <el-form-item label="所属组织">
                        <TenantSelect v-model="searchInfo.tenant_id" placeholder="请选择组织" :autoSelectFirst="false"
                            :multiple="false" clearable></TenantSelect>
                    </el-form-item>
                </template>

                <el-form-item label="所属会话">
                    <FcgContactSelect v-model="searchInfo.session_id" :tenant-id="searchInfo.tenant_id"
                        :tenant-ids="searchInfo.tenant_id" cache-key-prefix="fcg_order_contact_list" />
                </el-form-item>


                <el-form-item label="开始时间">
                    <datepicker v-model="searchInfo.startTime" type="date" />
                </el-form-item>
                <el-form-item label="结束时间">
                    <datepicker v-model="searchInfo.endTime" type="date" />
                </el-form-item>
            </searchform>
        </div>

        <el-tabs v-model="activeFinanceView" class="finance-view-tabs" @tab-click="handleFinanceViewChange">
            <el-tab-pane label="表格" name="table">
                <div ref="tableContainer" class="table-container">
                    <el-table ref="multipleTable" :data="tableData" :fit="false" :max-height="tableMaxHeight" border
                        stripe size="small" style="width: 100%" :show-summary="showSummary"
                        :summary-method="getSummaries" @selection-change="handleSelectionChange"
                        @sort-change="sortChange">
                        <!-- <el-table-column type="selection" width="48" fixed="left"></el-table-column> -->
                        <!-- <el-table-column label="ID" prop="ID" sortable width="90" align="center" fixed="left"></el-table-column> -->
                        <el-table-column label="期号" prop="issue_no" width="120" align="center"
                            fixed="left"></el-table-column>
                        <el-table-column label="会话" prop="session_name" width="200" align="center" fixed="left"
                            show-overflow-tooltip></el-table-column>
                        <el-table-column label="所属组织" prop="tennat_name" width="200" align="center" fixed="left"
                            show-overflow-tooltip></el-table-column>

                        <el-table-column label="总计" align="center" label-class-name="group-header-total">
                            <el-table-column label="投注" prop="total_bet_amount" min-width="120" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text">{{ formatMoney(scope.row.total_bet_amount) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="佣金" prop="total_commission" min-width="120" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text commission-text">{{ formatMoney(scope.row.total_commission)
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="中奖" prop="total_win_amount" min-width="120" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text"
                                        :style="{ color: getWinAmountColor(scope.row.total_win_amount, scope.row.total_bet_amount) }">
                                        {{ formatMoney(scope.row.total_win_amount) }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="利润" prop="total_profit" min-width="120" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text" :style="{ color: getProfitColor(scope.row.total_profit) }">
                                        {{ formatMoney(scope.row.total_profit) }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="福彩" align="center" label-class-name="group-header-fc">
                            <el-table-column label="投注" prop="fc_total_bet_amount" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text">{{ formatMoney(scope.row.fc_total_bet_amount) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="佣金" prop="fc_total_commission" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text commission-text">{{
                                        formatMoney(scope.row.fc_total_commission)
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="中奖" prop="fc_total_win_amount" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text"
                                        :style="{ color: getWinAmountColor(scope.row.fc_total_win_amount, scope.row.fc_total_bet_amount) }">
                                        {{ formatMoney(scope.row.fc_total_win_amount) }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="体彩" align="center" label-class-name="group-header-tc">
                            <el-table-column label="投注" prop="tc_total_bet_amount" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text">{{ formatMoney(scope.row.tc_total_bet_amount) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="佣金" prop="tc_total_commission" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text commission-text">{{
                                        formatMoney(scope.row.tc_total_commission)
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="中奖" prop="tc_total_win_amount" min-width="110" align="center">
                                <template slot-scope="scope">
                                    <span class="money-text"
                                        :style="{ color: getWinAmountColor(scope.row.tc_total_win_amount, scope.row.tc_total_bet_amount) }">
                                        {{ formatMoney(scope.row.tc_total_win_amount) }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="趋势折线" name="line">
                <div class="chart-panel">
                    <div ref="lineChart" class="finance-chart"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="核心对比" name="bar">
                <div class="chart-panel">
                    <div ref="barChart" class="finance-chart"></div>
                </div>
            </el-tab-pane>
        </el-tabs>

        <div ref="tableFooter" class="table-footer">
            <el-button v-if="activeFinanceView === 'table'" size="mini" type="primary" plain @click="toggleSummary">
                {{ showSummary ? "隐藏合计" : "合计" }}
            </el-button>
            <span v-else class="chart-tips">图表基于当前分页数据展示，可调整数量或切换页码查看更多数据。</span>
            <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
                class="table-pagination" :style="{ padding: '20px 0' }" :total="total"
                @current-change="handleCurrentChange" @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
        </div>

    </div>
</template>

<script>
import {
    createFcgOrderFinance,
    deleteFcgOrderFinance,
    updateFcgOrderFinance,
    findFcgOrderFinance,
    getFcgOrderSessionFinanceList,
    batchFcgOrderFinanceOperation,
} from "@/api/fcgame/fcg_order_finance";
import infoList from "@/mixins/infoList";
import FcgContactSelect from "@/components/fcgContactSelect/index.vue";
import { mapGetters } from "vuex";
import * as echarts from "echarts";
export default {
    name: "fcg_order_finance",
    components: {
        FcgContactSelect,
    },
    mixins: [infoList],
    computed: {
        ...mapGetters("user", ["userInfo"]),
    },
    data() {
        return {
            listApi: getFcgOrderSessionFinanceList,
            openDialog: false,
            dialogTitle: "",
            type: "",
            multipleSelection: [],
            activeFinanceView: "table",
            lineChartInstance: null,
            barChartInstance: null,
            tableLayoutTimer: null,
            tableMaxHeight: 520,
            formData: {
                issue_id: undefined,
                tenant_id: undefined,
                total_bet_amount: undefined,
                total_commission: undefined,
                total_win_amount: undefined,
                total_trans_amount: undefined,
                total_trans_water_amount: undefined,
                total_trans_win_amount: undefined,
                total_profit: undefined,
                total_quantity: undefined,
                fc_total_bet_amount: undefined,
                fc_total_commission: undefined,
                fc_total_win_amount: undefined,
                fc_total_trans_amount: undefined,
                fc_total_water_amount: undefined,
                fc_trans_win_amount: undefined,
                fc_total_quantity: undefined,
                tc_total_bet_amount: undefined,
                tc_total_commission: undefined,
                tc_total_win_amount: undefined,
                tc_total_trans_amount: undefined,
                tc_total_water_amount: undefined,
                tc_trans_win_amount: undefined,
                tc_total_quantity: undefined,
            },
            formRules: {
                issue_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
                tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
                total_bet_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_commission: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_trans_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_trans_water_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_trans_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_profit: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                total_quantity: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_bet_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_commission: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_trans_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_water_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_trans_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                fc_total_quantity: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_bet_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_commission: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_trans_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_water_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_trans_win_amount: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],

                tc_total_quantity: [
                    { required: true, message: "请选择项目", trigger: "change" },
                ],
            },
        };
    },
    watch: {
        tableData() {
            this.refreshTableLayout();
            this.renderFinanceCharts();
        },
        showSummary() {
            this.refreshTableLayout();
        },
        activeFinanceView() {
            this.$nextTick(() => {
                this.refreshTableLayout();
                this.renderFinanceCharts();
            });
        },
    },
    methods: {
        // 切换展示方式后重新计算表格布局或渲染当前图表。
        handleFinanceViewChange() {
            this.$nextTick(() => {
                this.refreshTableLayout();
                this.renderFinanceCharts();
            });
        },
        // 按需初始化图表实例，避免未展示的 tab 提前初始化导致宽度计算错误。
        initFinanceChart(refName, instanceName) {
            const chartDom = this.$refs[refName];
            if (!chartDom) {
                return null;
            }
            if (!this[instanceName]) {
                this[instanceName] = echarts.init(chartDom);
            }
            return this[instanceName];
        },
        disposeFinanceCharts() {
            // 页面销毁时主动释放 ECharts 实例，避免 keep-alive 切换后残留事件和 DOM 引用。
            ["lineChartInstance", "barChartInstance"].forEach((instanceName) => {
                if (this[instanceName]) {
                    this[instanceName].dispose();
                    this[instanceName] = null;
                }
            });
        },
        // 窗口尺寸变化时同步调整已创建的图表实例。
        handleChartsResize() {
            [this.lineChartInstance, this.barChartInstance].forEach((chart) => {
                if (chart) {
                    chart.resize();
                }
            });
        },
        // 图表按当前分页数据绘制，并反转为更符合时间趋势的阅读顺序。
        getChartRows() {
            const rows = Array.isArray(this.tableData) ? [...this.tableData] : [];
            return rows.reverse();
        },
        // host 账号可能看到多组织数据，用期号和组织共同作为横轴标签。
        getChartLabel(row) {
            const issueNo = row.issue_no || "未知期号";
            if (this.userInfo.perm["host"] && row.session_name) {
                return `${issueNo}-${row.session_name}`;
            }
            return issueNo;
        },
        // 横轴只显示少量关键期号，完整期号和组织名称保留在 tooltip 中查看。
        getCompactChartLabel(value, index, total) {
            const step = total > 12 ? Math.ceil(total / 8) : total > 8 ? 2 : 1;
            if (index % step !== 0 && index !== total - 1) {
                return "";
            }
            const label = String(value || "");
            const issueNo = label.split("-")[0] || label;
            return issueNo.length > 10 ? `${issueNo.slice(0, 10)}...` : issueNo;
        },
        // 统一把接口返回的金额字符串转换成图表可识别的数值。
        toChartNumber(value) {
            const num = Number(value);
            return Number.isNaN(num) ? 0 : Number(num.toFixed(2));
        },
        // 大额金额在坐标轴上用“万”缩写，避免标签过长。
        getMoneyAxisLabel(value) {
            if (Math.abs(value) >= 10000) {
                return `${(value / 10000).toFixed(1)}万`;
            }
            return value;
        },
        // 图表 tooltip 复用页面现有金额格式，保证显示口径一致。
        getChartTooltip(params) {
            const list = Array.isArray(params) ? params : [params];
            const title = list[0] ? list[0].axisValueLabel || list[0].name : "";
            const lines = list.map((item) => {
                return `${item.marker}${item.seriesName}：${this.formatMoney(item.value)}`;
            });
            return [title, ...lines].join("<br />");
        },
        // 当前分页没有数据时展示空状态，避免保留上一次图表。
        getEmptyChartOption(title) {
            return {
                title: {
                    text: title,
                    left: "center",
                    top: "middle",
                    textStyle: {
                        color: "#909399",
                        fontSize: 14,
                        fontWeight: "normal",
                    },
                },
                xAxis: { show: false },
                yAxis: { show: false },
                series: [],
            };
        },
        // 只渲染当前可见 tab 的图表，隐藏图表等切换后再初始化。
        renderFinanceCharts() {
            this.$nextTick(() => {
                if (this.activeFinanceView === "line") {
                    this.renderLineChart();
                }
                if (this.activeFinanceView === "bar") {
                    this.renderBarChart();
                }
            });
        },
        // 折线图用于观察投注、中奖、转出、利润随期号或组织的变化趋势。
        renderLineChart() {
            const chart = this.initFinanceChart("lineChart", "lineChartInstance");
            if (!chart) {
                return;
            }
            const rows = this.getChartRows();
            if (!rows.length) {
                chart.setOption(this.getEmptyChartOption("暂无趋势数据"), true);
                return;
            }
            const labels = rows.map((row) => this.getChartLabel(row));
            chart.setOption({
                color: ["#409eff", "#67c23a", "#f56c6c", "#e6a23c"],
                tooltip: {
                    trigger: "axis",
                    formatter: this.getChartTooltip,
                },
                legend: {
                    top: 0,
                    data: ["总投注", "总中奖", "转出", "利润"],
                    selected: {
                        总中奖: false,
                        转出: false,
                    },
                },
                grid: {
                    top: 48,
                    left: 24,
                    right: 24,
                    bottom: 64,
                    containLabel: true,
                },
                dataZoom: [
                    { type: "inside" },
                    { type: "slider", height: 18, bottom: 12 },
                ],
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: labels,
                    axisLabel: {
                        hideOverlap: true,
                        interval: 0,
                        formatter: (value, index) => this.getCompactChartLabel(value, index, labels.length),
                    },
                },
                yAxis: {
                    type: "value",
                    name: "金额",
                    axisLabel: {
                        formatter: this.getMoneyAxisLabel,
                    },
                },
                series: [
                    {
                        name: "总投注",
                        type: "line",
                        smooth: true,
                        data: rows.map((row) => this.toChartNumber(row.total_bet_amount)),
                    },
                    {
                        name: "总中奖",
                        type: "line",
                        smooth: true,
                        data: rows.map((row) => this.toChartNumber(row.total_win_amount)),
                    },
                    {
                        name: "转出",
                        type: "line",
                        smooth: true,
                        data: rows.map((row) => this.toChartNumber(row.total_trans_amount)),
                    },
                    {
                        name: "利润",
                        type: "line",
                        smooth: true,
                        data: rows.map((row) => this.toChartNumber(row.total_profit)),
                    },
                ],
            }, true);
        },
        // 柱状图用于对比总投注、总中奖和利润，更适合横向判断单期财务结果。
        renderBarChart() {
            const chart = this.initFinanceChart("barChart", "barChartInstance");
            if (!chart) {
                return;
            }
            const rows = this.getChartRows();
            if (!rows.length) {
                chart.setOption(this.getEmptyChartOption("暂无对比数据"), true);
                return;
            }
            const labels = rows.map((row) => this.getChartLabel(row));
            chart.setOption({
                color: ["#409eff", "#67c23a", "#f56c6c", "#34c759", "#ff9500"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: { type: "shadow" },
                    formatter: this.getChartTooltip,
                },
                legend: {
                    top: 0,
                    data: ["总投注", "总中奖", "利润", "福彩投注", "体彩投注"],
                    selected: {
                        福彩投注: false,
                        体彩投注: false,
                    },
                },
                grid: {
                    top: 48,
                    left: 24,
                    right: 24,
                    bottom: 64,
                    containLabel: true,
                },
                dataZoom: [
                    { type: "inside" },
                    { type: "slider", height: 18, bottom: 12 },
                ],
                xAxis: {
                    type: "category",
                    data: labels,
                    axisLabel: {
                        hideOverlap: true,
                        interval: 0,
                        formatter: (value, index) => this.getCompactChartLabel(value, index, labels.length),
                    },
                },
                yAxis: {
                    type: "value",
                    name: "金额",
                    axisLabel: {
                        formatter: this.getMoneyAxisLabel,
                    },
                },
                series: [
                    {
                        name: "总投注",
                        type: "bar",
                        data: rows.map((row) => this.toChartNumber(row.total_bet_amount)),
                    },
                    {
                        name: "总中奖",
                        type: "bar",
                        data: rows.map((row) => this.toChartNumber(row.total_win_amount)),
                    },
                    {
                        name: "利润",
                        type: "bar",
                        data: rows.map((row) => this.toChartNumber(row.total_profit)),
                    },
                    {
                        name: "福彩投注",
                        type: "bar",
                        data: rows.map((row) => this.toChartNumber(row.fc_total_bet_amount)),
                    },
                    {
                        name: "体彩投注",
                        type: "bar",
                        data: rows.map((row) => this.toChartNumber(row.tc_total_bet_amount)),
                    },
                ],
            }, true);
        },
        updateTableMaxHeight() {
            const container = this.$refs.tableContainer;
            if (!container) {
                return;
            }
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
            const top = container.getBoundingClientRect().top;
            const footerHeight = this.$refs.tableFooter ? this.$refs.tableFooter.offsetHeight : 60;
            const bottomSpace = 24;
            const nextHeight = Math.max(
                320,
                Math.floor(viewportHeight - top - footerHeight - bottomSpace)
            );
            if (nextHeight !== this.tableMaxHeight) {
                this.tableMaxHeight = nextHeight;
            }
        },
        refreshTableLayout() {
            this.$nextTick(() => {
                this.updateTableMaxHeight();
                const table = this.$refs.multipleTable;
                if (!table || typeof table.doLayout !== "function") {
                    return;
                }
                table.doLayout();
                clearTimeout(this.tableLayoutTimer);
                this.tableLayoutTimer = setTimeout(() => {
                    this.updateTableMaxHeight();
                    table.doLayout();
                }, 60);
            });
        },
        handleWindowResize() {
            this.refreshTableLayout();
            this.handleChartsResize();
        },
        toggleSummary() {
            this.showSummary = !this.showSummary;
            this.refreshTableLayout();
        },
        onQuery() {
            this.summary = {};
            this.showSummary = false;

            this.page = 1;
            this.pageSize = 50;
            this.getTableData();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getTableData();
        },
        createRow() {
            this.formData = {};
            this.type = "create";
            this.dialogTitle = "创建";
            this.openDialog = true;
        },
        async editRow(row) {
            this.type = "update";
            this.dialogTitle = "编辑";
            const res = await findFcgOrderFinance({ ID: row.ID });
            if (res.code == 0) {
                this.formData = res.data.refcg_order_finance;
                this.openDialog = true;
            }
        },
        async deleteRow(row) {
            const res = await deleteFcgOrderFinance({ ID: row.ID });
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: "删除成功",
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
                    res = await createFcgOrderFinance(this.formData);
                    break;
                case "update":
                    res = await updateFcgOrderFinance(this.formData);
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
                    message: "操作成功",
                });
                this.$refs.dialog.handleClose();
                this.openDialog = false;
                this.getTableData();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCommand(command) {
            this.$confirm("是否要执行批量操作?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                const ids = [];
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: "warning",
                        message: "请选择需要操作的数据",
                    });
                    return;
                }
                this.multipleSelection &&
                    this.multipleSelection.map((item) => {
                        ids.push(item.ID);
                    });

                const res = await batchFcgOrderFinanceOperation({
                    ids,
                    command: command,
                });
                if (res.code == 0) {
                    this.$message({
                        type: "success",
                        message: "操作成功",
                    });
                    this.getTableData();
                }
            });
        },
        sortChange(row) {
            //自定义排序要设置两个属性prop="field-name" sortable="custom"
            this.orderField = row.prop;
            this.orderType = this.directionMap[row.order] || "";
            this.getTableData();
        },
        isCountField(prop) {
            return /count|quantity|num|times/i.test(prop || "");
        },
        formatMoney(value) {
            const num = Number(value);
            if (Number.isNaN(num)) {
                return "-";
            }
            return `¥${num.toFixed(2)}`;
        },
        formatCount(value) {
            if (value === null || value === undefined || value === "") {
                return "-";
            }
            return value;
        },
        getProfitColor(profit) {
            const profitValue = parseFloat(profit || 0);
            if (profitValue > 0) {
                return "#67c23a";
            }
            if (profitValue < 0) {
                return "#f56c6c";
            }
            return "#303133";
        },
        getWinAmountColor(winAmount, betAmount) {
            const win = parseFloat(winAmount || 0);
            const bet = parseFloat(betAmount || 0);
            if (win > bet) {
                return "#f56c6c";
            }
            if (win < bet) {
                return "#67c23a";
            }
            return "#303133";
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            const nonSummaryProps = new Set(["issue_no", "session_name", "ID", "created_at"]);

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "合计";
                    return;
                }

                const prop = column.property;
                if (!prop || nonSummaryProps.has(prop)) {
                    sums[index] = "";
                    return;
                }

                const values = data
                    .map((item) => Number(item[prop]))
                    .filter((value) => !Number.isNaN(value));

                if (!values.length) {
                    sums[index] = "";
                    return;
                }

                const total = values.reduce((prev, curr) => prev + curr, 0);
                sums[index] = this.isCountField(prop) ? `${total}` : this.formatMoney(total);
            });

            return sums;
        },
        importExcel() {
            //触发upLoad组件内部点击事件，弹出文件选择框
            this.$refs.uploadexcel.chooseFile();
        },
        async exportExcel() {
            this.searchInfo.action = "fcg_order_finance";
            await this.$api.getExcel(this.searchInfo);
        },
    },
    async created() {
        this.pageSize = 50;
        await this.getTableData();
    },
    mounted() {
        window.addEventListener("resize", this.handleWindowResize);
        this.refreshTableLayout();
    },
    activated() {
        this.refreshTableLayout();
        this.renderFinanceCharts();
    },
    deactivated() {
        clearTimeout(this.tableLayoutTimer);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleWindowResize);
        clearTimeout(this.tableLayoutTimer);
        this.disposeFinanceCharts();
    },
};
</script>

<style scoped>
.table-container {
    width: 100%;
}

.finance-view-tabs {
    width: 100%;
}

.chart-panel {
    min-height: 520px;
    padding: 16px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fff;
}

.finance-chart {
    width: 100%;
    height: 500px;
}

.chart-tips {
    color: #909399;
    font-size: 12px;
}

.table-container ::v-deep .el-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.table-container ::v-deep .el-table th {
    font-weight: 600;
}

.table-container ::v-deep .el-table td {
    padding: 8px 0;
}

.table-container ::v-deep .el-table .cell {
    padding: 0 8px;
    text-align: center;
}

.table-container ::v-deep th.group-header-total {
    background: #e8f3ff !important;
}

.table-container ::v-deep th.group-header-fc {
    background: #eafaf0 !important;
}

.table-container ::v-deep th.group-header-tc {
    background: #fff6e8 !important;
}

.table-container ::v-deep th.group-header-total .cell,
.table-container ::v-deep th.group-header-fc .cell,
.table-container ::v-deep th.group-header-tc .cell {
    font-weight: 700;
}

.table-container ::v-deep .el-table__fixed,
.table-container ::v-deep .el-table__fixed-right {
    background-color: #fff;
}

.table-container ::v-deep .el-table__body tr:hover>td {
    background-color: #f5f7fa !important;
}

.money-text {
    font-variant-numeric: tabular-nums;
}

.commission-text {
    color: #667de8;
}

.table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 8px;
}

.table-pagination {
    margin-left: auto;
}

@media (max-width: 1400px) {
    .table-container ::v-deep .el-table .cell {
        padding: 0 4px;
        font-size: 12px;
    }
}

@media (max-width: 768px) {
    .chart-panel {
        min-height: 420px;
        padding: 8px;
    }

    .finance-chart {
        height: 400px;
    }
}
</style>
