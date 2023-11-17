<script setup lang="ts">
import Item from "./menu_RoomList_Item.vue";

const props = defineProps({
  items:Array
})
//将子组件的值，传给父
const emit = defineEmits(['sendItem'])

const receiveSon = (e : Object) => {
  emit("sendItem",e)
}
</script>

<template>
    <div v-for="i in items">
      <Item :item="i" @send-item="receiveSon"></Item>
    </div>
</template>

<style scoped>

</style>
