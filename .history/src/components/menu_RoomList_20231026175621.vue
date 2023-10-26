<script setup lang="ts">
import Item from "./menu_RoomList_Item.vue";

let items = [
    {a:1},
    {b:2},

]

</script>

<template>
  <div>
    
    <div v-for="i in items">
      {{ i }}
    </div>
    
  </div>
</template>

<style scoped>

</style>
