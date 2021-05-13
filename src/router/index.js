import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import( '../views/Projects.vue' ),
    props: route => ({
      cateID: route.query.cateID,
      tagID: route.query.tagID
    })
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('../views/Rank.vue')
  },
  {
    path: '/slot',
    name: 'Slot',
    component: () => import('../views/Slot.vue')
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import( '../views/Project.vue' ),
    props:true
  },
  {
    path: '/submit',
    name: 'Submit',
    component: () => import('../views/Submit.vue')
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
