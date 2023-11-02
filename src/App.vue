<script setup lang="ts">
import Menu from "./pages/menu.vue";
import Game from "./pages/game.vue";
import {ref} from "vue"
import { onMounted } from "vue";

const onGame = ref(false);

</script>

<template>
  <div>
    <!-- <Game v-if="onGame"></Game>
      <Menu v-else @start="onGame=$event"></Menu> -->
      <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
