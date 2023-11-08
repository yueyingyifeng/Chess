<script setup lang="ts">
import Item from "./menu_PlayerList_Item.vue";

defineProps({
  items:String
})


</script>

<template>
  <div>
    <div v-for="i in items" class="player">
      <Item :Id="i"></Item>
    </div>
    
  </div>
</template>

<style scoped>
.player{
  overflow: auto;
}
</style>
