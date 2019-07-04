import imageUpload from "./src/components/Main"; // 导入组件
imageUpload.install = function(Vue) {
  Vue.component("imageUpload", imageUpload);
  if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(imageUpload);
  }
};
export default imageUpload;
