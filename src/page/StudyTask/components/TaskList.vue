<template>
  <div class="taskpage">
    <van-tabs
      v-model="status"
      color="#3E7FF5"
      animated
      @change="changeTab"
    >
      <van-tab :title="`进行中(${taskTitle.doingNum})`"></van-tab>
      <van-tab :title="`已完成(${taskTitle.finshNum})`"></van-tab>
      <van-tab :title="`逾期(${taskTitle.delayNum})`"></van-tab>
    </van-tabs>
    <scroll
      class="task-wrapper"
      :data="taskList"
      :pullup="pullup"
      :pullupMsg="pullupMsg"
      @pullup="pullupEvent"
    >
      <ul class="task-list">
        <li
          class="task-item"
          v-for="item in taskList"
          :key="item.id"
        >
          <div class="icon-wrapper"><img
              :src="iconUrl[item.taskType-1]"
              alt=""
            ></div>
          <div class="task-content ellipsis">
            <div class="date"><i class="iconfont icon-rili"></i>{{item.endTime*1000|moment}}</div>
            <div class="title ellipsis">{{item.title}}</div>
            <div class="bottom">
              <div class="schedule">完成{{item.schedule}}%</div>
              <p class="type">
                <i :class="className[item.taskType-1]"></i>
                {{text[item.taskType-1]}}
              </p>
              <van-button
                round
                plain
                size="mini"
                type="primary"
                @click="()=>$router.push(`/taskdetail/${item.id}`)"
              >详情</van-button>
            </div>
          </div>
        </li>
      </ul>
      <p
        class="tips"
        v-show="taskList.length==0"
      >暂时没有任务</p>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll/Scroll";
import { getStudyTask } from "@/api/api";
export default {
  name: "TaskList",
  components: {
    Scroll
  },
  props: {
    taskTitle: Object
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      taskList: [],
      status: 0,
      iconUrl: [
        require("@/assets/images/video.png"),
        require("@/assets/images/course.png"),
        require("@/assets/images/article.png"),
        require("@/assets/images/exam.png")
      ],
      text: ["视频", "课程", "文章", "考试"],
      className: [
        "iconfont icon-bofang1",
        "iconfont icon-kecheng",
        "iconfont icon-wenzhang",
        "iconfont icon-border_color"
      ]
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多任务信息";
    }
  },
  created() {
    this.loadTaskList();
  },
  methods: {
    loadTaskList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getStudyTask({
        status: this.status + 1,
        page: this.page,
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
            this.taskList = this.taskList.concat(res);
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$toast("网络出错，请稍后重试");
        }
      );
    },
    changeTab() {
      this.noMoreData = false;
      this.page = 1;
      this.taskList = [];
      this.loadTaskList();
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadTaskList();
    }
  }
};
</script>

<style lang="stylus" scoped>
.van-tabs>>>
  .van-tab
    color: #747474

.task-content>>>.van-button--mini
  font-size: 12px

.task-content>>>.van-button--plain.van-button--primary
  color: #747474
  border: 1px solid #747474

.taskpage
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  display: flex
  flex-direction: column
  background-color: #f2f2f2

.task-wrapper
  flex: 1
  position: absolute
  // tab的高度为top值
  top: 44px
  left: 0
  right: 0
  bottom: 0

.tips
  padding: 0.3rem
  color: #b0b0b0

.task-list
  padding: 0 0.25rem
  background-color: #fff

  .task-item
    display: flex
    padding: 0.2rem 0

    &:nth-last-child(n+2)
      border-bottom: 1px #eee solid

  .icon-wrapper
    width: 0.84rem
    height: 0.84rem
    margin-right: 0.18rem

    img
      height: 100%
      width: 100%

  .task-content
    flex: 1

    .date
      font-size: 0.26rem
      margin-top: 0.04rem
      color: #747474

      .iconfont
        margin-right: 0.06rem

    .title
      line-height: 2
      font-size: 0.3rem
      color: #0F0F0F

    .bottom
      display: flex
      align-items: center

      .schedule
        flex: 1
        color: #3E7FF5
        font-size: 0.3rem

      .type
        font-size: 0.26rem
        color: #999999

      .van-button
        margin: 0 0.2rem
</style>
