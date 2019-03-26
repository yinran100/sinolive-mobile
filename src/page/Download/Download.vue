<template>
  <div class="download-page">
    <img class="phone" src="../../assets/images/phone.png" alt="">
    <p class="tittle">尊信培训平台APP下载</p>
    <a v-if="isAndroid" href="https://dev-asset.caizhanfuwu.com/app_file/app-release-201810182.apk" @click="handleAndroidClick" class="buttnLink">
      <img src="../../assets/images/android.png" alt="">
      安卓下载</a>
    <div class="wrapper" v-else-if="isiOS">
      <van-loading v-if="iosclick" color="white" />
      <a v-else-if="!iosclick&&!textShow" href="itms-services://?action=download-manifest&amp;url=https://dev-asset.caizhanfuwu.com/app_file/manifest.plist" @click="handleIosClick" class="buttnLink">
        <img src="../../assets/images/ios.png" alt="">
        IOS下载</a>
      <p v-else>正在安装，请回到桌面查看...</p>
    </div>
    <p v-else class="tittle">请在手机端打开该链接下载App</p>
    <div class="tips" v-show="tipsShow">
      <div class="tips-layer" @click="tipsShow=false"></div>
      <div class="tips-box">请点击右上角，选择“在浏览器打开”</div>
    </div>

  </div>
</template>
<script>
let ua = navigator.userAgent;
export default {
  data() {
    return {
      isAndroid: ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1,
      isiOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iosclick: false, //loading是否显示
      textShow: false, //是否显示回到桌面的提示
      patform: this.is_weixn_qq(),
      timeout: null,
      tipsShow: false //是否显示点击右上角的提示
    };
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout);
  },
  methods: {
    handleAndroidClick() {
      if (this.patform) {
        this.tipsShow = true;
      }
    },
    handleIosClick() {
      if (this.patform) {
        this.tipsShow = true;
      } else {
        this.iosclick = true;
        this.timeout = setTimeout(() => {
          this.iosclick = false;
          this.textShow = true;
        }, 2500);
      }
    },
    is_weixn_qq() {
      if (ua.match(/MicroMessenger\/[0-9]/i)) {
        return "weixin";
      }
      if (ua.match(/QQ\/[0-9]/i)) {
        return "QQ";
      }
      return false;
    }
  }
};
</script>
<style scoped>
.download-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: -webkit-linear-gradient(top, #c0d5da, #4391da);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.phone {
  display: block;
  height: 3.4rem;
  padding: 0.8rem 0 0.4rem;
}
.tittle {
  font-size: 0.34rem;
  margin: 0.4rem auto;
  color: #fff;
  text-align: center;
}
.wrapper {
  line-height: 0.9rem;
  height: 0.9rem;
  color: #fff;
  margin: 0.35rem auto;
  display: flex;
  align-items: center;
}
.buttnLink {
  display: block;
  text-decoration: none;
  line-height: 0.7rem;
  border: 1px solid #fff;
  border-radius: 0.1rem;
  font-size: 0.34rem;
  color: #fff;
  text-align: center;
  padding: 0.1rem 1.5rem;
}
.buttnLink img {
  width: 0.46rem;
  vertical-align: middle;
  position: relative;
  top: -0.05rem;
}
.tips-layer {
  z-index: 2;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
}
.tips-box {
  z-index: 5;
  position: fixed;
  max-width: 80%;
  top: 0.4rem;
  right: 0.2rem;
  color: #fff;
  padding: 0.2rem;
  line-height: 1.5;
  background-color: #0f9468;
  border-radius: 0.1rem;
}
.tips-box:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  right: 0.4rem;
  top: -0.17rem;
  border-left: 0.15rem solid #0f9468;
  border-top: 0.15rem solid transparent;
  border-bottom: 0.15rem solid transparent;
  transform: rotate(45deg);
}
</style>

