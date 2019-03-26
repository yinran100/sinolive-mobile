<template>
  <div class="exam-wrapper">
    <index-title
      title="我的考试"
      toLink="/exam"
    ></index-title>
    <ul
      class="exam-list"
      v-if="examdata.length!=0"
    >
      <li
        class="exam-item"
        v-for="item in examdatas"
        :class="{emptyli:item.empty}"
        @click="viewExamDetail(item.mark,item.Id)"
        :key="item.Id"
      >
        <div class="exam-left  ellipsis">
          <div class="paperName ellipsis">{{ item.Papername }}</div>
          <div
            class="passCard"
            v-if="item.Mark >= '60'"
          >通过</div>
          <div
            class="nopassCard"
            v-else-if="item.Mark>=0&&item.Mark< '60'"
          >不通过</div>
        </div>
        <div class="exam-center">
          <span
            :class="{'pass':!item.empty&& item.Mark.toString() == '100'}"
            v-show="item.Mark > '-1'"
          >{{ item.Mark }}分</span>
        </div>
        <div class="exam-right">
          <router-link
            tags="div"
            class="jionTest"
            v-if="!item.empty&&item.Mark=='-1'"
            :to="'/answer/'+item.Id"
          >立即参与</router-link>
          <div v-else-if="item.Created">{{ item.Created*1000|moment }}</div>
        </div>
      </li>
    </ul>
    <none-tip
      class="notest"
      v-else
      msg="暂无考试"
    ></none-tip>
  </div>
</template>
<script>
import IndexTitle from "./IndexTitle";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "IndexExam",
  components: {
    IndexTitle,
    NoneTip
  },
  props: {
    examdata: {
      type: Array,
      default: []
    }
  },
  computed: {
    examdatas() {
      var arr = [];
      for (let i = 0; i < 3; i++) {
        if (this.examdata[i]) arr.push(this.examdata[i]);
        else arr.push({ Papername: "", testScore: 0, empty: true });
      }
      return arr;
    }
  },
  methods: {
    viewExamDetail(mark, examId) {
      if (mark != "-1") {
        this.$router.push(`/answer/${examId}`);
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.exam-wrapper>>>.notest
  top: 0

.exam-list
  display: flex
  flex-direction: column

  .exam-item
    min-height: 0.62rem
    padding: 0.15rem 0.1rem
    display: flex
    align-items: center
    font-size: 0.28rem
    color: #444
    line-height: 0.32rem

    .exam-left
      flex: 1
      display: flex

      .paperName
        margin-right: 0.1rem

      .passCard, .nopassCard
        display: inline-block
        word-break: keep-all
        background: #fc526d
        color: #fff
        font-size: 0.18rem
        padding: 0 0.07rem
        border-radius: 0.05rem
        margin-top: 0.04rem
        height: 0.24rem
        line-height: 0.29rem

      .nopassCard
        transform: rotate(-6deg)
        background: #3977e9

    .exam-center
      float: right
      margin: 0 0.1rem

      .pass
        color: #eb3841

    .exam-right
      margin-left: 0.3rem
      float: right

      .jionTest
        display: block
        font-size: 0.22rem
        background: #4c87f4
        text-align: center
        line-height: 0.32rem
        padding: 0.04rem 0.1rem
        color: #fff
        border-radius: 0.16rem

  .exam-item:nth-last-child(n+2):not(.emptyli)
    border-bottom: 1px dashed #c2c2c2
</style>
