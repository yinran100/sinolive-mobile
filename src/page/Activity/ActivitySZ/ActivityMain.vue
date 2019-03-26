<template>
  <div class="activity-wrapper">
    <router-link
      tag='div'
      class="help-btn"
      to='/activity/activityhelp'
    >操作指南<span>
        <van-icon name="arrow" /></span></router-link>
    <img
      class="back-img"
      src="@/assets/images/activity/activity-back.png"
      alt=""
    >
    <div
      class="join-btn"
      @click="scanQRCode"
    ><img
        src="@/assets/images/activity/join.png"
        alt=""
      ></div>
    <router-link
      tag='div'
      class="check-btn"
      to='/activity/stationremain'
    ><img
        src="@/assets/images/activity/checkStation.png"
        alt=""
      ></router-link>

    <div class="text-wrapper">
      <p class="activity-title">活动规则</p>
      <p class="content"> 彩民到店购买双色球、3D、七乐彩、深圳风采等彩
        票且单张彩票金额满20元（含20元）以上，即可向站点
        讨“利是封”1份，最先领取“利是封”的彩民，还有
        机会获赠2019年报纸一份（先到先得，赠完即止）。</p>
    </div>
    <div class="text-wrapper">
      <p class="activity-title">温馨提示</p>
      <ol>
        <li>彩民领取“利是封”前，必须填写姓名和手机号
          进行领奖登记，登记成功后，由站点销售人员审核
          彩票及登记信息并发放利是封；</li>
        <li>单张彩票仅有一次赠送机会；</li>
        <li>每人最多可领5份利是封；</li>
        <li>快乐彩不参加本次活动；</li>
        <li>利是封数量有限，送完即止。</li>
      </ol>
    </div>
    <van-popup
      v-model="disable"
      :close-on-click-overlay='false'
    >
      <div class="dialog">
        <div class="icon-img"><img
            src="@/assets/images/activity/pig.png"
            alt=""
          >
        </div>
        <div class="msg">{{msg}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
import { checkActivity } from "@/api/api";
import wxConfig from "@/assets/js/wxConfig";
export default {
  data() {
    return {
      disable: false,
      msg: ""
    };
  },
  computed: {
    ...mapState(["activityId"])
  },
  mounted() {
    this.check();
    wxConfig();
  },
  methods: {
    check() {
      checkActivity({ activityid: this.activityId }).then(
        res => {
          res = res.data;
          if (res.code != 1) {
            this.disable = true;
            this.msg = res.message;
          }
        },
        () => {
          this.$dialog.alert({
            message: "网络出错,请稍后重试"
          });
        }
      );
    },
    scanQRCode() {
      console.log("调用扫一扫");
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode", "datamatrix", "pdf417"], // 可以指定扫二维码还是一维码，默认二者都有
        success: res => {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          try {
            location.href = result;
          } catch (error) {
            this.$dialog.alert({
              title: "二维码错误",
              message: "请扫描正确的活动二维码"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.activity-wrapper
  width: 100%

  .help-btn
    font-size: 0.3rem
    text-align: right
    margin: 0.3rem 0.3rem 0 0
    color: #FDD38D

    span
      vertical-align: middle
      font-size: 0.28rem

  .back-img
    width: 100%
    position: absolute
    top: 0
    z-index: -1

  .join-btn
    width: 4rem
    height: 1rem
    margin: 6rem auto 0.28rem

    img
      width: 100%
      height: 100%

  .check-btn
    @extend .activity-wrapper .join-btn
    margin-top: 0

.text-wrapper
  margin: 0.24rem 0.22rem 0
  background-color: rgba(255, 163, 186, 0.25)
  border-radius: 0.14rem
  padding: 0.1rem 0.16rem 0.2rem
  color: #FDD38D
  word-break: break-all
  font-size: 0.28rem
  line-height: 1.8

  .activity-title
    font-size: 0.3rem
    text-align: center
    line-height: 2
    font-family: 'webfont'

  .content
    text-indent: 0.56rem

  ol
    margin-left: 0.3rem
    list-style: decimal

.van-popup
  border-radius: 0.3rem

  .dialog
    width: 5rem
    height: 5rem
    border-radius: 0.3rem
    background-color: #fff
    display: flex
    flex-direction: column
    align-items: center

    .icon-img
      margin-top: 1rem
      margin-bottom: 0.4rem
      width: 1.96rem
      height: 1.92rem

      img
        width: 100%
        height: 100%
</style>

