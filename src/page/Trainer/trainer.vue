<template>
    <div
        class="list-wrapper"
        :class="{nobottom:toLink}"
    >
        <com-header
            :toLink="toLink"
            titleText="培训师中心"
        ></com-header>
        <van-search
            placeholder="搜索培训师"
            v-model="keywords"
            show-action
            @search="onSearch"
            
        >
            <div
                slot="action"
                @click="onSearch"
            >搜索</div>
        </van-search>
        <trainer-list
            class="list"
            ref="list"
            :keywords="keywords"
        ></trainer-list>
    </div>
</template>
<script>
import TrainerList from "./components/TrainerList";
import ComHeader from "@/components/Header/ComHeader";
export default {
  name: "Trainer",
  components: {
    TrainerList,
    ComHeader
  },
  data() {
    return {
      keywords: "",
      toLink: this.$route.path == "/trainer" ? "-1" : ""
    };
  },
  methods: {
    onSearch() {
      this.$refs.list.clearData();
      this.$refs.list.loadTrainerList();
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
