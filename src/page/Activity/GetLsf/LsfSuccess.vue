<template>
  <div class="success-wrapper">
    <div class="info-wrapper">
      <div class="title">领取详情</div>
      <div class="info"><span>姓名：{{name}}</span> <span>手机号：{{phoneNum}}</span> </div>
      <div class="info"><span>领取站点：{{stationNum}}</span> <span>份数：1份</span><span class="time">（已领取{{time}}份）</span> </div>
      <div
        class="paper-msg"
        v-show="hasPaper"
      >
        <p class="msg">{{remark}}</p>
        <van-button
          size="small"
          type="primary"
          @click="()=>$router.push({path:'/activity/getpaper',query:$route.query})"
        >领取</van-button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remark: this.$route.query.remark,
      name: this.$route.query.name,
      phoneNum: this.$route.query.phoneNum,
      stationNum: this.$route.query.stationNum,
      hasPaper: this.$route.query.hasPaper,
      time: this.$route.query.time
    };
  },
  beforeDestroy() {
    this.$notify.clear();
  },
  mounted() {
    this.$notify({
      message: "您的领取信息已经登记完毕，记得向站点讨要利是封哦！",
      duration: 0,
      background: "#F88B4F"
    });
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.success-wrapper
  wrapper()
  background-color: #EFEFEF

  .info-wrapper
    margin: 1.3rem 0.3rem 0
    padding: 0.32rem 0.24rem
    background-color: #fff
    border-radius: 0.1rem

    .title
      color: #000
      font-size: 0.32rem
      font-weight: bold
      text-align: center
      margin-bottom: 0.2rem

    .info
      line-height: 2
      text-align: center
      font-size: 0.3rem

      span+span
        margin-left: 0.3rem

      .time
        margin-left: 0
        font-size: 0.26rem
        color: #8E8E8E

    .paper-msg
      text-align: center
      margin-top: 0.2rem
      padding: 0.2rem 0.2rem 0
      border-top: 1px solid #B2B2B2

      .msg
        font-size: 0.28rem
        line-height: 0.6rem
        margin-bottom: 0.1rem
        color: $themeTextColor
</style>
