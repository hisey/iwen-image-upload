<template>
  <div class="video-upload-wrp">
    <div class="video-upload-box">
      <div v-if="fileId==''">
        <input type="file" @change="selectFile" accept="video/mp4, video/quicktime, video/avi"/>
        <el-button icon="el-icon-upload ">上传</el-button>
      </div>
      <div class="clearfix" v-else>
        <img class="f-l mr10" src="../../assets/images/icons/upload_video_successfully.png" alt/>
        <p class="f-l" @click="handlePreview()">{{fileName}}</p>
        <i v-if="!loading" @click="fileId=''" class="el-icon-circle-close ml10 close-icon"></i>
        <i v-if="loading" class="el-icon-loading"></i>
      </div>
    </div>
    <el-progress v-show="loading" :percentage="percentage"></el-progress>
    <p class="tip" v-show="!loading">请上传250M以内的MP4/MOV/AVI等格式文件</p>
    <p class="error" v-show="loading">正在上传视频中，请勿进行其他操作，否则将上传失败</p>
    <el-dialog append-to-body :title="fileName" :visible.sync="diglog.visible" center>
      <video style="width:100%" :src="diglog.url" controls="controls" autoplay>暂时不支持avi格式视频</video>
    </el-dialog>
  </div>
</template>
<script>
  import applicationService from "@/services/applicationService";
  import SparkMD5 from "spark-md5";

  export default {
    props: {
      videoId: {
        type: [String, Number],
        default: ""
      },
      // duration: {
      //   type: [String, Number],
      //   default: 0
      // },
      fileName: {
        type: [String],
        default: ""
      },
      fileId: {
        type: [String, Number],
        default: ""
      },
      url: {
        type: [String],
        default: ""
      },
      maxSize: {
        type: [String, Number],
        default: 250
      }
    },
    data() {
      return {
        percentage: 0,
        loading: false,
        diglog: {
          visible: false,
          type: "",
          url: ""
        }
      };
    },
    computed: {
      comtyId() {
        return this.$store.state.comtyInfo.id;
      }
    },
    methods: {
      selectFile(event) {
        this.loading = true;
        this.$emit("beforeUpload");
        // console.log(event.target.files[0]);
        // console.log(URL.createObjectURL(event.target.files[0]));
        // 调用上传方法，传入选择的文件对象
        this.uploadFile(event.target.files[0], () => {
          // upload-success
          console.log("seee");
          this.$emit("uploadSuccess");
          this.loading = false;
          this.percentage = 0;
        });
        // 重置file input控件的值
        event.target.value = "";
      },
      getVideoDuration() {
        var video = document.createElement("video");
        video.preload = "metadata";
        let This = this;
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          let duration = video.duration;
          This.$emit("update:duration", duration);
          // console.log("----->duration",this.duration);
        };
        video.src = this.diglog.url;
      },
      uploadFile(file, backtopage) {
        let type = file.type;
        this.diglog.url = URL.createObjectURL(file);
        this.diglog.type = type;
        const isVideo = "video/mp4,video/quicktime,video/avi".indexOf(type) > -1;
        const isLtMaxSize = file.size / 1024 / 1024 < this.maxSize;
        // console.log(isVideo);
        if (!isVideo) {
          this.$message.warning("请上传 MP4/MOV/AVI 格式的视频!");
          this.loading = false;
          this.$emit("uploadErrow");
          return false;
        }
        if (!isLtMaxSize) {
          this.$message.warning(`上传视频大小不能超过 ${this.maxSize}MB!`);
          this.loading = false;
          this.$emit("uploadErrow");
          return false;
        }
        //获取视频文件的时长
        // this.getVideoDuration();
        // 得到md5码
        this.getFileMD5(file, async md5 => {
          let param = {
            id: this.videoId,
            file_md5: md5,
            video_source: "biz",
            comtyId: this.comtyId
          };
          let res = await applicationService.videoUploadInit(param);
          if (res.status && res.status == 200) {
            res = res.data;
            let [fileName, fileId] = [file.name, res.file_id];
            this.$emit("initSuccess", {
              fileName,
              fileId,
              videoId: res.id
            });
            this.uploadChunk(
              file,
              0,
              backtopage,
              fileId,
              this.videoId == "" ? res.id : this.videoId
            );
          } else {
            return alert(res.msg);
          }
        });
      },
      uploadChunk(file, currentChunk, backtopage, fileId, videoId) {
        var fileReader = new FileReader(),
          // 上传文件块的大小，可自定义
          chunkSize = 2097152,
          // 计算改文件的可分为多少块
          chunks = Math.ceil(file.size / chunkSize),
          that = this;

        // 文件切割后的回调，this.result为切割的文件块
        fileReader.onload = function (e) {

          let spark = new SparkMD5();
          // 用FormData传输文件对象
          let fd = new FormData();
          // 设置文件上传接口的需要的参数
          fd.append("comtyId", that.comtyId);
          fd.append("id", videoId);
          fd.append("file_id", fileId);
          fd.append("slice_cnt", chunks);
          fd.append("slice_no", currentChunk + 1);
          // 设置上传的当前的文件块
          fd.append("slice_bin", new Blob([this.result]));
          spark.appendBinary(this.result);
          fd.append("slice_md5", spark.end());

          let xhr = new XMLHttpRequest();
          xhr.timeout = 50000;
          xhr.open("post", "/api/video/upload", true);
          xhr.onreadystatechange = function () {
            // 上传成功

            if (xhr) {
              if (xhr.readyState == 4) {

                if (xhr.status && xhr.status == 200) {
                  let res = JSON.parse(xhr.response);
                  //
                  // if(chunks>6){
                  //   if(currentChunk==3){
                  //     res.status = 400;
                  //   }
                  // }
                  if (res.status == 200) {


                    currentChunk++;


                    if (currentChunk < chunks) {

                      loadNext(); // 继续切割下一块文件
                    } else {
                      // 文件上传成功
                      backtopage && backtopage();
                    }
                    xhr = null;
                    return;
                  } else {
                    // 文件上传出错
                    that.$message.error("上传出错，请重新上传！");
                    that.loading = false;
                    that.percentage=0;
                    that.$emit("uploadErrow");
                  }

                } else {
                  // 文件上传出错
                  that.$message.error("上传出错，请重新上传！");
                  that.loading = false;
                  that.percentage=0;
                  that.$emit("uploadErrow");
                }
              }


            }


          };
          // 文件上传进度条
          xhr.upload.onprogress = function (e) {
            that.percentage = parseInt(
              ((e.loaded + currentChunk * chunkSize) / file.size) * 100
            );
          };
          xhr.onerror = xhr.upload.onerror = function () {
            // 文件上传出错
            that.$message.error("上传出错");
            that.loading = false;
            that.$emit("uploadErrow");
          };
          xhr.ontimeout = function (e) {
            that.$message.error("请求超时，服务器出错");
            that.loading = false;
          };
          //开始发送
          xhr.send(fd);
          fd = null;
        };

        //处理单片文件的上传
        function loadNext() {
          var start = currentChunk * chunkSize,
            end = Math.min(start + chunkSize, file.size);
          // 切割文件并触发fileReader.onload
          fileReader.readAsArrayBuffer(file.slice(start, end));
        }

        loadNext();
      },
      getFileMD5(file, callback) {
        //声明必要的变量
        var fileReader = new FileReader(),
          //文件每块分割2M，计算分割详情
          chunkSize = 2097152,
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          //创建md5对象（基于SparkMD5）
          spark = new SparkMD5();

        //每块文件读取完毕之后的处理
        fileReader.onload = function (e) {
          //每块交由sparkMD5进行计算
          spark.appendBinary(e.target.result);
          currentChunk++;

          //如果文件处理完成计算MD5，如果还有分片继续处理
          if (currentChunk < chunks) {
            loadNext();
          } else {
            callback(spark.end());
          }
        };

        //处理单片文件的上传
        function loadNext() {
          var start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;

          fileReader.readAsBinaryString(file.slice(start, end));
        }

        loadNext();
      },
      handlePreview() {
        if (this.url != "") {
          this.diglog.url = this.url;
          this.diglog.visible = true;
          return false;
        }
        if (this.diglog.type != "video/mp4") {
          this.$message({
            message: "该格式的视频文件暂时不支持打开预览",
            type: "warning"
          });
        } else {
          this.diglog.visible = true;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .video-upload-wrp {
    .video-upload-box {
      cursor: pointer;
      position: relative;

      input {
        display: block;
        height: 32px;
        position: absolute;
        top: 0;
        left: -75px;
        width: 150px;
        opacity: 0;
        cursor: pointer;
      }

      .close-icon {
        font-size: 18px;
      }
    }

    .tip {
      margin-top: 5px;
      color: #999;
    }
  }
</style>

