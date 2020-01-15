<template>
  <div class="upload-box">
    <div class="avatar-box">
      <!-- <div
        class="add-box"
        v-if="maxCount > value.length"
        @click="handleClick"
        :style="avatarStyleObj"
      >
        <input
          type="file"
          class="input-file"
          :style="avatarStyleObj"
          :name="name"
          :ref="`inputFile${name}`"
          @change="changeImage($event)"
          :disabled="disabled"
          accept="image/*"
        />
        <i v-if="isLoading" class="el-icon-loading"></i>
        <i v-if="!isLoading" class="el-icon-plus"></i>
      </div>-->
      <ul class="clearfix">
        <li
          class="add-box f-l"
          v-if="maxCount > value.length"
          @click="handleClick"
          :style="avatarStyleObj"
        >
          <input
            type="file"
            class="input-file"
            :style="avatarStyleObj"
            :name="name"
            :ref="`inputFile${name}`"
            @change="changeImage($event)"
            :disabled="disabled"
            accept="image/*"
          />
          <i v-if="isLoading" class="el-icon-loading"></i>
          <i v-if="!isLoading" class="el-icon-plus"></i>
        </li>
        <li
          class="f-l img-box"
          v-for="(item,index) in value"
          :key="index"
          @mouseenter="hoverIndex=index"
        >
          <span class="cover-tag" v-if="index==0&&hasCover">封面</span>
          <img :src="item" :style="avatarStyleObj" alt />
          <div
            class="cover-box"
            :style="avatarStyleObj"
            @mouseleave="hoverIndex=null"
            v-if="hoverIndex==index"
          >
            <i v-if="allowDelete" class="el-icon-delete close" @click="handleRemove(index)"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="tip">
      <p v-html="tip"></p>
    </div>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="750px" :append-to-body="true">
      <div class="cropper-box">
        <vue-cropper
          ref="cropper"
          :guides="true"
          :view-mode="0"
          drag-mode="move"
          :aspectRatio="autoCropWidth/autoCropHeight"
          :auto-crop-area="0.5"
          :min-container-width="250"
          :min-container-height="180"
          :background="true"
          :rotatable="true"
          :src="cropedImg"
          alt="Source Image"
          :img-style="{ 'width': '400px', 'height': '300px' }"
        ></vue-cropper>
        <div class="clearfix icon-box">
          <i
            @click="$refs.cropper.relativeZoom(0.1)"
            class="el-icon-circle-plus-outline icon-plus icon f-l"
          ></i>
          <i
            @click="$refs.cropper.relativeZoom(-0.1)"
            class="el-icon-remove-outline icon-outline icon f-l"
          ></i>
          <i @click="$refs.cropper.rotate(-90)" class="el-icon-refresh-left icon f-l"></i>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleCropper">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import commonService from "@/services/commonService";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  name: "multiplePicUpload",
  components: {
    VueCropper
  },
  data() {
    return {
      expVisible: false,
      avatar: "",
      isLoading: false,
      cropedImg: "",
      visible: false,
      hoverIndex: null
    };
  },
  props: {
    value: Array,
    hasCover: {
      type: Boolean,
      default: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
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
    uploadKey: {
      type: String,
      default: "file"
    },
    maxCount: {
      type: Number,
      default: 1
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
    handleClick() {
      this.$refs[`inputFile${this.name}`].click();
    },
    //clear input filie value
    clearValue() {
      let $rf = this.$refs[`inputFile${this.name}`];
      if ($rf) {
        $rf.value = "";
      }
    },

    //input filie change
    changeImage: function(e) {
      let file = e.target.files[0];
      if (file) {
        const isLt8M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt8M) {
          this.$message.warning(`上传的图片大小不能超过 ${this.maxSize}MB!`);
          return false;
        }
        if (this.isCropper) {
          this.visible = true;
          if (!file.type.includes("image/")) {
            this.$message.warning("请选择图片文件");
            return;
          }
          if (typeof FileReader === "function") {
            const reader = new FileReader();
            reader.onload = event => {
              this.cropedImg = event.target.result;
              this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
          } else {
            this.handleUpload(file);
          }
        } else {
          this.handleUpload(file);
        }
      }
    },

    //handle image file upload
    handleUpload(file) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append(this.uploadKey, file);
      commonService.uploadImg(formData).then(res => {
        this.isLoading = false;
        if (res.status == 200) {
          this.$emit("input", [...this.value, res.data[this.resUrlKey]]);
          this.$emit("uploadSuccess", res[this.resUrlKey], this.name);
        }
      });
    },

    //handle cropper image
    handleCropper() {
      this.visible = false;
      let data = this.$refs.cropper
        .getCroppedCanvas()
        .toDataURL("image/jpeg", 0.7);
      let blob = this.dataURLtoBlob(data);
      this.handleUpload(blob);
    },

    //base64 to blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    // handle remove image
    handleRemove(index) {
      this.clearValue();
      let fileList = this.value;
      fileList.splice(index, 1);
      this.$emit("input", fileList);
      this.$emit("onRemove", this.name);
    }
  }
};
</script>
<style  scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
p {
  padding: 0;
  margin: 0;
}
.upload-box .add-box {
  cursor: pointer;
  position: relative;
  display: inline-block;
  background-color: #f6f8fb;
  border: 1px dashed #999;
  margin-right: 15px;
}
.upload-box .avatar-box {
  /* cursor: pointer; */
  position: relative;
  text-align: center;
  display: flex;
}
.upload-box .avatar-box ul {
  display: inline-block;
}
.upload-box .avatar-box ul .img-box {
  border: 1px dashed #fff;
  position: relative;
}
.upload-box .avatar-box ul .img-box .cover-tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 20px;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  text-align: center;
  color: #fff;
  font-size: 12px;
  display: block;
  line-height: 22px;
}
.upload-box .avatar-box ul li {
  display: inline-block;
  margin-right: 15px;
  position: relative;
  margin-top: 10px;
}
.upload-box .avatar-box .input-file {
  opacity: 0;
  position: absolute;
  cursor: pointer;
  left: 0;
  z-index: -1;
}
.upload-box .avatar-box .text {
  padding-top: 10px;
  color: lightblue;
}
.upload-box .tip {
  margin-top: 5px;
  color: #999;
  text-align: left;
  font-size: 12px;
  line-height: 16px;
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.cover-box .close {
  cursor: pointer;
  right: 5px;
  top: 5px;
  font-size: 18px;
  color: #fff;
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
}
.cropper-box .icon-box {
  margin-top: 10px;
  margin-bottom: 20px;
}
.cropper-box .icon-box .icon {
  font-size: 22px;
  color: #409eff;
  display: block;
  margin-right: 10px;
  cursor: pointer;
  width: 26px;
  float: left;
}
.pic-example-btn {
  color: #409eff;
  cursor: pointer;
}
.el-icon-upload2 {
  font-size: 30px;
}
.el-icon-upload2,
.el-icon-close {
  color: #ddd;
}
</style>
