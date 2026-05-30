<template>
  <el-dialog title="选择渠道" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
    <div v-loading="loading">
      <el-radio-group v-model="selectedChannelId" v-if="channelList.length > 0">
        <el-radio v-for="channel in channelList" :key="channel.ID" :label="channel.ID" class="channel-radio">
          {{ channel.name }}
        </el-radio>
      </el-radio-group>
      <el-empty v-else description="暂无可用渠道"></el-empty>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedChannelId">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFcgTenantChannelList } from "@/api/fcgame/fcg_tenant_channel";

export default {
  name: "ChannelSelectDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    gameCategory: {
      type: [Number, String],
      default: undefined,
    },
  },
  data() {
    return {
      channelList: [],
      selectedChannelId: null,
      loading: false,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    // 打开弹窗
    open() {
      this.selectedChannelId = null;
      this.loadChannelList();
    },

    // 加载通道列表
    async loadChannelList() {
      this.loading = true;
      try {
        const res = await getFcgTenantChannelList({
          page: 1,
          pageSize: 1000,
          state: true, // 只获取启用的通道
          game_category: this.gameCategory,
        });
        if (res.code === 0 && res.data && res.data.list) {
          this.channelList = res.data.list;
        } else {
          this.$message.error(res.msg || "获取通道列表失败");
          this.channelList = [];
          this.dialogVisible = false;
        }
      } catch (error) {
        console.error("获取通道列表异常:", error);
        this.$message.error("获取通道列表异常");
        this.channelList = [];
      } finally {
        this.loading = false;
      }
    },

    // 确认选择
    handleConfirm() {
      if (!this.selectedChannelId) {
        this.$message.warning("请选择渠道");
        return;
      }
      this.$emit("confirm", this.selectedChannelId);
      this.dialogVisible = false;
    },

    // 取消选择
    handleCancel() {
      this.$emit("cancel");
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.channel-radio {
  display: block;
  margin-bottom: 15px;
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
