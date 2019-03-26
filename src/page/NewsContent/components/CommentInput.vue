<template>
  <div class="comment-contain" @touchstart.self="handleTouchStart" @touchmove.prevent="handleTouchMove" @touchend="handleTouchEnd">
    <div class="comment-header border-bottom">
      <div class="close iconfont icon-guanbi" @click="closeComment"></div>
    </div>
    <div class="comment-title ">
      {{title}}
    </div>
    <div class="input-wrapper">
      <textarea ref="count" placeholder="说点什么吧..." rows="4" class="input-textarea" :maxlength="maxlength" v-model="commentContent"></textarea>
    </div>
    <div class="count-tips">{{number}}/{{maxlength}}</div>
    <div class="btn-wrapper">
      <van-button type="primary" size="large" @click="commitComment">提交</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "CommentInput",
  data() {
    return {
      maxlength: 150,
      commentContent: "",
      touchStatus: false,
      startY: 0,
      timer: null
    };
  },
  props: {
    title: String
  },
  methods: {
    commitComment() {
      if (this.commentContent != "") this.$emit("commit", this.commentContent);
      this.commentContent = "";
    },
    closeComment() {
      this.touchStatus = false;
      this.$emit("closeComment");
    },
    handleTouchStart(e) {
      if (e.touches[0].target.className != "input-textarea") {
        this.touchStatus = true;
        this.startY = e.touches[0].clientY;
      }
    },
    handleTouchMove(e) {
      if (this.touchStatus) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          const touchY = e.touches[0].clientY;
          if (touchY - this.startY > 80) this.closeComment();
        }, 16);
      }
    },
    handleTouchEnd() {
      this.touchStatus = false;
    }
  },
  computed: {
    number() {
      return this.commentContent.length;
    }
  }
};
</script>
<style scoped>
.comment-contain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 3;
  background-color: #f0f0f0;
}
.border-bottom:before {
  border-bottom: 1px solid #e2e2e2;
}
.comment-header {
  height: 0.98rem;
  line-height: 0.98rem;
  background-color: #fff;
}
.close {
  font-size: 0.34rem;
  padding: 0 0.2rem;
}
.input-wrapper {
  border-top: 1px #e2e2e2 solid;
  border-bottom: 1px #e2e2e2 solid;
  align-items: center;
  display: flex;
  position: relative;
}
.input-textarea {
  border: 0;
  padding: 0.2rem 0.3rem;
  color: inherit;
  display: block;
  font-size: 0.32rem;
  line-height: inherit;
  outline: 0;
  resize: none;
  width: 100%;
}
.comment-title {
  font-size: 0.4rem;
  padding: 0.3rem;
}
.comment-content {
  padding: 0 0.2rem;
}
.count-tips {
  position: relative;
  padding-top: 0.5rem;
  padding-right: 0.2rem;
  text-align: right;
  color: #7d7d7d;
  font-size: 0.3rem;
}
.btn-wrapper {
  margin: 0.4rem 0.3rem 0;
}
</style>
