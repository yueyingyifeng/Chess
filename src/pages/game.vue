<script setup lang="ts">
import piece from "../components/game/piece.vue"
import {ref ,onMounted} from 'vue'

const start = (hang:number , lie:number) => {
  console.log(hang,lie);
}

var guy = 1
//下棋
const count = ref(0)
onMounted(() => {
  const res = document.querySelectorAll('.piece')
   // 给每个交点添加点击事件
   res.forEach(piece => {
      piece.addEventListener('click', () => {
          if(guy === 1)
            piece.setAttribute('style','background-color: #000')
          else if(guy === 2)
            piece.setAttribute('style','background-color: rgb(250, 253, 198)')
      });
  });
})
</script>

<template>
 <div class="box">
        <!--表格构成棋盘-->
        <table class="t1">
            <tr v-for="hang in 14" :key="hang" class="h1">
                <td v-for="lie in 14" :key="lie" class="l1"></td>
            </tr>
            <div class="circle" style="  left: 74px;top: 74px;"></div>
            <div class="circle" style="  right: 75px;top: 74px;"></div>
            <div class="circle" style="  left: 75px;bottom: 76px;"></div>
            <div class="circle" style="  right: 75px;bottom: 76px;"></div>
            <div class="circle" style="  left: 178px;top: 178px;"></div>
        </table>


        <table class="t2">
          <tr v-for="hang in 13" :key="hang" class="h2">
              <td v-for="lie in 13" :key="lie" @click="start(hang,lie)" class="l2"> 
                <piece :pieceNum = count ></piece>
              </td>
          </tr>
       </table>
    </div>

    <black></black>
    <white></white>
</template>

<style scoped>
.box{
  margin:0 auto;
  width:375px ;
  /* margin-top: 200px;  */
  /* overflow: hidden; */
  position: relative;
}
.t1{
   border: 5px solid #1b1a1a;
   width:372.5px; 
   height:372.5px; 
   border-collapse:collapse; 
   margin: 100px 0 0 0;
   position: relative;
}
.h1{
  border: 1px solid #000;
}
.l1{
  border: 1px solid #000;
  width: 25px;
  height: 25px;
  margin: 0px;
  padding: 0px;
}

.circle{
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #000;
  user-select: none;
}

.t2{
  /* border: 0px solid red; */
  width:338.5px; 
  height:338.5px; 
  border-collapse:collapse; 
  /* position: absolute;
  left: 443px;
  top: 119px; */
  position:absolute;
  left: 16px;
  top: 17px;

  /* display: none; */
   
}
.h2{
  border: 0px solid red;
}
.l2{
  border: 0px solid red;
  width: 25px;
  height: 25px;
  margin: 0px;
  padding: 0px;
}

</style>
