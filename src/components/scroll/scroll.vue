<template>
  <div ref="wrapper">
    <div>
      <!-- 刷新提示信息 -->
      <div
        class="top-tip"
        v-show="pulldown&&pulldownUI"
      >
        <span class="refresh-hook">{{pulldownMsg}}</span>
      </div>
      <slot></slot>
      <!-- 底部提示信息 -->
      <div
        class="bottom-tip"
        v-show="pullupUIShow"
      >
        <span class="loading-hook">{{pullupMsg}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    pulldownMsg: {
      type: String,
      default: "下拉刷新最新数据"
    },
    pullupMsg: {
      type: String,
      default: "上拉获取更多数据"
    },
    pulldownUI: {
      type: Boolean,
      default: true
    },
    pullupUI: {
      type: Boolean,
      default: true
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件,触碰到底部
     */
    scrollToEnd: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部上拉的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 上下拉触发条件的偏移量
     */
    pullOffset: {
      type: Number,
      default: 50
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      /**
       * 需要控制，防止加载前显示出来
       */
      pullupUIShow: false
    };
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        swipeTime: 3000
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on("scroll", pos => {
          me.$emit("scroll", pos);
        });
      }

      // 是否派发滚动接触到底部事件，用于快速继续加载
      if (this.scrollToEnd) {
        this.scroll.on("scrollEnd", () => {
          // 滚动到底部
          if (this.scroll.y <= this.scroll.maxScrollY) {
            this.$emit("scrollToEnd");
          }
        });
      }

      // 是否派发顶部下拉或上拉事件，用于下拉刷新或上拉加载
      if (this.pulldown || this.pullup) {
        this.scroll.on("touchEnd", pos => {
          // 下拉动作
          if (this.pulldown && pos.y > this.pullOffset) {
            this.$emit("pulldown");
          }
          // 上拉动作
          if (this.pullup && pos.y < this.scroll.maxScrollY - this.pullOffset) {
            this.$emit("pullup");
          }
        });
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    disable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
        this.pullupUIShow =
          this.pullup && this.pullupUI && this.scroll.maxScrollY < 0;
      }, this.refreshDelay);
    }
  }
};
</script>
<style scoped>
/* 下拉、上拉提示信息 */
.top-tip,
.bottom-tip {
  position: absolute;
  background-color: #f2f2f2;

  left: 0;
  z-index: 1;
  width: 100%;
  height: 0.98rem;
  line-height: 0.98rem;
  text-align: center;
  color: #a3a3a3;
  font-size: 0.3rem;
}
.top-tip {
  top: -0.98rem;
}
.bottom-tip {
  bottom: -0.98rem;
}
</style>
