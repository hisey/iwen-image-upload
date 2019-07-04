<template>
  <div id="app">
    <image-upload class="image-upload" :action="action" isCropper v-model="imgUrl" />
  </div>
</template>

<script>
import imageUpload from "./components/Main.vue";
// import imageUpload from "iwen-image-upload";

export default {
  name: "app",
  components: {
    imageUpload
  },
  data() {
    return {
      imgUrl: "",
      action: "/api/file/uploadImg"
    };
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
.image-upload {
  margin: 0 auto;
  width: 200px;
}
</style>
