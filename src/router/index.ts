import { createRouter, createWebHistory } from 'vue-router'
import { inject } from 'vue';
import {ChessWebSocket} from "../tool/WebSocket"
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
      redirect: '/menu'
    },
    {
      path:'/game',
      component:game
    }
  ]
});

router.beforeEach((to) => {
  let ws = inject("$ws") as ChessWebSocket;
  if (ws.playerData.id === -1 && to.path !== '/menu') return '/menu'
})

export default router
