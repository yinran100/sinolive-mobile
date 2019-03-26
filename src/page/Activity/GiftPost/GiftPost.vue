<template>
  <div class="page-wrapper">
    <div class="ad-back">
      <van-button
        class="btn"
        round
        @click="scanQRCode"
      >扫描活动二维码</van-button>
    </div>
    <div class="tips">
      <p class="tip-title">领取说明：</p>
      <p>填写信息即可领取精美礼品一份。每个手机号限领取1次哦。</p>
      <p class="tip-title">领取流程：</p>
      <p>第一步：使用微信打开本活动页面。点击"扫描活动二维码"扫描工作人员二维码。</p>
      <p>第二步：输入个人姓名与手机号，获取验证码，提交领取信息。</p>
      <p>第三步：提交成功，向工作人员领取礼品。</p>
    </div>

    <div class="article-wrapper">
      <p class="title">活动介绍</p>
      <p class="content"> “步步行善”新年公益网络行动是由市文明办、市关爱办主办，作为每年1月拉开新春关爱行动序幕的大型文明倡导活动。行动以“新年第一天，善行每一步”为主题，采取“互联网+健康+公益”的模式，倡导市民在元旦当天走出家门、迈开步伐，用一种关爱的姿势迎接新的一年。市民线下爱的行动将通过互联网捐步平台化作线上爱心善款，由爱心企业出资定向捐赠公益项目。全城同行、为爱走起，传递城市关爱精神，打造城市文明节庆新民俗。项目荣获由中共广东省委宣传部、广东省文明办、广东省网信办颁发的“2018广东十佳网络公益项目”。
      </p>
      <p class="content">“步步行善”新年公益网络行动已连续开展3届，联动益行家、悦动圈、行善等互联网平台，联合众多爱心基金会，联动知名赛事加入“步步行善”公益矩阵，带动数千万市民参与捐步行动，累计善行里程超4071万公里，兑换公益善款5000多万元，已成为深圳一个具有高关注度的公益品牌。</p>
      <p class="content">2019年第四届“步步行善”新年公益网络行动以“致敬城市建设者”为主题，聚焦城市建设者，在改革开放40周年之际，深圳将以新年第一跑致敬城市建设者的付出。</p>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import wxConfig from "@/assets/js/wxConfig";
export default {
  data() {
    return {
      dataCode: ""
    };
  },
  mounted() {
    wxConfig();
  },
  methods: {
    scanQRCode() {
      console.log("调用扫一扫");
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode", "datamatrix", "pdf417"], // 可以指定扫二维码还是一维码，默认二者都有
        success: res => {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          try {
            this.activeId = JSON.parse(result).activeID;
            if (this.activeId) {
              this.$router.push(`/inputinfo/${this.activeId}`);
            }
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
.ad-back
  width: 100%
  height: 8.6rem
  background: url('../../../assets/images/activity/gift_ad.jpg') no-repeat center center
  background-size: 100% 100%

  .btn
    margin: 0 auto
    background-color: #528D53
    color: #fff
    border: none
    display: block
    top: 5.5rem
    padding: 0 1.2rem

.tips
  position: relative
  margin: 0.4rem 0.4rem 0
  font-size: 0.28rem
  line-height: 1.5
  color: #78807d

  .tip-title
    font-weight: bold

.article-wrapper
  margin: 0.4rem 0
  padding: 0 0.3rem

  .title
    color: #000000
    font-weight: bold
    font-size: 0.4rem
    text-align: center
    margin-bottom: 0.3rem

  .content
    text-indent: 0.48rem
    color: #58445B
    line-height: 1.8
</style>
