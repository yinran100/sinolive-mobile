<template>
  <div class="send-wrapper">
    <div
      class="goback"
      @click="$router.go(-1);"
    >
      <van-icon name="arrow-left" />
    </div>
    <div class="back-img">
      <img
        src="@/assets/images/activity/sendgift_back.png"
        alt=""
      >
    </div>

    <div class="content">
      <div
        class="code-img"
        id="qrcode"
      ></div>
      <div class="station-num">站点编号：{{stationNum}}</div>
      <div class="text-wrapper">
        <p class="activity-title">派发说明</p>
        <ol>
          <li>彩民使用微信、支付宝或者浏览器扫描此码领取礼品；</li>
          <li>扫描后必须填写信息领取礼物，登记成功后即可向彩民发放礼品；</li>
          <li>彩民购买双色球、3D、七乐彩、深圳风采
            单张彩票金额满20元（含）以上，即可向彩民展示此码派发礼品（快乐彩不参加活动）；</li>
          <li>每位彩民最多可领5份；</li>
          <li>未提交登记的彩民，不得发放利是封；</li>
          <li>每个站点库存利是封100份，送完即止；</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { Base64 } from "js-base64";
export default {
  data() {
    return {
      stationNum: this.$route.query.stationNum
    };
  },
  mounted() {
    this.getQrcod();
  },
  methods: {
    //生产站主二维码
    getQrcod() {
      let text =
        location.href.split("sendgift")[0] +
        "getlsf/" +
        Base64.encode(this.stationNum);
      let qrcode = new QRCode("qrcode", {
        width: 180,
        height: 180, // 高度
        text, // 二维码内容
        render: "canvas", // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        colorLight: "#fff",
        colorDark: "#E12860"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.code-img>>>img
  padding: 0.25rem
  background-color: #fff

.send-wrapper
  wrapper()
  background-color: #FFFFFF
  padding: 0.32rem
  display: flex
  flex-direction: column
  align-items: center

  .goback
    background-color: rgba(0, 0, 0, 0.3)
    line-height: 0.75rem
    border-radius: 50%
    width: 0.75rem
    height: 0.75rem
    color: #fff
    text-align: center
    position: absolute
    left: 0.5rem
    top: 0.5rem

    .van-icon
      margin-top: 0.2rem
      margin-right: 0.04rem

  .back-img
    width: 6.82rem
    height: 12.7rem

    img
      width: 100%
      height: 100%

  .content
    transform: translateY(-10.7rem)

    .code-img
      // transform: translateY(-10.6rem)
      display: flex
      flex-direction: column
      align-items: center
      margin-bottom: 0.1rem

    .station-num
      font-size: 0.28rem
      margin-bottom: 0.15rem
      color: #fff
      text-align: center

    .text-wrapper
      // transform: translateY(-6.1rem)
      margin: 0 0.2rem
      background-color: rgba(255, 163, 186, 0.25)
      border-radius: 0.14rem
      padding: 0.1rem 0.3rem 0.2rem
      color: #FDD38D
      word-break: break-all
      font-size: 0.28rem
      line-height: 1.8
      max-width: 5.78rem

      .activity-title
        font-size: 0.3rem
        text-align: center
        line-height: 2
        font-family: 'webfont'

      ol
        margin-left: 0.3rem
        list-style: decimal
</style>
