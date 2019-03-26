<template>
  <div class="mine-wrapper">
    <div class="ellipse">
      <router-link
        tag="div"
        class="mine-photo"
        to="/personinfo"
      >
        <img
          class="photo-img"
          :src="userMsg.avatar"
          @load="(e)=>{ e.target.style.display = 'block'}"
        >
      </router-link>
      <div class="username">{{ userMsg.nickname }}</div>
    </div>

    <van-cell-group class="content-list">
      <van-cell
        class="content-item"
        is-link
        to="/exam"
      >
        <template slot="title">
          <span class="iconfont icon-kaoshi1"></span>我的考试
        </template>
      </van-cell>
      <van-cell
        class="content-item"
        is-link
        to="/task"
      >
        <template slot="title">
          <span class="iconfont icon-task-icon"></span>学习任务
        </template>
      </van-cell>
      <van-cell
        class="content-item"
        is-link
        @click="logout"
      >
        <template slot="title">
          <span class="iconfont icon-tuichu1"></span>退出登录
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userMsg"])
  },
  methods: {
    logout() {
      this.$dialog
        .confirm({
          message: "确定退出登录？"
        })
        .then(() => {
          this.$store.commit("saveToken", "");
          //存已登录
          this.$store.commit("saveLogin", 0);
          console.log("logout");
          this.$router.push(`/login`);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.mine-wrapper
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 0
  background-color: $backgroundColor

  .ellipse
    position: relative
    z-index: 1
    width: 150%
    height: 3.5rem
    background: $headerBackColor
    border-radius: 120% / 0 0 100% 100%
    margin-left: -25%
    display: flex
    flex-direction: column
    align-items: center

    .mine-photo
      width: 1.5rem
      height: 1.5rem
      margin-top: 0.8rem
      border: 0.02rem solid #fff
      border-radius: 50%
      background-color: #dfdfdf

      .photo-img
        display: none
        border-radius: 50%
        height: 100%
        width: 100%

    .username
      margin-top: 0.3rem
      color: #ffffff
      font-size: 0.36rem
      text-align: center

  .content-list
    position: relative
    margin-top: -0.4rem
    padding-top: 0.6rem

    .content-item
      font-size: 0.32rem

      .iconfont
        font-size: 0.38rem
        padding: 0 0.15rem
        color: $themeActiveColor
</style>
