<script setup lang="ts">
import  {useRouter}  from 'vue-router'
import {inject } from 'vue'
import {ChessWebSocket} from "../tool/WebSocket"
import { showNotify } from 'vant';
import 'vant/es/notify/style';
let ws = inject("$ws") as ChessWebSocket;

const props = defineProps(
  ['item']
)

  //进入房间
const router =  useRouter()
const addHome = () => {
  ws.sendMsg(JSON.stringify({
    type:103,
     data:
    {   hostId:props.item.id,
        guestId:ws.playerData.id
    }})
  )
  router.replace(`/game/?id=${props.item.id}&name=${props.item.name}`)
  showNotify({ type: 'success', message: '加入成功' });
}
</script>

<template>
  <div>
    <button class="btn" @click="addHome">{{ item.name }}的房间</button>
  </div>
</template>

<style scoped>
.btn{
  width: 200px;
  height: 60px;
  border: 1px solid #efefef;
  background-color: #fff;
  border-radius: 30px;
  margin-top: 10px;
}
/* .btn:hover{
  box-shadow: 1px 20px 10px 10px rgba(0,0,0,0.5);
} */
</style>
