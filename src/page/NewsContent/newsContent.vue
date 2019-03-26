<template>
    <div>
        <transition
            name="up"
            v-on:before-leave="beforeLeave"
            v-on:after-enter="afterEnter"
        >
            <comment-input
                class="comment-wrapper"
                :title="title"
                @commit="commit"
                @closeComment="showInput=!showInput"
                v-show="showInput"
            ></comment-input>
        </transition>
        <div
            class="news-wrapper"
            ref="newsWrapper"
        >
            <com-header
                class="header"
                toLink="-1"
                titleText="资讯详情"
            ></com-header>
            <div class="news-title">{{title}}</div>

            <div class="news-info"><span class="iconfont icon-jishi"></span><span class="updateTime">{{ updateTime*1000|moment }} </span>
                来源：<span class="system">{{sourceName}}</span>
            </div>
            <div
                class="news-contents"
                v-html="contentHtml"
                @click="imgClick"
            ></div>
            <div class="clearfix">
                <div class="news-reading"><span class="iconfont icon-yanjing"></span><span class="readnum">{{readingQuantity}}</span></div>
                <div class="like-btn">
                    <span
                        class="iconfont"
                        :class="{'icon-zan':isVote,'icon-zan1':!isVote}"
                        @click="voteArticle"
                    ></span>
                    <span v-show="voteNumber!=0"> {{voteNumber}}</span>
                </div>
            </div>
        </div>
        <gallery
            :imgs="imgs"
            :index="gallaryIndex"
            v-show="showGallary"
            @galleryClick="showGallary = false"
        ></gallery>
        <comment
            @openInput="openInput"
            @vote="voteComment"
            :commentList="commentList"
            :pullupMsg="pullupMsg"
        ></comment>
    </div>
</template>
<script>
import Gallery from "@/components/Gallery/Gallery";
import ComHeader from "@/components/Header/ComHeader";
import {
  getNewsContent,
  voteNews,
  voteComment,
  getCommentList,
  commitComment
} from "@/api/api";
import Comment from "./components/Comment";
import CommentInput from "./components/CommentInput";
export default {
  name: "NewsContent",
  components: {
    Gallery,
    Comment,
    CommentInput,
    ComHeader
  },
  data() {
    return {
      showGallary: false,
      currentId: this.$route.params.id,
      page: 1,
      offset: 10,
      gallaryIndex: 0,
      title: "",
      updateTime: "",
      sourceName: "",
      nickName: "",
      contentHtml: "",
      isVote: false,
      readingQuantity: 0,
      voteNumber: 0,
      showInput: false,
      loading: false,
      noMoreData: false,
      commentList: [],
      timer: null,
      scrollTop: 0
    };
  },
  computed: {
    pullupMsg() {
      if (this.commentList.length == 0) return "还没有人评论，抢一个沙发吧";
      if (this.loading) return "正在加载评论...";
      return this.noMoreData ? "已显示全部评论" : "获取更多评论";
    },
    imgs() {
      if (this.contentHtml) {
        return this.contentHtml
          .split('<img src="')
          .map((item, index) => {
            if (index > 0) return item.split('"')[0];
          })
          .filter(val => {
            return !(!val || val === "");
          });
      } else [];
    }
  },
  created() {
    this.$toast({
      type: "loading",
      message: "加载中..."
    });
    this.loadContentData();
    this.getCommentData(); //获取文章评论
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    beforeLeave(el) {
      this.$refs.newsWrapper.classList.remove("noscroll");
      document.documentElement.scrollTop = this.scrollTop; // 设置scrollTop的值
    },
    afterEnter(el) {
      this.scrollTop = document.documentElement.scrollTop;
      this.$refs.newsWrapper.classList.add("noscroll");
    },
    imgClick(e) {
      if (e.target.nodeName.toLocaleLowerCase() == "img") {
        //点击图片，检测是第几个图片
        this.gallaryIndex = this.imgs.findIndex(item => {
          return e.target.src.indexOf(item) >= 0;
        });
        this.showGallary = true;
      }
    },
    voteArticle() {
      voteNews({
        articleId: this.currentId
      }).then(res => {
        res = res.data;
        if (res.code == 1) {
          this.isVote = !this.isVote;
          if (this.isVote) this.voteNumber++;
          else this.voteNumber--;
        } else {
          if (res.message) this.$toast(res.message);
          console.log(res.message);
        }
      }, this.alertError);
    },
    loadContentData() {
      getNewsContent({
        articleId: this.currentId
      }).then(res => {
        this.$toast.clear();
        res = res.data;
        if (res.code == 1) {
          this.contentHtml = res.contentHtml;
          this.title = res.title;
          this.updateTime = res.updateTime;
          this.readingQuantity = res.readingQuantity;
          this.isVote = res.isVote;
          this.sourceName = res.sourceName;
          this.voteNumber = res.voteNumber;
        } else {
          if (res.message)
            this.$dialog
              .alert({
                message: res.message
              })
              .then(() => {
                this.$router.push("/home/news");
              });
          console.log(res.message);
        }
      }, this.alertError);
    },
    alertError(res) {
      console.log(res);
      this.$dialog
        .alert({
          message: "网络出错,请稍后重试"
        })
        .then(() => {
          this.$router.push("/home/news");
        });
      this.$toast.clear();
    },
    getCommentData() {
      this.loading = true;
      getCommentList({
        refid: this.currentId,
        p: this.page,
        offset: this.offset,
        type: 1
      }).then(res => {
        this.loading = false;
        window.addEventListener("scroll", this.handleScroll);
        if (res.data.code == 1) {
          // console.log(JSON.stringify(res.data));
          res = res.data.data;
          if (res.comments.length == 0) {
            this.noMoreData = true;
          } else {
            if (res.comments.length < this.offset) this.noMoreData = true;
            this.page++;
          }
          res.comments.map(item => {
            this.commentList.push(item);
          });
        } else {
          if (res.message) this.$toast(res.message);
          console.log(res.message);
        }
        this.showInput = false;
      }, this.alertError);
    },
    openInput() {
      this.showInput = true;
    },
    commit(content) {
      //提交评论
      commitComment({
        refid: this.currentId,
        content,
        type: 1 //1代表文章评论
      }).then(res => {
        if (res.data.code == 1) {
          if (res.data.message) this.$toast(res.data.message);
          this.page = 1;
          this.noMoreData = false;
          this.commentList = [];
          this.getCommentData();
        } else this.$toast(res.data.message);
      }, this.alertError);
    },
    voteComment(index) {
      //点赞
      voteComment({
        id: this.commentList[index].id,
        action: this.commentList[index].has_vote ? 0 : 1
      }).then(res => {
        if (res.data.code == 1) {
          this.commentList[index].has_vote = !this.commentList[index].has_vote;
          this.commentList[index].vote = res.data.data.has_vote
            ? this.commentList[index].vote + 1
            : this.commentList[index].vote - 1;
        }
      }, this.alertError);
    },
    handleScroll() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        const top = document.documentElement.scrollTop; //滚动距离
        if (
          top + document.documentElement.clientHeight + 150 >=
          document.documentElement.scrollHeight
        ) {
          if (!this.noMoreData && !this.showInput) this.getCommentData();
        }
      }, 16);
    }
  }
};
</script>
<style lang='stylus' scoped>
@import '~css/globalStyle.styl'

.news-info>>>.iconfont
    font-size: 0.24rem

.clearfix>>>.iconfont
    font-size: 0.38rem

.news-contents>>>p
    font-size: 0.34rem
    line-height: 1.5
    margin: 0.15rem 0

.news-contents>>>a
    color: $contentColor

    &:hover
        text-decoration: underline

.news-contents>>>img, .news-contents>>>table
    width: 100%
    padding: 0.3rem 0
    word-break: break-all

.news-contents>>>ul, .news-contents>>>h1, .news-contents>>>h2, .news-contents>>>h3, .news-contents>>>h4
    padding: 0.1rem 0

.news-contents>>>ul, .news-contents>>>li
    padding: 0.05rem 0.1rem

.news-contents>>>video
    position: relative
    margin: 0 auto
    width: 90%
    background-color: $borderColor

.header
    position: fixed !important
    z-index: 1

.noscroll
    height: 100%
    position: fixed !important
    overflow: hidden

.news-wrapper
    position: relative
    left: 0
    right: 0
    padding: 0.98rem 0.4rem 0
    background-color: #fff

    .news-title
        font-size: 0.44rem
        padding: 0.4rem 0 0.3rem
        line-height: 1.4
        color: $titleColor
        text-align: center

    .news-info
        font-size: 0.28rem
        color: #999999
        text-align: center
        letter-spacing: 0.02rem
        padding: 0.15rem 0 0.4rem

        .updateTime
            padding: 0 0.1rem

        .system
            color: #DD0E0E

    .news-contents
        color: $contentColor
        display: flex
        flex-direction: column
        align-items: center
        user-select: text
        text-align: justify
        word-wrap: break-word
        overflow-x: hidden
        line-height: 1.5

    .clearfix
        .news-reading
            font-size: 0.34rem
            color: $iconColor
            float: left
            padding: 0.3rem 0

            .readnum
                margin-left: 0.1rem

        .like-btn
            padding: 0.3rem 0
            font-size: 0.34rem
            color: #08486d
            float: right

.up-enter-active, .up-leave-active
    transition: all 0.3s

.up-enter, .up-leave-to
    transform: translateY(100%)
</style>