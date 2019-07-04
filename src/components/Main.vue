<template>
  <div class="upload-box">
    <div class="avatar-box" :style="avatarStyleObj">
      <input
        type="file"
        class="input-file"
        :style="`width:${imgWidth};height:${imgHeight};`"
        :name="name"
        @mouseover="handleShowCover()"
        :ref="`avatarInput${name}`"
        @change="changeImage($event)"
        accept="image/gif, image/jpeg, image/jpg, image/png"
      />
      <img v-if="value!=''" :src="value" alt :style="avatarStyleObj" />
      <div v-else class="add-box" :style="avatarStyleObj">
        <i v-if="isLoading" class="el-icon-loading"></i>
        <i v-if="!isLoading" class="el-icon-plus"></i>
      </div>
      <div
        @mouseleave="isShowCover=false"
        class="cover-box"
        :style="avatarStyleObj"
        v-if="isShowCover"
      >
        <div @click="handleInput">
          <i class="el-icon-upload2"></i>
        </div>
        <i v-if="allowDelete" class="el-icon-close close" @click="handleRemove"></i>
      </div>
    </div>
    <div class="tip">
      <p v-html="tip"></p>
    </div>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="750px" :append-to-body="true">
      <div class="cropper-box">
        <vueCropper
          ref="cropper"
          :img="cropedImg"
          :canMoveBox="true"
          :autoCrop="true"
          :fixed="true"
          :fixedNumber="[autoCropWidth,autoCropHeight]"
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
        ></vueCropper>
        <div class="clearfix icon-box">
          <i @click="handleChangeScale(1)" class="el-icon-circle-plus-outline icon-plus icon f-l"></i>
          <i @click="handleChangeScale(-1)" class="el-icon-remove-outline icon-outline icon f-l"></i>
          <i @click="$refs.cropper.rotateLeft()" class="el-icon-refresh-left icon f-l"></i>
        </div>
      </div>
      <span slot="footer">
        <el-button @click=" visible= false">取 消</el-button>
        <el-button type="primary" @click="handleCropper">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "imageUpload",
  data() {
    return {
      expVisible: false,
      avatar: "",
      isLoading: false,
      cropedImg: "",
      visible: false,
      isShowCover: false
    };
  },
  props: {
    value: String,
    allowDelete: {
      type: Boolean,
      default: true
    },
    imgWidth: {
      type: [String, Number],
      default: "100px"
    },
    imgHeight: {
      type: [String, Number],
      default: "100px"
    },
    tip: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: [String, Number],
      default: ""
    },
    round: {
      type: Boolean,
      default: false
    },
    autoCropHeight: {
      type: [String, Number],
      default: 100
    },
    autoCropWidth: {
      type: [String, Number],
      default: 100
    },
    maxSize: {
      type: Number,
      default: 8
    },
    isCropper: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: "",
      require: true
    },
    resUrlKey: {
      type: String,
      default: "url"
    },
    uploadKey:{
      type:String,
      default:"file"
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.cropedImg = "";
      }
    },
    visible(val) {
      if (!val) {
        this.clearValue();
      }
    }
  },
  computed: {
    avatarStyleObj() {
      return {
        width: this.imgWidth,
        borderRadius: this.round ? "50%" : "0",
        height: this.imgHeight,
        lineHeight: this.imgHeight
      };
    }
  },
  methods: {
    handleInput() {
      this.$refs[`avatarInput${this.name}`].click();
    },
    handleChangeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    clearValue() {
      this.$refs[`avatarInput${this.name}`].value = "";
    },
    changeImage: function(e) {
      let file = e.target.files[0];
      if (file) {
        const isLt8M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt8M) {
          this.$message.error(`上传的图片大小不能超过 ${this.maxSize}MB!`);
          return false;
        }
        // 文件对象
        if (this.isCropper) {
          var reader = new FileReader();
          reader.onload = e => {
            let data;
            if (typeof e.target.result === "object") {
              // 把Array Buffer转化为blob 如果是base64不需要
              data = window.URL.createObjectURL(new Blob([e.target.result]));
            } else {
              data = e.target.result;
            }
            this.cropedImg = data;
          };
          this.visible = true;
          // 转化为base64
          reader.readAsDataURL(file);
        } else {
          this.handleUpload(file);
        }
      }
    },
    handleUpload(file) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append(this.uploadKey, file);
      this.postFile(formData).then(res => {
        this.isLoading = false;
        if (res.status == 200 && res.data) {
          let data = res.data;
          this.$emit("input", data[this.resUrlKey]);
          this.$emit("uploadSuccess", data, this.name);
        }
      }).catch(res => {
          console.log(res);
          this.$emit("uploadFailure",this.name);
      });
    },
    handleCropper() {
      this.visible = false;
      this.$refs.cropper.getCropBlob(async data => {
        this.handleUpload(data);
        this.$emit("cropperSuccess", window.URL.createObjectURL(data));
      });
    },
    handleRemove() {
      this.isShowCover = false;
      this.clearValue();
      this.$emit("input", "");
      this.$emit("onRemove", this.name);
    },
    handleShowCover() {
      if (this.value != "") {
        this.isShowCover = true;
      } else {
        this.isShowCover = false;
      }
    },
    postFile(data) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      return axios.post(this.action, data, config).then(res => {
        return Promise.resolve(res.data);
      });
    }
  }
};
</script>
<style  scope>
.upload-box .avatar-box {
  cursor: pointer;
  position: relative;
  text-align: center;
  border: 1px dashed #999;
  background-color: #f6f8fb;
  font-size: 20px;
  width: 100%;
}
.upload-box .avatar-box .input-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}
.upload-box .avatar-box .text {
  padding-top: 10px;
  color: lightblue;
}
.upload-box .avatar-box .tip {
  margin-top: 5px;
  color: #999;
}
.upload-box .avatar-box .add-box i {
  font-size: 25px;
}

.cover-box {
  z-index: 3;
  position: absolute;
  top: 0;
  line-height: 100%;
  background-color: rgba(51, 51, 51, 0.5);
}
.cover-box .close {
  position: absolute;
  right: 0;
  top: 0;
}
.cover-box .upload-text {
  color: #fff;
  font-size: 14px;
}
.cover-box .plus {
  width: 14px;
}
.cropper-box {
  width: 700px;
  height: 300px;
}
.cropper-box .icon-box {
  margin-top: 10px;
  margin-bottom: 20px;
}
.cropper-box .icon-box .icon {
  font-size: 22px;
  color: #409eff;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}
.pic-example-btn {
  color: #409eff;
  cursor: pointer;
}
.el-icon-upload2{
  font-size: 30px;
}
.el-icon-upload2,.el-icon-close{
  color: #ddd;
}
</style>
