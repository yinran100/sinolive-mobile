
<template>
  <van-dialog
    v-model="pwdshow"
    title="重置密码"
    show-cancel-button
    :before-close="pwdClose"
    :confirmButtonText="pwdConfirm"
  >
    <phone-code-input
      v-if="step==1"
      ref="phoneCodeInput"
    ></phone-code-input>
    <van-cell-group v-else-if="step==0">
      <van-field
        v-model="passwordold"
        type="password"
        clearable
        label="原始密码"
        placeholder="请输入原密码"
      />

      <van-field
        v-model="password1"
        type="password"
        clearable
        label="新密码"
        placeholder="长度至少6位"
      />

      <van-field
        v-model="password2"
        clearable
        type="password"
        label="确认密码"
        placeholder="长度至少6位"
        :error-message="codeErrorMsg"
      />
    </van-cell-group>
    <van-cell-group v-else>
      <van-field
        v-model="password1"
        type="password"
        clearable
        label="新密码"
        placeholder="长度至少6位"
      />

      <van-field
        v-model="password2"
        clearable
        type="password"
        label="确认密码"
        placeholder="长度至少6位"
        :error-message="codeErrorMsg"
      />
    </van-cell-group>
    <p
      class="toggle-type"
      @click="toggleStep"
      v-show="step<=1"
    >{{tipText}}
      <span>
        <van-icon name="arrow" /></span>
    </p>
  </van-dialog>
</template>

<script>
import PhoneCodeInput from "@/components/PhoneCodeInput/PhoneCodeInput";
import { getState, modifyPwd, modifyPwdWithOld } from "@/api/api";
import encryptByDES from "@/assets/js/crypto";
export default {
  components: {
    PhoneCodeInput
  },
  data() {
    return {
      pwdshow: false,
      secretmobile: "",
      pwdConfirm: "确认修改",
      step: 0,
      codeErrorMsg: "",
      passwordold: "",
      password1: "",
      password2: "",
      mysqlDataTripleEcbDesKey: "C904F869415E8B9FU644E667"
    };
  },
  computed: {
    tipText() {
      return this.step == 0
        ? "忘记原始密码？使用手机验证重置"
        : "使用原始密码修改";
    }
  },
  methods: {
    showDialog() {
      this.pwdshow = true;
    },
    clearAll() {
      this.codeErrorMsg = "";
      this.passwordold = "";
      this.password1 = "";
      this.password2 = "";
    },
    toggleStep() {
      this.step = this.step == 0 ? 1 : 0;
      this.pwdConfirm = this.step == 0 ? "确认修改" : "下一步";
      if (this.step == 1) getState();
      this.clearAll();
    },
    pwdClose(action, done) {
      if (action === "confirm") {
        if (this.step == 1) {
          this.$refs.phoneCodeInput.login(true).then(res => {
            res = res.data;
            if (res.code == 1) {
              this.secretmobile = res.data.secretmobile;
              this.clearAll();
              this.$refs.phoneCodeInput.clearAll();
              this.step = 2;
              this.pwdConfirm = "确认修改";
            } else {
              this.$refs.phoneCodeInput.codeErrorMsg = res.message;
            }
          });
        } else {
          if (this.password1 != this.password2) {
            this.codeErrorMsg = "两次密码输入不一致";
          } else if (this.password1.length < 6) {
            this.codeErrorMsg = "密码长度不能少于6位";
          } else {
            this.codeErrorMsg = "";
            let result = null;
            if (this.step == 0) {
              result = modifyPwdWithOld({
                passwordold: encryptByDES(
                  this.passwordold,
                  this.mysqlDataTripleEcbDesKey
                ),
                password1: encryptByDES(
                  this.password1,
                  this.mysqlDataTripleEcbDesKey
                ),
                password2: encryptByDES(
                  this.password2,
                  this.mysqlDataTripleEcbDesKey
                )
              });
            } else {
              result = modifyPwd({
                secretmobile: this.secretmobile,
                //   password1: this.password1,
                //   password2: this.password2
                password1: encryptByDES(
                  this.password1,
                  this.mysqlDataTripleEcbDesKey
                ),
                password2: encryptByDES(
                  this.password2,
                  this.mysqlDataTripleEcbDesKey
                )
              });
            }
            result.then(res => {
              res = res.data;
              if (res.code == 1) {
                this.$toast.success("密码修改成功");
                done();
                this.clearAll();
                return;
              } else {
                this.codeErrorMsg = res.message;
                // if (res.message) this.$toast(res.message);
              }
            });
          }
        }
        done(false);
      } else {
        done();
        this.clearAll();
        setTimeout(() => {
          this.step = 0;
          if (this.$refs.phoneCodeInput) this.$refs.phoneCodeInput.clearAll();
        }, 300);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~css/globalStyle.styl'

.van-dialog
  >>>.van-dialog__header
    margin-bottom: 0.1rem

.toggle-type
  color: $themeTextColor
  margin: 0.2rem
  font-size: 0.26rem
  text-align: center

  span
    font-size: 0.22rem
</style>
