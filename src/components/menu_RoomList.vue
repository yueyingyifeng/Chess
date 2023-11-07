<script setup lang="ts">
import Item from "./menu_RoomList_Item.vue";

const props = defineProps({
  items:Array
})

</script>

<template>
    <div v-for="i in items">
      <Item :item="i"></Item>
    </div>
</template>

<style scoped>

</style>
