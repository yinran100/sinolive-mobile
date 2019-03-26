<template>
  <div class="wrapper">
    <com-header
      toLink="-1"
      titleText="头像"
      :rightText="viewModel?'':'使用'"
      @click="finish"
    ></com-header>

    <div
      class="view-wrapper"
      v-if="viewModel"
    >
      <div class="img-wrapper">
        <img
          :src="imgUrl"
          alt=""
        >
      </div>
      <van-uploader
        :after-read="onRead"
        :max-size="1024*1024*8"
        @oversize="oversize"
      >
        <div class="btn">修改头像</div>
      </van-uploader>
    </div>
    <div
      class="view-wrapper"
      v-else
    >
      <div class="cropper-wrapper">
        <vue-cropper
          ref="cropper"
          :img="cropperOption.img "
          :outputSize="cropperOption.size"
          :outputType="cropperOption.outputType"
          :canScale="cropperOption.canScale"
          :autoCrop="cropperOption.autoCrop"
          :autoCropWidth="cropperOption.autoCropWidth"
          :autoCropHeight="cropperOption.autoCropHeight"
          :fixed="cropperOption.fixed"
          :fixedNumber="cropperOption.fixedNumber"
        ></vue-cropper>
      </div>
      <div class="btn-group">
        <van-uploader
          :after-read="onRead"
          :max-size="1024*1024*8"
          @oversize="oversize"
        >
          <div class="btn">重新选择</div>
        </van-uploader>

        <div
          class="btn"
          @click="turnLeft"
        ><span class="iconfont icon-zuoxuanzhuan90du"></span>
        </div>
        <div
          class="btn"
          @click="turnRight"
        ><span class="iconfont icon-youxuanzhuandu"></span>
        </div>
        <div
          class="btn"
          @click="reset"
        ><span class="iconfont icon-zhongzhi"></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ComHeader from "@/components/Header/ComHeader";
import { mapState, mapGetters } from "vuex";
import VueCropper from "@/components/VueCropper/vue-cropper";
import { modifyAvatar } from "@/api/api";
export default {
  components: {
    ComHeader,
    VueCropper
  },
  data: function() {
    return {
      viewModel: true,
      imgUrl: "",
      imgfile: null,
      cropperOption: {
        //img的路径自行修改
        img: "",
        size: 1,
        outputType: "jpeg",
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixed: true,
        // 真实的输出宽高
        infoTrue: false,
        fixedNumber: [1, 1] //1:1的头像
      }
    };
  },
  computed: {
    ...mapState([
      "userMsg",
      "token",
      "systemInfo",
      "deviceId",
      "provinceId",
      "timestamp"
    ]),
    ...mapGetters(["sign"])
  },
  mounted() {
    this.imgUrl = this.userMsg.avatar;
  },
  methods: {
    turnLeft() {
      this.$refs.cropper.rotateLeft();
    },
    turnRight() {
      this.$refs.cropper.rotateRight();
    },
    reset() {
      this.$refs.cropper.rotateClear();
    },
    //点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropData(data => {
        this.modelSrc = data;
        //this.viewModel = true;

        this.imgfile = this.dataURLtoFile(this.modelSrc);
        console.log(this.imgfile);
        this.saveAvatar();
      });
    },
    saveAvatar() {
      this.$toast({
        type: "loading",
        forbidClick: true,
        mask: true,
        message: "提交中..."
      });
      let formData = new FormData(); //通过formdata上传
      this.$store.commit("updateTimestamp");
      formData.append("avatar", this.imgfile);
      formData.append("userid", this.userMsg.userid);
      formData.append("sessionid", this.token);
      formData.append("deviceid", this.deviceid);
      formData.append("channel", this.systemInfo.channel);
      formData.append("version", this.systemInfo.version);
      formData.append("provinceId", this.provinceId);
      formData.append("timestamp", this.timestamp);
      formData.append("sign", this.sign);
      modifyAvatar(formData).then(
        res => {
          this.$toast.clear();
          res = res.data;
          if (res.code == 1) {
            this.$toast.success("修改成功");
            this.$store.commit("saveUserMsg", { avatar: res.data.url });
            this.$router.go(-1);
          } else {
            if (res.message) this.$toast(res.message);
          }
        },
        () => {
          this.$toast("网络出错,请稍后重试");
        }
      );
    },
    oversize() {
      this.$toast("图片大小不能超过8M");
    },
    onRead(file) {
      this.imgfile = file.file;
      let imgUrl = this.getObjectURL(this.imgfile);
      this.viewModel = false;
      this.cropperOption.img = imgUrl;
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    dataURLtoFile(dataurl, filename) {
      //把cropper生成的DataUrl转换成file对象
      if (filename == undefined) filename = this.randomChar() + ".jpeg";
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    randomChar(l = 6) {
      //生成随机文件名
      let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
      let tmp = "";
      let timestamp = new Date().getTime();
      for (let i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
      }
      return tmp + timestamp;
    }
  }
};
</script>
<style lang="stylus" scoped>
.wrapper>>>.btn
  background-color: rgba(128, 128, 128, 0.4)
  padding: 0.15rem 0.2rem
  border-radius: 0.06rem
  color: #ccc
  text-align: center
  margin-bottom: 0.3rem

  &:active
    background-color: rgba(128, 128, 128, 0.7)

.wrapper>>>.iconfont
  font-size: 0.46rem

.wrapper
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  flex-direction: column

  .view-wrapper
    flex: 1
    background-color: #333

    .img-wrapper
      width: 100%
      height: 100%

      img
        width: 100%
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)

    .van-uploader
      position: fixed
      bottom: 0.7rem
      width: 70%
      left: 50%
      transform: translate(-50%, 0%)

  .cropper-wrapper
    width: 100%
    height: 100%

  .btn-group
    position: fixed
    right: 0.3rem
    top: 1.2rem
</style>
