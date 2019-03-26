<template>
  <div class="index-wrapper">
    <!-- 头部轮播图 -->
    <van-swipe
      class="swipe-wrapper"
      :autoplay="5000"
      :height="160"
    >
      <van-swipe-item
        v-for="item in headdata"
        :key="item.Id"
      >
        <router-link
          tag="img"
          class="headPic"
          :src="item.Screenshot"
          alt=""
          :to="'/liveRoom/' + item.Id"
        ></router-link>
      </van-swipe-item>
    </van-swipe>
    <!-- 导航栏 -->
    <index-nav
      class="index-module"
      :list="appList"
      v-show="appList.length!=0"
    ></index-nav>
    <!-- 我的考试 -->
    <index-exam
      class="index-module"
      :examdata="examdata"
      v-show="examdata.length!=0"
    ></index-exam>
    <!-- 最近学习 -->
    <index-study
      class="index-module"
      :viewdata="viewdata"
      v-show="viewdata.length!=0"
    ></index-study>
    <!-- 热门推荐 -->
    <index-recommend
      class="index-module"
      :hotdata="hotdata"
      v-show="hotdata.length!=0"
    ></index-recommend>
  </div>
</template>

<script>
import { getIndexInfo } from "@/api/api";
import IndexNav from "./components/IndexNav";
import IndexStudy from "./components/IndexStudy";
import IndexRecommend from "./components/IndexRecommend";
import IndexExam from "./components/IndexExam";
import md5 from "js-md5";
export default {
  components: {
    IndexNav,
    IndexExam,
    IndexStudy,
    IndexRecommend
  },
  data() {
    return {
      headdata: [],
      viewdata: [],
      hotdata: [],
      examdata: [],
      appList: []
    };
  },
  created() {
    this.getIndexInfo();
  },
  methods: {
    getIndexInfo() {
      this.$toast({
        type: "loading",
        message: "加载中..."
      });
      getIndexInfo().then(res => {
        this.$toast.clear();
        res = res.data;
        if (res.code == 1) {
          if (res.hotdata) this.hotdata = res.hotdata;
          if (res.viewdata) this.viewdata = res.viewdata;
          if (res.examdata) this.examdata = res.examdata;
          if (res.headdata) this.headdata = res.headdata;
          if (res.appdata)
            this.appList = res.appdata.map(({ Id, Icon, Name, Href }) => {
              return {
                id: Id,
                imgUrl: Icon,
                navName: Name,
                routerTo: "/" + Href
              };
            });
        } else {
          if (res.message)
            this.$dialog.alert({
              message: res.message
            });
          console.log(res.message);
        }
      }, this.alertError);
    },
    alertError(res) {
      this.$dialog
        .alert({
          message: "网络出错,请稍后重试"
        })
        .then(() => {});
      this.$toast.clear();
    }
  }
};
</script>

<style  lang="stylus" scoped>
@import '~css/globalStyle.styl'

.swipe-wrapper>>>.van-swipe__indicator, .swipe-wrapper>>>.van-swipe__indicator--active
  background-color: #333
  opacity: 0.2

.swipe-wrapper>>>.van-swipe__indicator--active
  background-color: #fff

.index-wrapper
  background-color: #f7f7f7
  position: relative
  left: 0
  right: 0
  padding-bottom: $bottomHeight

  .swipe-wrapper
    overflow: hidden
    width: 100%
    height: 3.2rem
    background: #e7e7e7

    .headPic
      height: 100%
      width: 100%

  .index-module
    // border-bottom: 1px solid #bfbfbf
    background-color: #fff
    padding: 0 0.2rem
    margin-top: 0.2rem
</style>
