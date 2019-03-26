<template>
  <div class="home-page">
    <transition :name="transitionName">
      <router-view class="home-view"></router-view>
    </transition>
    <div class="tabs-wrapper">
      <router-link
        tag="div"
        class="tab"
        to="index"
      >
        <div class="iconfont icon-shouye"></div>
        <p class="icon-item-desc">首页</p>
      </router-link>
      <router-link
        tag="div"
        class="tab"
        to="news"
      >
        <div class="iconfont icon-xwzx"></div>
        <p class="icon-item-desc">资讯</p>
      </router-link>
      <router-link
        tag="div"
        class="tab live"
        to="liveCenter"
      >
        <div class="iconfont icon-zhibo"></div>
        <p class="icon-item-desc">直播</p>
      </router-link>
      <router-link
        tag="div"
        class="tab"
        to="trainer"
      >
        <div class="iconfont icon-boshimao"></div>
        <p class="icon-item-desc">培训师</p>
      </router-link>
      <router-link
        tag="div"
        class="tab"
        to="mine"
      >
        <div class="iconfont icon-gerenzhongxin"></div>
        <p class="icon-item-desc">我的</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      transitionName: "slide-right" // 默认动态路由变化为slide-right
    };
  },
  watch: {
    $route(to, from) {
      this.transitionName =
        to.meta.index < from.meta.index ? "slide-right" : "slide-left";
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.home-page
  display: flex
  flex-direction: column
  position: absolute
  bottom: 0
  left: 0
  right: 0
  top: 0
  min-width: 3.5rem

.home-view
  flex: 1
  position: relative

.tabs-wrapper
  border-top: 1px solid #A7ACB8
  position: fixed
  height: $bottomHeight
  left: 0
  right: 0
  bottom: 0
  background-color: #fff
  z-index: 1
  display: flex
  justify-content: space-around

  .tab
    text-align: center
    color: $themeDisableColor

    .iconfont
      font-size: 0.5rem
      margin: 0.1rem 0 0.05rem

    .icon-item-desc
      font-size: 0.25rem

  // .live
  // // margin-top: -15px
  // // border-top: 1px #A7ACB8 solid
  // // border-radius: 50% / 100% 100% 0 0
  // // background-color: #fff
  // :before
  // content: ''
  // position: absolute
  // left: 0
  // top: -2px
  // width: 50%
  // height: 2px
  // background-color: red

  // .iconfont
  // font-size: 60px
  // margin: 15px 0 15px
  .router-link-active
    color: $themeActiveColor
</style>

