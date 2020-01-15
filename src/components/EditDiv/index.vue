<template>
  <div>
    <div class="edit-div">
      <textarea
        name
        id="edit-div"
        cols="30"
        rows="5"
        v-bind="$attrs"
        :placeholder="placeholder"
        @focus="isLocked = true"
        @blur="isLocked = false"
        @input="changeText"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        wrap="hard"
        v-model="innerText"
        style="resize: none;"
      ></textarea>
      <span v-if="isWordLimitVisible" class="input-count">{{ textLength }}/{{ upperLimit }}</span>
      <emotion  class="emotion" @selectEmotionFn="handleSelectEmotion" />
    </div>
  </div>
</template>

<script>
import emotion from "./emotion";
export default {
  name: "editDiv",
  components: { emotion },
  props: {
    value: {
      type: String,
      default: ""
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false,
      isComposing: false,
      pos: ""
    };
  },
  computed: {
    isWordLimitVisible() {
      return this.showWordLimit && this.$attrs.maxlength;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === "number") {
        return String(this.value).length;
      }
      return (this.value || "").length;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    }
  },
  watch: {
    value(newVal) {
      if (!this.isLocked || !this.innerText) {
        // && !this.innerText
        this.innerText = this.value;
      }
    }
  },
  created() {},
  methods: {
    handleSelectEmotion(data) {
      let str = data.value + this.value;
      if (str.length < 1000) {
        this.insertContent(data.value);
      }
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionEnd(event) {
      if (this.isComposing) {
        this.isComposing = false;
        this.changeText();
      }
    },
    replaceBrTag(strContent) {
      strContent = strContent.replace(/\r\n/g, "<br/>");
      strContent = strContent.replace(/\n/g, "<br/>");
      return strContent;
    },
    changeText() {
      this.innerText = document.getElementById("edit-div").value;
      this.$emit("input", this.innerText);
      return this.innerText;
    },
    // 获取光标位置
    getCursortPosition() {
      let textDom = document.getElementById("edit-div");
      var cursorPos = 0;
      if (document.selection) {
        // IE Support
        textDom.focus();
        var selectRange = document.selection.createRange();
        selectRange.moveStart("character", -textDom.value.length);
        cursorPos = selectRange.text.length;
      } else if (textDom.selectionStart || textDom.selectionStart == "0") {
        // Firefox support
        cursorPos = textDom.selectionStart;
      }
      return cursorPos;
    },
    //设置光标位置
    setCaretPosition(pos) {
      let textDom = document.getElementById("edit-div");
      if (textDom.setSelectionRange) {
        // IE Support
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
      } else if (textDom.createTextRange) {
        // Firefox support
        var range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    },
    //插入文本
    insertContent(value) {
      let textDom = document.getElementById("edit-div");
      var selectRange;
      // this.setCaretPosition(this.pos);
      if (document.selection) {
        // IE Support
        this.setCaretPosition(this.pos);
        // textDom.focus();
        selectRange = document.selection.createRange();
        selectRange.text = value;
        // textDom.focus();
        this.setCaretPosition(this.pos);
      } else if (textDom.selectionStart || textDom.selectionStart == "0") {
        // Firefox support
        var startPos = textDom.selectionStart;
        var endPos = textDom.selectionEnd;
        var scrollTop = textDom.scrollTop;
        textDom.value =
          textDom.value.substring(0, startPos) +
          value +
          textDom.value.substring(endPos, textDom.value.length);
        this.setCaretPosition(this.pos);
        // textDom.focus();
        textDom.selectionStart = startPos + value.length;
        textDom.selectionEnd = startPos + value.length;
        textDom.scrollTop = scrollTop;
      } else {
        this.setCaretPosition(this.pos);
        // textDom.focus();
        textDom.value += value;
      }
      this.changeText();

      this.getCursortPosition();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.edit-div {
  box-sizing: border-box;
  height: 100%;
  text-align: left;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 5px 10px 25px 10px;
  position: relative;
  textarea {
    width: 100%;
    word-break: break-all;
    user-select: text;
    border: none;
    outline: none;
    white-space: pre-wrap;
  }
  &[contenteditable="true"] {
    user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
  .input-count {
    color: #909399;
    background: #fff;
    position: absolute;
    font-size: 12px;
    bottom: 5px;
    right: 10px;
  }
  .emotion {
    position: absolute;
    bottom: 5px;
    left: 7px;
  }
}
</style>
