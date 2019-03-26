// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/store";
import moment from "moment";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import fastClick from "fastclick";
import "./assets/font/iconfont.css";
import Vant from 'vant';
import 'vant/lib/index.css';
// import "./assets/css/reset.css";
// import "./assets/css/border.css";
import "./assets/css/overWrite.css";


Vue.use(Vant);
Vue.config.productionTip = false;
fastClick.attach(document.body);
Vue.use(VueAwesomeSwiper /* { default global options } */ );
//时间戳转换为特定格式
Vue.filter("moment", function (value, formatString) {
    formatString = formatString || "YYYY-MM-DD";
    return moment(value).format(formatString);
});
/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    components: {
        App
    },
    template: "<App/>"
});
