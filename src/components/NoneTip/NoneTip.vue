<template>
  <div class="noOpen">
    <img v-if="picType==0" src="../../assets/images/noTest.png" alt="">
    <img v-else src="../../assets/images/noOpen.png" alt="">
    <p class="sign">{{msg}}</p>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: ""
    },
    picType: {
      type: [Number, String],
      default: 0
    }
  }
};
</script>
<style lang="stylus" scoped>
.noOpen
  position: relative
  top: 1.5rem
  display: flex
  flex-direction: column
  align-items: center

  img
    width: 2.7rem
    height: 2.7rem

  .sign
    font-size: 0.28rem
    text-align: center
    margin: 0.3rem 0.3rem 0.1rem
    line-height: 1.5
    color: #ccc
</style>
