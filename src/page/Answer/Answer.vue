<template>
  <div class="answer">
    <div class="header-cont">
      <div
        class="close iconfont icon-guanbi"
        @click="exit"
      ></div>
      <p class="test-name">{{paperName}}</p>
      <div
        class="test-time"
        v-show="!viewModel"
      >
        <van-circle
          v-model="currentRate"
          :speed="100"
          :text="timeStr"
          layer-color="#e6e6e6"
        />
      </div>
    </div>
    <div class="main-cont">
      <p class="test-num">{{numStr}}</p>
      <p class="question">{{ questionObject.Questionname }}<span
          class="question-type"
          v-show="questionObject.Questiontype==2"
        >【多选】</span></p>
      <transition
        :name="transitionName"
        v-on:after-leave="afterLeave"
      >
        <ul
          class="answer-list"
          v-show="animateTime"
        >
          <li
            class="answer-item"
            v-for="item in questionObject.Option"
            :key="item.Value"
            @click="select(item.Value)"
            :class="{currentli:answer.indexOf(item.Value)>=0,select:viewModel}"
          >
            <i
              class="iconfont icon-duihao"
              v-show="(!viewModel&&answer.indexOf(item.Value)>=0)||(viewModel&&questionObject.Questionanswer.indexOf(item.Value)>=0)"
            ></i>{{item.Value}}.{{item.Name}}</li>
        </ul>
      </transition>
      <div class="btn-wrapper">
        <div
          class="previous"
          v-show="viewModel"
          :class="{disable:viewModel&&examQuestionIndex==0}"
          @click="previous"
        >
          <i class="iconfont icon-left-angle"></i>上一题
        </div>
        <div
          :class="{disable:(!viewModel&&answer=='')||(viewModel&&examQuestionIndex==examQuestion.length-1),next:viewModel}"
          @click="next"
        >{{textmsg}}
          <i class="iconfont icon-right-angle"></i>
        </div>
      </div>

    </div>
    <score-board
      class="score-board"
      :examInfo="examInfo"
      v-show="isOver"
      @retryExam="retryExam"
      @viewExam="viewExamDetail"
    ></score-board>
  </div>
</template>
<script>
import { joinExam, repareExam, viewExam } from "@/api/api";
import ScoreBoard from "./ScoreBoard.vue";
export default {
  components: { ScoreBoard },
  data() {
    return {
      examid: this.$route.params.id,
      answer: "",
      paperName: "",
      questionObject: {},
      animateTime: true,
      isOver: false,
      countdown: 360,
      examtime: 360,
      examInfo: {},
      counts: null,
      anniTimeout: null,
      examQuestion: [], //试卷详情
      testPaper: {},
      viewModel: false,
      examQuestionIndex: 0,
      transitionName: "next"
    };
  },
  computed: {
    numStr() {
      if (this.viewModel)
        return this.examQuestionIndex + 1 + "/" + this.examQuestion.length;
      return this.questionObject.Answernum
        ? this.questionObject.Answernum + "/" + this.questionObject.Nums
        : "0/0";
    },
    timeStr() {
      let hour = Math.floor(this.countdown / 3600);
      let lasttime = parseInt(this.countdown % 3600);
      let minutes = Math.floor(lasttime / 60);
      let seconds = parseInt(lasttime % 60);
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      if (hour > 0) return hour + ":" + minutes + ":" + seconds;
      else return minutes + ":" + seconds;
    },
    currentRate: {
      get() {
        return (this.countdown / this.examtime).toFixed(4) * 100;
      },
      set() {}
    },
    textmsg() {
      if (this.viewModel) return "下一题";
      else
        return this.questionObject.Answernum >= this.questionObject.Nums
          ? "完成答题"
          : "下一题";
    }
  },
  created() {
    this.getQuestion();
  },
  methods: {
    afterLeave() {
      if (this.anniTimeout) clearTimeout(this.anniTimeout);
      this.anniTimeout = setTimeout(() => {
        this.animateTime = true;
      }, 20);
    },
    retryExam() {
      repareExam({
        examid: this.examid
      }).then(res => {
        res = res.data;
        if (res.code == 1) {
          this.isOver = false;
          this.answer = "";
          this.questionObject = {};
          this.examQuestion = {};
          this.examQuestionIndex = 0;
          this.getQuestion();
        } else {
          if (res.message) this.$toast(res.message);
        }
      });
    },
    viewExamDetail() {
      //查看试卷
      viewExam({
        examid: this.examid
      }).then(res => {
        res = res.data;
        if (res.code == 1) {
          this.examQuestion = res.examQuestion;
          this.viewModel = true;
          this.isOver = false;
          this.testPaper = res.testPaper;
          this.questionObject = this.examQuestion[this.examQuestionIndex];
          this.answer = this.questionObject.Answer;
        } else {
          if (res.message) this.$toast(res.message);
        }
      });
    },
    countDowns() {
      this.counts = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.counts);
          this.$dialog
            .alert({
              title: "考试时间到！",
              message: "试卷已提交。"
            })
            .then(() => {
              //   this.$router.push(this.$route.path);
              this.getQuestion();
            });
        }
      }, 1000);
    },
    getQuestion() {
      joinExam({
        examquestionid: this.questionObject.Id || "",
        answer: this.answer,
        examid: this.examid
      }).then(res => {
        res = res.data;
        if (res.code == 1) {
          this.answer = "";
          if (res.action == "finish") {
            this.isOver = true;
            this.examInfo = res.data[0];
          } else {
            this.animateTime = false;
            this.questionObject = res.data[0];
            if (res.countdown) this.countdown = res.countdown;
            this.paperName = res.papername;
            if (res.examtime) this.examtime = res.examtime;
            if (!this.counts) {
              //进入页面第一次获取
              this.countDowns();
            }
          }
        } else if (res.message)
          this.$dialog
            .alert({
              message: res.message
            })
            .then(() => {
              this.$router.go("-1");
            });
      });
    },
    previous() {
      if (this.viewModel) {
        this.examQuestionIndex = Math.max(this.examQuestionIndex - 1, 0);
        this.questionObject = this.examQuestion[this.examQuestionIndex];
        this.answer = this.questionObject.Answer;
      }
    },
    next() {
      if (this.viewModel) {
        this.examQuestionIndex = Math.min(
          this.examQuestionIndex + 1,
          this.examQuestion.length - 1
        );
        this.questionObject = this.examQuestion[this.examQuestionIndex];
        this.answer = this.questionObject.Answer;
      } else if (this.answer != "") {
        this.getQuestion();
      }
    },
    select(value) {
      if (this.viewModel) return;
      if (this.questionObject.Questiontype == 1) this.answer = value;
      else {
        if (this.answer.indexOf(value) >= 0) {
          this.answer = this.answer.replace(value, "");
        } else this.answer += value;
      }
    },
    exit() {
      if (this.viewModel) this.$router.go(-1);
      else
        this.$dialog
          .confirm({
            title: "确定退出考试?",
            message:
              "考试退出后，倒计时仍会继续进行，直到考试结束。退出后也可回到考试，继续答题。"
          })
          .then(() => {
            this.$router.go(-1);
          })
          .catch(() => {});
    }
  },
  beforeDestroy() {
    clearInterval(this.counts);
    clearTimeout(this.anniTimeout);
  }
};
</script>
<style lang="stylus" scoped>
.header-cont>>>.iconfont
  font-size: 0.32rem

.answer
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0

  .header-cont
    width: 100%
    height: 2.8rem
    background: url('../../assets/images/bg.jpg') no-repeat center center
    background-size: cover

    .close
      float: left
      color: #fff
      padding: 0.25rem 0.25rem 0

    .test-name
      text-align: center
      font-size: 0.48rem
      color: #fff
      padding-top: 0.9rem

    .test-time
      padding: 0.05rem
      position: relative
      width: 2rem
      height: 2rem
      margin: 0 auto
      color: #0c7cfb
      background: #fff
      text-align: center
      line-height: 1.89rem
      border-radius: 50%
      margin-top: 0.8rem
      font-size: 0.38rem

  .main-cont
    margin-top: 0.5rem

    .test-num
      padding: 0.2rem 0.3rem
      text-align: right
      color: #5a5a5a
      font-size: 0.38rem

  .question
    margin: 0.3rem 0.4rem 0
    line-height: 1.3
    text-align: center
    font-weight: bold
    font-size: 0.34rem

    .question-type
      font-weight: normal
      color: #a3a3a3

  .answer-list
    margin-top: 0.5rem
    transition: all 0.3s ease

    .answer-item
      position: relative
      background: #f0f0f0
      width: 70%
      margin: 0 auto
      height: 0.8rem
      text-align: center
      line-height: 0.8rem
      border-radius: 0.4rem
      font-weight: bold
      margin-bottom: 0.24rem
      font-size: 0.3rem

      .icon-duihao
        position: absolute
        left: 0.45rem
        color: #79c506
        font-size: 0.38rem

    .currentli
      background: #79c506
      color: #fff

    .currentli.select
      background: #d1ac1d

  .btn-wrapper
    position: absolute
    text-align: center
    color: #00a0ea
    left: 1.5rem
    right: 1.5rem
    bottom: 0.7rem
    font-size: 0.34rem

    .previous
      float: left

    .next
      float: right

    .disable
      color: #b3b3b3

.score-board
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1
</style>

