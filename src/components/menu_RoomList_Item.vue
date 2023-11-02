<script setup lang="ts">
import  {useRouter}  from 'vue-router'
defineProps(
  ['id']
)


  //进入房间
const router =  useRouter()
const addHome = () => {
  router.push('/game')
  // router.push(`/game/${ws.id}`)
}
</script>

<template>
  <div>
    <button class="btn" @click="addHome">房间号-{{ id }}</button>
  </div>
</template>

<style scoped>
.btn{
  width: 200px;
  height: 60px;
  border: 1px solid #efefef;
  background-color: #fff;
  border-radius: 30px;
  margin-top: 10px;
}
/* .btn:hover{
  box-shadow: 1px 20px 10px 10px rgba(0,0,0,0.5);
} */
</style>
