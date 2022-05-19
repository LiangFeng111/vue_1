import {createRouter, createWebHistory} from 'vue-router'
import Login from '@/views/Login';
import Layout from '@/layout/Layout';
import Register from '@/views/Register';

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
        path: '/front',
        name: 'Front',
        component: ()=>import("@/views/front/Front"),
        redirect: '/front/home',
        children: [
            {
                path: 'home',
                name: "前台",
                component: () => import("@/views/front/Home"),
            },
        ]
    },
    {
        path: '/:catchAll(.*)',// 不识别的path自动匹配404
        name: '404',
        component: () => import('@/views/404'),

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
    const storeMenus = sessionStorage.getItem("menus")
    if (storeMenus) {
        //获取当前动态路由对象名称数组
        const currentRouteNames = router.getRoutes().map(v => v.name)
        if (!currentRouteNames.includes('Layout')) {
            //拼装动态路由
            const manageRoute = {
                path: '/',
                name: "Layout",
                redirect: '/home',
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
setRoutes();

export default router
