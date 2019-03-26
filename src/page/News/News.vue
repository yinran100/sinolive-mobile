<template>

  <div
    class="list-wrapper"
    :class="{nobottom:this.$route.path == '/newslist'}"
  >
    <div
      class="tabs-wrapper"
      ref="tabsUl"
    >
      <ul class="tabs-ul">
        <li
          class="tab"
          @click="tabClick('')"
          :class="{activeTab:sortId==''}"
        >全部</li>
        <li
          class="tab"
          v-for="item in sortList"
          :key="item.sortId"
          @click="tabClick(item.sortId)"
          :class="{activeTab:sortId==item.sortId}"
        >{{item.sortName}}</li>
      </ul>
    </div>
    <news-list
      class="list"
      ref="list"
      :sortId="sortId"
    ></news-list>
  </div>

</template>
<script>
import NewsList from "./components/NewsList";
import { getNoticeSort } from "@/api/api";
import { mapState } from "vuex";
import BScroll from "better-scroll";
export default {
  name: "News",
  data() {
    return {
      sortList: [],
      scroll: null
    };
  },
  computed: {
    ...mapState(["sortId"])
  },
  components: {
    NewsList
  },
  methods: {
    tabClick(id) {
      this.$store.commit("saveSortId", id);
      setTimeout(() => {
        this.$refs.list.clearData();
        this.$refs.list.loadNewsData();
      }, 200);
    }
  },
  created() {
    if (this.$route.path == "/home/newslist")
      this.$store.commit("setDemoUser", 1);
    getNoticeSort().then(
      res => {
        res = res.data;
        if (res.code == 1 && res.noticeSorts) this.sortList = res.noticeSorts;
      },
      () => {
        console.log("error");
      }
    );
  },
  mounted() {
    this.$nextTick(() => {
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.tabsUl, {
        click: true,
        scrollX: true,
        bounce: false
      });
      this.scroll.scrollToElement(document.querySelector(".activeTab"), 0); //滑到当前分类下
    });
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.list-wrapper
  display: flex
  flex-direction: column
  wrapper()
  bottom: $bottomHeight
  overflow: hidden

  .tabs-wrapper
    position: relative
    width: 100%
    top: 0
    color: #f5f5f5
    height: $headerHeight
    line-height: $headerHeight
    background: $headerBackColor

    .tabs-ul
      white-space: nowrap
      position: absolute

      .tab
        margin: 0 0.1rem
        display: inline-block

      .activeTab
        color: #fff
        text-shadow: 0 0 2px #fff
        background: radial-gradient(60% 25%, rgba(256, 256, 256, 0.4) 20%, rgba(0, 0, 0, 0) 80%)

  .list
    flex: 1
    position: relative

.nobottom
  bottom: 0
</style>
