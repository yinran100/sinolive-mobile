<template>
  <div>
    <scroll
      class="trainer-wrapper"
      :data="trainerList"
      :pullup="pullup"
      :pullupMsg="pullupMsg"
      @pullup="pullupEvent"
    >
      <ul class="trainer-list">
        <router-link
          tag='li'
          class="trainer-item"
          :to="'/trainerDetail/'+item.trainerId"
          v-for="item in trainerList"
          :key="item.trainerId"
        >
          <div class="photo-wrapper">
            <img
              class="trainer-img"
              @load="(e)=>{ e.target.style.display = 'block'}"
              :src="item.trainerPhoto"
              alt=""
            >
          </div>
          <div class="item-info ellipsis">
            <div class="name-wrapper  ellipsis">
              <div class="name ellipsis">{{item.trainerName}}</div>
              <div
                class="label"
                v-for="(label,index) in item.trainerLable"
                :key="index"
              >{{label}}</div>
            </div>
            <div
              class="tips-wrapper"
              :class="{tipsOver:item.introduce.length>51}"
            >
              <span class="tips">{{item.introduce}}</span>
            </div>
            <div class="data">
              <span class="influence iconfont icon-redu">{{item.influence}}</span>
              <span class="watch iconfont icon-yanjing">{{item.watchNum}}</span>
            </div>
          </div>
        </router-link>
      </ul>
    </scroll>
    <none-tip
      :msg="msg"
      v-show="trainerList.length==0"
    ></none-tip>
  </div>
</template>
<script>
import { getTrainerList } from "@/api/api";
import Scroll from "@/components/Scroll/Scroll";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "TrainerList",
  components: {
    Scroll,
    NoneTip
  },
  props: {
    keywords: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      trainerList: []
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多培训师信息";
    },
    msg() {
      if (this.noMoreData)
        return this.keywords != ""
          ? `搜索不到"${this.keywords}"相关的培训师`
          : "暂时没有培训师";
      else return "加载中...";
    }
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.trainerList = [];
    },
    loadTrainerList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getTrainerList({
        p: this.page,
        offset: this.offset,
        keywords: this.keywords
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
      this.$toast.clear();
      res = res.data;
      if (res.code == 1) {
        res = res.data;
        if (res && res.length == 0) {
          if (this.page != 1) this.$toast("没有更多数据");
          this.noMoreData = true;
        } else {
          if (res && res.length < this.offset) this.noMoreData = true;
          this.page++;
        }
        res.map(
          ({
            trainerId,
            nickName,
            avatar,
            desc,
            influence,
            watchNum,
            introduce
          }) => {
            this.trainerList.push({
              trainerId,
              trainerName: nickName,
              trainerPhoto: avatar,
              trainerLable: desc.map((item, index) => {
                if (index < 2) return item.trim().substr(0, 5);
              }),
              influence: influence,
              watchNum,
              introduce: introduce.trim()
            });
          }
        );
      } else {
        this.$toast(res.message);
      }
    },
    alertError() {
      this.$toast.clear();
    },
    pullupEvent() {
      if (!this.noMoreData) this.loadTrainerList();
    }
  },
  created() {
    this.loadTrainerList();
  }
};
</script>
<style scoped>
.trainer-wrapper {
  position: absolute;
  overflow: hidden;
  width: 100%;
  bottom: 0;
  top: 0;
  background-color: #f2f2f2;
}
.trainer-list {
  padding: 0 0.4rem;
  background-color: #fff;
}
.trainer-item {
  display: flex;
  align-items: center;
  padding: 0.15rem 0;
}
.trainer-item:nth-last-child(n + 2) {
  border-bottom: 1px #eee solid;
}
.item-info {
  flex: 1;
}
.photo-wrapper {
  width: 1.34rem;
  height: 1.34rem;
  margin-right: 0.36rem;
  margin-bottom: 0.12rem;
  border-radius: 50%;
  background-color: #dfdfdf;
}
.trainer-img {
  display: none;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.name-wrapper {
  display: flex;
  padding-bottom: 0.15rem;
}
.name {
  font-size: 0.34rem;
}
.data {
  line-height: 1;
  float: right;
}
.data .iconfont {
  font-size: 0.26rem !important;
  color: #cecece;
}
.data .influence {
  margin-right: 0.1rem;
}
.label {
  display: inline;
  font-size: 0.24rem;
  color: #4a90e2;
  padding: 0.03rem 0.12rem;
  margin-left: 0.1rem;
  border: 1px #4a90e2 solid;
  border-radius: 0.08rem;
  word-break: keep-all;
}
.label:nth-child(n + 3) {
  color: #2ed361;
  border: 1px #2ed361 solid;
}
.tips-wrapper {
  position: relative;
  line-height: 0.4rem;
  height: 0.8rem;
  font-size: 0.28rem;
  color: #999999;
  overflow: hidden;
  text-align: justify;
  white-space: initial;
}
.tipsOver:after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 0.4rem;
  background: -webkit-linear-gradient(left, transparent, #ffffff 50%);
  background: -o-linear-gradient(right, transparent, #ffffff 50%);
  background: -moz-linear-gradient(right, transparent, #ffffff 50%);
  background: linear-gradient(to right, transparent, #ffffff 50%);
}
</style>
