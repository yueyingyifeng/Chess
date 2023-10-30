<script setup lang="ts">
import Menu from "./pages/menu.vue";
import Game from "./pages/game.vue";
import {ref} from "vue"

let onGame = ref(false);

</script>

<template>
  <div>
    <Game v-if="onGame"></Game>
      <Menu v-else @start="onGame=true"></Menu>
  </div>
</template>

<style scoped>

</style>
