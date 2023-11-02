<script setup lang="ts">
import piece from "../components/game/piece.vue"
import {ref ,onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant';

const router = useRouter()
const side = ref()


//标题栏
const onClickLeft = () =>{
  showConfirmDialog({
  title: '温馨提示',
  message:
    '您确定退出吗？',
})
  .then(() => {
    // on confirm
    router.go(-1)
  })
  .catch(() => {
    // on cancel
  });
}

const start = (hang:number , lie:number) => {
  console.log(hang,lie);
}

//var guy = 1
//下棋
// const count = ref(0)
// onMounted(() => {
//   const res = document.querySelectorAll('.piece')
//    // 给每个交点添加点击事件
//    res.forEach(piece => {
//       piece.addEventListener('click', () => {
//           if(guy === 1)
//             piece.setAttribute('style','background-color: #000')
//           else if(guy === 2)
//             piece.setAttribute('style','background-color: rgb(250, 253, 198)')
//       });
//   });
// })
const pieceNum = ref(1)
onMounted(()=>{
    const cells = document.querySelectorAll('.l2')
    // 给每个交点添加点击事件
        cells.forEach(cell => {
        cell.addEventListener('click', () => {
            // 在此处编写点击事件的逻辑
            if(pieceNum.value === 1 && cell.innerHTML === '')
            {
              console.log(pieceNum.value);
              cell.innerHTML = '<div data-v-c7e6c129="" data-v-30667a28="" class="piece black"></div>'
            }      
            else if(pieceNum.value === 2 && cell.innerHTML === '')
              cell.innerHTML = '<div data-v-c7e6c129="" data-v-30667a28="" class="piece white"></div>'
        })
})
})
</script>

<template>
<div>
  <!-- 标题栏 -->
  <div class="header">
    <van-nav-bar
      title="五子棋"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
    />
  </div>
  <!-- 棋盘 -->
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
              </td>
          </tr>
       </table>
    </div>
  <piece :pieceNum = 1></piece>
</div>  
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
   border: 5px solid #000000;
   background-color: #e7c633;
   width:372.5px; 
   height:372.5px; 
   border-collapse:collapse; 
   /* margin: 100px 0 0 0; */
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
