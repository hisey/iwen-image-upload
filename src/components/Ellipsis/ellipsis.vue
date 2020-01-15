<template>
  <div class="mu-wrapper">
    <div class="mulitLineText" :style="mulitLineTextStyle"  ref="dom">
      {{text}}
      <span class="close" v-if="lengthEnough&&!more" @click="more=true">...展开 <i class="el-icon-arrow-down"></i></span>
      <span class="close" v-if="lengthEnough&&more" @click="more=false" :style="{position:this.more?'relative':'absolute',bottom:this.more?'0':'-3px'}" >收起 <i class="el-icon-arrow-up"></i></span>

    </div>
    
  </div>
</template>

<script>
/**
* @desc 多行文本溢出显示省略号组件
* @props
    text  要显示在此组件中的文本
    line  要显示的行数
    subfix  要显示在文字末尾的字符 默认是 ...
    display_btn  是否显示展开更多按钮 默认是 true
* @ep
    <ellipsis
    :text="instroText"
    :line="3"
    subfix="..."
    :display_btn="true"
    ></ellipsis>
**/
export default {
  name: "ellipsis",
  props:{
    text:{
      default:"",
      type:String
    },
    line:{
      default:2,
      type:Number
    },
    width:{
      default:500,
      type:Number
    },
    display_btn:{
      default:true,
      type:Boolean
    }
  },
  data () {
    return {
      showing:false,
      more:false
    };
  },
  mounted() {
    // this.init();
  },
  computed:{
    lengthEnough(){
      if(this.strWidth>this.width*this.line){
        return true;
      }else{
        return false;
      }
    },
    mulitLineTextStyle(){
      let style={
        width:this.width+"px",
        "overflow":this.more?"unset":"hidden",
        "-webkit-line-clamp":this.more?100:this.line,
        
      };
      return style;
    },
  },
  methods: {
  
  },
  watch:{
    
    text:{
      handler:function(n,o){
        var width = 0;
        if(n){
          var html = document.createElement("span");
          html.innerText = n;
          html.className = "getTextWidth";
          html.style.cssText="white-space: nowrap;font-size:12px";
          document.querySelector("body").appendChild(html);
          width = document.querySelector(".getTextWidth").offsetWidth;
          document.querySelector(".getTextWidth").remove();
          console.log(n,width);
        }
        this.strWidth=width;
      },
      immediate: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

.mu-wrapper{
  position: relative;
  line-height: 20px;
  .mulitLineText{
    font-size: 12px;
    width: 100%;
    position: relative;
    text-overflow: fade;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  
    .close{
      background: #fff;
      position: absolute;
      white-space: nowrap;
      right: 0;
      bottom: -3px;
      color:#98A9BE;
    }
  }
  
}

</style>
