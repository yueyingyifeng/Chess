<script setup lang="ts">
import { inject,onBeforeMount,reactive ,ref} from 'vue'
import RoomList from "../components/menu_RoomList.vue";
import PlayerList from "../components/menu_PlayerList.vue";
import {ChessWebSocket} from "../tool/WebSocket"
import 'vant/es/dialog/style'
import { useRouter } from 'vue-router'

let getPlayerList  : Array<string>  = reactive([]);
let getRoomList : Array<any> = reactive([]);
let ws = inject("$ws") as ChessWebSocket;
// const roomlist = [...getRoomList]  //如果没有失去响应式，就保留
// const playerlist = reactive([...getPlayerList])  //如果没有失去响应式，就保留

//一进页面加入服务器
// if(ws.playerData.id !== -1)
{
  ws.sendMsg(JSON.stringify({ //把对象转成字符串
        type: 102,
        data:{
          name:ws.playerData.name
        }
  }))
}
// 接受服务器的数据
onBeforeMount(()=>{
    ws.onmessage  = function(e) {
      const temp = JSON.parse(e.data);   
      console.log("menu:",temp);
           
      if(temp.type == 202){ // 玩家列表
        getPlayerList.values = temp.data;
      }
      if(temp.type == 201){ // 房间列表
        getRoomList.values = temp.data;
      }
      if(temp.type == 235){ // 用户id
        ws.playerData.id = temp.id
      }
      // 创建房间的请求
      if(temp.type == 234){
          if(temp.accept === true)
            router.push(`/game/${ws.playerData.id}`)
    }
    //打印出你的id
    setTimeout(()=>{
          console.log(ws.playerData.id)
    },1000)
    window.addEventListener("beforeunload",(e)=>{
      e = e || window.event;
        if (e) {
            e.returnValue = '关闭提示';
            
        }
        return true;

    });

    window.addEventListener("unload",e=>{
      let json = {
              type:100,
              data:{
                id:ws.playerData.id,
              }
            };
            ws.send(JSON.stringify(json));
    })
    }
})


//创建房间
const roomlist = [...getRoomList]
const router = useRouter()
function createRoom(){
  let json = {
      type:105,
      data:{
        id:ws.playerData.id,
      }
  };
  if(roomlist.find(item => item.id === ws.playerData.id))return
  ws.sendMsg(JSON.stringify(json))

  // ws.onmessage  = function(e) {
  //     const temp = JSON.parse(e.data);      
  //     if(temp.type == 234){
  //         if(temp.accept === true)
  //           router.push(`/game/${ws.playerData.id}`)
}
    // }

</script>

<template>
  <!-- 左边游戏列表 -->
  <div class="playertitle">玩家列表</div>
  <div class="left">
    <PlayerList class="player" :items="getRoomList.values"/>
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
