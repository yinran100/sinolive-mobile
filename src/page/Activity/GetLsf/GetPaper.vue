<template>
  <div class="paper-wrapper">
    <p class="title">{{remark}}</p>
    <van-popup
      v-model="pickerShow"
      position="bottom"
      :overlay="true"
    >
      <van-picker
        show-toolbar
        title="选择区"
        :columns="areaList"
        @confirm="onConfirm"
      />
    </van-popup>

    <div class="info-wraper">
      <p class="info-title">请补齐信息领取报纸</p>
      <div class="info-item">姓名：{{name}}</div>
      <div class="info-item">手机：{{phoneNum}}</div>
      <div class="info-item">详细地址：广东省深圳市 <span
          class="area"
          @click="()=>pickerShow=true"
        >{{area}}
          <van-icon name="arrow-down" /></span>
      </div>
      <van-field
        v-model.trim="address"
        type="textarea"
        placeholder="请输入详细地址"
        rows="2"
      />
    </div>
    <div class="btn-wrapper">
      <van-button
        size="large"
        type="primary"
        @click="confirm"
      >提交</van-button>
    </div>
    <div class="tips-wrapper">
      <p class="tips-title">派发说明</p>
      <ol>
        <li>地址填写后不能修改，请确保地址填写正确； </li>
        <li>信息未提交时关闭此页面视为放弃奖品；</li>
        <li>领取成功后报纸将投递至您填写的地址；</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { postPaper } from "@/api/api";
export default {
  data() {
    return {
      remark: this.$route.query.remark,
      pickerShow: false,
      name: this.$route.query.name,
      phoneNum: this.$route.query.phoneNum,
      address: "",
      committing: false,
      area: "罗湖区",
      areaList: [
        "罗湖区",
        "福田区",
        "南山区",
        "宝安区",
        "龙岗区",
        "龙华区",
        "盐田区",
        "光明区",
        "坪山区",
        "大鹏新区"
      ]
    };
  },
  computed: {
    ...mapState(["provinceId", "activityId"]),
    wholeAddress() {
      return "广东省深圳市" + this.area + this.address;
    }
  },
  methods: {
    onConfirm(value, index) {
      this.pickerShow = false;
      this.area = value;
    },
    confirm() {
      if (this.address.length == 0) return this.$toast("详细地址不能为空");
      this.$dialog
        .confirm({
          message: `确定地址为：${this.wholeAddress}？`
        })
        .then(() => {
          this.commit();
        })
        .catch(() => {});
    },
    commit() {
      if (this.committing) return;
      this.committing = true;
      postPaper({
        activityid: this.activityId,
        mobile: this.phoneNum,
        name: this.name,
        provinceid: this.provinceId,
        address: this.wholeAddress
      }).then(
        res => {
          res = res.data;
          if (res.code == 1) {
            // this.$dialog.alert({ message: "报纸领取成功，信息已提交！" });
            this.$router.push({
              path: "/activity/papersuccess",
              query: {
                name: this.name,
                phoneNum: this.phoneNum,
                address: this.wholeAddress
              }
            });
          } else {
            this.committing = false;
            this.$toast(res.message);
          }
        },
        () => {
          this.committing = false;
          this.$toast("网络出错,请稍后重试");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.paper-wrapper
  wrapper()
  background-color: #EFEFEF

  .title
    color: $themeTextColor
    text-align: center
    font-weight: bold
    font-size: 0.36rem
    margin: 0.32rem

  .info-wraper
    background-color: #ffffff
    margin: 0.2rem 0
    font-size: 0.3rem
    padding: 0.4rem

    .info-title
      font-size: 0.28rem
      color: #8E8E8E
      margin-bottom: 0.1rem

    .info-item
      color: #000000
      line-height: 2.2

      .area
        color: #8E8E8E
        margin-left: 0.2rem

    .van-cell
      background-color: #EFEFEF

  .btn-wrapper
    margin: 0.6rem 0.5rem 0.4rem

  .tips-wrapper
    margin: 0.7rem 0.5rem 0
    padding: 0.1rem 0.16rem 0.2rem
    color: #8E8E8E
    word-break: break-all
    font-size: 0.28rem
    line-height: 1.8

    .tips-title
      text-align: center
      font-weight: bold
      margin-bottom: 0.1rem

    ol
      margin-left: 0.3rem
      list-style: decimal
</style>
