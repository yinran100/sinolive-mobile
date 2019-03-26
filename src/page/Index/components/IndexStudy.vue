<template>
  <div class="study-wrapper">
    <index-title
      title="最近学习"
      toLink="/myStudy"
    ></index-title>
    <router-link
      tag="div"
      class="study-list"
      v-for="item in viewdata"
      :key="item.Id"
      :to="'/liveRoom/' + item.Id"
    >
      <div class="study-cover">
        <img
          class="cover-img"
          :src="item.Headpic"
          @load="(e)=>{ e.target.style.display = 'block'}"
          alt=""
        >
      </div>
      <div class="study-info  ellipsis">
        <p class="study-name ellipsis">{{ item.Name }}</p>
        <div class="study-cont ellipsis">{{ item.Subtitle }}</div>
        <div class="study-tv clearfix">
          <span class="study-time">{{ item.Begindate*1000|moment }}</span>
          <span class="study-view">
            <i class="iconfont icon-yanjing"></i>{{ item.Views }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
import IndexTitle from "./IndexTitle";
export default {
  name: "IndexStudy",
  components: {
    IndexTitle
  },
  props: {
    viewdata: {
      type: Array,
      default: []
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.study-wrapper>>>.icon-yanjing
  font-size: 0.24rem
  padding-right: 0.08rem

.study-list
  display: flex
  padding-bottom: 0.25rem

  .study-cover
    margin-right: 0.18rem
    background-color: #dfdfdf
    preview()

    .cover-img
      height: 100%
      width: 100%
      display: none

  .study-info
    flex: 1
    vertical-align: top
    margin-left: 0.1rem

    .study-name
      margin-top: 0.2rem
      font-size: 0.32rem

    .study-cont
      color: #a5a5a5
      font-size: 0.28rem
      line-height: 1.2
      margin-top: 0.2rem

    .study-tv
      padding-top: 0.25rem
      font-size: 0.26rem
      color: #a5a5a5

      .study-time
        float: left

      .study-view
        float: right
        margin-right: 0.1rem
</style>
