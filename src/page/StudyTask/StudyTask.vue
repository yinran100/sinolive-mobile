<template>
  <div class="task-wrapper ">
    <div class="info-wrapper">
      <div
        class="top-tips"
        @click="()=>$router.go(-1)"
      >
        <span class="back iconfont icon-left-angle"></span>返回
      </div>
      <img
        class="back-img"
        src="@/assets/images/task-bg.png"
        alt=""
      >
      <div class="user-info">
        <div class="avatar-wrapper"><img
            class="photo-img"
            :src="userMsg.avatar"
            @load="(e)=>{ e.target.style.display = 'block'}"
          ></div>
        <div class="name ellipsis">{{userMsg.nickname}}</div>
        <div class="badge-wrapper"><img
            class="badge-img"
            :src="taskTitle.img"
            @load="(e)=>{ e.target.style.display = 'block'}"
          ></div>
      </div>
    </div>
    <div class="study-count">今日学习 <span>{{ getFormatString(taskTitle.todayWatchLength)}}</span> / 累计学习 <span>{{getFormatString(taskTitle.totalWatchLength)}}</span></div>
    <div
      class="tabs"
      @click="handleClick"
    >
      <div
        class="tab-item"
        tab="TaskList"
        :class="{active:currentTab=='TaskList'}"
      ><i class="iconfont icon-shu"></i>学习任务({{taskTitle.learnTaskNum}})
      </div>
      <Divider
        type="vertical"
        orientation="left"
      />
      <div
        class="tab-item"
        tab="StudyList"
        :class="{active:currentTab=='StudyList'}"
      ><i class="iconfont icon-shipin"></i>最近学习({{taskTitle.recentlyNum}})
      </div>
    </div>
    <div class="content-wrapper">
      <keep-alive>
        <component
          :is="currentTab"
          :taskTitle="taskTitle"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getTaskTitle } from "@/api/api";
import Divider from "@/components/Divider/Divider";
import StudyList from "./components/StudyList";
import TaskList from "./components/TaskList";
export default {
  name: "StudyTask",
  components: { Divider, StudyList, TaskList },
  data() {
    return {
      taskTitle: {
        todayWatchLength: 0,
        totalWatchLength: 0,
        img: "",
        learnTaskNum: 0,
        doingNum: 0,
        finshNum: 0,
        delayNum: 0,
        recentlyNum: 0
      },
      currentTab: "TaskList"
    };
  },
  computed: {
    ...mapState(["userMsg"])
  },
  created() {
    this.initInfo();
  },
  methods: {
    initInfo() {
      getTaskTitle().then(
        res => {
          res = res.data;
          if (res.code == 1) {
            this.taskTitle = res.data;
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$toast("网络出错，请稍后重试");
        }
      );
    },
    getFormatString(num) {
      let minutes = Math.round(num / 60);
      let hour = minutes / 60;
      return hour < 1 ? minutes + "分钟" : hour.toFixed(1) + "小时";
    },
    handleClick(e) {
      if (e.target.className == "tab-item") {
        this.currentTab = e.target.attributes.tab.value;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.task-wrapper
  display: flex
  flex-direction: column
  wrapper()

  .info-wrapper
    background-color: #c5c5c5
    background-size: 100% 100%
    height: 2.76rem
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

      .back
        padding-left: 0.15rem
        font-size: 0.36rem

    .back-img
      width: 100%
      height: 100%

    .user-info
      position: absolute
      left: 0
      right: 0
      bottom: 0.3rem
      display: flex
      align-items: center

      .avatar-wrapper
        width: 1.14rem
        height: 1.14rem
        margin: 0 0.3rem
        border-radius: 50%
        background-color: #ccc

        img
          border-radius: 50%
          width: 100%
          height: 100%
          display: none

      .badge-wrapper
        width: 1.66rem
        height: 1.4rem
        margin-right: 0.4rem

      .badge-img
        width: 100%
        height: 100%
        display: none

      .name
        flex: 1
        font-size: 0.38rem
        font-weight: bold

  .study-count
    position: relative
    left: 0
    right: 0
    line-height: 2.5
    color: #898989
    background-color: #F2F2F2
    padding: 0 0.26rem

    span
      color: $themeTextColor

.tabs
  position: relative
  color: #747474
  left: 0
  right: 0
  display: flex
  align-content: center

  .tab-item
    flex: 1
    text-align: center
    line-height: 3
    word-break: keep-all

  .iconfont
    margin-right: 0.04rem

  .active
    color: $themeActiveColor

.content-wrapper
  flex: 1
  position: relative
</style>
