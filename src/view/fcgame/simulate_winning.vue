<template>
    <div>
        <div class="search-term">
            <searchform size="mini" :maxShow="5" @search="getChartData">
                <el-form-item label="期号">
                    <el-select v-model="chartIssueId" placeholder="请选择期号" @change="getChartData" clearable>
                        <el-option v-for="item in lotteryIssueList" :key="item.ID" :label="item.issue_no"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="福彩开奖号码">
                    <el-input v-model="fc_draw_number" placeholder="请输入福彩模拟开奖号码"></el-input>
                </el-form-item>

                <el-form-item label="体彩开奖号码">
                    <el-input v-model="tc_draw_number" placeholder="请输入体彩模拟开奖号码"></el-input>
                </el-form-item>

            </searchform>
        </div>

        <div class="rick-data-info" v-if="rickDataInfo && rickDataInfo.orders">
            <div class="total-info">
                <el-descriptions title="模拟中奖信息" :column="3" border>
                    <el-descriptions-item label="订单数量">{{ rickDataInfo.win_order_count }}</el-descriptions-item>
                    <el-descriptions-item label="总奖金">{{ rickDataInfo.total_win_amount }}</el-descriptions-item>

                </el-descriptions>
            </div>
            <el-table :data="rickDataInfo.orders" style="width: 100%" border>
                <el-table-column prop="ID" label="ID" align="center"></el-table-column>
                <el-table-column prop="bet_content" label="投注内容" align="center"></el-table-column>
                <el-table-column prop="win_amount" label="奖金" align="center"></el-table-column>
            </el-table>
        </div>

        <div class="split-info" v-if="rickDataInfo && rickDataInfo.split_list">
            <div class="split-item" v-for="item in rickDataInfo.split_list" :key="item.split_number">
                <div class="split-number">{{ item.split_number }}</div>
                <div class="split-price">
                    <el-tag class="split-tag">
                        ¥{{ item.total_amount }}
                    </el-tag>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {
    getFcgOrderSplitNumberList
} from "@/api/fcgame/fcg_order_split_number";
import { getFcgLotteryIssueList } from "@/api/fcgame/fcg_lottery_issue";
import infoList from "@/mixins/infoList";
import { mapGetters, mapMutations } from "vuex";
export default {
    name: "fcg_order_split_number",
    mixins: [infoList],
    computed: {
        ...mapGetters("user", ["userInfo"]),
        // 创建双向绑定的计算属性
        alpha: {
            get() {
                return this.$store.state.common.alpha;
            },
            set(value) {
                this.setAlpha(value);
            }
        },
        beta: {
            get() {
                return this.$store.state.common.beta;
            },
            set(value) {
                this.setBeta(value);
            }
        }
    },
    data() {
        return {
            listApi: getFcgOrderSplitNumberList,
            openDialog: false,
            dialogTitle: "",
            type: "",
            multipleSelection: [],
            chartIssueId: 0,
            game_category: 1,    // 默认福彩
            maxValue: 0,
            // 期号列表
            lotteryIssueList: [],
            rickDataInfo: {},
            fc_draw_number: "",
            tc_draw_number: ""
        };
    },
    methods: {
        ...mapMutations("common", ["setAlpha", "setBeta"]),
        // 获取期号列表
        async getLotteryIssueList() {
            try {
                const res = await getFcgLotteryIssueList({ page: 1, pageSize: 100 });
                if (res.code === 0 && res.data && res.data.list) {
                    this.lotteryIssueList = res.data.list;
                    // 获取到列表后默认取第一条期号作为参数
                    if (this.lotteryIssueList.length > 0) {
                        this.chartIssueId = this.lotteryIssueList[0].ID
                        console.log(this.chartIssueId)
                        this.getChartData()
                    }
                }
            } catch (error) {
                console.error('获取期号列表失败:', error);
                this.$message.error('获取期号列表失败');
            }
        },


        // 获取图表数据
        async getChartData() {
            if (this.chartIssueId == 0) {
                this.$message.warning('请输入期号');
                return;
            }
            this.chartLoading = true;
            try {
                const res = await getFcgOrderSplitNumberList({
                    action: "simulate_winning",
                    // game_category: this.game_category,
                    issue_id: this.chartIssueId,
                    fc_draw_number: this.fc_draw_number,
                    tc_draw_number: this.tc_draw_number
                });
                if (res.code === 0 && res.data) {
                    this.rickDataInfo = res.data;
                } else {
                    this.chartData = null;
                    this.$message.error(res.msg || '获取数据失败');
                }
            } finally {
                this.chartLoading = false;
            }
        },

        onQuery() {
            this.summary = {};
            this.showSummary = false;

            this.page = 1
            this.pageSize = 10
            this.getTableData()
        },
    },

    async created() {
        await this.getLotteryIssueList();
    }
};
</script>

<style scoped>
.split-tag {
    color: #EE4445;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    width: 100%;
}

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
    color: #FFD700;
    font-weight: bold;
}

.risk-level-RED {
    color: #FF0000;
    font-weight: bold;
}

.risk-level-ORANGE {
    color: #FFA500;
    font-weight: bold;
}

.total-info {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
}

.split-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
}

.split-item {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 15px;
    width: calc(10% - 15px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.split-number {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}

.split-price {
    display: flex;
    justify-content: center;
    align-items: center;
}

.split-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
}

.label {
    font-weight: bold;
}

.value {
    text-align: right;
}
</style>
