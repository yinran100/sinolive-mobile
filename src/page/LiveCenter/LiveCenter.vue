<template>
    <div
        class="list-wrapper"
        :class="{nobottom:toLink}"
    >
        <com-header
            :toLink="toLink"
            titleText="直播中心"
        ></com-header>
        <van-search
            placeholder="搜索直播"
            v-model="keywords"
            show-action
            @search="onSearch"
        >
            <div
                slot="action"
                @click="onSearch"
            >搜索</div>
        </van-search>
        <live-list
            class="list"
            ref="liveList"
            :keywords="keywords"
        ></live-list>
    </div>
</template>
<script>
import ComHeader from "@/components/Header/ComHeader";
import LiveList from "./components/LiveList";
export default {
  components: {
    ComHeader,
    LiveList
  },
  data() {
    return {
      keywords: "",
      toLink: this.$route.path == "/liveCenter" ? "-1" : ""
    };
  },
  methods: {
    onSearch() {
      this.$refs.liveList.clearData();
      this.$refs.liveList.loadLiveList();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.list-wrapper
    display: flex
    flex-direction: column
    position: absolute
    bottom: $bottomHeight
    left: 0
    right: 0
    top: 0
    overflow: hidden

    .list
        flex: 1
        position: relative

.nobottom
    bottom: 0
</style>

