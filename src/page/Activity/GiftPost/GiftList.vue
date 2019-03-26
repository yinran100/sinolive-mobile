<template>
  <div class="list-wrapper">
    <div
      class="layer"
      v-show="!begin"
    >
      <img
        src="@/assets/images/activity/wait-ad.png"
        alt=""
      >
      <div class="user-info">
        <div class="info-title">我的站点信息</div>
        <div class="info-num"><span>站点编号:{{stationInfo.stationCode}}</span><span>电话:{{stationInfo.mobile}}</span> </div>
        <div>地址：{{stationInfo.address}}</div>
        <div class="tips">如站点信息有误，请联系管理员</div>
      </div>
    </div>
    <div class="stationer-info">
      <div class="avatar-wrapper"><img
          :src="userMsg.avatar"
          @load="(e)=>{ e.target.style.display = 'block'}"
          alt=""
        ></div>
      <div class="station-info">
        <div class="name">{{stationInfo.userName}}</div>
        <div class="station-number">站点编号：{{stationInfo.stationCode}}</div>
      </div>
      <router-link
        class="mine"
        to="/personinfo"
      >个人资料
        <van-icon name="arrow" />
      </router-link>
    </div>
    <div class="btn-wrapper">
      <div>
        <van-button
          plain
          type="primary"
          size="small"
          @click="reflesh"
        >刷新领取记录</van-button>
      </div>
      <div>
        <van-button
          plain
          type="primary"
          size="small"
          @click="()=>$router.push({path:'/activity/sendgift',query:{stationNum:stationInfo.stationCode}})"
        >派发礼品</van-button>
      </div>
    </div>
    <van-list
      class="info-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getInfo"
    >
      <p class="gift-info">共{{total}}份，已派发{{received}}份</p>
      <div
        class="gift-item"
        v-for="(item,index) in infoList"
        :key="index"
      >
        <p class="index">{{index+1}}.</p>
        <div class="base-info">
          <div class="name"><span>{{item.name}}</span> <span>{{item.mobile}}</span> </div>
          <div class="date">领取时间：{{item.createdTime}}</div>
        </div>
        <div class="count">1份</div>
        <div class="result">已领取</div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { getGiftRecord, getSationInfo } from "@/api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeName: [],
      loading: false,
      begin: true,
      finished: false,
      total: 0,
      received: 0,
      infoList: [],
      page: 1,
      offset: 10,
      stationInfo: {
        stationCode: "",
        mobile: "",
        username: "",
        address: ""
      },
      isShowCode: false
    };
  },
  computed: {
    ...mapState(["activityId", "userMsg"])
  },
  mounted() {
    getSationInfo().then(
      res => {
        res = res.data;
        if (res.code == 1) {
          this.stationInfo = res.data;
        }
      },
      () => {
        this.$toast("网络出错，请稍后重试");
      }
    );
  },
  methods: {
    reflesh() {
      this.page = 1;
      this.finished = false;
      this.infoList = [];
    },
    showCode() {
      this.isShowCode = true;
    },
    getInfo() {
      this.loading = true;
      if (!this.activityId) return;
      getGiftRecord({
        page: this.page,
        offset: this.offset,
        activityid: this.activityId
      }).then(
        res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1) {
            // this.stationInfo = res.data.stationInfo;
            this.total = res.data.total;
            this.received = res.data.received;
            if (!res.data.userInfo || res.data.userInfo.length < this.offset) {
              this.finished = true;
            }
            this.page++;
            this.infoList = this.infoList.concat(res.data.userInfo);
          } else if (res.code == 0) {
            this.begin = false;
            this.finished = true;
            document.title = "活动页面";
          } else {
            this.$toast(res.message);
          }
        },
        () => {
          this.finished = true;
          this.$dialog.alert({
            message: "网络出错,请稍后重试"
          });
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.list-wrapper>>>.van-cell__left-icon
  line-height: 30px

.list-wrapper>>>.van-dialog__content
  img
    margin: 0.4rem auto
    display: block

.list-wrapper>>>.iconfont
  font-size: 0.26rem

.list-wrapper
  wrapper()
  background-color: #EFEFEF

  .stationer-info
    display: flex
    padding: 0.4rem 0.3rem
    align-items: center
    background-color: #fff

    .avatar-wrapper
      width: 1rem
      height: 1rem
      border-radius: 50%
      background-color: #dfdfdf

      img
        display: none
        border-radius: 50%
        height: 100%
        width: 100%

    .station-info
      margin-left: 0.4rem
      flex: 1

      .name
        color: #000
        margin-bottom: 0.1rem

      .station-number
        color: #8E8E8E

    .mine
      color: #56A3F2
      font-size: 0.28rem

  .btn-wrapper
    display: flex
    background-color: #fff
    padding: 0 0.3rem 0.3rem

    div
      flex: 1
      padding: 0 0.3rem

      button
        font-size: 0.3rem
        width: 100%

.info-list
  margin: 0.3rem 0
  background-color: #fff
  padding: 0 0.3rem

  .gift-info
    line-height: 3
    font-size: 0.28rem
    color: #8E8E8E
    text-align: center

  .gift-item
    display: flex
    align-items: center
    font-size: 0.3rem
    padding: 0.24rem 0

    &:nth-last-child(n+2)
      border-bottom: 1px #eee solid

    .index
      color: #C12D48
      font-style: italic
      font-weight: bold
      margin-right: 0.2rem

    .base-info
      flex: 1

      .name
        color: #000
        margin-bottom: 0.12rem

        span+span
          margin-left: 0.2rem

      .date
        font-size: 0.27rem
        color: #8E8E8E

    .count
      margin-right: 0.6rem
      color: $themeTextColor

    .result
      color: #000

.layer
  wrapper()
  z-index: 2

  img
    width: 100%
    height: 100%

  .user-info
    position: absolute
    left: 0
    right: 0
    bottom: 0.4rem
    display: flex
    flex-direction: column
    align-items: center
    color: #115778
    line-height: 1.5
    font-size: 0.3rem

    .info-title
      font-size: 0.34rem
      font-weight: bold
      margin-bottom: 0.3rem

      &:before, &:after
        content: ''
        width: 0.3rem
        transform: translateX(-150%)
        position: absolute
        height: 0.24rem
        border-bottom: 1px solid #115778

      &:after
        transform: translateX(50%)

    .info-num
      span+span
        margin-left: 0.4rem

    .tips
      margin-top: 0.3rem
      color: #ffffff
      font-size: 0.26rem
</style>

