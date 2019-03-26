<template>
  <div>
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
          v-for="(item,index) in liveList"
          :key="item.liveId"
        >
          <div class="photo-wrapper">
            <img
              class="live-img"
              @load="(e)=>{ e.target.style.display = 'block'}"
              :src="item.Headpic"
              alt=""
            >
            <div
              class="state-tag"
              :style="{backgroundColor:stateTags[index].color}"
              v-show="stateTags[index]"
            >{{stateTags[index].text}}</div>
          </div>
          <div class="item-info ellipsis">
            <div class="titel ellipsis">{{item.name}}</div>
            <div class="tips-wrapper">
              <span
                class="tips"
                :class="{tipsOver:item.subtitle.length>26}"
              >{{item.subtitle}}</span>
            </div>
            <div class="clearfix">
              <div class="date">{{ item.updatedTime*1000|moment }}更新</div>
              <div class="watch"><span class="iconfont icon-yanjing"></span>{{item.watchNum}}</div>
            </div>
          </div>
        </router-link>
      </ul>
    </scroll>
    <none-tip
      :msg="msg"
      v-show="liveList.length==0"
    ></none-tip>
  </div>
</template>
<script>
import Scroll from "@/components/Scroll/Scroll";
import { getLiveList } from "@/api/api";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "LiveList",
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
    stateTags() {
      return this.liveList.map(item => {
        if (item.Livestate == 0) return { text: "未开始", color: "#6175F7" };
        else if (item.Livestate == 1)
          return { text: "直播中", color: "#F24B43" };
        else if (item.Livestate == 2)
          return { text: "答题中", color: "#449d44" };
        else if (item.Livestate == 3)
          return { text: "已结束", color: "#676767" };
        else return false;
      });
    },
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多直播间";
    },
    msg() {
      if (this.noMoreData)
        return this.keywords != ""
          ? `搜索不到"${this.keywords}"相关的直播`
          : "暂时没有直播";
      else return "加载中...";
    }
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.liveList = [];
    },
    loadLiveList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getLiveList({
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
            Livestate,
            influence,
            Updated,
            Views
          }) => {
            this.liveList.push({
              liveId: Id,
              name: Name,
              Headpic,
              liveImg: Screenshot,
              Livestate,
              subtitle: Subtitle.trim(),
              updatedTime: Updated,
              watchNum: Views
            });
          }
        );
      } else {
        this.$toast(res.message);
      }
    },
    alertError() {
      this.$toast.clear();
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadLiveList();
    }
  },
  created() {
    this.loadLiveList();
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.live-wrapper>>>.iconfont
  font-size: 0.26rem
  padding-right: 0.07rem

.live-wrapper
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  background-color: #f2f2f2

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
        preview()
        position: relative
        margin-right: 0.16rem
        background-color: #dfdfdf

        .live-img
          display: none
          height: 100%
          width: 100%

        .state-tag
          font-size: 0.2rem
          color: #fff
          border-radius: 0.03rem
          position: absolute
          top: 0.1rem
          left: 0.1rem
          padding: 0.04rem 0.03rem 0rem

      .item-info
        flex: 1

        .titel
          font-size: 0.36rem

        .tips-wrapper
          font-size: 0.28rem
          color: #a0a0a0
          margin-top: 0.1rem
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
