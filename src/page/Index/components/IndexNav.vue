<template>
  <div class="icons">
    <swiper :options="swiperOption">
      <!-- slides -->
      <swiper-slide
        v-for="(items,index) in pageData"
        :key="index"
      >
        <router-link
          tag="div"
          class="icon-item"
          v-for="item in items"
          :key="item.id"
          :to="item.routerTo"
        >
          <div class="icon-imgs"><img
              :src="item.imgUrl"
              alt=""
            ></div>
          <p class="icon-item-name ellipsis">{{item.navName}}</p>
        </router-link>
      </swiper-slide>
    </swiper>

  </div>
</template>

<script>
export default {
  name: "IndexNav",
  props: {
    list: Array
  },
  data() {
    return {
      swiperOption: {
        autoplay: false
      }
    };
  },
  computed: {
    pageData() {
      const PAGECOUNT = 4,
        pageData = [];
      let page = Math.ceil(this.list.length / PAGECOUNT);
      for (let i = 0; i < page; i++) {
        pageData.push(this.list.slice(i * PAGECOUNT, (i + 1) * PAGECOUNT));
      }
      return pageData;
    }
  }
};
</script>

<style lang="stylus" scoped>
.icons
  overflow: hidden

  .swiper-container
    padding-top: 0.2rem

    .icon-item
      width: 25%
      height: 1.5rem
      float: left

      .icon-imgs
        height: 0.9rem
        margin-bottom: 0.1rem
        display: block
        text-align: center
        background: url('../../../assets/images/iconback.png') no-repeat
        background-position: center
        background-size: contain

      .icon-imgs img
        height: 100%

      .icon-item-name
        bottom: 0
        line-height: 0.4rem
        font-size: 0.3rem
        text-align: center
</style>
