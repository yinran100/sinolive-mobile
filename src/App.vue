<template>
  <transition :name="transitionName">
    <router-view class="router-class"></router-view>
  </transition>
</template>

<script>
import { getUserMsgbyToken } from "@/api/api";
export default {
  name: "App",
  data() {
    return {
      transitionName: "slide-right" // 默认动态路由变化为slide-right  TrainerDetail,LiveRoom,CourseDetail,NewsContent
    };
  },
  watch: {
    $route(to, from) {
      if (from.meta.index == undefined) return (this.transitionName = "");
      this.transitionName =
        to.meta.index < from.meta.index ? "slide-right" : "slide-left";
      if (to.path == "/login" && localStorage.hasLogin == 1) {
        //若是到/login.且未登录，则直接重定向到首页
        if (
          this.$store.state.activityId == 4 &&
          this.$store.state.provinceId == 83
        ) {
          this.$router.push(`/giftlist`);
        } else {
          this.$router.push("/home/index");
        }
      }
    }
  },
  created() {
    let res = location.search.replace(/\?/, "").split("&"); //去掉第一个问号 decodeURIComponent(uri_encode)
    let query = {};
    res.map(item => {
      let temp = item.split("=");
      if (temp[0] == "provinceId") {
        query["provinceId"] = decodeURIComponent(temp[1]);
      } else if (temp[0] == "notice_token") {
        query["notice_token"] = decodeURIComponent(temp[1]);
      } else if (temp[0] == "id") {
        query["id"] = decodeURIComponent(temp[1]);
      }
    });
    query = Object.assign(query, this.$route.query);
    if (query.hasOwnProperty("provinceId")) {
      this.$store.commit("setProvinceId", query.provinceId);
    }
    if (query.hasOwnProperty("notice_token")) {
      getUserMsgbyToken({ notice_token: query.notice_token }).then(res => {
        res = res.data;
        if (res.code == 1) {
          this.$store.commit("saveUserMsg", res.data);
          this.$store.commit("saveToken", res.data.sessionid);
        } else {
          this.$toast(res.message);
        }
      });
    }
    if (query.hasOwnProperty("id")) {
      this.$store.commit("setActivityId", query.id);
    }
  }
};
</script>

<style lang='stylus'>
@import '~css/globalStyle.styl'

.van-button--primary:not(.van-button--plain)
  background-color: $themeButtonColor
  border: 1px solid $themeButtonColor

.van-button--plain.van-button--primary
  border: 1px solid $themeButtonColor !important

.van-tabs__line
  background-color: $themeActiveColor !important

.van-dialog__confirm, .van-dialog__confirm:active, .van-picker__cancel, .van-picker__confirm, .van-button--plain.van-button--primary
  color: $themeTextColor !important

.van-tab
  font-size: 0.32rem

.van-cell__value
  color: #969799

.van-cell
  font-size: 15px
  line-height: 2

.van-nav-bar
  background: $headerBackColor
  color: #fff

body
  font-size: 0.32rem

.router-class, .home-view
  transition: all 0.4s ease

.slide-left-enter, .slide-right-leave-active
  -webkit-transform: translate(100%, 0)
  transform: translate(100%, 0)

.slide-left-leave-active, .slide-right-enter
  -webkit-transform: translate(-100%, 0)
  transform: translate(-100% 0)

.next-leave-active, .previous-enter
  -webkit-transform: translate(-100%, 0)
  transform: translate(-100% 0)

.next-enter, .previous-leave-active
  -webkit-transform: translate(100%, 0)
  transform: translate(100%, 0)
</style>
