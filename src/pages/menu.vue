<script setup lang="ts">
import { inject,onMounted,reactive ,ref} from 'vue'
import RoomList from "../components/menu_RoomList.vue";
import PlayerList from "../components/menu_PlayerList.vue";
import {ChessWebSocket} from "../tool/WebSocket"
import 'vant/es/dialog/style'
import { useRouter,useRoute } from 'vue-router'
import { showNotify,showToast } from 'vant';
import 'vant/es/notify/style';

let getPlayerList  : Array<string>  = reactive([]);
let getRoomList : Array<any> = reactive([]);
let ws = inject("$ws") as ChessWebSocket;
const route = useRoute()
//接受进入房间的数据
const item = ref()
const addroomData = (e : object) => {
  item.value = e;
}

// 接受服务器的数据
ws.onmessage  = function(e) {
    const temp = JSON.parse(e.data);   
    // console.log("menu:",temp);
              
    if(temp.type == 202){ // 玩家列表
      getPlayerList.values = temp.data;
    }
    else if(temp.type == 201){ // 房间列表
      getRoomList.values = temp.data;
    }
    else if(temp.type == 235){ // 用户id
      ws.playerData.id = temp.id
    }
    else if(temp.type == 234){ // 创建房间的请求
        if(temp.accept === true)
        {
          router.replace(`/game/?id=${ws.playerData.id}`)
          showNotify({ type: 'success', message: '创建成功' });
        }
    }
    else if(temp.type === 236) //加入房间的请求
    {
      if(temp.accept)
      {
        router.replace(`/game/?id=${item.value.id}&name=${item.value.name}`)
        showNotify({ type: 'success', message: '加入成功' });
      }
      else{
        router.replace('/')
        showToast({
          message: '房间已满',
          icon: 'warn-o',
          duration:5000
        });
      }
    }
    else if(temp.type === 250)
    {
      showToast({
        message: 'You have been disconnected, please refresh and try again',
        duration:0
      });
    }
  }


onMounted(()=>{
    setTimeout(()=>{
          //打印出你的id
          // console.log("我的id = ",ws.playerData.id)
          // console.log("在线玩家数量",getPlayerList.values.length);
          
          //获取list
          if(getPlayerList.values.length === 0)
            ws.sendMsg(JSON.stringify({type:107,data:{id:ws.playerData.id}}))
          //id获取失败
          if(ws.playerData.id === -1)
            showNotify({ type: 'danger', message: 'ID获取失败'});
    },700)


    window.addEventListener("beforeunload",(e)=>{
      e = e || window.event;
        if (e) {
            e.returnValue = '关闭提示';
            
        }
        return true;

    });

    window.addEventListener("unload",e=>{
      
      if(route.path.substring(0,5) === '/game')
                ws.sendMsg(JSON.stringify({type:101,data:{id:ws.playerData.id}}))
      let json = {
              type:100,
              data:{
                id:ws.playerData.id,
              }
            };
            ws.send(JSON.stringify(json));
          

    })
  }
)

//创建房间
const router = useRouter()
function createRoom(){
  let json = {
      type:105,
      data:{
        id:ws.playerData.id,
      }
  };  
  ws.sendMsg(JSON.stringify(json))
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
    <RoomList :items="getRoomList.values" @send-item="addroomData"/>
  </div>
</template>

<style scoped>
.btn{
  width: 200px;
  height: 60px;
  border: 1px solid #efefef;
  background-color: #ef6500;
  color: #fff;
  border-radius: 30px;
  margin-top: 100px;
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
