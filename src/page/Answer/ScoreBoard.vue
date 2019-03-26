<template>
  <div class="score-wrapper">
    <div class="score-top">
      <div class="back"><span
          class="iconfont icon-left-angle"
          @click="overTest"
        ></span></div>
      <div class="score-name">{{ examInfo.Papername }}</div>
    </div>
    <div class="score-info">
      <div class="title-info">本场考试结果</div>
      <div class="score"><span class="score-num">{{ examInfo.Mark }}</span>分</div>
      <div class="detail-info">
        <span class="correct">正确 : {{ examInfo.Right }}</span>
        <span class="error">错误 : {{ examInfo.Wrong }}</span>
      </div>
    </div>
    <div
      class="test-agin"
      @click="testAgin"
    >重新考试</div>
    <div
      class="view-axam"
      @click="viewExam"
    >查看考试详情</div>
  </div>
</template>
<script>
export default {
  props: {
    examInfo: { type: Object }
  },
  methods: {
    overTest() {
      this.$router.go(-1);
    },
    testAgin() {
      this.$emit("retryExam");
    },
    viewExam() {
      this.$emit("viewExam");
    }
  }
};
</script>
<style lang='stylus' scoped>
.score-wrapper
  background-color: #f7f7f7
  display: flex
  align-items: center
  flex-direction: column

  .score-top
    position: relative
    width: 100%
    height: 3rem
    color: #fff
    background: url('../../assets/images/scoreMainBg.png') no-repeat center center
    background-size: cover

    .back
      height: 0.75rem

      .iconfont
        line-height: 0.85rem
        padding: 0 0.2rem
        font-size: 0.46rem

    .score-name
      font-size: 0.36rem
      text-align: center
      margin: 0 0.5rem

  .score-info
    position: relative
    background: #fff
    width: 80%
    box-shadow: 0 0 0.1rem #444
    border-radius: 0.08rem
    text-align: center
    margin-top: -1.1rem

    .title-info
      line-height: 2
      margin: 0 1.6rem
      position: relative
      padding: 0 0.1rem
      top: -0.24rem
      border: 1px solid #e5415b
      font-size: 0.34rem
      font-weight: bold
      text-align: center
      color: #e5415b
      background: #fff
      border-radius: 0.5rem

    .score
      width: 3.2rem
      height: 1.3rem
      margin: 0 auto
      text-align: center
      line-height: 1.3rem
      font-size: 0.38rem
      font-weight: bold
      background: url('../../assets/images/scoreBg.png') no-repeat center center
      background-size: cover
      color: #f74040

      .score-num
        color: #f74040
        font-size: 0.6rem
        padding-right: 0.1rem
        vertical-align: middle

    .detail-info
      font-size: 0.3rem
      line-height: 0.6rem

    .correct
      margin-right: 0.2rem

  .view-axam, .test-agin
    position: absolute
    bottom: 1rem
    width: 60%
    max-width: 6rem
    line-height: 2.5
    background: #fff
    font-size: 0.32rem
    text-align: center
    color: #3d9ffa
    border-radius: 0.5rem
    border: 1px solid #3d9ffa

  .test-agin
    bottom: 2.3rem
    border: 1px solid #08ae55
    background: #08ae55
    color: #fff
</style>


