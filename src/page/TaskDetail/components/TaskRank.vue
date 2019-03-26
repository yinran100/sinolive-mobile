<template>
  <div>
    <scroll
      class="rank-page"
      :data="rankList"
      :pullup="pullup"
      :pullupMsg="pullupMsg"
      @pullup="pullupEvent"
    >
      <ul class="rank-list">
        <li
          class="rank-item"
          v-for="(item,index) in rankList"
          :key="item.userId"
        >
          <div class="num">
            <img
              :src="numImg[index]"
              alt=""
              v-if="index<3"
            >
            <p v-else>{{index+1}}</p>
          </div>
          <div
            class="avatar-wrapper"
            :class="classObjec(index)"
          >
            <img
              class="photo-img"
              :src="item.avatar"
              @load="(e)=>{ e.target.style.display = 'block'}"
            >
            <div
              class="num-text"
              v-if="index<3"
            >No.{{index+1}}</div>
          </div>
          <div class="rank-info ellipsis">
            <div class="name ellipsis">{{item.nickName}}</div>
            <div class="date">上次学习 {{item.endWatchTime*1000|moment}}</div>
          </div>
          <div class="schedule">{{item.schedule==100?'已完成':item.schedule+'%'}}</div>
        </li>
      </ul>
      <p
        class="tips"
        v-show="rankList.length==0"
      >暂时没有排名</p>
    </scroll>
  </div>
</template>

<script>
import { getTaskRanks } from "@/api/api";
import Scroll from "@/components/Scroll/Scroll";
export default {
  components: { Scroll },
  props: {
    taskId: String
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      rankList: [],
      numImg: [
        require("@/assets/images/first.png"),
        require("@/assets/images/second.png"),
        require("@/assets/images/third.png")
      ]
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多数据";
    }
  },
  created() {
    this.loadRankList();
  },
  methods: {
    loadRankList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getTaskRanks({
        taskId: this.taskId,
        p: this.page,
        offset: this.offset
      }).then(
        res => {
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
            this.rankList = this.rankList.concat(res);
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$toast("网络出错，请稍后重试");
        }
      );
    },
    classObjec(index) {
      if (index == 0) return "top1";
      else if (index == 1) return "top2";
      else if (index == 2) return "top3";
      else return "";
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadRankList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.rank-page
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0

.tips
  padding: 0.3rem
  color: #b0b0b0

.rank-list
  padding: 0 0.25rem
  background-color: #fff

  .rank-item
    display: flex
    align-items: center
    padding: 0.2rem 0

    .num
      width: 0.52rem
      height: 0.62rem

      img
        width: 100%
        height: 100%

      p
        line-height: 0.62rem
        color: #747474
        text-align: center
        font-size: 0.38rem

    .avatar-wrapper
      width: 0.9rem
      height: 0.9rem
      margin: 0 0.3rem
      background-color: #ccc
      border-radius: 50%

      img
        border-radius: 50%
        width: 100%
        height: 100%
        display: none

      .num-text
        position: relative
        bottom: 0.14rem
        color: #fff
        text-align: center
        font-size: 0.22rem
        width: 70%
        margin: auto
        border-radius: 0.06rem
        background-color: #F5605A

    .top1
      border: 2px solid #F5605A

    .top2
      border: 2px solid #FB9936

      .num-text
        background-color: #FB9936

    .top3
      border: 2px solid #EFD226

      .num-text
        background-color: #EFD226

    .rank-info
      flex: 1
      margin-right: 0.1rem

      .name
        color: #000000
        line-height: 2

      .date
        font-size: 0.26rem
        color: #747474

    .schedule
      color: #747474
</style>
