<script setup lang="ts">

defineProps({
  name:String
}
)

</script>

<template>
  <div>
    <div class="player">{{name}}</div>
  </div>
</template>

<style scoped>
.player{
  width: 64px;
  height: 20px;
  margin: 10px auto;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
