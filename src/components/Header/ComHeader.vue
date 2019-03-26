<template>
  <div class="mine-title">
    <div
      class="iconfont icon-left-angle"
      @click="goto"
      v-show="toLink!=''"
    ></div>
    <div class="title ellipsis">{{titleText}}</div>
    <div
      class="head-right"
      v-show="rightText!=''"
      @click="btnClick"
    >{{rightText}}</div>
  </div>
</template>
<script>
export default {
  name: "ComHeader",
  props: {
    toLink: {
      type: [String, Number],
      default: ""
    },
    titleText: {
      type: String,
      default: ""
    },
    rightText: {
      type: String,
      default: ""
    }
  },
  methods: {
    goto() {
      if (isNaN(this.toLink)) this.$router.push(this.toLink);
      else this.$router.go(this.toLink);
    },
    btnClick() {
      this.$emit("click");
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.mine-title
  position: relative
  top: 0
  left: 0
  right: 0
  height: 0.98rem
  line-height: 0.98rem
  text-align: center
  font-size: 0.38rem
  color: $headerTextColor
  background: $headerBackColor

  .icon-left-angle
    padding-left: 0.2rem
    float: left
    font-size: 0.42rem
    color: $headerTextColor

  .title
    margin: 0 1rem

  .head-right
    position: absolute
    right: 0.24rem
    top: 0
    font-size: 0.32rem
</style>
