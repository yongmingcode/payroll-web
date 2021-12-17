import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home/Home.vue'
import Welcome from '../components/home/welcome/Welcome.vue'
import Manager from '../components/manager/Manager.vue'
import User from '../components/user/User.vue'
import Calender from '../components/class/calender/Calender.vue'
import ClassRecordList from '../components/class/class_record_list/ClassRecordList.vue'
import UserLessonCard from '../components/class/user_lesson_card/UserLessonCardList.vue'
import UserLessonRecord from '../components/class/user_lesson_record/UserLessonRecordList.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
          {path: '/welcome', component: Welcome},
          {path: '/manager', component: Manager},
          {path: '/user', component: User},
          {path: '/calendar', component: Calender},
          {path: '/class_record_list', component: ClassRecordList},
          {path: '/user_lesson_card', component: UserLessonCard},
          {path: '/user_lesson_record', component: UserLessonRecord}
        ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //      next() 放行      next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
