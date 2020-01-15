<template>
  <span :class="{ disabled: countDown && isLoading }" @click="onClick">
    <template v-if="countDown && isLoading">
      <span class="re-send-text">重新获取({{countDown}}s)</span>
    </template>

    <template v-else-if="isEnd && !initialize">重新获取</template>

    <template v-else>发送验证码</template>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      initialize: true,
      isLoading: false,
      countDown: 0
    };
  },
  computed: {
    isEnd() {
      return this.countDown <= 0;
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.toStart();
      }
    },
    time() {
      this.countDown = this.time;
    },
    isEnd(val) {
      if (val) {
        this.clearTime();
        this.$emit("callback");
        this.$emit("input", false);
      }
    }
  },
  created() {
    this.countDown = this.time;
  },
  destroyed() {
    this.clearTime();
  },
  methods: {
    onClick() {
      if (!this.value) {
        this.$emit("click");
      }
    },
    toStart() {
      if (this.isLoading) {
        return;
      }

      this.countDown = this.time;
      this.isLoading = true;
      this.initialize = false;
      this.startCount();
    },
    startCount() {
      if (this.countDown > 0) {
        this.countDown -= 1;

        setTimeout(this.startCount, 1000);
      } else {
        this.clearTime();
      }
    },
    clearTime() {
      this.isLoading = false;
      clearTimeout();
    }
  }
};
</script>
<style scoped lang="less">
.re-send-text {
  color: #cfcfcf;
}
</style>
