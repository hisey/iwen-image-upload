import iwenImageUpload from "./src/components/Main"; // 导入组件
iwenImageUpload.install = function(Vue) {
  Vue.component("iwenImageUpload", iwenImageUpload);
  if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(iwenImageUpload);
  }
};
export default iwenImageUpload;
