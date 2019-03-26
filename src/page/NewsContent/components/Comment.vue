<template>
  <div class="comment-area">
    <div class="clearfix">
      <div
        class="comment-title"
        v-show="commentList.length!=0"
      >全部评论</div>
      <a
        class="comment-btn"
        href="javascript:void(0);"
        @click="showInput"
      >写评论</a>
    </div>
    <ul class="comment-list">
      <li
        class="comment-item"
        v-for="(item,index) in commentList"
        :key="item.id"
      >
        <div class="user-photo">
          <img
            class="user-img"
            @load="(e)=>{ e.target.style.display = 'block'}"
            :src="item.avatar"
            alt=""
          ></div>
        <div class="user-info">
          <div class="clearfix">
            <div class="user-name">{{item.username}}</div>
            <div class="comment-like">
              <span
                class="iconfont"
                :class="{'icon-zan':item.has_vote,'icon-zan1':!item.has_vote}"
                @click="likeClick(index)"
              ></span>
              {{item.vote}}
            </div>
          </div>
          <div class="comment-content">{{item.content}}</div>
        </div>
      </li>
    </ul>
    <Divider>{{pullupMsg}}</Divider>
  </div>
</template>
<script>
import Divider from "@/components/Divider/Divider";
export default {
  name: "Comment",
  components: {
    Divider
  },
  props: { pullupMsg: String, commentList: Array },
  computed: {
    voteList() {
      return this.commentList.map(({ has_vote, vote }) => {
        return { has_vote, vote };
      });
    }
  },
  methods: {
    likeClick(index) {
      this.$emit("vote", index);
    },
    showInput() {
      this.$emit("openInput");
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.comment-area
  user-select: text
  text-align: justify
  padding: 0.05rem 0.4rem
  background-color: $backgroundColor

  .clearfix
    .comment-title, .comment-btn
      float: left
      line-height: 2
      color: $iconColor

    .comment-btn
      float: right
      color: #005a8f

  .comment-list
    .comment-item
      padding: 0.2rem 0
      display: flex

      .user-photo
        width: 0.8rem
        height: 0.8rem
        float: left
        margin-right: 0.15rem
        border-radius: 12.5%
        background: url('../../../assets/images/avatar.png') no-repeat
        background-size: cover
        background-position: center

        .user-img
          display: none
          border-radius: 10%
          width: 100%
          height: 100%

      .user-info
        flex: 1

        .user-name
          float: left
          font-size: 0.32rem
          color: #757575

        .comment-content
          font-size: 0.32rem
          color: $contentColor
          margin-right: 0.1rem
          line-height: 1.2
          word-break: break-all

        .comment-like
          font-size: 0.3rem
          color: #08486d
          float: right

          .icon-zan, .icon-zan1
            font-size: 0.34rem
</style>
