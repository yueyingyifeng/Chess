<script setup lang="ts">
import piece from "../components/game/piece.vue"
import {ref ,inject,onMounted,reactive} from 'vue'
import { useRouter,useRoute, routerViewLocationKey } from 'vue-router'
import {ChessWebSocket} from "../tool/WebSocket"
import { showToast,showConfirmDialog, Toast } from 'vant';
const router = useRouter()
const route = useRoute()
let ws = inject("$ws") as ChessWebSocket;


//接受此房间的房间号
const RoomId:number = parseInt(route.query.id as string,10)
// 当状态为true时，表示我方回合，启动点击事件
const myTurn = ref(false)
// // 游戏结束
// let  = ref(false)
// 是否结束了游戏
const gameOver = ref(false)  
// 我下棋的位置
let posi = ref(0)
// 对方下棋的位置，用于呼吸效果
let rivposi :number
// 对手的信息
let rival = ref({id:-1,name:'等待玩家...'}) // 当对手退出了，还原这个%*************************************
// 先手和后手的棋子颜色
const isFirst = ref(1)
//连败
let fail = ref(0)
// 最后下棋的效果
let lastpiece :Array<boolean> = []
//不是房主，获得房主信息
if(RoomId !== ws.playerData.id) 
{
    rival.value.id = RoomId
    rival.value.name = route.query.name as string
}

//接收服务器
ws.onmessage  = function(e) {
  const temp = JSON.parse(e.data); 
    console.log("game",temp);
    //是否有人进入房间     
    if(temp.type === 204) //只有房主能收到
    {
      rival.value = temp.data
    if(rival.value.id !== -1)
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
              ws.sendMsg(JSON.stringify({type:106,data:{id:ws.playerData.id,whoFirst:true}}))
              isFirst.value = 1
              myTurn.value = true
              showToast('Show Time')
            })
            .catch(() => {
              ws.sendMsg(JSON.stringify({type:106,data:{id:ws.playerData.id,whoFirst:false}}))
              isFirst.value = 2
              showToast('Show Time')
        });
      }
    }
    }
    //下棋是否被允许 -- 判断是否允许进入房间
    if(temp.type === 234) //************************************** */
    {
      if(temp.accept === true) 
      {
        pieceNum[posi.value] = isFirst.value
        myTurn.value = false
        lastpiece[rivposi] = false //关闭对手的呼吸效果
      }
      else{ //不让进 或者不让下棋？
        router.replace('/')  // 只出现在房间满和不让下棋，有问题
        showToast({
          message: '房间已满',
          icon: 'warn-o',
          duration:3000
        });
      }
    }
    //收到对方下棋
    if(temp.type === 205)
    {
      lastpiece[rivposi] = false
      rivposi  = (temp.data.position.x -1)*13 + temp.data.position.y
      pieceNum[rivposi] = isFirst.value == 1? 2:1
      lastpiece[rivposi] = true
      myTurn.value = true
    }
    //对手收到是否先手
    if(temp.type === 203) //非房主接受
    {
       isFirst.value = temp.whoFirst? 1:2
       myTurn.value = temp.whoFirst
       showToast('我方先手下棋')
    }
    //判断获胜
    if(temp.type === 233)//必定是下棋方赢了
    {
      if(temp.winningId === ws.playerData.id)
      {
        alert('胜利! You are victory ~ ')
        gameOver.value = true
      }
      else  {
        fail.value++
        if(fail.value == 2) 
        {
          alert('这小子指定是开挂了')
          gameOver.value = true
          return
        } 
        alert('输了耶，再干他一次试试？')
        gameOver.value = true
      }
    }
     //房主离开房间开了
     if(temp.type === 206)
    {
      alert('房主跑路了')
      ws.sendMsg(JSON.stringify({type:101,data:{id:ws.playerData.id}}))
      router.replace('/')
    }
    if(temp.type === 207)
    {
      rival.value = { id:-1,name:'等待玩家...'}
      showToast('对方已退出')
      myTurn.value = false

      //当对方退出的时候，需要清空棋盘
    }
  }

onMounted( async()=>{
    console.log(ws.playerData.id);
})


//标题栏逻辑
const onClickLeft = () =>{
  showConfirmDialog({
  title: '温馨提示',
  message:
    '您确定退出吗？',
})
  .then(() => {
    router.replace('/menu')
    setTimeout(()=>{
      ws.sendMsg(JSON.stringify({type:101,data:{id:ws.playerData.id}}))
    },100)
    })
  .catch(() => {
    // on cancel
  });
}

//落棋数组
const pieceNum : Array<number> = reactive([])
//下棋逻辑
const play = (item:number) => {
  posi.value = item
  const row = Math.floor(item / 13) + 1
  const col = item % 13
 
  // 我的回合
  if(myTurn.value === true)
    ws.sendMsg(JSON.stringify({type:104,data:{id:ws.playerData.id,position:{x:row,y:col}}}))
}
  

//点击了再来一局
const again = () => {
    gameOver.value = true
}
</script>


<template>
<div>
  <!-- 听说添加这个alter会生效，在ios -->
  <meta name="apple-mobile-web-app-capable" content="yes">
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
  <!-- 用户和棋子 -->
  <div class="rival">
      <span>{{RoomId === ws.playerData.id?rival.name:ws.playerData.name}}</span>
      <piece class="rivpiece" :piece-num="isFirst==1?2:1"></piece>
  </div>
  <div class="me">
      <span>{{RoomId === ws.playerData.id?ws.playerData.name : rival.name }}</span>
      <piece class="mepiece" :piece-num="isFirst"></piece>
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
           <piece v-for="item in 169" :lastpiece="lastpiece[item]" :piece-num ="pieceNum[item]" @click="play(item)"></piece>             
        </div>

    </div>
        <div class="box1">
                      <!-- 游戏结束显示 -->
          <button class="btn" v-if="gameOver&&rival.id !== -1" @click="again">再来一局</button>
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
  border: 0px solid red;
  position: absolute;
  top:17px;
  left: 16px;
}
.rival{
  width: 80px;
  height: 50px;
  position: absolute;
  left: 0;
  top: 75px;
}
.me{
  width: 80px;
  height: 50px;
  position: absolute;
  right: 0;
  top: 75px;
  text-align: right;
  margin-bottom: 10px ;
}
.rivpiece{
  position: absolute;
  left: 5px;
  margin-top: 5px;
}
.mepiece{
  position: absolute;
  right: 5px;
  margin-top: 5px;
}
</style>
