import Vue from "vue";
import Store from '@/store/store'
import Router from "vue-router";
import Home from "@/page/Home";
import IndexPage from "@/page/Index/Index";
import MyExam from "@/page/MyExam/MyExam";
import LiveCenter from "@/page/LiveCenter/LiveCenter";
import StudyTask from "@/page/StudyTask/StudyTask";
import TaskDetail from "@/page/TaskDetail/TaskDetail";
import Mine from "@/page/Mine/Mine";
import Login from "@/page/Login/Login";
import Download from "@/page/Download/Download";
import Course from "@/page/Course/Course";
import Attestation from "@/page/Attestation/Attestation";
import News from "@/page/News/News";
import NewsContent from "@/page/NewsContent/NewsContent";
import Trainer from "@/page/Trainer/Trainer";
import PersonInfo from '@/page/PersonInfo/PersonInfo'
import CutPicture from '@/page/PersonInfo/components/CutPicture'
import GiftPost from '@/page/Activity/GiftPost/GiftPost'
import InputInfo from '@/page/Activity/GiftPost/InputInfo'
import GiftList from '@/page/Activity/GiftPost/GiftList'

import {
    hasLogin
} from "@/api/api";
Vue.use(Router);
const router = new Router({
    routes: [{
            path: "/",
            redirect: "/home/index"
        },
        {
            path: "/home",
            component: Home,
            redirect: "/home/index",
            children: [{
                    path: "index",
                    meta: {
                        index: 0.1,
                        requireAuth: true // 进入这个路由是否需要登录
                    }, //meta对象的index用来定义当前路由的层级,越小越高
                    component: IndexPage,
                    beforeEnter: (to, from, next) => {
                        if (Store.state.activityId == 4 && Store.state.provinceId == 83) {
                            next({
                                path: '/giftlist'
                            })
                        } else next()
                    }
                },
                {
                    path: "news",
                    meta: {
                        index: 0.2,
                        requireAuth: true // 进入这个路由是否需要登录
                    },
                    component: News
                },
                {
                    path: "liveCenter",
                    meta: {
                        index: 0.3,
                        requireAuth: true // 进入这个路由是否需要登录
                    },
                    component: LiveCenter
                },
                {
                    path: "trainer",
                    meta: {
                        index: 0.4,
                        requireAuth: true // 进入这个路由是否需要登录
                    },
                    component: Trainer
                },
                {
                    path: "mine",
                    meta: {
                        index: 0.5,
                        requireAuth: true // 进入这个路由是否需要登录
                    },
                    component: Mine
                }
            ]
        },
        {
            path: "/newslist",
            name: "News",
            meta: {
                index: 2,
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: News
        },
        {
            path: "/liveCenter",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: LiveCenter
        },
        {
            path: "/login",
            name: "Login",
            meta: {
                index: 0,
                title: "站主登录"
            },
            component: Login
        },
        {
            path: "/Exam",
            name: "exam",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: MyExam
        },
        {
            path: "/answer/:id",
            name: "Answer",
            meta: {
                index: 5,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Answer/Answer')
        },
        {
            path: "/liveRoom/:id",
            name: "LiveRoom",
            meta: {
                index: 4,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: () => import('@/page/LiveRoom/LiveRoom')
        },
        {
            path: "/task",
            name: "StudyTask",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: StudyTask
        },
        {
            path: "/taskdetail/:id",
            name: "TaskDetail",
            meta: {
                index: 2,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: TaskDetail
        },
        {
            path: "/download",
            meta: {
                index: 6,
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: Download
        },
        {
            path: "/course",
            name: "Course",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: Course
        },
        {
            path: "/attestation",
            name: "Attestation",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: Attestation
        },
        {
            path: "/newsContent/:id",
            name: "NewsContent",
            meta: {
                index: 2,
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: NewsContent
        },
        {
            path: "/trainer",
            name: "Trainer",
            meta: {
                index: 1,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: Trainer
        },
        {
            path: "/trainerDetail/:id",
            name: "TrainerDetail",
            meta: {
                index: 2,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: () => import('@/page/TrainerDetail/TrainerDetail') //
        },
        {
            path: "/courseDetail/:id",
            name: "CourseDetail",
            meta: {
                index: 2,
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: () => import('@/page/CourseDetail/CourseDetail')
        },
        {
            path: "/personinfo",
            name: "PersonInfo",
            meta: {
                index: 9,
                title: "个人资料",
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: PersonInfo
        },
        {
            path: "/cutPicture",
            name: "cutPicture",
            meta: {
                index: 10,
                title: "头像修改",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: CutPicture
        },
        {
            path: "/giftpost",
            name: "giftpost",
            meta: {
                index: 3,
                title: "活动页面",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: GiftPost
        },
        {
            path: "/giftlist",
            name: "giftlist",
            meta: {
                index: 4,
                title: "个人中心",
                requireAuth: true // 进入这个路由是否需要登录
            },
            component: GiftList

        },
        {
            path: "/inputinfo/:id",
            name: "inputinfo",
            meta: {
                index: 6,
                title: "礼品登记",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: InputInfo
        },
        {
            path: "/activity/sendgift",
            name: "sendgift",
            meta: {
                index: 6,
                title: "派发礼品",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/GiftPost/SendGift')
        },
        {
            path: "/stationsearch",
            name: "stationsearch",
            meta: {
                index: 3,
                title: "站点查询",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/StationSearch/StationSearch')
        },
        {
            path: "/activity/szlsf",
            name: "szlsf",
            meta: {
                index: 5,
                title: "新年利是封",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/ActivitySZ/ActivityMain')
        },
        {
            path: "/activity/stationremain",
            name: "stationremain",
            meta: {
                index: 6,
                title: "站点库存",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/ActivitySZ/StationRemain')
        },
        {
            path: "/activity/getlsf/:stationCode",
            name: "getlsf",
            meta: {
                index: 8,
                title: "领取利是封",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/GetLsf/GetLsf')
        },
        {
            path: "/activity/activityhelp",
            name: "ActivityHelp",
            meta: {
                index: 6,
                title: "操作指南",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/ActivitySZ/ActivityHelp')
        },
        {
            path: "/activity/lsfsuccess",
            name: "LsfSuccess",
            meta: {
                index: 9,
                title: "领取成功",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/GetLsf/LsfSuccess')
        },
        {
            path: "/activity/getpaper",
            name: "getpaper",
            meta: {
                index: 10,
                title: "报纸领取",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/GetLsf/GetPaper')
        }, {
            path: "/activity/papersuccess",
            name: "paperSuccess",
            meta: {
                index: 11,
                title: "领取成功",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/GetLsf/PaperSuccess')
        },
        {
            path: "/activity/phonesearch",
            name: "phonesearch",
            meta: {
                index: 7,
                title: "信息查询",
                requireAuth: false // 进入这个路由是否需要登录
            },
            component: () => import('@/page/Activity/PhoneSearch/PhoneSearch')
        },
        {
            path: "*",
            meta: {
                index: 10,
                title: "找不到页面",
            },
            component: () => import('@/page/ErrorPage/ErrorPage')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        };
    }
})
router.beforeResolve((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = '尊信培训'
    }
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        let timestamp = Math.floor(new Date().getTime() / 1000);
        if (Store.state.token == "") {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        } else if (timestamp - Store.state.checkLoginTime > 600) { //超时检测是否登录
            hasLogin(timestamp).then(res => { //远程检测
                res = res.data;
                if (res.code == 1) {
                    console.log("用户已登录");
                    Store.commit("saveStateInfo", res.state);
                    //存已登录
                    Store.commit("saveLogin", 1);
                    Store.commit("saveLoginTime", timestamp);
                    next();
                } else if (res.code == 104) {
                    console.log(res.message);
                    Store.commit("saveStateInfo", res.state);
                    next({
                        path: to.fullPath
                    })
                } else {
                    Store.commit("saveLogin", 0);
                    console.log("未登录");
                    next({
                        path: '/login',
                        query: {
                            redirect: to.fullPath
                        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    })
                }
            }); //检查是否登录
        } else next();
    } else {
        next();
    }
})
router.afterEach((to, from) => {
    document.getElementById('my-loading').style.display = 'none'
})
export default router;
