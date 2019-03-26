<template>
    <div class="error-page">

        <none-tip
            msg="该页面不存在~"
            v-show="true"
            :picType="1"
        ></none-tip>
        <div class="btn-wrapper">
            <van-button
                size="large"
                @click="()=>this.$router.push(`/home/index`)"
            >前往首页</van-button>
        </div>
    </div>
</template>

<script>
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  name: "ErrorPage",
  components: {
    NoneTip
  }
};
</script>

<style lang="stylus" scoped>
.btn-wrapper
    position: relative
    top: 3rem
    margin: 0 1.5rem
</style>