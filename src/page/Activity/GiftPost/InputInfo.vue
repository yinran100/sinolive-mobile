<template>
  <div class="wrapper">
    <div class="input-group">
      <phone-code-input ref="phoneCodeInput">
        <van-field
          v-model.trim="name"
          label="姓名"
          type="text"
          placeholder="姓名"
          @blur="checkName"
          :error-message="nameErrorMsg"
        />
      </phone-code-input>
    </div>
    <div class="btn-wrapper">
      <van-button
        class="commit-btn"
        round
        @click="commitData"
        :loading='loading'
        :disabled="old"
      >领取登记</van-button>
    </div>
    <div class="tips">
      <p class="tip-title">温馨提示：</p>
      <p>1、登记信息仅用于礼品领取用。</p>
      <p>2、每个手机号仅限领取1个礼品。</p>
    </div>

  </div>
</template>

<script>
import PhoneCodeInput from "@/components/PhoneCodeInput/PhoneCodeInput";
import { checkActivity, commitInfo } from "@/api/api";

export default {
  components: {
    PhoneCodeInput
  },
  data() {
    return {
      loading: false,
      phone: "",
      code: "",
      name: "",
      nameErrorMsg: "",
      old: false,
      activeid: this.$route.params.id
    };
  },
  mounted() {
    this.check();
  },
  methods: {
    check() {
      checkActivity({ activityid: this.activeid }).then(
        res => {
          res = res.data;
          if (res.code != 1) {
            this.old = true;
            this.$dialog.alert({
              message: res.message
            });
          }
        },
        () => {
          this.$dialog.alert({
            message: "网络出错,请稍后重试"
          });
        }
      );
    },
    checkName() {
      if (this.name.length == 0) {
        this.nameErrorMsg = "姓名不能为空";
      } else this.nameErrorMsg = "";
    },
    commitData() {
      if (this.name.length == 0) {
        return (this.nameErrorMsg = "姓名不能为空");
      }
      this.nameErrorMsg = "";
      let { mobile, code } = this.$refs.phoneCodeInput.getPhoneAndCode();
      if (mobile && code) {
        this.loading = true;
        commitInfo({
          mobile,
          code,
          name: this.name,
          activityid: this.activeid
        }).then(
          res => {
            res = res.data;
            this.loading = false;
            if (res.code == 1) {
              this.$dialog
                .alert({
                  title: "登记成功",
                  message: "感谢对本活动的支持"
                })
                .then(() => {
                  window.close();
                });
            } else if (res.code == 2) {
              this.$dialog
                .alert({
                  title: "登记成功",
                  message: res.message
                })
                .then(() => {
                  window.close();
                });
            } else {
              this.$toast(res.message);
            }
          },
          () => {
            this.$dialog.alert({
              message: "网络出错,请稍后重试"
            });
          }
        );
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.van-field>>>.van-cell__title
  max-width: 65px

.input-group>>>.van-button--primary
  background-color: #528D53
  border: 1px solid #528D53

.wrapper
  wrapper()

.input-group
  margin-top: 0.8rem
  position: relative

.code-input
  display: table-cell
  white-space: nowrap

.btn-wrapper
  position: relative
  text-align: center
  margin-top: 1rem

  .commit-btn
    background-color: #528D53
    color: #fff
    border: none
    font-size: 0.32rem
    padding: 0 1.4rem

.tips
  position: relative
  margin: 0.8rem 0.4rem 0
  font-size: 0.28rem
  line-height: 1.5
  color: #78807d

  .tip-title
    font-weight: bold
</style>
