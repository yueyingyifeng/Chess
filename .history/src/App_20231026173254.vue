<script setup lang="ts">
import Menu from "./pages/menu.vue";
import Game from "./pages/game.vue";

let onGame = ref(false);

</script>

<template>
  <div>
      <Menu></Menu>
      <Game v-show=""></Game>

  </div>
</template>

<style scoped>

</style>
