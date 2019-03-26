<template>
  <div>
    <scroll
      class="news-wrapper"
      :data="newsList"
      :pullup="pullup"
      :pullupMsg="pullupMsg"
      @pullup="pullupEvent"
    >
      <ul class="news-list">
        <router-link
          tag='li'
          class="news-item"
          :class="{'news-item-col':item.itemType==1}"
          :to="'/newsContent/'+item.articleId"
          v-for="item in newsList"
          :key="item.articleId"
        >
          <div
            class="item-info"
            v-if="item.itemType==0"
          >
            <div
              class="title"
              :class="{tipsOver:item.title.length>27}"
            >
              <span>{{item.title}}</span>
            </div>
            <div class="clearfix">
              <div class="date">{{ item.updateTime*1000|moment }}</div>
              <div class="tips-wrapper">
                <span><i class="iconfont icon-yanjing"></i>{{item.readingQuantity}}</span>
              </div>
            </div>
          </div>
          <div
            class="title"
            v-else
          >
            <span>{{item.title}}</span>
          </div>
          <div
            class="photo-wrapper"
            v-if="item.itemType==0"
          >
            <img
              class="news-img"
              alt=""
              @load="(e)=>{ e.target.style.display = 'block'}"
              :src="item.coverImagePath1"
            >
          </div>
          <div
            class="photo-line"
            v-else
          >
            <div class="photo-wrapper">
              <img
                class="news-img"
                alt=""
                @load="(e)=>{ e.target.style.display = 'block'}"
                :src="item.coverImagePath1"
              >
            </div>
            <div class="photo-wrapper">
              <img
                class="news-img"
                alt=""
                @load="(e)=>{ e.target.style.display = 'block'}"
                :src="item.coverImagePath2"
              >
            </div>
            <div class="photo-wrapper">
              <img
                class="news-img"
                alt=""
                @load="(e)=>{ e.target.style.display = 'block'}"
                :src="item.coverImagePath3"
              >
            </div>
          </div>
          <div
            class="clearfix"
            v-if="item.itemType==1"
          >
            <div class="date">{{ item.updateTime*1000|moment }}</div>
            <div class="tips-wrapper">
              <span><i class="iconfont icon-yanjing"></i>{{item.readingQuantity}}</span>
            </div>
          </div>
        </router-link>
      </ul>
    </scroll>
    <none-tip
      :msg="msg"
      v-show="newsList.length==0"
    ></none-tip>
  </div>

</template>
<script>
import { getNewsList } from "@/api/api";
import Scroll from "@/components/Scroll/Scroll";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "NewsList",
  components: {
    Scroll,
    NoneTip
  },
  props: {
    sortId: { default: "" }
  },
  data() {
    return {
      pullup: true,
      newsList: [],
      page: 1,
      offset: 5,
      loaded: false,
      noMoreData: false
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多新闻";
    },
    msg() {
      return this.loaded ? "没有任何资讯" : "加载中...";
    }
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.newsList = [];
    },
    loadNewsData() {
      this.$toast({ type: "loading", message: "加载中..." });
      getNewsList({
        page: this.page,
        offset: this.offset,
        sortId: this.sortId
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
      this.loaded = true;
      this.$toast.clear();
      res = res.data;
      if (res.code == 1 && res.notices) {
        if (res.notices.length == 0) {
          if (this.page != 1) this.$toast("没有更多数据");
          this.noMoreData = true;
        } else {
          if (res.notices.length < this.offset) this.noMoreData = true;
          this.page++;
        }
        res.notices.map(
          ({
            articleId,
            title,
            coverImagePath1,
            coverImagePath2,
            coverImagePath3,
            readingQuantity,
            updateTime
          }) => {
            this.newsList.push({
              articleId,
              title,
              updateTime,
              coverImagePath1,
              coverImagePath2,
              coverImagePath3,
              readingQuantity,
              itemType: coverImagePath2 != "" && coverImagePath2 != "" ? 1 : 0
            });
          }
        );
      } else {
        if (res.message) this.$toast(res.message);
      }
    },
    alertError() {
      this.$toast.clear();
      console.log("error");
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadNewsData();
    }
  },
  created() {
    this.loadNewsData();
  }
};
</script>
<style lang="stylus" scoped>
.news-wrapper>>>.icon-yanjing
  font-size: 0.26rem
  padding-right: 0.07rem

.news-wrapper>>>.clearfix
  .date
    float: left
    color: #9b9b9b
    font-size: 0.28rem
    margin-top: 0.1rem

  .tips-wrapper
    font-size: 0.26rem
    margin-top: 0.1rem
    float: right
    margin-right: 0.16rem
    color: #9b9b9b

.news-wrapper
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  background-color: #f2f2f2

  .news-list
    padding: 0 0.3rem
    background-color: #fff

    .news-item, .news-item-col
      display: flex
      padding-top: 0.2rem
      padding-bottom: 0.2rem

      .item-info
        flex: 1
        margin-right: 0.12rem

        .tipsOver:after
          background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%)
          repeat: scroll 0 0 rgba(0, 0, 0, 0)
          bottom: 0
          content: '...'
          padding: 0 0.05rem 0px 0.2rem
          position: absolute
          right: 0

        .title
          text-overflow: ellipsis
          overflow: hidden
          font-size: 0.34rem
          position: relative
          line-height: 0.52rem
          height: 1.04rem

      .photo-wrapper
        width: 2.26rem
        height: 1.48rem
        margin: 0 0.05rem
        background-color: #dfdfdf

        .news-img
          display: none
          width: 100%
          height: 100%

    .news-item, .news-item-col
      &:nth-last-child(n+2)
        border-bottom: 1px #eee solid

    .news-item-col
      flex-direction: column

      .title
        font-size: 0.34rem
        line-height: 0.48rem

      .photo-line
        display: flex
        padding-bottom: 0.1rem
        justify-content: space-around
</style>
