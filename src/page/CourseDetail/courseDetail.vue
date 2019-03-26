<template>
  <div class="course-wrapper">
    <div class="info-wrapper">
      <div
        class="top-tips"
        @click="()=>{this.$router.go(-1)}"
      >
        <span class="back iconfont icon-left-angle"></span>返回
      </div>
      <img
        class="course-img"
        :src="courseImg"
        alt=""
        @load="(e)=>{ e.target.style.display = 'block'}"
      >
      <div class="course-info">
        <div class="name ellipsis">{{title}}</div>
        <div class="data">
          <span
            class="voteNum"
            v-show="voteNum!=0"
          ><i class=" iconfont icon-zan"></i>{{voteNum}}</span>
          <span class="watch"><i class="iconfont icon-yanjing"></i> {{watch}}</span>
        </div>
      </div>
    </div>
    <van-tabs
      v-model="active"
      color="#6279f7"
      swipeable
      animated
    >
      <van-tab title="详情"></van-tab>
      <van-tab title="课件列表"></van-tab>
    </van-tabs>
    <div class="content-wrapper">
      <keep-alive>
        <component
          :is="tabComponents[active]"
          :introduce="desc"
          :courseId="courseId"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Intro from "../TrainerDetail/components/Intro";
import CoursewareList from "../TrainerDetail/components/CoursewareList";
import { getCourseDetail } from "@/api/api";
export default {
  name: "CourseDetail",
  components: {
    Intro,
    CoursewareList
  },
  data() {
    return {
      courseId: this.$route.params.id,
      tabComponents: ["Intro", "CoursewareList"],
      active: 0,
      courseImg: "",
      title: "",
      voteNum: 0,
      watch: 0,
      desc: ""
    };
  },
  methods: {
    getCourseDetail() {
      this.$toast({
        type: "loading",
        message: "加载中..."
      });
      getCourseDetail({
        liveid: "",
        courseid: this.$route.params.id
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
      this.$toast.clear();
      res = res.data;
      if (res.code == 1) {
        res = res.data[0];
        this.courseId = res.courseId;
        this.title = res.title;
        this.courseImg = res.img;
        this.voteNum = res.voteNum;
        this.desc = res.desc;
      } else {
        if (res.message)
          this.$dialog
            .alert({
              message: res.message
            })
            .then(() => {
              this.$router.go(-1);
            });
        console.log(res.message);
      }
    },
    alertError() {
      console.log(res);
      this.$dialog
        .alert({
          message: "网络出错,请稍后重试"
        })
        .then(() => {
          this.$router.push("/home/index");
        });
      this.$toast.clear();
    }
  },
  created() {
    this.getCourseDetail();
  }
};
</script>
<style lang="stylus" scoped>
.course-wrapper>>>.icon-left-angle
  font-size: 0.4rem

.data>>>.iconfont
  font-size: 0.3rem
  padding-right: 0.05rem

.course-wrapper
  display: flex
  flex-direction: column
  position: absolute
  bottom: 0
  left: 0
  right: 0
  top: 0

  .info-wrapper
    background-color: #c5c5c5
    background-size: 100% 100%
    height: 4.44rem
    position: relative
    color: #fff

    .top-tips
      position: absolute
      display: flex
      left: 0
      right: 0
      top: 0
      line-height: 0.8rem
      font-size: 0.34rem
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0)
      )

      .back
        padding-left: 0.1rem
        font-size: 0.36rem

    .course-img
      width: 100%
      height: 100%
      display: none

    .course-info
      position: absolute
      display: flex
      left: 0
      right: 0
      bottom: 0
      padding: 0 0.25rem
      line-height: 0.8rem
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.5)
      )

      .name
        font-size: 0.36rem
        flex: 1

      .data
        float: right
        font-size: 0.32rem

        .voteNum
          margin-right: 0.1rem
          color: #f16f32

  .content-wrapper
    flex: 1
    position: relative
</style>
