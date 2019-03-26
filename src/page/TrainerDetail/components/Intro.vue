<template>
  <div class="intro-wrapper">{{introduce}}</div>
</template>
<script>
export default {
  name: "Intro",
  props: { introduce: String }
};
</script>

<style scoped>
.intro-wrapper {
  padding: 0.3rem 0.3rem 0.1rem;
  color: #3c444e;
  font-size: 0.3rem;
  line-height: 1.5;
}
</style>
