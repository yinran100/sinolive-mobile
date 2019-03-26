<template>
  <div class="search-wrapper">
    <div class="content">
      <van-cell-group>
        <van-field
          ref='input'
          v-model.trim="stationNum"
          center
          type="tel"
          clearable
          onkeyup="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入站点编号"
        >
          <van-button
            slot="button"
            size="small"
            type="primary"
            @click="search"
          >查询</van-button>
        </van-field>
        <van-cell
          v-for="item in infoList"
          :title="item.userName"
          :key='item.mobile'
          :value="item.mobile"
          :label="item.address"
        />
      </van-cell-group>

    </div>
    <!-- <div id="map" ></div> -->
  </div>
</template>

<script>
import { getStationInfo } from "@/api/api";
export default {
  name: "StationSearch",
  data() {
    return {
      infoList: [],
      stationNum: "",
      tips: ""
    };
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    search() {
      if (this.stationNum.length == 0) {
        return this.$toast("请输入正确站点号");
      }
      this.$toast({ type: "loading", message: "查询中..." });
      getStationInfo({ stationnum: this.stationNum }).then(
        res => {
          this.$toast.clear();
          res = res.data;
          if (res.code == 1 && res.data) {
            console.log(res.data);
            if (res.data instanceof Array) this.infoList = res.data;
            else {
              this.infoList.push(res.data);
            }
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$toast("网络出错,请稍后重试");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~css/globalStyle.styl'

.van-panel >>>.van-cell__value
  color: #666

.search-wrapper
  wrapper()
  display: flex
  flex-direction: column

  .content
    width: 100%
    height: 3.6rem

    .van-cell-group
      margin: 0.3rem 0

    .name
      margin: 0 0.4rem
      font-size: 0.36rem
      line-height: 20px

      .phone
        float: right
        font-size: 0.3rem

  #map
    width: 100%
    flex: 1
    background-color: aliceblue
</style>
