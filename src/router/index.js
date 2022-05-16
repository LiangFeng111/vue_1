import {createRouter, createWebHistory} from 'vue-router'
import User from "@/views/User";
import Login from '@/views/Login';
import Layout from '@/layout/Layout';
import Register from '@/views/Register';

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
              path: 'home',
              name: "主页",
              component: ()=>import("@/views/Home")
            },
            {
                path: 'user',
                name: '用户管理',
                component: User
            },
            {
                path: 'person',
                name: '个人信息',
                component: ()=>import("@/views/Person")
            },
            {
                path: 'file',
                name: '文件管理',
                component: ()=>import("@/views/File")
            },
            {
                path: 'role',
                name: '角色管理',
                component: ()=>import("@/views/Role")
            },

        ]
    },
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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
