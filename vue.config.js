// vue.config.js
var path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  outputDir: path.resolve(__dirname, "./dist"),
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        // target: "http://192.168.255.207:53000/api",  //测试
        target: "http://192.168.1.240:53000/api", //开发
        // target: "http://10.220.202.31:53000/api",//zhaopin
        // target: "http://10.220.202.45:53000/api",//hanjinyuan
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: config => {
    config.entry.app =
      process.env.NODE_ENV === "production" ? "./index.js" : "./src/main.js";
    config.output.filename = "imageUpload.js";
    config.output.library = "imageUpload";
    config.output.libraryTarget = "umd";
    config.output.umdNamedDefine = true;
  }
};
