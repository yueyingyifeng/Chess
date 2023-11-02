<script setup lang="ts">
import Item from "./menu_PlayerList_Item.vue";

let props = defineProps({
  items:Array<string>
})


</script>

<template>
  <div>
    <div v-for="i in items" class="player">
      <Item :name="i"></Item>
    </div>
    
  </div>
</template>

<style scoped>
.player{
  overflow: auto;
}
</style>
