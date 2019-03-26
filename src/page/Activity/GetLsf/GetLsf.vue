<template>
  <div class="activity-wrapper">
    <div class="info-wrapper">
      <van-field
        v-model.trim="stationNum"
        v-if="showInput"
        center
        type='tel'
        placeholder="请输入领取站点号"
        @blur="()=>{stationErrorMsg = stationNum.length==0?'站点号不能为空':/^[0-9]*$/.test(stationNum)?'':'站点号只能为数字'}"
        :error-message="stationErrorMsg"
      />
      <div
        v-else
        class="info"
      >领取站点：{{queryCode}}</div>
      <div class="info">领取份数：1份</div>
      <van-field
        v-model.trim="name"
        center
        placeholder="请输入姓名"
        @blur="()=>{nameErrorMsg = name.length==0?'姓名不能为空':/^[\u4e00-\u9fa5]*$/.test(name)?'':'姓名只能输入中文'}"
        :error-message="nameErrorMsg"
      />
      <van-field
        v-model="phoneNum"
        center
        type='tel'
        placeholder="请输入手机号"
        @blur="()=>{phoneErrorMsg = /^1\d{10}$/.test(phoneNum)?'':'手机号格式有误'}"
        :error-message="phoneErrorMsg"
      />
      <van-field
        v-model="code"
        center
        placeholder="请输入短信验证码"
        @blur="()=>{codeErrorMsg = code.length==0?'验证码不能为空':''}"
        :error-message="codeErrorMsg"
        v-show="showCodeInput"
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          :disabled="waiting"
          @click="getCode(0)"
        >{{tipMsg}}</van-button>
      </van-field>
      <p
        class="tip"
        v-show="showVoiceTip"
        @click="getCode(1)"
      >收不到短信?试试语音验证码</p>
    </div>
    <div
      class="commit-btn"
      @click="commit"
    ><img
        src="@/assets/images/activity/commit.png"
        alt=""
      ></div>
    <div class="text-wrapper">
      <p class="activity-title">领取说明</p>
      <ol>
        <li>请登记姓名领取利是封；</li>
        <li>本次登记仅限领取一份利是封，每位用户最多可领5份；</li>
        <li>请保管好符合领奖条件的彩票以备站点销售员查验。</li>
      </ol>
    </div>
    <over-tip
      style="z-index:2"
      v-show="over"
      @comfirm="()=>{over=false}"
    ></over-tip>
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
import PhoneCodeInput from "@/components/PhoneCodeInput/PhoneCodeInput";
import md5 from "js-md5";
import { Base64 } from "js-base64";
import OverTip from "./OverTip";
import { checkCode, checkVoiceCode, getGift, checkActivity } from "@/api/api";
export default {
  name: "getlsf",
  components: {
    OverTip
  },
  data() {
    return {
      queryCode: Base64.decode(this.$route.params.stationCode),
      stationNum: "",
      waiting: false,
      disable: false,
      msg: "",
      code: "",
      name: "",
      phoneNum: "",
      countDown: 60,
      timeCountDown: null,
      showVoiceTip: false,
      stationErrorMsg: "",
      nameErrorMsg: "",
      phoneErrorMsg: "",
      codeErrorMsg: "",
      committing: false,
      over: false,
      showCodeInput: true
    };
  },
  computed: {
    ...mapState([
      "systemInfo",
      "stateInfo",
      "provinceId",
      "activityId",
      "phone"
    ]),

    showInput() {
      return !/^[0-9]*$/.test(this.queryCode);
    },
    tipMsg() {
      if (this.waiting) return this.countDown + "秒后重新发送";
      else return "发送验证码";
    }
  },
  watch: {
    countDown(val) {
      if (val <= 5) this.showVoiceTip = true;
    }
  },
  mounted() {
    this.check();
    if (this.phone.length != 0) this.showCodeInput = false;
  },
  beforeDestroy() {
    if (this.timeCountDown) clearInterval(this.timeCountDown);
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
    commit() {
      if (
        this.stationErrorMsg.length != 0 ||
        this.nameErrorMsg.length != 0 ||
        this.phoneErrorMsg.length != 0 ||
        this.codeErrorMsg.length != 0 ||
        this.committing
      )
        return;
      if (this.phoneNum != this.phone) this.showCodeInput = true;
      this.committing = true;
      getGift({
        activityid: this.activityId,
        mobile: this.phoneNum,
        name: this.name,
        code: this.code,
        stationnum: this.showInput ? this.stationNum : this.queryCode,
        provinceid: this.provinceId
      }).then(
        res => {
          res = res.data;
          if (res.code == 1) {
            this.$store.commit("savePhone", this.phoneNum);
            this.$router.push({
              path: "/activity/lsfsuccess",
              query: {
                phoneNum: this.phoneNum,
                name: this.name,
                stationNum: this.showInput ? this.stationNum : this.queryCode,
                time: res.data.time,
                hasPaper: res.data.isReceive,
                remark: res.data.paper.remark
              }
            });
          } else if (res.code == 111) {
            this.over = true;
            this.committing = false;
          } else {
            if (res.message) this.$toast(res.message);
            this.committing = false;
          }
        },
        () => {
          this.committing = false;
          this.$toast("网络出错,请稍后重试");
        }
      );
    },
    sendVoiceDialog() {
      this.$dialog
        .alert({
          title: "语音验证码",
          message: "我们将通过电话方式告知您验证码，请注意接听"
        })
        .then(() => {})
        .catch(() => {});
    },
    /** 获取验证码*/
    getCode(type = 0) {
      //   if (!/^1\d{10}$/.test(this.phoneNum)) {
      //     return (this.phoneErrorMsg = "手机号格式有误");
      //   }
      if (this.phoneErrorMsg.length != 0) return;
      //this.phoneErrorMsg = "";
      this.waiting = true;
      let timestamp = Math.floor(new Date().getTime() / 1000) + "";
      let theSign = md5(
        `${this.phoneNum}${this.stateInfo}${this.systemInfo.usersource}${
          this.systemInfo.channel
        }${this.systemInfo.version}${timestamp}${this.systemInfo.privateKey}`
      );
      let postFunction = type == 0 ? checkCode : checkVoiceCode;
      postFunction({
        mobile: this.phoneNum,
        state: this.stateInfo,
        timestamp,
        sign: theSign
      }).then(
        res => {
          res = res.data;
          if (res.code == 1) {
            if (type == 1) this.sendVoiceDialog();
            this.$store.commit("saveStateInfo", res.state);
            if (type == 0) {
              this.timeCountDown = setInterval(() => {
                if (this.countDown <= 0) {
                  clearInterval(this.timeCountDown);
                  this.waiting = false;
                  this.countDown = 60;
                } else {
                  this.countDown--;
                }
              }, 1000);
            } else this.waiting = false;
          } else if (res.code == 2) {
            this.$store.commit("saveStateInfo", res.state);
            return setTimeout(() => {
              this.getCode(type);
            }, 500);
          } else {
            this.waiting = false;
            if (res.message) this.$toast(res.message);
            console.log(res.message);
          }
        },
        () => {
          this.waiting = false;
          this.$toast("网络出错,请稍后重试");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.van-field>>>.van-button--primary
  height: 38px

.van-field>>>.van-field__control
  background-color: #EFEFEF
  padding: 0.14rem 0.15rem
  border-radius: 0.06rem

.van-field>>>.van-field__control, .van-field>>>.van-field__button
  display: table-cell
  white-space: nowrap

.activity-wrapper
  wrapper()
  background: linear-gradient(0deg, #720C3F, #C12D48)

  .info-wrapper
    margin: 0.2rem 0.15rem
    background-color: #ffffff
    border-radius: 0.14rem
    padding: 0.15rem 0.15rem 0.4rem
    font-size: 0.3rem

    .info
      color: #000000
      margin: 0.3rem 0.3rem 0.1rem

      .station-remain
        font-size: 0.24rem
        float: right
        line-height: 0.36rem
        color: $erroColor

    .van-cell
      padding: 0.18rem 0.3rem

      &:after
        border: none

    .tip
      color: #f44
      padding: 0.1rem 0.3rem
      font-size: 0.24rem
      border: none

  .commit-btn
    width: 4rem
    height: 1rem
    margin: 0.5rem auto 0.28rem

    img
      width: 100%
      height: 100%

  .text-wrapper
    margin: 0.7rem 0.22rem 0
    padding: 0.1rem 0.16rem 0.2rem
    color: #FDD38D
    word-break: break-all
    font-size: 0.28rem
    line-height: 1.8

    .activity-title
      font-size: 0.3rem
      margin-bottom: 0.2rem
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
