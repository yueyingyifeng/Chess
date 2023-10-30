<script setup lang="ts">
// import {ref} from 'vue'
let props = defineProps({
  pieceNum:{
      type: Number
    }
})

// 处理对手的下棋位置

</script>

<template>
    <div class="piece" :class="{black:(pieceNum === 1),white:(pieceNum === 2)}"></div>
</template>

<style scoped>
.piece {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  /* background-color: #000; */
}
.black{
   background-color: #000;
}
.white{
  background-color: rgb(250, 253, 198)
}
</style>