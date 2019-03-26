<template>
  <div class="success-wrapper">
    <div class="info-wrapper">
      <div class="title">领取成功！</div>
      <div class="tips">报纸将邮寄到如下联系人和地址</div>
      <div class="info">姓名：{{name}}</div>
      <div class="info">手机号：{{phoneNum}}</div>
      <div class="info">地址：{{address}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: this.$route.query.name,
      phoneNum: this.$route.query.phoneNum,
      address: this.$route.query.address
    };
  },
  mounted() {}
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.success-wrapper
  wrapper()
  background-color: #EFEFEF

  .info-wrapper
    margin: 0.5rem 0.3rem 0
    padding: 0.3rem
    background-color: #fff
    border-radius: 0.1rem

    .title
      color: $themeTextColor
      text-align: center
      font-weight: bold
      margin-bottom: 0.4rem

    .tips
      font-size: 0.28rem
      text-align: center
      padding-bottom: 0.2rem
      border-bottom: 1px #eee solid
      color: #8E8E8E

    .info
      line-height: 2
      font-size: 0.3rem
</style>
