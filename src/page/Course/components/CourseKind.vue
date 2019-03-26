<template>
    <van-collapse
        class="kind-wrapper"
        v-model="activeNames"
    >
        <van-collapse-item
            name="1"
            value="课程类别"
        >
            <div slot="title">筛选<i class="iconfont icon-shaixuan"></i></div>

            <div
                class="tag-wrapper"
                @touchstart="select"
            >
                <van-tag
                    class="kind-item"
                    v-for="item in kinds"
                    :key="item.coursetypeId"
                    :coursetypeId="item.coursetypeId"
                    :plain="selectKind.indexOf(item.coursetypeId+'')<0"
                    type="primary"
                    size="medium"
                >{{item.coursetype}}</van-tag>

                <div
                    class="clear-btn"
                    @click="clear"
                >
                    <van-icon name="delete" />
                </div>
            </div>

        </van-collapse-item>
    </van-collapse>

</template>

<script>
export default {
  props: {
    kinds: { type: Array, default: [] }
  },
  data() {
    return {
      activeNames: [],
      selectKind: []
    };
  },
  watch: {
    selectKind(val) {
      this.$emit("change", val);
    },
    activeNames() {
      this.$emit("fresh");
    }
  },
  methods: {
    select(event) {
      if (!event.target.attributes.coursetypeId) return;
      let id = event.target.attributes.coursetypeId.value;
      let index = this.selectKind.indexOf(id);
      if (index >= 0) {
        this.selectKind.splice(index, 1);
      } else this.selectKind.push(id);
    },
    clear() {
      this.selectKind = [];
    }
  }
};
</script>

<style lang="stylus" scoped>
.iconfont
    padding-left: 0.04rem

.tag-wrapper
    line-height: 2

    .van-tag
        line-height: 1.5

    .kind-item
        margin-right: 0.25rem

    .clear-btn
        display: inline-block
        padding: 0.05rem
        font-size: 0.22rem
        line-height: 0.41rem
        text-align: center
        color: #666
        width: 0.36rem
        height: 0.36rem
        background-color: #fff
        border-radius: 50%
        border: 1px solid #eee

        &:active
            background-color: #eee
</style>
