<template>
  <div class="myExam-wrapper">
    <com-header
      toLink="-1"
      titleText="我的考试"
    ></com-header>
    <van-search
      placeholder="搜索考试"
      v-model="keywords"
      show-action
      @search="onSearch"
    >
      <div
        slot="action"
        @click="onSearch"
      >搜索</div>
    </van-search>
    <my-exam-list
      class="list"
      ref="examList"
      :keywords="keywords"
    ></my-exam-list>
  </div>
</template>
<script>
import Answer from "../Answer/Answer.vue";
import ComHeader from "@/components/Header/ComHeader";
import MyExamList from "./components/MyExamList";
export default {
  components: {
    Answer,
    ComHeader,
    MyExamList
  },
  data() {
    return {
      keywords: ""
    };
  },
  methods: {
    onSearch() {
      this.$refs.examList.clearData();
      this.$refs.examList.loadExamList();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.myExam-wrapper
  display: flex
  flex-direction: column
  wrapper()
  overflow: hidden

  .list
    flex: 1
    position: relative
</style>

