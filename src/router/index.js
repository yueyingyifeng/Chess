import { createRouter, createWebHistory } from 'vue-router'

import game from '../pages/game.vue'
import menu from '../pages/menu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
        path:'/menu',
        component:menu
    },
    {
      path: '/',
      component: menu,
      redirect: '/menu'
    },
    {
        path:'/game/:id',
        component:game
    }
  ]
});
export default router
