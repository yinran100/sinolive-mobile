<template>
	<div>
		<scroll
		 class="course-wrapper"
		 ref="scroll"
		 :data="courseList"
		 :pullup="pullup"
		 :pullupMsg="pullupMsg"
		 @pullup="pullupEvent"
		>
			<ul class="course-list">
				<router-link
				 tag='li'
				 class="course-item"
				 :to="'/courseDetail/'+item.courseId"
				 v-for="item in courseList"
				 :key="item.courseId"
				>
					<div class="photo-wrapper">
						<img
						 class="course-img"
						 @load="(e)=>{ e.target.style.display = 'block'}"
						 :src="item.courseImg"
						 alt=""
						>
					</div>
					<div class="item-info ellipsis">
						<div class="titel ellipsis">{{item.title}}</div>
						<div class="tips-wrapper">
							<span
							 class="tips"
							 :class="{tipsOver:item.desc.length>22}"
							>{{item.desc}}</span>
						</div>
						<div class="data">
							<span
							 class="voteNum"
							 v-show="item.voteNum!=0"
							><i class=" iconfont icon-zan"></i>{{item.voteNum}}</span>
							<span class="watch"><i class="iconfont icon-yanjing"></i> {{item.watchNum}}</span>
						</div>
					</div>
				</router-link>
			</ul>
		</scroll>
		<none-tip
		 :msg="msg"
		 v-show="courseList.length==0"
		></none-tip>
	</div>
</template>
<script>
import { getCourseList } from "@/api/api";
import NoneTip from "@/components/NoneTip/NoneTip";
import Scroll from "@/components/Scroll/Scroll";
export default {
  name: "CourseList",
  components: {
    Scroll,
    NoneTip
  },
  props: {
    keywords: {
      type: String,
      default: ""
    },
    typeid: {
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
      courseList: [],
      timer: null
    };
  },
  computed: {
    pullupMsg() {
      return this.noMoreData ? "没有更多数据" : "上拉获取更多课程信息";
    },
    msg() {
      if (this.noMoreData)
        return this.keywords != "" || this.typeid != ""
          ? `搜索不到"${this.keywords}"相关的课程`
          : "暂时没有课程";
      else return "加载中...";
    }
  },
  methods: {
    clearData() {
      this.page = 1;
      this.noMoreData = false;
      this.courseList = [];
    },
    loadCourseList() {
      this.$toast({
        type: "loading",
        message: "加载中..."
      });
      getCourseList({
        p: this.page,
        offset: this.offset,
        keywords: this.keywords,
        coursetypeid: this.typeid
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
            courseId,
            title,
            img,
            desc,
            influence,
            voteNum,
            watchNum,
            introduce
          }) => {
            this.courseList.push({
              courseId,
              title,
              courseImg: img,
              desc: desc.trim(),
              voteNum,
              watchNum,
              introduce
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
      if (!this.noMoreData) this.loadCourseList();
    },
    refresh() {
      if (this.timer) clearTimeout(this.timer); //列表需要等待折叠面板的动画完成后刷新
      this.timer = setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 350);
    }
  },
  created() {
    this.loadCourseList();
  }
};
</script>
<style lang="stylus" scoped>
.data>>>.iconfont
	font-size: 0.25rem
	padding-right: 0.06rem

.course-wrapper
	position: absolute
	overflow: hidden
	width: 100%
	top: 0
	bottom: 0
	background-color: #fff

	.course-list
		padding: 0 0.25rem

		.course-item
			display: flex
			align-items: center
			padding: 0.2rem 0

			&:nth-last-child(n+2)
				border-bottom: 1px #eee solid

			.item-info
				flex: 1

			.photo-wrapper
				width: 3.1rem
				height: 1.8rem
				margin-right: 0.16rem
				background-color: #dfdfdf

				.course-img
					display: none
					height: 100%
					width: 100%

			.titel
				font-size: 0.36rem

			.tips-wrapper
				font-size: 0.28rem
				color: #a0a0a0
				padding-top: 0.2rem
				white-space: initial
				overflow: hidden
				position: relative
				line-height: 0.38rem
				height: 0.76rem

				.tipsOver:after
					background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%)
					repeat: scroll 0 0 rgba(0, 0, 0, 0)
					bottom: 0
					content: '...'
					padding: 0 0.05rem 0 0.2rem
					position: absolute
					right: 0

			.data
				float: right
				padding-top: 0.15rem
				line-height: 1
				font-size: 0.26rem
				color: #999999
				padding-right: 0.2rem
</style>
