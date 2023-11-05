<script setup lang="ts">
import piece from "../components/game/piece.vue"
import {ref ,inject} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { showConfirmDialog } from 'vant';
import {ChessWebSocket} from "../tool/WebSocket"
import { reactive } from "vue";
import { onMounted } from "vue";
const router = useRouter()
const route = useRoute()
let ws = inject("$ws") as ChessWebSocket;


//接受此房间的房间号
const RoomId:number = parseInt(route.params.id as string,10)

// myTurn 状态
// 当状态为true时，表示我方回合，启动点击事件
const myTurn = ref(false)
// 当选好先后手，就可以点击开始游戏了
const allReady = ref(true)
// 是否开始了游戏
const started = ref(false)  

//接收服务器
ws.onmessage  = function(e) {
  const temp = JSON.parse(e.data); 
    console.log("game",temp);
    //是否有人进入房间     
    if(temp.type == 204)
    {
      revalId.value= temp.data.id
      console.log("有人进来了");
    }
    //下棋是否被允许 -- 判断是否允许进入房间
    if(temp.type === 234) //************************************** */
    {
      if(temp.accept === true)
        myTurn.value = true
      else{ //不让进 或者不让
        router.go(-1)
      }
  }
    //对方下棋
    if(temp.type == 205)
    {
      let item = (temp.x -1)*13 + temp.y
      pieceNum[item] = 2
      myTurn.value = true
    }

}



const revalId = ref('')
onMounted( async()=>{
    //当一进入这个房间，等待是否有人加入房间
    console.log(ws.playerData.id);
 
    if(revalId.value !== '')
    {
      //有人进来后，房主选择谁先手，谁后手
      if(RoomId === ws.playerData.id)
      {
        showConfirmDialog({
            title: '决定先手',
            message:
              '请决定先手玩家',
            confirmButtonText:'我方先手',
            cancelButtonText:'对方先手'
          })
            .then(() => {
              ws.sendMsg(JSON.stringify({type:106,data:{whoFirst:true}}))
              myTurn.value = true
            })
            .catch(() => {
              ws.sendMsg(JSON.stringify({type:106,data:{whoFirst:false}}))
        });
      }
      else
        console.log("非房主");
    }
})




//标题栏逻辑
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

//落棋数组
const pieceNum : Array<number> = reactive([])
//下棋逻辑
const play = (item:number) => {
  const row = Math.floor(item / 13) + 1
  const col = item % 13
 
  // 我的回合
  if(myTurn.value === true)
  {
    ws.sendMsg(JSON.stringify({type:104,data:{row,col}}))
    pieceNum[item] = 1 //等于房主决定的 还没写
    myTurn.value = false
  }
}

  
  // 每次下棋接受233数据，是否获胜********************************
  


//点击了开始游戏
const clickstart = () => {
    started.value = true
    console.log("开始游戏了");
    
}
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
        <!-- 棋子 -->
        <div class="box2">
           <piece v-for="item in 169" :piece-num ="pieceNum[item]"></piece>             
           <!-- <piece v-for="item in 169" :piece-num ="pieceNum[item]" @click="play(item)"></piece>              -->
        </div>

    </div>
        <div class="box1">
                      <!-- 都准备好了，并且未开始游戏的时候显示 -->
          <button class="btn" v-if="allReady&&!started" @click="clickstart">开始游戏</button>
        </div>
</div>  
</template>

<style scoped>
.box{
  margin:0 auto;
  width:375px ;
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
  border: 1px solid red;
}
.l2{
  border: 1px solid red;
  width: 25px;
  height: 25px;
  margin: 0px;
  padding: 0px;
  background-color: blue;
  border-radius: 50%;
}
.box1{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn{
    width: 34%;
    height: 37px;
    margin-top: 55px;
    background: linear-gradient(90deg,#ecb53c,rgb(228, 198, 76));
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    border: 0px ;
}

.box2{
  display: grid;
  grid-template-columns: repeat(13, 26px); 
  grid-template-rows: repeat(13, 26px); 
  border: 1px solid red;
  position: absolute;
  top:17px;
  left: 16px;
}
</style>
