<template>
  <div class="recommend-wrapper">
    <index-title
      title="热门推荐"
      toLink="/liveCenter"
    ></index-title>
    <div class="clearfix">
      <router-link
        tag="div"
        class="recommend-item"
        v-for="(item,index) in hotdata"
        :key="item.Id"
        :to="'/liveRoom/' + item.Id"
      >
        <div class="recommend-cover">
          <img
            class="cover-img"
            :src="item.Headpic"
            @load="(e)=>{ e.target.style.display = 'block'}"
            alt=""
          >
          <div class="hotViewNum">
            <i class="iconfont icon-yanjing"> {{ item.Views }}</i>
          </div>
          <div
            class="state-tag"
            :style="{backgroundColor:stateTags[index].color}"
            v-show="stateTags[index]"
          >{{stateTags[index].text}}</div>
        </div>
        <div class="recommend-info ellipsis">
          <p class="recommend-name ellipsis">{{ item.Name }}</p>
          <p class="recommend-cont ellipsis">{{ item.Subtitle }}</p>
          <p class="recommend-time ellipsis">{{ item.Begindate*1000|moment }}</p>
        </div>
      </router-link>
    </div>

  </div>
</template>
<script>
import IndexTitle from "./IndexTitle";
export default {
  name: "IndexRecommend",
  components: {
    IndexTitle
  },
  props: {
    hotdata: {
      type: Array,
      default: []
    }
  },
  computed: {
    stateTags() {
      return this.hotdata.map(item => {
        if (item.Livestate == 0) return { text: "未开始", color: "#6175F7" };
        else if (item.Livestate == 1)
          return { text: "直播中", color: "#F24B43" };
        else if (item.Livestate == 2)
          return { text: "答题中", color: "#449d44" };
        else if (item.Livestate == 3)
          return { text: "已结束", color: "#676767" };
        else return false;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.recommend-wrapper>>>.icon-yanjing
  font-size: 0.24rem

.recommend-item
  display: flex
  float: left
  flex-direction: column
  align-items: left
  padding-bottom: 0.15rem
  width: 50%

.recommend-cover
  width: 95%
  max-width: 3.38rem
  height: 1.92rem
  position: relative
  margin: 0 auto
  background-color: #dfdfdf

  .cover-img
    height: 100%
    width: 100%
    display: none

  .state-tag
    font-size: 0.2rem
    color: #fff
    border-radius: 0.03rem
    position: absolute
    top: 0.1rem
    left: 0.1rem
    padding: 0.04rem 0.03rem 0rem

  .hotViewNum
    position: absolute
    left: 0
    bottom: 0
    right: 0

    .iconfont
      float: right
      padding-right: 0.05rem
      padding-bottom: 0.05rem
      color: #fff

.recommend-info
  margin: 0.1rem auto 0
  width: 95%
  max-width: 3.5rem

  .recommend-name
    line-height: 0.46rem
    font-size: 0.32rem

  .recommend-cont
    color: #999999
    line-height: 0.38rem
    font-size: 0.28rem

  .recommend-time
    font-size: 0.24rem
    line-height: 0.38rem
    color: #A0A0A0
</style>
