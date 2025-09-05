<template>
  <div>
    <!-- <h1 class="headline">Vue.js Chat Box</h1> -->

    <main>
      <section ref="chatArea" class="chat-area">
        <p
          v-for="(message, index) in messages"
          class="message"
          :class="{
            'message-out': !message.reply,
            'message-in': message.reply,
          }"
          :key="index"
        >
          {{ message.body }}
        </p>
      </section>

      <div style="max-width: 728px; margin: 0 auto; margin-top: -27px">
        <mavon-editor
          v-model="content"
          :toolbars="toolbars"
          :toolbarsFlag="true"
          :subfield="false"
          :placeholder="placeholder"
          :shortCut="false"
          :autofocus="true"
          @change="change"
          @keyup.enter.native="enterSubmit"
          style="box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)"
        ></mavon-editor>
      </div>

      <section class="chat-inputs" style="padding-bottom: 25px">
        <!-- <form @submit.prevent="sendMessage('in')" id="person1-form">
          <label for="person1-input">Bob</label>
          <input
            v-model="bobMessage"
            id="person1-input"
            type="text"
            placeholder="Type your message"
          />
          <button type="submit">Send</button>
        </form> -->

        <el-button
          @click="clearAllMessages"
          style="
            float: right;
            margin-right: 0;
            position: absolute;
            right: 10%;
            z-index: 999;
            bottom: 50%;
            margin-top: 5px;
            width: 100px;
          "
          >清除</el-button
        >

        <el-button
          @click="sendMessage"
          style="
            float: right;
            margin-right: 0;
            position: absolute;
            right: 29%;
            margin-top: 5px;
            z-index: 999;
            bottom: 7%;
            width: 100px;
          "
          >发送</el-button
        >

        <!-- <form @submit.prevent="sendMessage('out')" id="person2-form">
          <label for="person2-input">You</label>
          <input
            v-model="youMessage"
            id="person2-input"
            type="text"
            placeholder="Type your message"
          />
          <button type="submit">Send</button>
        </form> -->
      </section>
    </main>
  </div>
</template>


<script>
import Vue from "vue";

import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  components: {
    mavonEditor,
  },
  data() {
    return {
      isFirstLoad: true, // 添加一个标志，默认为第一次加载
      socketClient: null,
      placeholder: "",
      length: 0,
      content: "",

      bobMessage: "",
      youMessage: "",
      msgId: 0,
      messages: [
        // {
        //   id: 1,
        //   body: "Welcome to the chat, I'm Bob!",
        //   author: "bob",
        //   reply: true, //true 为系统恢复， false 为客户消息
        // },
        // {
        //   id: 2,
        //   body: "Thank you Bob",
        //   author: "you",
        //   reply: false,
        // },
      ],

      toolbars: {
        bold: false, // 粗体
        italic: false, // 斜体
        header: false, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: false, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: false, // 上一步
        redo: false, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: false, // 预览
      },
    };
  },
  methods: {
    sendMessage() {
      this.msgId = this.msgId + 1;

      this.messages.push({
        id: this.msgId,
        body: this.content,
        author: "",
        reply: false,
      });

      const dataToSend = {
        id: this.msgId,
        path: "/zuan",
        ver: "1.0.0",
        data: this.content,
      };
      // 将JSON对象转换为字符串
      const jsonString = JSON.stringify(dataToSend);

      // 发送JSON字符串到服务器
      this.socketClient.send(jsonString);

      Vue.nextTick(() => {
        let messageDisplay = this.$refs.chatArea;
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
      });

      this.content = "";
    },
    sendReplyMessage() {
      this.messages.push({
        id: 1,
        body: "this is reply message",
        author: "",
        reply: true,
      });
    },
    clearAllMessages() {
      this.messages = [];
    },
    initSocket() {
      // 定义WebSocket服务器的URL https
      //const url = "wss://your-websocket-server.com/path";

      const self = this;
      const url = "ws://127.0.0.1:888/websocket";

      // 创建WebSocket对象
      this.socketClient = new WebSocket(url);

      // 设置WebSocket的各种事件处理器
      this.socketClient.onopen = function (event) {
        console.log("WebSocket连接已打开", event);
        // 在这里可以发送初始消息或执行其他初始化操作
      };

      this.socketClient.onmessage = function (event) {
        //console.log("接收到消息:", event.data);
        let jsonObject = JSON.parse(event.data);
        self.messages.push({
          id: 0,
          body: jsonObject.msg,
          author: "",
          reply: true,
        });
      };

      this.socketClient.onerror = function (error) {
        console.error("WebSocket错误:", error);
      };

      this.socketClient.onclose = function (event) {
        console.log("WebSocket连接已关闭", event);
        // 这里可以添加重新连接的逻辑，如果需要的话
      };
    },
    change() {},
    enterSubmit() {
      this.sendMessage();
    },
  },
  activated() {
    if (this.isFirstLoad) {
      this.initSocket();
      this.isFirstLoad = false;
    }
  },
  deactivated() {
    if (this.socketClient) {
      this.socketClient.close(); // 断开WebSocket连接
      this.socketClient = null; // 清除引用，防止内存泄漏
      this.isFirstLoad = true;
    }
  },
};
</script>



<style scoped>
.headline {
  text-align: center;
  font-weight: 100;
  color: white;
}
.chat-area {
  /*   border: 1px solid #ccc; */
  /* background: white; */
  height: 65vh;
  padding: 1em;
  overflow: auto;
  max-width: 700px;
  margin: 0 auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.message {
  width: 45%;
  border-radius: 10px;
  padding: 0.5em;
  margin-bottom: 0.5em;
  font-size: 1em;
  white-space: normal; /* 保持文本的自然换行 */
  overflow-wrap: break-word; /* 当长单词遇到边界时折行 */
}
.message-out {
  background: #407fff;
  color: white;
  margin-left: 53%;
}
.message-in {
  background: #f1f0f0;
  color: black;
}
.chat-inputs {
  display: flex;
  justify-content: space-between;
}
#person1-input {
  padding: 0.5em;
}
#person2-input {
  padding: 0.5em;
}

.v-note-wrapper {
  position: relative;
  min-width: 720px;
  min-height: 100px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: #fff;
  z-index: 0;
  text-align: left;
  border: 1px solid #f2f6fc;
  border-radius: 4px;
  margin-top: -27px;
}
</style>