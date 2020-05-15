import Vue from 'vue'
import VueRouter from 'vue-router'
import SkillBoard from "@/components/skills/SkillBoard.vue";
import ProfilesBoard from "@/components/employee/ProfilesBoard.vue";
import Home from '@/components/profile/Home.vue';
import NotFound from '@/components/common/NotFound.vue';
import Forbidden from '@/components/common/Forbidden.vue';
import Login from '@/components/auth/login/Login.vue';
import {store} from '../../store';
import Management from "@/components/management/Management.vue";
import SkillTable from "@/components/skills/SkillTable.vue";
import PlanningBoard from "@/components/planning/PlanningBoard.vue";

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
        component: SkillBoard,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/skills/:id',
        name: 'UserSkillBoard',
        component: SkillBoard,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/skills/:id/table',
        name: 'UserSkillTable',
        component: SkillTable,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/employees',
        name: 'ProfilesBoard',
        component: ProfilesBoard,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/planning',
        name: 'PlanningBoard',
        component: PlanningBoard,
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
        path: '/management',
        name: 'Management',
        component: Management,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/404',
        component: NotFound,
        beforeEnter: ifAuthenticated
    },
    {
        path: '/403',
        name: 'Forbidden',
        component: Forbidden,
        beforeEnter: ifAuthenticated
    },
    {
        path: '*',
        redirect: '/404',
        beforeEnter: ifAuthenticated
    },
]
