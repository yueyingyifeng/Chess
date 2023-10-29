<script setup lang="ts">
import RoomList from "../components/menu_RoomList.vue";
import { getCurrentInstance } from 'vue'

function createRoom(){

}

function getRoomList() : Array<number>{
    const cxt  = getCurrentInstance() //相当于Vue2中的this
    if(cxt != null){
      const bus = cxt.appContext.config.globalProperties.$bus
      
      let result : Array<number> = [];
      bus.on("onMsg",(e : string)=>{
          result = JSON.parse(e);
      })
      return result;
    }
    return [];
}

</script>

<template>
  <div>
    <button @click="createRoom">创建房间</button>
    <RoomList :items="getRoomList"/>
  </div>
</template>

<style scoped>

</style>
