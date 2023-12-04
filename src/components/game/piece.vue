<script setup lang="ts">
defineProps({
  pieceNum:{
      type: Number,
    },
  lastpiece:{
      type:Boolean
    } 
})

</script>

<template>
    <div class="piece" :class="{black:(pieceNum === 1),white:(pieceNum === 2),huxi:lastpiece}"></div>
</template>

<style scoped>
.piece {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
.black{
   background-color: #000;
}
.white{
  background-color: rgb(238, 238, 238);
}
.huxi{
  animation: breathe 0.5s infinite alternate;
}

/* 定义呼吸效果的关键帧动画 */
@keyframes breathe {
  0% {
    transform: scale(1);
    border: 0px solid rgb(94, 94, 221)

  }
  100% {
    transform: scale(1.1);
    border: 1px solid rgb(94, 94, 221)
   }
}
</style>
