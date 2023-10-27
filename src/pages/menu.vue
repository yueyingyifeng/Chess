<script setup lang="ts">
import RoomList from "../components/menu_RoomList.vue";

init();

function createRoom(){

}

function init(){
  const ws = new WebSocket("ws:/localhost:9900");
  ws.addEventListener("open",e=>{
    console.log("onOpen",e);
  });

  ws.addEventListener("error",e=>{
    console.log("onError",e);
  })
}


</script>

<template>
  <div>
    <button @click="createRoom">创建房间</button>
    <RoomList :items="[1,2,3,4]"/>
  </div>
</template>

<style scoped>

</style>
