<script setup lang="ts">

defineProps({
  Id:String
}
)

</script>

<template>
  <div>
    <div class="player">{{Id}}</div>
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
