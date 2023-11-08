<script setup lang="ts">
import { inject } from "vue";
import {ChessWebSocket} from "./tool/WebSocket"
let ws = inject("$ws") as ChessWebSocket;
  ws.sendMsg(JSON.stringify({ //把对象转成字符串
        type: 102,
        data:{
          name:ws.playerData.name
        }
}))
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>