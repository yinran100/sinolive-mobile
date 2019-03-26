<template>
  <div class="list-wrapper">
    <com-header
      toLink="-1"
      titleText="站点库存"
    ></com-header>
    <van-search
      placeholder="输入站点号查询"
      v-model.trim="keywords"
      show-action
      @search="onSearch"
    >
      <div
        slot="action"
        @click="onSearch"
      >搜索</div>
    </van-search>

    <van-list
      class="info-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getInfo"
    >
      <van-cell
        :title="'站点号：'+item.stationNum"
        v-for="(item,index) in remainList"
        :key="index"
        :label="'地址：'+item.address"
      >
        <span style="color:#E12860">库存：{{item.stockNo}}</span>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ComHeader from "@/components/Header/ComHeader";
import { getStationRemain } from "@/api/api";
export default {
  components: {
    ComHeader
  },
  data() {
    return {
      keywords: "",
      loading: true,
      finished: false,
      offset: 10,
      page: 1,
      remainList: []
    };
  },
  computed: {
    ...mapState(["activityId", "provinceId"])
  },
  mounted() {
    this.page = 1;
    this.finished = false;
    this.remainList = [];
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.loading = true;
      this.$toast({
        type: "loading",
        message: "加载中..."
      });
      getStationRemain({
        activityid: this.activityId,
        provinceid: this.provinceId,
        keywords: this.keywords,
        page: this.page,
        offset: this.offset
      }).then(
        res => {
          this.$toast.clear();
          this.loading = false;
          res = res.data;
          if (res.code == 1) {
            if (!res.data || res.data.length < this.offset) {
              this.finished = true;
            }
            this.page++;
            this.remainList = this.remainList.concat(res.data);
          } else {
            this.finished = true;
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.finished = true;
          this.$dialog.alert({
            message: "网络出错,请稍后重试"
          });
        }
      );
    },
    onSearch() {
      this.page = 1;
      this.finished = false;
      this.loading = true;
      this.remainList = [];
      this.getInfo();
    }
  }
};
</script>

<style lang="stylus" scoped>
.info-list>>>.van-cell__value
  flex: inherit
</style>

