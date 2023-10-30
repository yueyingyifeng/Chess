<script setup lang="ts">
import Item from "./menu_PlayerList_Item.vue";

let props = defineProps({
  items:Array
})

</script>

<template>
  <div>
    <div>玩家列表</div>
    <div v-for="i in items">
      <Item :name="i"></Item>
    </div>
    
  </div>
</template>

<style scoped>

</style>
