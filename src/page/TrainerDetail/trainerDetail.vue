<template>
  <div class="trainer-wrapper">
    <div class="info-wrapper">
      <div class="backImg"></div>
      <div
        class="top-tips"
        @click="()=>$router.go(-1)"
      >
        <span class="back iconfont icon-left-angle"></span>返回
      </div>
      <div class="trainer-info">
        <div class="photo-wrapper">
          <img
            class="trainer-img"
            @load="(e)=>{ e.target.style.display = 'block'}"
            :src="trainerPhoto"
            alt=""
          >
        </div>
        <div class="trainer-left ellipsis">
          <div class="name ellipsis">{{trainerName}}</div>
          <div class="data">
            <span class="influence "><i class="iconfont icon-redu"></i>{{influence}}</span>
            <span class="watch"><i class="iconfont icon-yanjing"></i>{{watchNum}}</span>
          </div>
        </div>
        <div class="trainer-labels">
          <div
            class="label"
            v-for="(label,index) in trainerLable"
            v-show="label"
            :key="index"
          >{{label}}</div>
        </div>
      </div>
      <div
        class="tips"
        :class="{tipsOver:motto.length>72}"
      >
        <span>{{motto}}</span>
      </div>
      <div
        class="tabs clearfix"
        @click="handleClick"
      >
        <div
          class="tab-item"
          tab="Intro"
          :class="{active:currentTab=='Intro'}"
        >简介
          <span
            class="market-nav-arrow"
            :class="{hide:currentTab!='Intro'}"
          ></span>
        </div>
        <div
          class="tab-item"
          tab="CoursewareList"
          :class="{active:currentTab=='CoursewareList'}"
        >课件列表
          <span
            class="market-nav-arrow"
            :class="{hide:currentTab!='CoursewareList'}"
          ></span>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <keep-alive>
        <component
          :is="currentTab"
          :introduce="introduce"
          :trainerId="trainerId"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Intro from "./components/Intro";
import CoursewareList from "./components/CoursewareList";
import { getTrainerDetail } from "@/api/api";
export default {
  name: "TrainerDetail",
  components: {
    Intro,
    CoursewareList
  },
  data() {
    return {
      trainerId: this.$route.params.id,
      currentTab: "Intro",
      trainerPhoto: "",
      trainerName: "",
      influence: 0,
      watchNum: 0,
      trainerLable: [],
      motto: "",
      introduce: ""
    };
  },
  methods: {
    handleClick(e) {
      if (e.target.className == "tab-item")
        this.currentTab = e.target.attributes.tab.value;
    },
    getTrainDetail() {
      this.$toast({ type: "loading", message: "加载中..." });
      getTrainerDetail({
        trainerid: this.$route.params.id
      }).then(this.getResult, this.alertError);
    },
    getResult(res) {
      this.$toast.clear();
      res = res.data;
      if (res.code == 1) {
        res = res.data;
        this.trainerId = res.trainerId;
        this.trainerName = res.nickName;
        this.trainerPhoto = res.avatar;
        this.watchNum = res.watchNum;
        this.trainerLable = res.desc.map((item, index) => {
          if (index < 2) return item.trim().substr(0, 5);
        });
        this.influence = res.influence;
        this.motto = res.motto.trim();
        this.introduce = res.introduce;
      } else {
        if (res.message)
          this.$dialog
            .alert({
              message: res.message
            })
            .then(() => {
              this.$router.push("/home/trainer");
            });
        console.log(res.message);
      }
    },
    alertError() {
      console.log(res);
      this.$dialog
        .alert({
          message: "网络出错,请稍后重试"
        })
        .then(() => {
          this.$router.push("/home/trainer");
        });
      this.$toast.clear();
    }
  },
  created() {
    this.getTrainDetail();
  }
};
</script>
<style scoped>
.trainer-wrapper {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.info-wrapper {
  background-image: url("../../assets/images/back.jpg");
  background-size: 100% 100%;
  height: 4rem;
  position: relative;
  flex: 0;
}
.backImg {
  position: absolute;
  background-color: rgba(14, 26, 69, 0.85);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.top-tips {
  position: relative;
  display: flex;
  left: 0;
  right: 0;
  top: 0;
  color: #fff;
  line-height: 0.8rem;
  font-size: 0.34rem;
}

.back {
  padding-left: 0.15rem;
  font-size: 0.36rem;
}

.trainer-info {
  position: relative;
  padding: 0 0.3rem 0;
  display: flex;
  align-items: center;
  color: #cad9ee;
}

.photo-wrapper {
  position: relative;
  width: 0.9rem;
  height: 0.9rem;
  margin-right: 0.34rem;
  border-radius: 50%;
  background-color: #dfdfdf;
}
.trainer-left {
  flex: 1;
  float: left;
  z-index: 1;
}
.trainer-img {
  display: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.name {
  font-size: 0.36rem;
}
.data {
  font-size: 0.24rem;
  margin-top: 0.05rem;
}
.data .iconfont {
  font-size: 0.23rem;
  padding-right: 0.04rem;
}
.data .influence {
  margin-right: 0.1rem;
  color: #f16f32;
}
.trainer-labels {
  float: right;
  z-index: 1;
}
.label {
  display: inline;
  font-size: 0.24rem;
  color: #4a90e2;
  padding: 0.03rem 0.12rem;
  margin-left: 0.15rem;
  border: 1px #4a90e2 solid;
  border-radius: 0.08rem;
  line-height: 1;
  word-break: keep-all;
}
.label:nth-child(n + 2) {
  color: #2ed361;
  border: 1px #2ed361 solid;
}
.tips {
  padding: 0.3rem 0.3rem 0;
  color: #829cc0;
  line-height: 0.32rem;
  overflow: hidden;
  height: 0.96rem;
  font-size: 0.26rem;
  position: relative;
  text-align: justify;
  text-overflow: ellipsis;
}
.tipsOver:after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 0.4rem;
  background: -webkit-linear-gradient(left, transparent, #0e1a45 50%);
  background: -o-linear-gradient(right, transparent, #0e1a45 50%);
  background: -moz-linear-gradient(right, transparent, #0e1a45 50%);
  background: linear-gradient(to right, transparent, #0e1a45 50%);
}
.tabs {
  position: relative;
  color: #829cc0;
  font-size: 0.3rem;
  bottom: 0;
}
.tab-item {
  float: left;
  line-height: 1.3;
  margin: 0.05rem 0.3rem 0.2rem;
  word-break: keep-all;
}
.tab-item.active {
  color: #fff;
}
.content-wrapper {
  flex: 1;
  position: relative;
}
.market-nav-arrow {
  position: relative;
  bottom: -0.45rem;
  left: 50%;
  float: left;
  height: 0;
  font-size: 0;
  line-height: 0;
  border-style: solid;
  border-width: 0 0.18rem 0.18rem 0.18rem;
  border-color: #ffffff transparent;
}
.market-nav-arrow.hide {
  border-color: transparent;
}
</style>
