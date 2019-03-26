<template>
  <van-cell-group>
    <slot></slot>
    <van-field
      v-model="phoneNum"
      label="手机号"
      type="tel"
      onkeyup="value=value.replace(/[^\d]/g,'')"
      placeholder="请输入手机号"
      :error-message="phoneErrorMsg"
    />
    <van-field
      v-model="code"
      center
      label="验证码"
      placeholder="请输入短信验证码"
      :error-message="codeErrorMsg"
    >
      <van-button
        slot="button"
        size="small"
        type="primary"
        :disabled="!isGet"
        @click="gotCode(0)"
      >{{tipMsg}}</van-button>
    </van-field>
    <van-cell
      class="tip"
      title="收不到短信?试试语音验证码"
      v-show="showVoiceTip"
      @click="gotCode(1)"
    />
  </van-cell-group>
</template>

<script>
import { mapState } from "vuex";
import md5 from "js-md5";
import { checkCode, checkVoiceCode, login } from "@/api/api";
export default {
  props: {
    codeSymbol: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isGet: true,
      countDown: 60,
      timeCountDown: null,
      phoneNum: "",
      phoneErrorMsg: "",
      codeErrorMsg: "",
      code: "",
      showVoiceTip: false
    };
  },
  computed: {
    ...mapState(["systemInfo", "stateInfo", "provinceId", "deviceId"]),
    tipMsg() {
      if (this.isGet) return "发送验证码";
      else return this.countDown + "秒后重新发送";
    }
  },
  watch: {
    countDown(val) {
      if (val <= 5) this.showVoiceTip = true;
    }
  },
  beforeDestroy() {
    if (this.timeCountDown) clearInterval(this.timeCountDown);
  },
  methods: {
    clearAll() {
      this.phoneNum = "";
      this.code = "";
      this.codeErrorMsg = "";
      this.phoneErrorMsg = "";
    },
    sendVoiceDialog() {
      this.$dialog
        .alert({
          title: "语音验证码",
          message: "我们将通过电话方式告知您验证码，请注意接听"
        })
        .then(() => {
          //gotCode(1)
        })
        .catch(() => {});
    },
    //******************获取验证码************************//
    gotCode(type = 0) {
      console.log(!/^1\d{10}$/.test(this.phoneNum));
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        this.phoneErrorMsg = "手机号格式有误";
        return;
      }
      this.phoneErrorMsg = "";
      this.isGet = false;
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
        stationsymbol: this.codeSymbol,
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
                  this.isGet = true;
                  this.countDown = 60;
                } else {
                  this.countDown--;
                }
              }, 1000);
            } else this.isGet = true;
          } else if (res.code == 2) {
            this.$store.commit("saveStateInfo", res.state);
            return setTimeout(() => {
              this.gotCode(type);
            }, 500);
          } else if (res.code == 5) {
            this.isGet = true;
            if (res.message) this.$toast(res.message);
          } else {
            this.isGet = true;
            if (res.message) this.$toast(res.message);
            console.log(res.message);
          }
        },
        () => {
          this.isGet = true;
          this.$toast("网络出错,请稍后重试");
        }
      );
    },
    //******************登录/注册************************//
    login(type = false) {
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        this.phoneErrorMsg = "手机号格式有误";
        return new Promise(() => {});
      } else if (!/^\d{6}$/.test(this.code)) {
        this.phoneErrorMsg = "";
        this.codeErrorMsg = "验证码格式有误";
        return new Promise(() => {});
      }
      this.phoneErrorMsg = "";
      this.codeErrorMsg = "";
      let timestamp = Math.floor(new Date().getTime() / 1000) + "";
      let theSign = md5(
        `${this.phoneNum}${this.code}${this.systemInfo.usersource}${
          this.stateInfo
        }${this.systemInfo.channel}${this.systemInfo.version}${timestamp}${
          this.systemInfo.privateKey
        }`
      );
      return login({
        mobile: this.phoneNum,
        code: this.code,
        state: this.stateInfo,
        timestamp,
        ischange: type,
        sign: theSign,
        stationsymbol: this.codeSymbol
      });
    },
    getPhoneAndCode() {
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        this.phoneErrorMsg = "手机号格式有误";
        return null;
      } else if (!/^\d{6}$/.test(this.code)) {
        this.phoneErrorMsg = "";
        this.codeErrorMsg = "验证码格式有误";
        return null;
      }
      this.phoneErrorMsg = "";
      this.codeErrorMsg = "";
      return {
        mobile: this.phoneNum,
        code: this.code
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.van-field>>>.van-cell__title
  max-width: 65px

.van-field>>>.van-field__body
  display: inline-table
  width: 100%

.van-field>>>.van-field__control, .van-field>>>.van-field__button
  display: table-cell
  white-space: nowrap

.tip
  color: #f44
  padding: 0.1rem 0.3rem
  font-size: 0.24rem
  border: none
</style>
