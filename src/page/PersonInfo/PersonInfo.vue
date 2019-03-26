<template>
  <div class="info-wrapper">
    <com-header
      toLink="-1"
      titleText="个人资料"
    ></com-header>
    <van-cell-group>
      <van-cell
        title="头像"
        is-link
        to="/cutPicture"
      >
        <template>

          <div class="avatar-wrapper">
            <img
              class="avatar-img"
              :src="userMsg.avatar"
              alt=""
            >
          </div>
        </template>
      </van-cell>
      <van-cell
        title="手机号"
        :value="phone"
      />
      <van-cell
        title="昵称"
        :value="userMsg.nickname"
        is-link
        @click="showNick"
        clickable
      />

      <van-cell
        title="登录密码"
        is-link
        @click="showPwd"
      >
        <template>
          <span class="code">重置密码</span>
        </template></van-cell>
    </van-cell-group>
    <h2
      class="title"
      v-show="userInfo"
    >站主信息</h2>
    <van-cell-group v-if="userInfo">
      <van-cell
        title="姓名"
        :value="userInfo.userName"
      />
      <van-cell
        title="身份证号"
        :value="userInfo.idCard"
      />
      <van-cell
        title="站点编号"
        :value="userInfo.stationCode"
      />
      <van-cell
        title="站点地址"
        :value="userInfo.address"
      />
    </van-cell-group>

    <van-dialog
      v-model="nickshow"
      title="修改昵称"
      show-cancel-button
      :before-close="nickClose"
    >
      <van-field
        ref="nickInput"
        v-model="newName"
        placeholder="昵称字数长度在2~15个之间"
      />
    </van-dialog>
    <div
      class="tips"
      v-show="userInfo"
    >注：以上站点信息如果有误，请联系管理员或致电客服电话 <span class="call">0755-83995853</span> </div>
    <reset-pwd-dialog ref="pwdDialog"></reset-pwd-dialog>

  </div>
</template>

<script>
import ComHeader from "@/components/Header/ComHeader";
import ResetPwdDialog from "./components/ResetPwdDialog";
import { mapState } from "vuex";
import { modifyNickname, getSationInfo } from "@/api/api";
export default {
  name: "PersonInfo",
  components: {
    ComHeader,
    ResetPwdDialog
  },
  data() {
    return {
      nickshow: false,
      newName: "",
      userInfo: null
    };
  },
  computed: {
    ...mapState(["userMsg", "phone"])
  },
  created() {
    getSationInfo().then(
      res => {
        res = res.data;
        if (res.code == 1) {
          this.userInfo = res.data;
        }
      },
      () => {
        this.$toast("网络出错，请稍后重试");
      }
    );
  },
  methods: {
    nickClose(action, done) {
      if (action === "confirm") {
        if (this.newName.length < 15 && this.newName.length > 1) {
          modifyNickname({
            nickname: this.newName
          }).then(
            res => {
              res = res.data;
              if (res.code == 1) {
                this.$toast("修改成功！");
                this.$store.commit("saveUserMsg", { nickname: res.data });
                done();
                this.newName = "";
              } else {
                if (res.message) this.$toast(res.message);
              }
            },
            () => {
              this.$toast("网络出错,请稍后重试");
            }
          );
        } else {
          this.$toast("昵称长度不合法");
          this.newName = "";
          done();
        }
      } else {
        done();
        this.newName = "";
      }
    },
    showPwd() {
      this.$refs.pwdDialog.showDialog();
    },
    showNick() {
      this.nickshow = true;
      setTimeout(() => {
        this.$refs.nickInput.focus();
      }, 200);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.van-cell>>>.van-cell__value
  color: $iconColor

.info-wrapper
  background-color: $backgroundColor
  min-height: 100%
  position: absolute
  left: 0
  right: 0

  .van-cell-group
    margin: 0.15rem 0

    .van-cell
      align-items: center

      .avatar-wrapper
        width: 0.9rem
        height: 0.9rem
        border-radius: 50%
        float: right

        .avatar-img
          width: 100%
          height: 100%
          border-radius: 50%

      .code
        color: $themeTextColor
        text-align: right

  .title
    margin: 0
    font-size: 0.3rem
    color: #7e8389
    padding: 0.3rem 0.15rem 0

  .img-view
    position: fixed

.tips
  margin: 0.3rem
  line-height: 1.5
  font-size: 0.28rem
  color: #8E8E8E

  .call
    color: #F88B4F

.van-popup
  width: 75%
  height: 75%
  display: flex
  flex-direction: column
  align-items: center
  background-color: rgba(0, 0, 0, 0)

  .img-wrapper
    width: 80%

    .view-img
      width: 100%

  .modify-avatar-btn
    cursor: pointer
    color: #fff
    user-select: none
    font-size: 0.36rem
    margin-top: 1rem
    padding: 0.1rem 0.5rem
    border: 1px solid #fff
    border-radius: 0.1rem

    &:active
      color: #aaa
      border: 1px solid #aaa

  .btn
    color: #fff
    margin-top: 1rem

    &:active
      color: #aaa

    .iconfont
      font-size: 0.5rem
</style>
