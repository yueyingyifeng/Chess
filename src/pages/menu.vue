<script setup lang="ts">
import { reactive,onMounted,inject,onBeforeUnmount } from 'vue'
import RoomList from "../components/menu_RoomList.vue";
import PlayerList from "../components/menu_PlayerList.vue";
import {ChessWebSocket} from "../tool/WebSocket"
import { stringify } from 'querystring';
import { showDialog } from 'vant'
import 'vant/es/dialog/style';


let getPlayerList : Array<number> = reactive([]);
let getRoomList : Array<number> = reactive([]);
let ws = inject("$ws") as ChessWebSocket;

onMounted(()=>{
  let n = prompt("名字");
  if(n == null)
    n = "一个不愿意敲自己名字的家伙";
    ws.getId().then((e)=>{
    let json = {
      type:1,
      data:{
        id:e,
        name:n
      }
    };
    ws.id = e as number;
    ws.ws.send(JSON.stringify(json));

    ws.ws.onmessage = function(e) {
      const temp = JSON.parse(e.data);
      if(temp.type == 6){
        getPlayerList.values = temp.data;
      }
      if(temp.type == 5){
        getRoomList.values = temp.data;
      }
  
    }

    window.addEventListener("beforeunload",(e)=>{
      e = e || window.event;
        if (e) {
            e.returnValue = '关闭提示';
            
        }
        return '关闭提示';

    });

    window.addEventListener("unload",e=>{
      let json = {
              type:0,
              data:{
                id:ws.id,
              }
            };
            console.log(JSON.stringify(json));
            ws.ws.send(JSON.stringify(json));
    })
  })
})





function createRoom(){
  showDialog({
  title: '标题',
  message: '代码是写出来给人看的，附带能在机器上运行。',
}).then(() => {
  // on close
});

startGame()
}

//开始游戏
const emit = defineEmits(['start']) 
const startGame = () =>{
  emit("start")
}


</script>

<template>
  <div>
    <button class="btn" @click="createRoom">创建房间</button>
    <RoomList :items="getRoomList.values"/>
    <PlayerList :items="getPlayerList.values"/>


  </div>
</template>

<style scoped>
.btn{
  width: 200px;
  height: 60px;
  border: 1px solid #efefef;
  background-color: #ef6500;
  border-radius: 30px;
  margin-top: 100px;
  font-family:monospace;
}
</style>
