<template>
    <div class="live-wrapper">
        <div
            class="video-wrapper"
            :style="{backgroundImage:`url(${videoInfo.Screenshot})`}"
        >
            <div id="player-con"></div>
            <div
                class="top-tips"
                @click="()=>{this.$router.go(-1)}"
                v-show="backBtnShow"
            >
                <span class="back iconfont icon-left-angle"></span>返回
            </div>
            <div
                class="state-info"
                v-show="timeArr"
            >
                <div v-if="timeArr&&timeArr[0]<3">
                    <p>距离开播</p>
                    <p class="count-down"> <span class="time-num">{{timeArr[0]}}</span>时
                        <span class="time-num">{{timeArr[1]}}</span>分<span class="time-num">{{timeArr[2]}}</span>秒</p>
                </div>
                <p
                    class="count-down"
                    v-else
                >未开始</p>
            </div>
        </div>
        <div class="video-msg">
            <div class="liver-avatar ellipsis">
                <img
                    :src="videoInfo.Avatar"
                    alt=""
                    @load="(e)=>{ e.target.style.display = 'block'}"
                >
            </div>
            <div class="liver-name">{{ videoInfo.Nickname }}</div>
            <div class="live-name ellipsis">{{ videoInfo.Name }}</div>
            <div class="view-num ellipsis">
                <span class="viewNum">{{ videoInfo.Views }}</span> 人观看</div>
        </div>
        <div class="commentListCont">
            <ul
                class="comment-ul"
                ref="commentUl"
            >
                <li
                    class="comment-item"
                    v-for="(item, index) in commentList"
                    :key="index"
                >
                    <span class="author">{{ item.username }}：</span>
                    <span
                        class="content"
                        v-html="encodeQQFace(item.content)"
                    ></span>
                </li>
            </ul>
        </div>
        <div class="writeCont">
            <input
                class="comment-input"
                type="text"
                name="comment"
                id="comment"
                placeholder="吐槽两句吧..."
                ref="commentInput"
            >
            <button
                class="comment-btn"
                @click="addComment()"
            >发送</button>
        </div>
        <div class="gift-wrapper">
            <div
                class="favour"
                @click="favour()"
            >
                <img
                    src="@/assets/images/favour.png"
                    alt=""
                    v-if='has_vote'
                >
                <img
                    src="@/assets/images/favour2.png"
                    alt=""
                    v-else
                >
                <span class="voteNum">{{ vote }}</span>
            </div>
            <div class="gift">
                <img
                    src="@/assets/images/gift.png"
                    alt=""
                >
            </div>
        </div>
    </div>
</template>
<script>
import { encodeQQface } from "@/assets/js/qqface";
import { Base64 } from "js-base64";
import {
  getLiveVoteInfo,
  voteLive,
  getLiveDetail,
  getCommentList,
  commitComment,
  addView
} from "@/api/api";
import {  mapGetters } from "vuex";

export default {
  name: "LiveRoom",
  data() {
    return {
      liveid: this.$route.params.id,
      videoInfo: {},
      errorTimes: 0,
      player: null,
      commentList: [],
      examInfo: {},
      showState: false,
      examId: 0,
      backBtnShow: true,
      websock: null,
      has_vote: false,
      vote: 0,
      internal: null,
      timeArr: false,
      timer: null,
      intervaltimer: null
    };
  },
  computed: {
    ...mapGetters(["wsuri"])
  },
  created() {
    this.getCommentList();
    this.initWebSocket();
    this.isFavour();
  },
  updated() {
    //每次页面渲染完之后滚动条在最底部
    this.$nextTick(() => {
      this.$refs.commentUl.scrollTop = this.$refs.commentUl.scrollHeight;
    });
  },
  mounted() {
    this.initLive();
  },
  beforeDestroy() {
    if (this.internal) clearInterval(this.internal);
    console.log("leave:" + Math.floor(new Date().getTime() / 1000));
    if (this.intervaltimer) clearInterval(this.intervaltimer);
    if (this.timer) clearInterval(this.timer);
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    getCountDown() {
      let subSecond =
        (this.videoInfo.Begindate * 1000 - new Date().getTime()) / 1000; //秒差
      if (subSecond > 0 && this.videoInfo.Livestate == 0) {
        let hour = Math.floor(subSecond / 3600);
        let lasttime = parseInt(subSecond % 3600);
        let minutes = Math.floor(lasttime / 60);
        let seconds = parseInt(lasttime % 60);
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        this.timeArr = [hour, minutes, seconds];
      } else {
        console.log("倒计时：" + subSecond);
        this.timeArr = false;
        clearInterval(this.timer);
        if (!this.player) this.initPlayer();
      }
    },
    encodeQQFace(content) {
      return encodeQQface(content);
    },
    /*获取是否点赞*/
    isFavour() {
      getLiveVoteInfo({
        liveid: this.liveid
      }).then(res => {
        console.log(res.data.data.has_vote);
        this.has_vote = res.data.data.has_vote;
        this.vote = res.data.data.vote;
      });
    },
    /*点赞或取消*/
    favour() {
      voteLive({
        liveid: this.liveid,
        action: this.has_vote ? 0 : 1
      }).then(res => {
        if (res.data.code == 1) {
          this.has_vote = res.data.data.has_vote;
          this.vote = res.data.data.vote;
        }
      });
    },
    initLive() {
      getLiveDetail({
        liveid: this.liveid
      }).then(res => {
        if (res.data.code == 1) {
          res = res.data;
          if (res.data.length > 0) this.videoInfo = res.data[0];
          else
            this.$dialog
              .alert({
                message: "没有直播数据"
              })
              .then(() => {
                this.$router.go(-1);
              });
          if (this.videoInfo.Livestate == 0) {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.getCountDown();
            }, 1000);
          } else {
            if (!this.player) this.initPlayer();
          }
        } else if (res.message)
          this.$dialog
            .alert({
              message: res.message
            })
            .then(() => {
              this.$router.go(-1);
            });
        console.log(res.message);
      });
    },
    initPlayer() {
      this.player = new Aliplayer(
        {
          id: "player-con",
          source: this.videoInfo.Lowurl,
          autoplay: false,
          playsinline: true,
          height: "100%",
          isLive: false,
          rePlay: true,
          x5_type: "h5",
          x5_video_position: "top",
          x5_fullscreen: false,
          x5_orientation: "portrait",
          preload: false,
          controlBarVisibility: "hover",
          useH5Prism: true,
          cover: this.videoInfo.Screenshot
        },
        function(player) {
          console.log("播放器创建了。");
        }
      );
      this.player.on("play", () => {
        this.backBtnShow = false;
      });
      this.player.on("pause", () => {
        this.backBtnShow = true;
      });

      this.player.on("requestFullScreen", () => {
        let that = this;
        that.player.x5_fullscreen = true;
        that.x5_orientation = "portrait";
        let video = document.getElementsByTagName("video")[0];
        video.style.objectFit = "contain";
        video.style.width = 100 + "% !important";
      });
      this.scrollBottom();
      this.getVideoInfo();

      //微信左上角退出按钮触发时关闭页面
      this.player.tag.addEventListener("x5videoexitfullscreen", () => {
        if (WeixinJSBridge) {
          this.$router.go(-1);
        }
      });
      this.player.on("play", () => {
        this.recordStatus();
      });
      this.player.on("pause", () => {
        if (this.intervaltimer) clearInterval(this.intervaltimer);
      });
    },
    recordStatus() {
      this.intervaltimer = setInterval(() => {
        console.log(this.player.getStatus());
        if (this.player.getStatus() == "playing") {
          let data = Base64.encode(
            JSON.stringify({
              liveid: parseInt(this.liveid),
              add_play_sec: 5
            })
          );
          // console.log(Base64.decode(data));
          this.websocketsend(3, data); //订阅直播评论推送
        }
      }, 5000);
    },
    /*********获取品论列表***************/
    getCommentList() {
      //获取评论列表
      getCommentList({
        refid: this.liveid,
        offset: 30,
        p: 1,
        order: 1
      }).then(res => {
        if (res.data.code == 1) {
          res = res.data.data;
          this.commentList = this.commentList.concat(res.comments);
        }
      });
    },
    /***************发送评论*************/
    addComment() {
	  let content = this.$refs.commentInput.value.trim();
	  
      if (content.length == 0) {
        this.$toast({
          message: "评论不能为空",
          position: "middle",
          duration: 3000
		});
		this.$refs.commentInput.value=""
        return false;
      } else if (content.length > 500) {
        this.$toast({
          message: "评论字数不能超过500",
          position: "middle",
          duration: 3000
        });
        return false;
      }
      commitComment({
        refid: this.liveid,
        content: this.escapeHtml(content)
      }).then(res => {
        // console.log(res.data);
        if (res.data.code == 1) {
          this.$refs.commentInput.value = "";
        }
      });
    },
    escapeHtml(str) {
      var s = "";
      s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/\n/g, "<br>");
      return s;
    },
    /************websocket**************/
    initWebSocket() {
      //dev-live
      console.log("wsuri=", this.wsuri);
      this.websock = new WebSocket(this.wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) {
      //数据接收
      // console.log(e);
      let redata = JSON.parse(Base64.decode(JSON.parse(e.data).data));
      // console.log(redata);
      if (redata.username) {
        this.commentList = this.commentList.concat(redata);
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      console.log("连接到websocket服务端");
      let maxCommentId =
        this.commentList.length == 0
          ? 0
          : this.commentList[this.commentList.length - 1].id;
      let data = Base64.encode(
        JSON.stringify({
          liveid: parseInt(this.liveid),
          maxcommentid: maxCommentId
        })
      );
      // console.log(Base64.decode(data));
      this.websocketsend(1, data); //订阅直播评论推送
    },
    websocketonerror(res) {
      //连接建立失败重连
      this.errorTimes++;
      console.log("连接error,尝试重新连接" + this.errorTimes, res);
      if (this.errorTimes < 5) this.initWebSocket();
    },

    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    websocketsend(categorytype, data) {
      //数据发送

      let sendData = {
        category: categorytype, // 消息类型：1: 订阅直播评论推送, 2: 取消订阅直播评论推送，3：发送播放时长
        data, // base64 编码的 JSON 消息内容，根据消息类型具有不同的结构，具体见下文
        request_id: 0, // 请求ID，响应消息将带上相同的 request_id
        ts: Math.floor(new Date().getTime() / 1000) // Unix 时间戳
      };
      this.websock.send(JSON.stringify(sendData));
    },
    /**********让滚动条一直在底部************/
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs.commentUl.scrollTop = this.$refs.commentUl.scrollHeight;
      });
    },
    getVideoInfo() {
      //查看是否有考试
      addView({
        liveid: this.liveid
      })
        .then(res => {
          res = res.data;
          if (res.data.length !== 0) {
            let examInfo = res.data[0];
            this.internal = setInterval(() => {
              this.initLive(); //获取直播状态
              if (this.Livestate == 2) {
                this.$dialog
                  .confirm({
                    title: "答题考试",
                    message: `直播结束，是否前往完成《${
                      examInfo.Papername
                    }》的考试题？若取消，可在我的考试中查看考试`
                  })
                  .then(() => {
                    this.$router.push("/answer/" + examInfo.Examid);
                  })
                  .catch(() => {}); //弹框答题
              } else {
                clearInterval(this.internal);
              }
            }, 15000);
          } else {
            console.log("没有考试");
          }
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.video-wrapper>>>video
    object-position: 0 !important

.live-wrapper>>>.prism-player
    position: absolute !important
    left: 0 !important
    right: 0 !important

.video-wrapper>>>.prism-big-play-btn
    left: 50% !important
    bottom: 50% !important
    z-index: 10
    transform: translate(-50%, 50%)

.video-wrapper>>>.prism-player .prism-ErrorMessage
    z-index: 0

.content>>>.emotion
    width: 0.4rem
    height: 0.4rem

.liver-avatar>>>img
    width: 100%
    height: 100%
    display: none

.gift-wrapper>>>img
    width: 0.8rem
    display: block
    margin: 0 auto
    position: relative
    top: 0.18rem

.live-wrapper
    display: flex
    flex-direction: column
    position: absolute
    bottom: 0
    left: 0
    right: 0
    top: 0
    overflow: hidden

    .video-wrapper
        left: 0
        right: 0
        height: 4.2rem
        z-index: 9
        position: relative
        background-size: cover

        .top-tips
            z-index: 20
            position: absolute
            display: flex
            left: 0
            right: 0
            top: 0
            line-height: 0.8rem
            font-size: 0.34rem
            color: #fff
            background: -webkit-linear-gradient(
                top,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
            )

            .back
                padding-left: 0.1rem
                font-size: 0.36rem

        .state-info
            position: absolute
            z-index: 15
            top: 0
            left: 0
            right: 0
            bottom: 0
            background-color: rgba(0, 0, 0, 0.5)
            color: #fff
            text-align: center
            font-size: 0.44rem
            padding: 1.2rem 0 0
            line-height: 2

            .count-down
                font-size: 0.52rem
                letter-spacing: 0.02rem

                .time-num
                    color: #23B8FF

    /* ***********video-msg样式************ */
    .video-msg
        display: flex
        position: relative
        align-items: center
        line-height: 0.88rem
        height: 0.88rem
        padding: 0 0.2rem
        background-color: #f8f8f8
        border-bottom: 2px solid rgba(248, 248, 248, 1)

        .liver-avatar
            width: 0.7rem
            height: 0.7rem
            border-radius: 50%
            overflow: hidden
            background-color: #b4b4b4

        .liver-name
            font-size: 0.27rem
            color: #375d8f
            padding: 0 0.15rem

        .live-name
            flex: 1
            font-size: 0.28rem
            color: #010101
            font-weight: 400

        .view-num
            text-align: right
            font-size: 0.25rem

            .viewNum
                font-size: 0.3rem
                color: #f85a59
                font-weight: 800

    /* **********评论列表样式*********** */
    .commentListCont
        width: 100%
        position: fixed
        top: 0
        bottom: 0

        .comment-ul
            font-size: 0.22rem
            overflow-y: scroll
            overflow-x: hidden
            padding: 0.1rem 0.3rem 0.3rem
            position: absolute
            left: 0
            right: 0
            top: 5.2rem
            bottom: 1rem
            background: rgba(392, 392, 392, 0.5)

            .comment-item
                margin-bottom: 0.18rem
                font-size: 0.29rem

            .author
                color: #27508b

            .content
                color: #0e0e0d
                word-break: break-all

    /* *************输入框组件样式************* */
    .writeCont
        height: 1rem
        position: fixed
        bottom: 0
        left: 0
        right: 0
        display: flex
        align-items: center
        margin: 0 auto
        border-top: 1px solid #ccc
        background-color: #fff
        z-index: 1

        .comment-input
            flex: 1
            height: 0.7rem
            line-height: 0.7rem
            outline: none
            border-radius: 0.5rem
            border: none
            margin-left: 0.2rem
            background-color: #f4f5f7
            text-indent: 0.2rem
            font-size: 0.28rem

        .comment-btn
            width: 1.2rem
            border: none
            outline: none
            color: #2a90d8
            font-size: 0.3rem
            background-color: #fff
            padding: 0

    /* *****礼物&点赞样式***** */
    .gift-wrapper
        position: fixed
        display: flex
        flex-direction: column
        bottom: 1.48rem
        right: 0.27rem

        .favour, .gift
            width: 0.9rem
            height: 0.8rem
            margin-bottom: 0.2rem
            border-radius: 50%

        .voteNum
            text-align: center
            display: block
            width: 100%
            font-size: 0.22rem
            color: #fff
            margin-top: -0.1rem
            position: relative
</style>

