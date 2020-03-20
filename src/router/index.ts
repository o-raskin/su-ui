import Vue from 'vue'
import VueRouter from 'vue-router'
import Skills from "@/components/skills/SkillBoard.vue";
import Home from '@/components/home/Home.vue';
import Login from '@/components/auth/login/Login.vue';
import {store} from '../../store';

Vue.use(VueRouter)

const ifNotAuthenticated = (to: any, from: any, next: any) => {
    if (!store.state.currentUser.id) {
        next()
        return
    }
    next('/')
}

const ifAuthenticated = (to: any, from: any, next: any) => {
    if (store.state.currentUser.id) {
        next()
        return
    }
    next('/login')
}

export const routes = [
    {
        path: '/skills',
        name: 'SkillBoard',
        component: Skills,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: ifNotAuthenticated,
    },
    // {
    //     path: '/500',
    //     component: ServerError,
    //     meta:
    //         {
    //             //title: 'common.view.500.title'
    //         }
    // },
    // {
    //     path: '/404',
    //     component: NotFound,
    //     meta: {
    //         //title: 'common.view.404.title'
    //     }
    // },
    // {
    //     path: '*',
    //     redirect: '/404',
    //     meta: {
    //       // title: ''
    //     }
    // },
]
