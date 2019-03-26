<template>
  <div class="search-wrapper">
    <com-header
      titleText="信息查询"
      toLink="-1"
    ></com-header>
    <van-cell-group>
      <van-field
        v-model="stationNum"
        type="tel"
        clearable
        onkeyup="value=value.replace(/[^\d]/g,'')"
        label="站点编号"
        placeholder="请输入站点编号"
      />
      <van-field
        v-model="name"
        clearable
        label="姓名"
        placeholder="请输入站主或销售员姓名"
      >
      </van-field>
    </van-cell-group>
    <div class="btn-wrapper">
      <van-button
        size="large"
        type="primary"
        @click="search"
      >查询</van-button>
    </div>
    <p
      class="result-title"
      v-show="phone.length!=0"
    >查询结果</p>
    <van-cell-group v-show="phone.length!=0">
      <van-cell
        :title="name"
        v-show="name.length!=0"
      >
        <van-icon name="phone" />{{phone}}
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getStationInfoByName } from "@/api/api";
import ComHeader from "@/components/Header/ComHeader";
export default {
  name: "phonesearch",
  components: {
    ComHeader
  },
  data() {
    return {
      stationNum: "",
      name: "",
      phone: "",
      address: ""
    };
  },
  methods: {
    search() {
      if (this.stationNum.length == 0) {
        return this.$toast("请输入正确站点号");
      } else if (this.name.length == 0) {
        return this.$toast("请输入姓名");
      }
      this.$toast({ type: "loading", message: "查询中..." });
      getStationInfoByName({
        stationnum: this.stationNum,
        name: this.name
      }).then(
        res => {
          this.$toast.clear();
          res = res.data;
          if (res.code == 1 && Object.keys(res.data).length > 0) {
            this.name = res.data.userName;
            this.phone = res.data.mobile;
            this.address = res.data.address;
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

.search-wrapper
  wrapper()

  .btn-wrapper
    margin: 0.8rem 0.5rem 0.4rem

  .result-title
    font-size: 0.28rem
    margin: 0 0.2rem 0.2rem
    color: $iconColor
</style>
