<template>
  <div class="over-wrapper">
    <div class="dialog-wrapper">
      <img
        src="@/assets/images/activity/over_back.png"
        alt=""
      >
      <div class="over-text"><img
          src="@/assets/images/activity/late_text.png"
          alt=""
        ></div>
      <div class="tip-text">本站利是封已派发完了，请到其他站点领取</div>
      <div
        class="ok-btn"
        @click="()=>{this.$emit('comfirm')}"
      ><img
          src="@/assets/images/activity/yes.png"
          alt=""
        ></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

img
  width: 100%
  height: 100%

.over-wrapper
  wrapper()
  background: linear-gradient(0deg, #720C3F, #7A0D40)

  .dialog-wrapper
    width: 5.88rem
    height: 6.92rem
    margin: 0.7rem auto 0.28rem

    .over-text
      width: 4rem
      height: 0.6rem
      margin: -4.3rem auto 0

    .tip-text
      margin: 1.2rem 1.2rem 0
      color: #ffd8d6
      line-height: 1.5
      font-size: 0.28rem
      text-align: center

    .ok-btn
      width: 3.84rem
      height: 1rem
      margin: 0.4rem auto
</style>
