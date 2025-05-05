import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import CourseList from '../views/course/list.vue'
import CourseDetail from '../views/course/detail.vue'
import ExamList from '../views/exam/list.vue'
import ExamStart from '../views/exam/start.vue'
import ExamReview from '../views/exam/review.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/course',
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
      },
      {
        path: '/exam',
        name: 'ExamList',
        component: ExamList
      },
      {
        path: '/exam/start/:id',
        name: 'ExamStart',
        component: ExamStart
      },
      {
        path: '/exam/review/:id',
        name: 'ExamReview',
        component: ExamReview
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 