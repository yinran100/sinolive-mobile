<template>
  <div class="container" @click="hide">
    <div class="wrapper">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item,index) in imgs" :key="index">
          <img class="swiper-img" :src="item">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
export default {
  name: "Gallery",
  props: {
    imgs: Array,
    index: { type: Number, default: 0 }
  },
  methods: {
    hide() {
      this.$emit("galleryClick");
    }
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        observer: true,
        observeParents: true
      }
    };
  },
  watch: {
    index(newVue) {
      if (!isNaN(Number(newVue))) {
        this.$refs.mySwiper.swiper.slideTo(newVue, 0, false);
      }
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
}
.wrapper {
  width: 100%;
}
.swiper-img {
  width: 100%;
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.swiper-pagination {
  color: #fff;
  position: fixed;
  font-size: 0.34rem;
  top: 0.2rem;
}
.swiper-container {
  overflow: inherit;
}
</style>
