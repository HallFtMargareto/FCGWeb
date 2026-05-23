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

                <el-form-item label="开始时间">
                    <datepicker v-model="searchInfo.startTime" type="datetime" />
                </el-form-item>
                <el-form-item label="结束时间">
                    <datepicker v-model="searchInfo.endTime" type="datetime" />
                </el-form-item>
            </searchform>
        </div>

        <div class="table-container">
            <el-table ref="multipleTable" :data="tableData" :fit="false" border stripe size="small" style="width: 100%"
                :show-summary="showSummary" :summary-method="getSummaries" @selection-change="handleSelectionChange"
                @sort-change="sortChange">
                <!-- <el-table-column type="selection" width="48" fixed="left"></el-table-column> -->
                <!-- <el-table-column label="ID" prop="ID" sortable width="90" align="center" fixed="left"></el-table-column> -->
                <el-table-column label="期号" prop="issue_no" width="120" align="center" fixed="left"></el-table-column>
                <el-table-column label="组织" prop="tennat_name" width="200" align="center" fixed="left"
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
                    <el-table-column label="转出" prop="total_trans_amount" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span class="money-text">{{ formatMoney(scope.row.total_trans_amount) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出佣金" prop="total_trans_water_amount" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span class="money-text commission-text">{{ formatMoney(scope.row.total_trans_water_amount)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出中奖" prop="total_trans_win_amount" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span class="money-text"
                                :style="{ color: getWinAmountColor(scope.row.total_trans_win_amount, scope.row.total_trans_amount) }">
                                {{ formatMoney(scope.row.total_trans_win_amount) }}
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
                            <span class="money-text commission-text">{{ formatMoney(scope.row.fc_total_commission)
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
                    <el-table-column label="转出" prop="fc_total_trans_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text">{{ formatMoney(scope.row.fc_total_trans_amount) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出佣金" prop="fc_total_water_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text commission-text">{{ formatMoney(scope.row.fc_total_water_amount)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出中奖" prop="fc_trans_win_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text"
                                :style="{ color: getWinAmountColor(scope.row.fc_trans_win_amount, scope.row.fc_total_trans_amount) }">
                                {{ formatMoney(scope.row.fc_trans_win_amount) }}
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
                            <span class="money-text commission-text">{{ formatMoney(scope.row.tc_total_commission)
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
                    <el-table-column label="转出" prop="tc_total_trans_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text">{{ formatMoney(scope.row.tc_total_trans_amount) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出佣金" prop="tc_total_water_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text commission-text">{{ formatMoney(scope.row.tc_total_water_amount)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出中奖" prop="tc_trans_win_amount" min-width="110" align="center">
                        <template slot-scope="scope">
                            <span class="money-text"
                                :style="{ color: getWinAmountColor(scope.row.tc_trans_win_amount, scope.row.tc_total_trans_amount) }">
                                {{ formatMoney(scope.row.tc_trans_win_amount) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>

        <div class="table-footer">
            <el-button size="mini" type="primary" plain @click="toggleSummary">
                {{ showSummary ? "隐藏合计" : "合计" }}
            </el-button>
            <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
                class="table-pagination" :style="{ padding: '20px 0' }" :total="total" @current-change="handleCurrentChange"
                @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"
                background></el-pagination>
        </div>

    </div>
</template>

<script>
import {
    createFcgOrderFinance,
    deleteFcgOrderFinance,
    updateFcgOrderFinance,
    findFcgOrderFinance,
    getFcgOrderFinanceList,
    batchFcgOrderFinanceOperation,
} from "@/api/fcgame/fcg_order_finance";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
    name: "fcg_order_finance",
    mixins: [infoList],
    computed: {
        ...mapGetters("user", ["userInfo"]),
    },
    data() {
        return {
            listApi: getFcgOrderFinanceList,
            openDialog: false,
            dialogTitle: "",
            type: "",
            multipleSelection: [],
            tableLayoutTimer: null,
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
        },
        showSummary() {
            this.refreshTableLayout();
        },
    },
    methods: {
        refreshTableLayout() {
            this.$nextTick(() => {
                const table = this.$refs.multipleTable;
                if (!table || typeof table.doLayout !== "function") {
                    return;
                }
                table.doLayout();
                clearTimeout(this.tableLayoutTimer);
                this.tableLayoutTimer = setTimeout(() => {
                    table.doLayout();
                }, 60);
            });
        },
        handleWindowResize() {
            this.refreshTableLayout();
        },
        toggleSummary() {
            this.showSummary = !this.showSummary;
            this.refreshTableLayout();
        },
        onQuery() {
            this.summary = {};
            this.showSummary = false;

            this.page = 1;
            this.pageSize = 10;
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
            const nonSummaryProps = new Set(["issue_no", "tennat_name", "ID", "created_at"]);

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
        await this.getTableData();
    },
    mounted() {
        window.addEventListener("resize", this.handleWindowResize);
        this.refreshTableLayout();
    },
    activated() {
        this.refreshTableLayout();
    },
    deactivated() {
        clearTimeout(this.tableLayoutTimer);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleWindowResize);
        clearTimeout(this.tableLayoutTimer);
    },
};
</script>

<style scoped>
.table-container {
    width: 100%;
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
</style>
