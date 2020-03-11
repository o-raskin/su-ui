import Vue from 'vue'
import VueRouter from 'vue-router'
import Skills from "@/components/skills/Skills.vue";
import Home from '@/components/home/Home.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/skills',
    name: 'Skills',
    component: Skills
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
