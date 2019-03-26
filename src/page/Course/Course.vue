<template>
  <div class="course">
    <com-header
      toLink="-1"
      titleText="课程中心"
    ></com-header>
    <van-search
      placeholder="搜索课程"
      v-model="keywords"
      show-action
      @search="onSearch"
      
    >
      <div
        slot="action"
        @click="onSearch"
      >搜索</div>
    </van-search>
    <course-kind
      ref="kind"
      v-show="kinds.length!=0"
      :kinds="kinds"
      @change="changeKind"
      @fresh="scrollFresh"
    ></course-kind>
    <course-list
      class="list"
      ref="courseList"
      :keywords="keywords"
      :typeid="typeid"
    ></course-list>
  </div>
</template>
<script>
import CourseList from "./components/CourseList";
import ComHeader from "@/components/Header/ComHeader";
import CourseKind from "./components/CourseKind";
import { getCourseType } from "@/api/api";
export default {
  name: "Trainer",
  components: {
    CourseList,
    ComHeader,
    CourseKind
  },
  data() {
    return {
      keywords: "",
      typeid: "",
      kinds: []
    };
  },
  created() {
    this.getKinds();
  },
  methods: {
    onSearch() {
      this.$refs.courseList.clearData();
      this.$refs.courseList.loadCourseList(this.$refs.kind.selectKind.join());
    },
    changeKind(val) {
      this.typeid = val.join();
    },
    scrollFresh() {
      this.$refs.courseList.refresh();
    },
    getKinds() {
      getCourseType().then(res => {
        res = res.data;
        if (res.code == 1) {
          this.kinds = res.data;
        } else {
          this.$toast(res.message);
        }
      }, this.alertError);
    }
  }
};
</script>
<style lang="stylus" scoped>
.course
  display: flex
  flex-direction: column
  position: absolute
  bottom: 0
  left: 0
  right: 0
  top: 0
  overflow: hidden

  .list
    flex: 1
    position: relative
</style>