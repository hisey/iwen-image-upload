<template>
  <div class="multiplePicShow"> 
    <swiper :options="swiperOption" class="swiper-box">
      <swiper-slide v-for="slide in data" :key="slide.url">
        <img v-img:group class="swiper-img" :style="{width:width,height:height}" :src="slide.url" alt />
      </swiper-slide>
      <div
        v-show="data.length>imgNum"
        class="swiper-button-prev swiper-buttom-arrow-box swiper-button-white"
        slot="button-prev"
      ></div>
      <div
        v-show="data.length>imgNum"
        class="swiper-button-next swiper-buttom-arrow-box swiper-button-white"
        slot="button-next"
      ></div>
        
    </swiper>
    <div class="swiper-pagination" v-if="showPagination"></div>  
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    imgNum:{
      type: [String,Number],
      default:6,
    },
    width:{
      type: [String],
      default:"120px",
    },
    height:{
      type: [String],
      default:"75px",
    },
    showPagination:{
      type: Boolean,
      default:false,
    },
  },
  data() {
    return {
      
    };
  },
  computed:{
    swiperOption(){
      let option={
        slidesPerView: this.imgNum,
        spaceBetween: 15,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      };
      return option;
    }
  },
};
</script>
<style lang="less" scoped>
.swiper-img {
  width: 120px;
  height: 75px;
}
.swiper-buttom-arrow-box {
  background-color: #000;
  background-size: 30%;
  width: 24px;
  height: 24px;
  top: 60%;
  opacity: 0.5;
}
.swiper-button-prev {
  left: 0;
}
.swiper-button-next {
  right: 0;
}
.swiper-pagination{
  width: auto;
  left: unset;
  right: 10px;
  padding:2px 7px;
  color: #fff;
  background:rgba(0,0,0,0.2);
}
</style>

<style lang="less">
.multiplePicShow{
  .swiper-pagination{
    z-index: 2;
  }
}
</style>

