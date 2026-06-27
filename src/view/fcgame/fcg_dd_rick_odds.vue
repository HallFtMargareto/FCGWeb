<template>
    <div>
        <div class="search-term">
            <searchform size="mini" :maxShow="9" @search="getData">
                <el-form-item label="期号">
                    <IssueSelect v-model="chartIssueId" placeholder="请选择期号" clearable></IssueSelect>
                </el-form-item>
                <el-form-item label="所属组织" v-if="this.$store.state.user.userInfo.perm['host']">
                    <TenantSelect v-model="tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable>
                    </TenantSelect>
                </el-form-item>
                <el-form-item label="彩票类型">
                    <el-select v-model="game_category" placeholder="彩票类型">
                        <el-option label="福彩" :value="1"></el-option>
                        <el-option label="体彩" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转出金额">
                    <el-input v-model="transferAmount" placeholder="请输入转出金额" :min="0" :precision="2"
                        @change="updateRiskTransferAmounts"></el-input>
                </el-form-item>
            </searchform>
        </div>

        <div class="data-info" v-if="dataList && dataList.length > 0">
            <div class="stats-bar">
                <span class="stat-item">总号码数：<strong>{{ totalCount }}</strong></span>
                <span class="stat-item">总金额：<strong>{{ formatNumber(totalAmount) }}</strong></span>
            </div>
            <el-table :data="dataList" style="width: 100%" border>
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column prop="number" label="独胆号码" align="center"></el-table-column>
                <el-table-column prop="total_amount" label="总金额" align="center">
                    <template slot-scope="scope">
                        {{ formatNumber(scope.row.total_amount) }}
                    </template>
                </el-table-column>
                <el-table-column prop="potential_payout" label="中奖赔付" align="center">
                    <template slot-scope="scope">
                        -{{ formatNumber(scope.row.potential_payout) }}
                    </template>
                </el-table-column>
                <el-table-column label="" align="center">
                    <template slot="header">
                        <span>转出金额</span>
                        <i class="el-icon-document-copy" style="margin-left: 5px; cursor: pointer"
                            @click="copyRiskTransferData"></i>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.risk_transfer_amount" :min="0" :precision="2"
                            size="small"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getFcgOrderSplitNumberList, batchFcgOrderSplitNumberOperation } from "@/api/fcgame/fcg_order_split_number";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";

export default {
    name: "fcg_dd_rick_odds",
    mixins: [infoList],
    computed: {
        ...mapGetters("user", ["userInfo"]),
        totalCount() {
            return this.dataList.length;
        },
        totalAmount() {
            return this.dataList.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
        }
    },
    data() {
        return {
            chartIssueId: 0,
            tenant_id: null,
            game_category: 1,
            dataList: [],
            transferAmount: 0, // 转出金额
            copyLoading: false // 复制loading状态
        };
    },
    methods: {
        // 计算并更新所有行的风控转出金额
        updateRiskTransferAmounts() {
            if (!this.dataList || this.dataList.length === 0) return;
            this.dataList.forEach(item => {
                // 计算风控转出金额：总金额 - 转出金额，如果结果<=0则为0
                const calculated = Number(item.total_amount || 0) - Number(this.transferAmount || 0);
                item.risk_transfer_amount = Math.max(0, calculated);
            });
        },
        // 复制风控转出数据
        async copyRiskTransferData() {
            // 防止重复点击
            if (this.copyLoading) {
                return;
            }

            // 过滤掉风控转出金额为0的数据
            const validData = this.dataList.filter(
                (item) => item.risk_transfer_amount && Number(item.risk_transfer_amount) > 0
            );

            // 如果没有有效数据，提示用户
            if (validData.length === 0) {
                this.$message.warning("没有可复制的内容");
                return;
            }

            // 生成内容
            const contentToCopy = this.generateCopyContent(validData);

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

                // 复制成功后弹窗确认是否保存方案
                try {
                    await MessageBox.confirm("复制成功，是否保存复制方案？", "提示", {
                        confirmButtonText: "保存",
                        cancelButtonText: "不保存",
                        type: "warning",
                    });
                    await this.sendRiskTransferData(validData);
                } catch (e) {
                    // 选择“不保存”或关闭弹窗不做任何处理
                }
            } catch (err) {
                this.$message.error("复制失败");
                console.error("复制失败:", err);
            }
        },
        // 生成复制内容
        generateCopyContent(validData) {
            const lines = [];
            let totalRiskAmount = 0;

            validData.forEach((item) => {
                const riskAmount = Number(item.risk_transfer_amount) || 0;
                lines.push(`独胆 ${item.number} ${riskAmount}元`);
                totalRiskAmount += riskAmount;
            });

            // 添加总金额
            lines.push(`总金额 ${totalRiskAmount}元`);

            return lines.join("\n");
        },
        // 发送风控转出数据到后台
        async sendRiskTransferData(validData) {
            try {
                this.copyLoading = true;

                // 构建transfer_list数据
                const transfer_list = validData.map((item) => ({
                    split_number: item.number,
                    trans_amount: item.risk_transfer_amount,
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

                // 调用API接口
                const res = await batchFcgOrderSplitNumberOperation(requestData, {});

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
        async getData() {
            if (this.chartIssueId == 0) {
                this.$message.warning("请输入期号");
                return;
            }
            try {
                const res = await getFcgOrderSplitNumberList({
                    action: "dudan_odds",
                    game_category: this.game_category,
                    issue_id: this.chartIssueId,
                    tenant_id: this.tenant_id
                });
                if (res.code === 0 && res.data) {
                    this.dataList = res.data.list || [];
                    // 获取数据后初始化风控转出金额
                    this.updateRiskTransferAmounts();
                } else {
                    this.$message.error(res.msg || "获取数据失败");
                }
            } catch (error) {
                this.$message.error("获取数据失败");
            }
        },
        formatNumber(num) {
            if (!num && num !== 0) return "-";
            return Number(num).toLocaleString();
        }
    },
    async created() {
        await this.$nextTick();
        await new Promise((resolve) => setTimeout(resolve, 0));
        this.getData();
    }
};
</script>

<style scoped>
.data-info {
    margin-top: 20px;
}

.stats-bar {
    background: #f5f7fa;
    padding: 12px 20px;
    margin-bottom: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
}

.stat-item {
    margin-right: 40px;
    font-size: 14px;
    color: #606266;
}

.stat-item strong {
    color: #303133;
    font-size: 16px;
}
</style>