<template>
  <div class="emotion-wrapper">
    <div class="btn_bq" @click="panelShow = true">
      <img src="./images/bq.png" alt />
    </div>
    <div v-show="panelShow" class="bq_box" id="myPanel">
      <div class="bg" @click="panelShow = false"></div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          :lazy="true"
          v-for="(item,index) in emotionsCategory"
          :key="index"
          :label="item"
          :name="item"
        >
          <ul class="clearfix" :key="index">
            <li v-for="(item,index) in emotions" :key="index" @click="selectEmotion(index)">
              <img :src="item.icon" :alt="item.value" :title="item.value" />
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <a href="javascript:void(0);" @click="panelShow = false" class="close">关闭</a>
    </div>
  </div>
</template>

<script>
import commonService from "@/services/commonService";
export default {
  name: "emotion",
  data() {
    return {
      activeName: "默认",
      panelShow: false,
      emotions: [],
      allEmotions: [],
      emotionsCategory: []
    };
  },
  components: {},
  computed: {
    uid() {
      return this.$store.state.userInfo.opendUid;
    }
  },
  watch: {
    activeName(val) {
      console.log(val);
      this.emotions = this.allEmotions.filter(item => item.category == val);
    }
  },
  mounted() {
    commonService.getEmotions().then(res => {
      if (res.status == 200) {
        let data = res.data.filter(item => item.icon.includes("http://"));
        let arry = this.emotionsCategory;
        data.forEach(item => {
          item.category = item.category || "默认";
          if (
            !arry.includes(item.category) &&
            item.category.indexOf("测试") == -1
          ) {
            arry.push(item.category);
          }
        });
        this.emotions = data.filter(item => item.category == "默认");
        this.allEmotions = data;
        this.emotionsCategory = arry;
      }
    });
  },
  methods: {
    selectEmotion(index) {
      this.emotions[index].type = this.type;
      this.$emit("selectEmotionFn", this.emotions[index]);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.emotion-wrapper {
  text-align: left;
  margin-top: 5px;
}
.btn_bq {
  cursor: pointer;
  padding: 4px;
  &:hover {
    background-color: #ebf0f8;
  }
}
.btn_addlink {
  color: rgb(82, 99, 212);
  display: inline;
  text-decoration: underline;
}
.bq_box {
  position: absolute;
  left: auto;
  top: auto;
  width: 373px;
  padding: 26px 16px 15px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  z-index: 99;
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
  /deep/ .el-tabs__item {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
  }
  /deep/ .el-tabs__nav-next {
    line-height: 25px;
  }
  /deep/ .el-tabs__nav-prev {
    line-height: 25px;
  }
}
.bq_box ul {
  position: relative;
  z-index: 3;
  padding: 1px 0 0 1px;
  height: 190px;
  overflow: auto;
}
.bq_box li {
  cursor: pointer;
  float: left;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  margin: -1px 0 0 -1px;
  padding: 4px 2px;
  text-align: center;
}
.bq_box li img {
  width: 22px;
  height: 22px;
}
.bq_box .close {
  display: block;
  position: absolute;
  z-index: 3;
  color: rgb(82, 99, 212);
  right: 10px;
  top: 5px;
  cursor: pointer;
}
.shortLink-wrapper {
  padding: 0 20px;
}
</style>
