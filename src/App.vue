<template>
  <div id="app">
    <!-- <image-upload class="image-upload" :action="action" isCropper v-model="imgUrl" /> -->
  </div>
</template>

<script>
// import imageUpload from "./components/Main.vue";
import iwenImageUpload from "iwen-image-upload";

export default {
  name: "app",
  data() {
    return {
      imgUrl: [],
      action: "/api/file/uploadImg"
    };
  },
  created(){
    console.log("imageUpload");
    console.log(iwenImageUpload);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
