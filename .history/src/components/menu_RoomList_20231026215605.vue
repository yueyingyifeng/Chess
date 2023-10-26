<script setup lang="ts">
import Item from "./menu_RoomList_Item.vue";

let items = [
    1,2,3,4
]

</script>

<template>
  <div>
    
    <div v-for="i in items">
      <Item id="i"></Item>
    </div>
    
  </div>
</template>

<style scoped>

</style>
