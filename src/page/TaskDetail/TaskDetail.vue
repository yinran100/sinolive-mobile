<template>
  <div class="detail-page">
    <com-header
      toLink="-1"
      titleText="任务详情"
    ></com-header>
    <div class="task-info">
      <div class="cover-wrapper"><img
          :src="taskDetail.backgroundImg"
          alt=""
          @load="(e)=>{ e.target.style.display = 'block'}"
        ></div>
      <div class="task-right">
        <div class="date"><i class="iconfont icon-rili"></i>{{taskDetail.endTime*1000|moment}}前完成</div>
        <div class="tips-wrapper">
          <span
            class="tips"
            :class="{tipsOver:taskDetail.desc.trim().length>20}"
          >{{taskDetail.desc}}</span>
        </div>
        <div class="clearfix">
          <div class="voteNum"><i class="iconfont icon-zan"></i>{{ taskDetail.voteNum }}</div>
          <div class="watch"><i class="iconfont icon-haoyou"></i>{{taskDetail.viewNum}}人学过</div>
        </div>
      </div>
    </div>
    <div class="progress">
      <div class="progress-text">{{status[taskDetail.taskStatus]}}</div>
      <van-progress
        color="linear-gradient(90deg, #FF2285, #FA4E1F)"
        :percentage="taskDetail.schedule"
        pivot-color="#FA4E1F"
      />
    </div>
    <div
      class="recent-study"
      v-show="Object.keys(recentcontent).length!=0"
    >
      <div class="ellipsis">上次学习：{{recentcontent.name}}</div>
      <van-button
        round
        plain
        size="small"
        type="primary"
        @click="()=>$router.push(`${gotoRouter[taskDetail.taskType- 1]}${recentcontent.id}`)"
      >继续</van-button>
    </div>
    <div class="rank-header"><img
        src="@/assets/images/rank-header.png"
        alt=""
      ></div>
    <task-rank
      class="rank-wrapper"
      :taskId="taskId"
    ></task-rank>
  </div>
</template>

<script>
import ComHeader from "@/components/Header/ComHeader";
import TaskRank from "./components/TaskRank";
import { getTaskDetail } from "@/api/api";
export default {
  name: "TaskDetail",
  components: {
    ComHeader,
    TaskRank
  },
  data() {
    return {
      taskId: this.$route.params.id,
      taskDetail: {
        title: "",
        desc: "",
        backgroundImg: "",
        endTime: 0,
        taskType: 1,
        taskStatus: 0,
        schedule: 0,
        viewNum: 0,
        voteNum: 0,
        recentlyWatch: {
          recentlyWatchVideo: {},
          recentlyWatchLive: {},
          recentlyWatchNews: {},
          recentlyWatchExam: {}
        }
      },
      gotoRouter: ["/liveRoom/", "/liveRoom/", "/newsContent/", "/answer/"],
      recentname: [
        "recentlyWatchVideo",
        "recentlyWatchLive",
        "recentlyWatchNews",
        "recentlyWatchExam"
      ],
      status: ["未开始", "进行中", "已完成"]
    };
  },
  computed: {
    recentcontent() {
      return (
        this.taskDetail.recentlyWatch[
          this.recentname[this.taskDetail.taskType - 1]
        ] || {}
      );
    }
  },
  created() {
    this.initDetail();
  },
  methods: {
    initDetail() {
      getTaskDetail({ taskId: this.$route.params.id }).then(
        res => {
          res = res.data;
          if (res.code == 1) {
            this.taskDetail = res.data;
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$dialog.alert("网络出错，请稍后重试");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.recent-study>>>.van-button--small
  font-size: 14px

.recent-study>>>.van-button--plain.van-button--primary
  color: #3E7FF5
  border: 1px solid #3E7FF5

.task-info>>>.iconfont
  margin-right: 0.06rem

.progress>>>.van-progress__pivot
  padding-top: 0.03rem

.detail-page
  display: flex
  flex-direction: column
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  overflow: hidden
  background-color: #f2f2f2

.task-info
  padding-top: 0.4rem
  display: flex
  align-items: center
  background-color: #fff

  .cover-wrapper
    width: 3.44rem
    height: 1.92rem
    margin-left: 0.3rem
    background-color: #dfdfdf

    img
      display: none
      height: 100%
      width: 100%

  .task-right
    flex: 1
    margin: 0 0.2rem

    .date
      font-size: 0.28rem
      color: #747474

    .tips-wrapper
      padding-top: 0.14rem
      color: #000
      white-space: initial
      overflow: hidden
      position: relative
      line-height: 0.4rem
      height: 0.8rem

    .tipsOver:after
      background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%)
      repeat: scroll 0 0 rgba(0, 0, 0, 0)
      bottom: 0
      content: '...'
      padding: 0 0.05rem 0 0.2rem
      position: absolute
      right: 0

    .voteNum
      margin-top: 0.2rem
      float: left
      color: #FA4E1F
      font-size: 0.28rem

    .watch
      margin-top: 0.2rem
      float: right
      font-size: 0.28rem
      color: #929292

.progress
  padding: 0.4rem
  display: flex
  align-items: center
  background-color: #fff
  border-bottom: 1px #eee solid

  .progress-text
    color: #FA4E1F
    font-size: 0.3rem
    margin-right: 0.2rem

  .van-progress
    flex: 1

.recent-study
  padding: 0.2rem 0.3rem
  display: flex
  background-color: #fff
  align-items: center

  .ellipsis
    flex: 1
    font-size: 0.3rem
    color: #000
    margin-right: 0.2rem

.rank-header
  margin-top: 0.15rem
  background-color: #fff

  img
    display: block
    margin: 0.3rem auto 0.2rem
    width: 3.1rem
    height: 0.7rem

.rank-wrapper
  flex: 1
  position: relative
</style>
