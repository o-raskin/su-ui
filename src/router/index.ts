import Vue from 'vue'
import VueRouter from 'vue-router'
import Skills from "@/components/skills/SkillBoard.vue";
import Home from '@/components/home/Home.vue';
import NotFound from '@/components/common/NotFound.vue';
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
        path: '/profile/:id',
        name: 'UserProfile',
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
    {
        path: '/404',
        component: NotFound,
        beforeEnter: ifAuthenticated
    },
    {
        path: '*',
        redirect: '/404',
        beforeEnter: ifAuthenticated
    },
]
