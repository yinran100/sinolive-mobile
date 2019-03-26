<template>
  <div>
    <scroll
      class="exam-wrapper"
      :data="examList"
      :pullup="pullup"
      :pullupMsg="pullupMsg"
      @pullup="pullupEvent"
    >
      <ul class="exam-list">
        <li
          class="exam-item"
          v-for="item in examList"
          :key="item.examId"
          @click="viewExamDetail(item.mark,item.examId)"
        >
          <div class="icon-wrapper">
            <img
              class="icon-img"
              src="../../../assets/images/testIcon.png"
              alt=""
            >
          </div>
          <div class="exam-info ellipsis">
            <div class="name ellipsis">{{item.paperName}}</div>
            <div class="date">{{ item.endTime*1000|moment }}更新</div>
          </div>
          <div
            class="score"
            :class="{'pass':item.mark == '100'}"
            v-show="item.mark > -1"
          >
            {{ item.mark }}分
          </div>
          <div class="item-left">
            <router-link
              tags="div"
              class="jionTest"
              v-if="item.mark == '-1'"
              :to="`/answer/${item.examId}`"
            >立即参与</router-link>
            <div
              class="card"
              v-else-if="item.sign"
            >
              <img
                class="passOrFile"
                src="../../../assets/images/passIcon.png"
                alt="通过"
              >
            </div>
            <div
              class="card"
              v-else
            >
              <img
                class="passOrFile"
                src="../../../assets/images/failIcon.png"
                alt="不通过"
              >
            </div>
          </div>
        </li>
      </ul>
    </scroll>
    <none-tip
      :msg="msg"
      v-show="examList.length==0"
    ></none-tip>
  </div>
</template>
<script>
import Scroll from "@/components/Scroll/Scroll";
import { getMyExam } from "@/api/api";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "MyExamList",
  components: {
    Scroll,
    NoneTip
  },
  props: {
    keywords: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      examList: []
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多考试";
    },
    msg() {
      if (this.noMoreData)
        return this.keywords != ""
          ? `搜索不到"${this.keywords}"相关的考试`
          : "暂时没有考试";
      else return "加载中...";
    }
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.examList = [];
    },
    viewExamDetail(mark, examId) {
      if (mark != "-1") {
        this.$router.push(`/answer/${examId}`);
      }
    },
    loadExamList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getMyExam({
        keywords: this.keywords,
        p: this.page,
        offset: this.offset
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
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
        res.map(
          ({ Id, Papername, testScore, Mark, influence, Enddate, sign }) => {
            this.examList.push({
              examId: Id,
              paperName: Papername,
              testScore,
              mark: Mark,
              endTime: Enddate,
              sign: sign == 1
            });
          }
        );
      } else {
        this.$toast(res.message);
      }
    },
    alertError() {
      this.$toast.clear();
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadExamList();
    }
  },
  created() {
    this.loadExamList();
  }
};
</script>
<style lang="stylus" scoped>
.exam-wrapper
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  background-color: #f2f2f2

  .exam-list
    padding: 0 0.25rem
    background-color: #fff

    .exam-item
      display: flex
      align-items: center
      padding: 0.2rem 0

      &:nth-last-child(n+2)
        border-bottom: 1px #eee solid

      .icon-wrapper
        width: 0.72rem
        height: 0.72rem
        margin-right: 0.16rem

        .icon-img
          height: 100%
          width: 100%

    .exam-info
      flex: 1
      display: flex
      flex-direction: column

      .name
        font-size: 0.34rem

      .date
        color: #a0a0a0
        font-size: 0.27rem
        margin-top: 0.1rem

    .score
      margin: 0 0.1rem

    .pass
      color: #eb3841

    .item-left
      float: right
      margin-left: 0.2rem

      .jionTest
        display: block
        font-size: 0.24rem
        background: #4c87f4
        text-align: center
        line-height: 0.32rem
        padding: 0.06rem 0.12rem
        color: #fff
        border-radius: 0.16rem

      &:active
        background: #3075dc

      .card
        width: 1rem
        height: 0.7rem

        img
          width: 100%
          height: 100%
          color: #a0a0a0
          font-size: 0.28rem
</style>
