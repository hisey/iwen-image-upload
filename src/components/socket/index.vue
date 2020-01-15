<template>
  <div></div>
</template>
<script>
import { WS_URL } from "@/config";
import Auth from "@/auth";
export default {
  props: {
    onSuccess: Function
  },
  data() {
    return {
      socket: null,
      serverTimeoutObj: null,
      timeout: 5000,
      websocketConnectedCount: 0
    };
  },
  methods: {
    newWebSocket: function() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持websocket,推荐使用谷歌浏览器");
      } else {
        // 实例化socket
        this.socket = new WebSocket(`${WS_URL}?token=${Auth.token()}`);
        // 监听socket连接
        this.socket.onopen = this.onopen;
        // 监听socket错误信息
        this.socket.onerror = this.onerror;
        // 监听socket消息
        this.socket.onmessage = this.onmessage;
        this.socket.onclose = this.onclose;
      }
    },
    onopen: function() {
      this.heartCheckReset().heartCheckStart();
      console.log("socket--------------连接成功");
    },
    onerror: function() {
      this.websocketConnectedCount++;
      if (this.websocketConnectedCount <= 5) {
        this.newWebSocket();
      }
      console.log("连接错误");
    },
    onclose: function(e) {
      console.log("socket已经关闭");
    },
    onmessage: function(message) {
      this.heartCheckReset().heartCheckStart();
      console.log("收到消息---");
      // console.log(message.data);
      this.onSuccess(message.data);
      // this.$emit("onmessage", message.data);
    },
    disconnect: function() {
      console.log("客户端主动关闭socket");
      this.socket.close();
    },
    //心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
    heartCheckReset() {
      clearInterval(this.serverTimeoutObj);
      return this;
    },
    //心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
    heartCheckStart() {
      // let count = 0;
      this.serverTimeoutObj = setInterval(() => {
        if (this.socket.readyState === 1) {
          console.count("socket5秒心跳检测次数");
          this.socket.send("ping");
        } else {
          console.log("socket断开");
          this.socket.close();
          this.newWebSocket();
          // this.$emit("enterGroup");
        }
      }, this.timeout);
    }
  },
  //销毁页面之前，断开连接
  beforeDestroy: function() {
    //页面离开时断开连接,清除定时器
    this.disconnect();
    this.heartCheckReset();
  },
  mounted() {
    //调用初始化websocket方法
    this.$emit("enterGroup");
    this.newWebSocket();
    window.onbeforeunload = function() {
      this.disconnect();
    };
  }
};
</script>
