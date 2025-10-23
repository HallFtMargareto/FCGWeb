<template>
  <div class="game-info-test">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>游戏信息测试页面</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="refreshData"
          >刷新数据</el-button
        >
      </div>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="sub-card">
            <div slot="header">
              <span>游戏类型</span>
            </div>
            <div v-if="Object.keys(gameTypes).length > 0">
              <el-tag
                v-for="(name, id) in gameTypes"
                :key="id"
                style="margin: 2px"
              >
                {{ id }}: {{ name }}
              </el-tag>
            </div>
            <div v-else>
              <el-empty
                description="暂无游戏类型数据"
                :image-size="100"
              ></el-empty>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="sub-card">
            <div slot="header">
              <span>游戏分类</span>
            </div>
            <div v-if="Object.keys(gameCategory).length > 0">
              <el-tag
                v-for="(name, id) in gameCategory"
                :key="id"
                type="success"
                style="margin: 2px"
              >
                {{ id }}: {{ name }}
              </el-tag>
            </div>
            <div v-else>
              <el-empty
                description="暂无游戏分类数据"
                :image-size="100"
              ></el-empty>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="sub-card">
            <div slot="header">
              <span>模拟赔率</span>
            </div>
            <div v-if="Object.keys(simulatedOdds).length > 0">
              <div
                v-for="(odds, gameKey) in simulatedOdds"
                :key="gameKey"
                style="margin: 2px"
              >
                <el-tag type="warning">{{ gameKey }}: {{ odds }}</el-tag>
              </div>
            </div>
            <div v-else>
              <el-empty description="暂无赔率数据" :image-size="100"></el-empty>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="24">
          <el-card class="sub-card">
            <div slot="header">
              <span>组织列表</span>
            </div>
            <el-table
              :data="tenants"
              style="width: 100%"
              v-if="tenants.length > 0"
            >
              <el-table-column
                prop="organization"
                label="组织标识"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="application"
                label="应用标识"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="platform_name"
                label="平台名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="admin_id"
                label="管理员ID"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="account"
                label="账号"
                width="150"
              ></el-table-column>
            </el-table>
            <div v-else>
              <el-empty description="暂无组织数据" :image-size="100"></el-empty>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="24">
          <el-alert
            title="数据更新时间"
            :description="
              lastUpdateTime
                ? new Date(lastUpdateTime).toLocaleString()
                : '暂无数据'
            "
            type="info"
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GameInfoTest",
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters("gameInfo", [
      "gameTypes",
      "gameCategory",
      "simulatedOdds",
      "tenants",
      "lastUpdateTime",
    ]),
  },
  methods: {
    ...mapActions("gameInfo", ["fetchGameInfo"]),
    async refreshData() {
      this.loading = true;
      try {
        await this.fetchGameInfo();
        this.$message.success("数据刷新成功");
      } catch (error) {
        this.$message.error("数据刷新失败: " + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    console.log("游戏信息测试页面数据:", {
      gameTypes: this.gameTypes,
      gameCategory: this.gameCategory,
      simulatedOdds: this.simulatedOdds,
      tenants: this.tenants,
      lastUpdateTime: this.lastUpdateTime,
    });
  },
};
</script>

<style scoped>
.game-info-test {
  padding: 20px;
}

.sub-card {
  margin-bottom: 20px;
}

.el-tag {
  margin: 2px;
}
</style>
