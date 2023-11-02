<script setup lang="ts">
import { reactive,onMounted,inject } from 'vue'
import RoomList from "../components/menu_RoomList.vue";
import PlayerList from "../components/menu_PlayerList.vue";
import {ChessWebSocket} from "../tool/WebSocket"
// import { stringify } from 'querystring';
import { showLoadingToast } from 'vant';
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue';

let getPlayerList  : Array<string>  = reactive([]);
let getRoomList : Array<string> = reactive([]);
let ws = inject("$ws") as ChessWebSocket;

// 循环检测
const loopCheck = () => {
    ws.onMsg = function(e) {
      console.log(ws.playerData);
      const temp = JSON.parse(e.data); 
      if(temp.type == 6){
        getPlayerList.values = temp.data;
      }
      if(temp.type == 5){
        getRoomList.values = temp.data;
      }
    }
  
    
}

onMounted(()=>{
    loopCheck()

    window.addEventListener("beforeunload",(e)=>{
      e = e || window.event;
        if (e) {
            e.returnValue = '关闭提示';
            
        }
        return true;

    });

    window.addEventListener("unload",e=>{
      let json = {
              type:0,
              data:{
                id:ws.playerData.id,
              }
            };
            ws.send(JSON.stringify(json));
    })

})



//创建房间
function createRoom(){
  let json = {
      type:3,
      data:{
        id:ws.id,
      }
  };
  ws.ws.send(JSON.stringify(json));

  ws.ws.onmessage = function(e) {
      const temp = JSON.parse(e.data);
      if(temp.type == 5){
        getPlayerList.values = temp.data;
      }
    }
}

</script>

<template>
  <!-- 左边游戏列表 -->
  <div class="playertitle">玩家列表</div>
  <div class="left">
    <PlayerList class="player" :items="getPlayerList.values"/>
  </div>
  <!-- 中间创建、加入房间 -->
  <div class="main">
    <button class="btn" @click="createRoom">创建房间</button>
    <RoomList :items="getRoomList.values"/>
  </div>
</template>

<style scoped>
.btn{
  width: 200px;
  height: 60px;
  border: 1px solid #efefef;
  background-color: #ef6500;
  border-radius: 30px;
  /* margin-top: 100px; */
  font-family:monospace;
}
.left{
  position:absolute;
  left: 8px;
  top: 82px;
  width: 64px;
  height: 500px;
  overflow: auto;
  text-align: center;
}
.main{
  /* position:absolute;
  left: 8px;
  top: 60px; */
  width: 200px;
  height: 600px;
  overflow: auto;
}
.playertitle{
  position: absolute;
  left: 8px;
  top: 53px;
}
.main::-webkit-scrollbar {
  display: none;
}
</style>
