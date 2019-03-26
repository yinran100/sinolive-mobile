<template>
  <scroll
    class="courseware-wrapper"
    :data="coursewareList"
    :pullup="pullup"
    :pullupMsg="pullupMsg"
    @pullup="pullupEvent"
  >
    <ul class="courseware-list">
      <router-link
        tag='li'
        class="courseware-item"
        :to="'/liveRoom/'+item.liveInfo.liveId"
        v-for="item in coursewareList"
        :key="item.courseWareId"
      >
        <div class="photo-wrapper">
          <img
            class="course-img"
            @load="(e)=>{ e.target.style.display = 'block'}"
            :src="item.courseCover"
            alt=""
          >
        </div>
        <div class="item-info ellipsis">
          <div class="titel ellipsis">{{item.title}}</div>
          <div class="tips-wrapper">
            <span :class="{tipsOver:item.desc.length>24}">{{item.desc}}</span>
          </div>
          <div class="update-time">{{item.updateTime*1000|moment}}</div>
          <div class="data">
            <span
              class="voteNum"
              v-show="item.voteNumber!=0"
            ><i class=" iconfont icon-zan"></i>{{item.voteNumber}}</span>
            <span class="watch"><i class="iconfont icon-yanjing"></i> {{item.watch}}</span>
          </div>
        </div>
      </router-link>
    </ul>
    <p
      class="tips"
      v-show="coursewareList.length==0"
    >暂时没有课件</p>
  </scroll>
</template>
<script>
import Scroll from "@/components/Scroll/Scroll";
import { getCoursewareList } from "@/api/api";
export default {
  name: "CoursewareList",
  components: {
    Scroll
  },
  props: {
    trainerId: {
      type: [String, Number],
      default: ""
    },
    courseId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      pullup: true,
      page: 1,
      offset: 10,
      noMoreData: false,
      coursewareList: []
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多课件信息";
    }
  },
  created() {
    this.getCoursewareList();
  },
  methods: {
    getCoursewareList() {
      this.$toast({ type: "loading", message: "加载中..." });
      getCoursewareList(
        {
          p: this.page,
          offset: this.offset,
          trainerid: this.trainerId,
          courseid: this.courseId
        },
        this.courseId
      ).then(this.getResult, this.alertError);
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
            courseWareId,
            title,
            img,
            updated,
            scan,
            desc,
            liveInfo,
            voteNum
          }) => {
            this.coursewareList.push({
              courseWareId,
              title,
              courseCover: img,
              updateTime: updated,
              voteNumber: voteNum,
              watch: scan,
              desc,
              liveInfo
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
  }
};
</script>

<style lang="stylus" scoped>
.courseware-wrapper>>>.iconfont
  color: #999999
  font-size: 0.26rem

.courseware-wrapper
  position: absolute
  overflow: hidden
  width: 100%
  top: 0
  bottom: 0
  background-color: #f2f2f2

.tips
  padding: 0.3rem
  color: #b0b0b0

.courseware-list
  padding: 0 0.3rem
  background-color: #fff

  .courseware-item
    display: flex
    align-items: center
    padding-top: 0.18rem
    padding-bottom: 0.14rem
    border-bottom: 1px #eee solid

    .photo-wrapper
      width: 2.7rem
      height: 1.8rem
      margin-right: 0.2rem
      background-color: #dfdfdf

    .course-img
      height: 100%
      width: 100%
      display: none

    .item-info
      flex: 1

      .titel
        font-size: 0.34rem

      .tips-wrapper
        font-size: 0.3rem
        color: #999999
        padding-top: 0.1rem
        white-space: initial
        overflow: hidden
        position: relative
        line-height: 0.34rem
        height: 0.68rem

      .update-time
        float: left
        color: #999999
        font-size: 0.26rem
        padding-top: 0.15rem

      .data
        float: right
        color: #999999
        font-size: 0.26rem
        padding-top: 0.15rem
        line-height: 1
        padding-right: 0.1rem
</style>
