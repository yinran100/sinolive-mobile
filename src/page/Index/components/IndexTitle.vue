<template>
  <div class="title-wrapper ellipsis">
    <div class="point">
      <span class="iconfont icon-dian dianOne"></span>
      <span class="iconfont icon-dian dianTwo"></span>
    </div>
    <div class="title ellipsis">{{title}}</div>
    <router-link
      class="more"
      tag="div"
      :to="toLink"
      v-show="toLink"
    >更多</router-link>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    toLink: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.title-wrapper
  display: flex
  position: relative
  padding: 0.3rem 0 0.2rem
  line-height: 1.2

  .title
    font-size: 0.34rem
    color: #000
    flex: 1

  .point
    color: rgba(98, 101, 244, 1)

  .dianTwo, .dianOne
    font-size: 0.34rem
    float: left

  .dianTwo
    margin-left: -0.38rem
    margin-right: 0.1rem
    color: rgba(0, 183, 238, 0.6)

  .more
    float: right
    margin-right: 0.1rem
    font-size: 0.28rem
    color: $themeTextColor
</style>
