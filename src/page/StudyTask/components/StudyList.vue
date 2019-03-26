<template>
  <scroll
    class="live-wrapper"
    :data="liveList"
    :pullup="pullup"
    :pullupMsg="pullupMsg"
    @pullup="pullupEvent"
  >
    <ul class="live-list">
      <router-link
        tag='li'
        class="live-item"
        :to="'/liveRoom/'+item.liveId"
        v-for="item in liveList"
        :key="item.liveId"
      >
        <div class="photo-wrapper">
          <img
            class="live-img"
            @load="(e)=>{ e.target.style.display = 'block'}"
            :src="item.Headpic"
            alt=""
          >
        </div>
        <div class="item-info ellipsis">
          <div class="titel ellipsis">{{item.name}}</div>
          <div class="subtitle-wrapper">
            <span
              class="subtitle"
              :class="{tipsOver:item.subtitle.length>22}"
            >{{item.subtitle}}</span>
          </div>
          <div class="clearfix">
            <div class="date"><i class="iconfont icon-jishi"></i>{{ item.beginDate*1000|moment }}更新</div>
            <div class="watch"><span class="iconfont icon-yanjing"></span>{{item.watchNum}}</div>
          </div>
        </div>
      </router-link>
    </ul>
    <p
      class="tips"
      v-show="liveList.length==0"
    >暂时没有课件</p>
  </scroll>

</template>
<script>
import { getView } from "@/api/api";
import Scroll from "@/components/Scroll/Scroll";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "StudyList",
  components: {
    Scroll,
    NoneTip
  },
  props: {
    keywords: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      liveList: []
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多数据";
    },
    msg() {
      if (this.noMoreData)
        return this.keywords != ""
          ? `搜索不到"${this.keywords}"相关的学习数据`
          : "暂时没有学习数据";
      else return "加载中...";
    }
  },
  created() {
    this.loadLiveList();
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.liveList = [];
    },
    loadLiveList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getView({
        p: this.page,
        offset: this.offset,
        keywords: this.keywords
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
      this.$toast.clear();
      res = res.data;
      if (res.code == 1) {
        res = res.data;
        if (res && res.length == 0) {
          if (this.page != 1) this.$toast("没有更多数据");
          this.noMoreData = true;
        } else {
          if (res && res.length < this.offset) this.noMoreData = true;
          this.page++;
        }
        res.map(
          ({
            Id,
            Name,
            Screenshot,
            Headpic,
            Subtitle,
            influence,
            Begindate,
            Views
          }) => {
            this.liveList.push({
              liveId: Id,
              name: Name,
              Headpic,
              liveImg: Screenshot,
              subtitle: Subtitle.trim(),
              beginDate: Begindate,
              watchNum: Views
            });
          }
        );
      } else {
        if (res.message) this.$toast(res.message);
      }
    },
    alertError() {
      this.$toast.clear();
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadLiveList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.live-wrapper>>>.iconfont
  font-size: 0.26rem
  padding-right: 0.07rem

.live-wrapper
  border-top: 1px solid #eee
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  background-color: #f2f2f2

  .tips
    padding: 0.3rem
    color: #b0b0b0

  .live-list
    padding: 0 0.25rem
    background-color: #fff

    .live-item
      display: flex
      align-items: center
      padding: 0.2rem 0

      &:nth-last-child(n+2)
        border-bottom: 1px #eee solid

      .photo-wrapper
        width: 3rem
        height: 1.65rem
        margin-right: 0.16rem
        background-color: #dfdfdf

        .live-img
          display: none
          height: 100%
          width: 100%

      .item-info
        flex: 1

        .titel
          font-size: 0.36rem

        .subtitle-wrapper
          font-size: 0.28rem
          color: #a0a0a0
          padding-top: 0.15rem
          white-space: initial
          overflow: hidden
          position: relative
          line-height: 0.38rem
          height: 0.76rem

        .tipsOver:after
          background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%)
          repeat: scroll 0 0 rgba(0, 0, 0, 0)
          bottom: 0
          content: '...'
          padding: 0 0.05rem 0 0.2rem
          position: absolute
          right: 0

        .date
          margin-top: 0.1rem
          padding-left: 0.04rem
          float: left
          color: #999999
          font-size: 0.26rem

        .watch
          margin-top: 0.1rem
          float: right
          font-size: 0.26rem
          line-height: 1
          color: #999999
</style>
