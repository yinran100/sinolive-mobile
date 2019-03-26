<template>
  <div class="wrapper">
    <com-header titleText="站主登录"></com-header>

    <van-cell-group v-if="step==0">
      <van-field
        v-model="phoneNum"
        type="tel"
        clearable
        onkeyup="value=value.replace(/[^\d]/g,'')"
        label="手机号"
        placeholder="请输入手机号"
        :error-message="phoneErrorMsg"
      />
      <van-field
        v-model="password"
        :type="viewType"
        clearable
        label="密码"
        placeholder="请输入密码"
        :error-message="codeErrorMsg"
      >
        <van-icon
          slot="icon"
          :name="iconName"
          @click="toggleView"
        ></van-icon>
      </van-field>
    </van-cell-group>
    <phone-code-input
      ref="phoneCodeInput"
      v-else
    ></phone-code-input>
    <router-link
      class="phone-search"
      to="/activity/phonesearch"
    >忘记手机号？点击查询
    </router-link>
    <div class="btn-wrapper">
      <van-button
        size="large"
        type="primary"
        @click="login"
      >登录</van-button>
    </div>
    <div class="clearfix">
      <p
        class="toggle-type"
        @click="toggleStep"
      >{{tipText}}
        <span>
          <van-icon name="arrow" /></span>
      </p>
      <p
        class="help-text"
        @click="showhelp"
      >使用说明
      </p>
    </div>
    <van-dialog
      v-model="isShowHelp"
      title="派发说明"
    >
      <div class="tips-wrapper">
        <ol>
          <li>限福彩投注站业主及销售员使用；</li>
          <li>使用手机号+验证码即可登陆；</li>
          <li>忘记手机号可在首页通过站点编号与姓名查询；</li>
          <li>申请账号请联系本站管理员或者客服：0755-83995853</li>
        </ol>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import ComHeader from "@/components/Header/ComHeader";
import PhoneCodeInput from "@/components/PhoneCodeInput/PhoneCodeInput";
import { loginByPwd, getState } from "@/api/api";
import encryptByDES from "@/assets/js/crypto";
import { mapState } from "vuex";
import md5 from "js-md5";
export default {
  name: "Login",
  components: {
    ComHeader,
    PhoneCodeInput
  },
  data() {
    return {
      isShowHelp: false,
      step: 1,
      iconName: "password-view",
      phoneNum: "",
      password: "",
      phoneErrorMsg: "",
      codeErrorMsg: "",
      mysqlDataTripleEcbDesKey: "C904F869415E8B9FU644E667"
    };
  },
  computed: {
    ...mapState(["systemInfo", "stateInfo", "provinceId", "activityId"]),
    tipText() {
      return this.step == 0 ? "忘记密码，可用手机验证码登陆" : "密码登录";
    },
    viewType() {
      return this.iconName == "password-view" ? "password" : "tel";
    }
  },
  mounted() {
    getState();
  },
  methods: {
    toggleView() {
      this.iconName =
        this.iconName == "password-view"
          ? "password-not-view"
          : "password-view";
    },
    toggleStep() {
      this.step = this.step == 0 ? 1 : 0;
      this.phoneNum = "";
      this.codeErrorMsg = "";
      this.phoneErrorMsg = "";
      this.password = "";
      if (this.$refs.phoneCodeInput) this.$refs.phoneCodeInput.clearAll();
    },
    showhelp() {
      this.isShowHelp = true;
      //   this.$dialog.confirm({
      //     title: "使用帮助",
      //     message:
      //       "1、限福彩投注站业主及销售员使用。2、使用手机号+验证码即可登陆。3、忘记手机号可在首页通过站点编号与姓名查询。"
      //   });
    },
    login() {
      let result = null;
      if (this.step == 0) {
        if (!/^1\d{10}$/.test(this.phoneNum)) {
          this.phoneErrorMsg = "手机号格式有误";
          return;
        } else if (this.password == "") {
          this.codeErrorMsg = "";
          this.codeErrorMsg = "密码不能为空";
          return;
        }
        this.codeErrorMsg = "";
        this.phoneErrorMsg = "";
        let timestamp = Math.floor(new Date().getTime() / 1000) + "";
        let code = encryptByDES(this.password, this.mysqlDataTripleEcbDesKey);
        let theSign = md5(
          `${this.phoneNum}${code}${this.systemInfo.usersource}${
            this.stateInfo
          }0${this.systemInfo.channel}${this.systemInfo.version}${timestamp}${
            this.systemInfo.privateKey
          }`
        );
        result = loginByPwd({
          state: this.stateInfo,
          mobile: this.phoneNum,
          password: code,
          timestamp,
          sign: theSign,
          stationsymbol: 1
        });
      } else result = this.$refs.phoneCodeInput.login();
      result.then(res => {
        res = res.data;
        if (res.code == 1) {
          if (this.$refs.phoneCodeInput)
            this.$refs.phoneCodeInput.codeErrorMsg = "";
          //存token
          this.$store.commit("saveToken", res.data.sessionid);
          //存用户信息
          this.$store.commit("saveUserMsg", res.data);
          //cunstate
          this.$store.commit("saveStateInfo", res.state);
          //存已登录
          this.$store.commit("saveLogin", 1);
          this.$store.commit(
            "saveLoginTime",
            Math.floor(new Date().getTime() / 1000) + ""
          );
          this.$store.commit("savePhone", this.phoneNum);
          console.log(res.message);
          if (this.activityId == 4 && this.provinceId == 83) {
            this.$router.push(`/giftlist`);
          } else {
            //跳转至上页面
            this.$router.push(
              this.$route.query.redirect
                ? this.$route.query.redirect
                : `/home/index`
            );
          }
        } else {
          this.codeErrorMsg = res.message;
          if (this.$refs.phoneCodeInput)
            this.$refs.phoneCodeInput.codeErrorMsg = res.message;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.wrapper
  wrapper()

  .van-cell-group
    margin-top: 0.5rem

  .btn-wrapper
    margin: 0.6rem 0.5rem 0.4rem

  .phone-search
    font-size: 0.28rem
    margin: 0.2rem
    text-align: right
    display: block
    color: $themeTextColor

.toggle-type
  color: #8E8E8E
  margin-left: 0.5rem
  font-size: 0.28rem
  float: left

  span
    vertical-align: middle
    font-size: 0.26rem
    margin-left: -0.08rem

.help-text
  margin-right: 0.5rem
  float: right
  font-size: 0.28rem
  color: #8E8E8E

.tips-wrapper
  margin: 0.1rem 0.5rem 0
  word-break: break-all
  font-size: 0.28rem
  line-height: 1.8

  .tips-title
    text-align: center
    font-weight: bold
    margin-bottom: 0.1rem

  ol
    margin-left: 0.3rem
    list-style: decimal
</style>


