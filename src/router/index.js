import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import CourseList from '../views/course/list.vue'
import CourseDetail from '../views/course/detail.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/course',
        name: 'CourseList',
        component: CourseList
      },
      {
        path: '/course/view/:id',
        name: 'CourseDetail',
        component: CourseDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 