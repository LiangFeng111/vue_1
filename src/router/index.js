import {createRouter, createWebHistory} from 'vue-router'
import Login from '@/views/Login';
import Layout from '@/layout/Layout';
import Register from '@/views/Register';
import store from "@/store";

const routes = [

    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },

    {
        path: '/404',
        name: '404',
        component: ()=>import('@/views/404')
    },
    {
        path: '/front',
        name: 'Front',
        component: ()=>import("../views/front/Front"),
        children: [
            {
                path: 'home',
                name: "Home",
                component: () => import("../views/front/Home"),
            },
            {
                path: 'person',
                name: "Person",
                component: () => import("../views/front/Person"),
            },
            {
                path: 'notice',
                name: "FrontNotice",
                component: () => import("../views/front/Notice"),
            },
            {
                path: 'noticeDetail',
                name: "NoticeDetail",
                component: () => import("../views/front/NoticeDetail"),
            },
            {
                path: 'detail',
                name: "Detail",
                component: () => import("../views/front/Detail"),
            },
            {
                path: 'cart',
                name: "FrontCart",
                component: () => import("../views/front/Cart"),
            },
            {
                path: 'orders',
                name: "FrontOrders",
                component: () => import("../views/front/Orders"),
            },
            {
                path: 'collect',
                name: "Collect",
                component: () => import("../views/front/Collect"),
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


//提供一个重置路由的方法
export const resetRouter = ()=>{
    router.matcher = new createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes
    })
}

//注意刷新页面会重置路由
export const setRoutes = () => {
    const storeMenus = localStorage.getItem("menus")
    if (storeMenus) {
        //获取当前动态路由对象名称数组
        const currentRouteNames = router.getRoutes().map(v => v.name)
        if (!currentRouteNames.includes('Layout')) {
            //拼装动态路由
            const manageRoute = {
                path: '/',
                name: "Layout",
                redirect: '/front/home',
                component: Layout,
                children: [
                    {
                        path: 'person',
                        name: "个人信息",
                        component: () => import("@/views/Person"),
                    },
                    {
                        path: 'password',
                        name: "修改密码",
                        component: () => import("@/views/Password"),
                    },
                ]
            }
            const menus = JSON.parse(storeMenus)
            menus.forEach(item => {
                if (item.path) { //当path不为空的时候才去设置路由
                    let itemMenu = {
                        path: item.path.replace("/", ""),
                        name: item.name,
                        component: () => import("@/views/" + item.pagePath)
                    }
                    manageRoute.children.push(itemMenu)
                } else if (item.children.length) {
                    item.children.forEach(item1 => {
                        if (item1.path) {
                            let itemMenu = {
                                path: item1.path.replace("/", ""),
                                name: item1.name,
                                component: () => import("@/views/" + item1.pagePath)
                            }
                            manageRoute.children.push(itemMenu)
                        }
                    })
                }
            })
            //动态添加到现在的路由里面去
            router.addRoute(manageRoute)
        }
    }
}
//重置就在set一次
setRoutes();

// 这里就可以进行vue-router的beforeEach拦截了
router.beforeEach((to, from, next) =>{
    localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
    store.commit("setPath")

    // 未找到路由的情况
    if (!to.matched.length) {
        const storeMenus = localStorage.getItem("menus")
        if (storeMenus) {
            next("/404")
        } else {
            // 跳回登录页面
            next("/login")
        }
    }
    // 其他的情况都放行
    next()
})


export default router
