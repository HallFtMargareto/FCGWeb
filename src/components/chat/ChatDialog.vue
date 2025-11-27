<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    @close="handleClose"
    class="chat-dialog"
    :top="'5vh'"
    :show-header="false"
  >
    <!-- 自定义标题栏 -->
    <div class="chat-header">
      <div class="chat-title">
        <span class="session-name">
          {{ contactData.nick_name || "未知会话" }}
          <span class="organization-name" v-if="getOrganizationName()">
            {{ getOrganizationName() }}
          </span>
        </span>
      </div>
      <!-- <div class="chat-actions">
        <el-button
          type="text"
          icon="el-icon-close"
          @click="handleClose"
          class="close-button"
        ></el-button>
      </div> -->
    </div>
    <div class="chat-container">
      <!-- 消息显示区域 (70%) -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-item"
          :class="{
            'user-message': message.type === 'user',
            'system-message': message.type === 'system',
          }"
        >
          <div class="message-content">
            <div
              class="message-text"
              v-html="formatMessageContent(message.content)"
            ></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>

          <!-- 系统响应 - 暂时不显示到聊天区域 -->
          <!-- <div v-if="message.response" class="system-response">
            <div class="response-text">{{ message.response }}</div>
            <div class="response-status">
              <el-tag :type="getStatusType(message.status)" size="mini">
                {{ getStatusText(message.status) }}
              </el-tag>
            </div>
          </div> -->
        </div>

        <!-- 空状态提示 -->
        <div v-if="messages.length === 0" class="empty-messages">
          暂无消息记录
        </div>
      </div>

      <!-- 输入区域 (30%) -->
      <div class="chat-input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入订单信息..."
          @keydown.enter.native="handleEnterKey"
          :disabled="sending"
          class="message-input"
        ></el-input>
        <div class="input-actions">
          <el-button
            type="primary"
            @click="sendMessage"
            :loading="sending"
            :disabled="!inputMessage.trim()"
            class="send-button"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { createFcgMessage } from "@/api/fcgame/fcg_message";
import { formatTimeToStr } from "@/utils/date";

export default {
  name: "ChatDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    contactData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      inputMessage: "",
      sending: false,
      messages: [],
    };
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
      // 当对话框打开时，清空聊天区域内容
      if (newVal) {
        this.messages = [];
      }
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
  },
  methods: {
    // 格式化消息内容，处理换行符
    formatMessageContent(content) {
      if (!content) return "";
      // 将换行符转换为HTML的<br>标签
      return content.replace(/\n/g, "<br>");
    },

    // 获取组织名称
    getOrganizationName() {
      if (!this.contactData.tenant_id) return "";

      // 从vuex获取组织信息
      const tenants = this.$store.getters["gameInfo/tenants"];
      if (!tenants || tenants.length === 0) return "";

      const tenant = tenants.find((t) => t.ID === this.contactData.tenant_id);
      return tenant ? tenant.platform_name : "";
    },

    // 发送消息
    async sendMessage() {
      if (!this.inputMessage.trim()) {
        this.$message.warning("请输入消息内容");
        return;
      }

      // 添加用户消息到聊天记录
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: this.inputMessage,
        timestamp: new Date(),
      };

      this.messages.push(userMessage);

      // 保存输入内容并清空输入框
      const messageContent = this.inputMessage;
      this.inputMessage = "";

      // 滚动到底部
      this.scrollToBottom();

      // 调用createFcgMessage接口（不显示loading）
      const messageData = {
        user_name: this.contactData.user_name || "",
        nick_name: this.contactData.nick_name || "",
        session_id: this.contactData.ID,
        session_name: this.contactData.nick_name || "",
        message_content: messageContent,
        tenant_id: this.contactData.tenant_id,
      };

      try {
        const res = await createFcgMessage(messageData);

        if (res.code === 0) {
          // 暂时不显示服务器返回的内容到聊天区域
          // const systemMessage = {
          //   id: Date.now() + 1,
          //   type: "system",
          //   content: messageContent,
          //   response: res.data.refcg_message?.llm_resp || "处理完成",
          //   status: res.data.refcg_message?.recognition_status || 2,
          //   timestamp: new Date(),
          // };
          // this.messages.push(systemMessage);
          // this.$message.success("消息发送成功");
        } else {
          this.$message.error(res.msg || "消息发送失败");
        }
      } catch (error) {
        console.error("发送消息失败:", error);
        this.$message.error("消息发送失败，请重试");

        // 暂时不显示错误消息到聊天区域
        // const errorMessage = {
        //   id: Date.now() + 1,
        //   type: "system",
        //   content: messageContent,
        //   response: "发送失败，请重试",
        //   status: 3, // 识别失败
        //   timestamp: new Date(),
        // };

        // this.messages.push(errorMessage);
      }
    },

    // 处理回车键发送
    handleEnterKey(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },

    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return "";
      return formatTimeToStr(timestamp, "hh:mm:ss");
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        0: "info", // 未识别
        1: "warning", // 识别中
        2: "success", // 识别完成
        3: "danger", // 识别失败
      };
      return statusMap[status] || "info";
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: "未识别",
        1: "识别中",
        2: "识别完成",
        3: "识别失败",
      };
      return statusMap[status] || "未知状态";
    },

    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
      this.inputMessage = "";
      this.sending = false;
    },
  },
};
</script>

<style scoped>
.chat-dialog >>> .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0;
  position: absolute;
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  max-height: 85vh;
  height: 750px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.chat-dialog >>> .el-dialog__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 自定义标题栏 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 8px 8px 0 0;
}

.chat-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.session-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.organization-name {
  font-size: 12px;
  color: #909399;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: normal;
}

.chat-actions {
  display: flex;
  align-items: center;
}

.close-button {
  color: #909399;
  font-size: 18px;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-button:hover {
  color: #303133;
  background-color: #f0f0f0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 消息显示区域 (70%) */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e4e7ed;
  min-height: 0;
}

.message-item {
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message .message-content {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.system-message .message-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.message-text {
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.4;
}

.user-message .message-text {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.system-message .message-text {
  background-color: #ffffff;
  color: #303133;
  border: 1px solid #e4e7ed;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 6px;
  text-align: right;
  padding: 0 8px;
}

.empty-messages {
  text-align: center;
  color: #909399;
  padding: 80px 0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-messages::before {
  content: "💬";
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

/* 输入区域 (30%) */
.chat-input-area {
  flex-shrink: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  max-height: 200px;
}

.message-input {
  flex: 1;
  margin-bottom: 12px;
}

.message-input >>> .el-textarea__inner {
  resize: vertical;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  padding: 12px 15px;
  font-size: 14px;
  line-height: 1.4;
  transition: border-color 0.2s;
  min-height: 80px;
  max-height: 200px;
}

.message-input >>> .el-textarea__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.send-button {
  min-width: 90px;
  height: 40px;
  border-radius: 20px;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
  transition: all 0.3s;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.send-button:active {
  transform: translateY(0);
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
