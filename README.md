# iwen-image-upload

## 基于vue、element、vue-cropper、axios的上传单张图片组件

### 依赖项
vue 、element ui 、vue-cropper

### 安装
```bash
$ npm i iwen-image-upload --save-dev
```
### 使用
需全局注入element ui 、vue-cropper
```javascript
// src/main.js

import Vue from "vue";
import App from "./App.vue";
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import vueCropper from "vue-cropper";
Vue.use(vueCropper)
Vue.use(ElementUI);
```
```
//demo.vue

<template>
  <div id="app">
    <iwen-image-upload class="image-upload" :action="action" isCropper v-model="imgUrl" />
  </div>
</template>

<script>
import iwenImageUpload from "iwen-image-upload";

export default {
  name: "app",
  components: {
    iwenImageUpload
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
```

### 属性(Props)
| 参数           | 说明          | 类型  |  可选值  |   默认值
| ------------- |:-------------:| -----:|-----:|-----:|
| value / v-mode| 绑定值         |string |—|—|
| allowDelete   | 是否允许删除图片|boolean |—|false|
| imgWidth | 上传组件和图片展示的宽度|string|--|100px|
| imgHeight | 上传组件和图片展示的高度|string|--|100px|
| tip | 组件下方的灰色字提示|string|--|--|
| name | 原生上传 input[file] name值|string|--|--|
| uploadKey | 上传的formData对应的key值|string|--|file|
| round | 是否展示圆形图片|boolean|--|false|
| autoCropHeight | 裁剪高度|string|--|100px|
| autoCropWidth | 裁剪宽度|string|--|100px|
| maxSize | 上传图片限制的大小，以M为单位|number|--|8|
| isCropper | 是否裁剪|boolean|--|false|
| action | 上传的url|string|--|--|
| resUrlKey | 返回的res.data下面url的key|string|--|url|

### 事件(Events)
| 事件名称           | 说明          | 回调参数
| ------------- |:-------------:| ------------:
|   upload-success   |上传成功|res.data和name|
|   cropper-success  |裁剪成功|Blob值|
|   on-remove  |删除成功|name值|
|   upload-failure  |上传失败|name值|

### 方法
| 方法名           | 说明          | 参数
| ------------- |:-------------:| ------------:
|clearValue| 清楚input 的值| -- |

