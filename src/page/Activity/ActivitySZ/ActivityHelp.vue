<template>
  <div class="img-wrappper">
    <com-header
      toLink="-1"
      titleText="操作指南"
    ></com-header>
    <img
      src="@/assets/images/activity/help-img.jpg"
      alt=""
    >
  </div>
</template>

<script>
import ComHeader from "@/components/Header/ComHeader";
export default {
  components: {
    ComHeader
  }
};
</script>

<style scoped>
img {
  width: 100%;
}
</style>
