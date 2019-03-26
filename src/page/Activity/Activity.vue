<template>
  <div class="activity">
    <com-header titleText="活动"></com-header>
    <none-tip msg="暂未开通 敬请期待" v-show="true" :picType="1"></none-tip>
  </div>
</template>
<script>
import ComHeader from "@/components/Header/ComHeader";
import NoneTip from "@/components/NoneTip/NoneTip";
export default {
  components: { ComHeader, NoneTip }
};
</script>
<style scoped>
</style>