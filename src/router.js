import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/HomeView.vue'
import QuestionnaireList from './components/QuestionnaireList.vue'
import QuestionnaireForm from './components/QuestionnaireForm.vue'
const routes = [
  { path: '/', component: HomeView },
  { path: '/questionnaires', component: QuestionnaireList },
  { path: '/questionnaires/new', component: QuestionnaireForm },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
