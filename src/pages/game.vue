<script setup lang="ts">
import piece from "../components/game/piece.vue"
import {ref ,inject, type Ref} from 'vue'
import { useRouter,useRoute, } from 'vue-router'
import {ChessWebSocket} from "../tool/WebSocket"
import { showToast,showConfirmDialog, showNotify, closeDialog,showDialog, type BarrageItem} from 'vant';
const router = useRouter()
const route = useRoute()
let ws = inject("$ws") as ChessWebSocket;


// 判断是否为 Windows
const isWindows = /Windows/.test(navigator.userAgent);
//接受此房间的房间号
const RoomId:number = parseInt(route.query.id as string,10)
// 判断是否是房主
const host : boolean = RoomId === ws.playerData.id
// 当状态为true时，表示我方回合，启动点击事件
const myTurn = ref(false)
//落棋数组
let pieceNum = ref([]) as Ref<number[]>;
// // 游戏开始
let start = false
// 是否结束了游戏
const gameOver = ref(false)  
// 我下棋的位置
let posi = ref(0)
// 对方下棋的位置，用于呼吸效果
let rivposi :number
// 对手的信息
let rival = ref({id:-1,name:'等待玩家...'}) 
// 先手和后手的棋子颜色
const isFirst = ref(1)
//连败
let fail = ref(0)
//避免重复点击悔棋，下棋后可再次显示
let pieced = ref(false)
// 最后下棋的效果
let lastpiece :Array<boolean> = []
//下棋的音效
const chessAudio = ref<any>(null)
//下棋编号计数
const xqNumber = ref(0)
// 房主和对手的准备
let hostshow = ref(false)
let rivalshow = ref(false)
//记录所有的棋子
let Allpiece: number[] = []
let index = -1
//不是房主，获得房主信息
if(!host) 
{
    rival.value.id = RoomId
    rival.value.name = route.query.name as string
}
//封装房主选先后手
function first() {
    if(host)
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
            showToast({
            message: 'show Time',
            position: 'top',
            duration: 6000
            });
          })
          .catch(() => {
            ws.sendMsg(JSON.stringify({type:106,data:{id:ws.playerData.id,whoFirst:false}}))
            isFirst.value = 2
      })
    }
}
//封装 -- 悔自己的棋子
const regret = () => {
  pieceNum.value[Allpiece[index--]] = 0
  Allpiece.pop()

  showToast({
    message: '悔棋成功',
    position: 'top',
    duration: 6000
  });
}
//封装 -- 同意悔棋，发请求，去掉别人的棋子
const agreeRegret = () => {
  ws.sendMsg(JSON.stringify({type:109,data:{id:ws.playerData.id,isMyTurn:myTurn.value,agree:true}}))
  
  pieceNum.value[Allpiece[index--]] = 0
  Allpiece.pop()

  lastpiece[rivposi] = false //清掉高亮特效
}
//接收服务器
ws.onmessage  = function(e) {
  const temp = JSON.parse(e.data); 
    console.log("game",temp);

    //是否有人进入房间     
    if(temp.type === 204) //只有房主能收到
    {
      pieced.value = false  //禁止重复点击
      rival.value = temp.data
    if(rival.value.id !== -1)
    {          
      //有人进来后，房主选择谁先手，谁后手
      first()
      start = true
    }
    }
    //下棋是否被允许
    else if(temp.type === 234) 
    {
      if(temp.accept === true) 
      {
        myTurn.value = false
        pieceNum.value[posi.value] = isFirst.value
        lastpiece[rivposi] = false //关闭对手的呼吸效果
        // chessAudio.value.play()//播放声音*************************************

        //棋子进栈
        if(Allpiece.indexOf(posi.value) === -1)
        {
          Allpiece.push(posi.value)
          index++
          console.log(Allpiece);
          console.log(index);
          
        }
        
        pieced.value = true //可以进行悔棋了
      }
      else{ 
        // 被拒绝了就重新下一个
        myTurn.value = true
        showToast({
          message: '此处无法下棋',
          icon: 'warn-o',
          duration:5000
        });
      }
    }
    //收到对方下棋
    else if(temp.type === 205)
    {      
      xqNumber.value = temp.data.no + 1
      lastpiece[rivposi] = false
      rivposi  = (temp.data.position.x -1)*13 + temp.data.position.y
      pieceNum.value[rivposi] = isFirst.value == 1? 2:1
      lastpiece[rivposi] = true
      // chessAudio.value.play()//播放声音****************************************  
      myTurn.value = true

       //棋子进栈
      if(Allpiece.indexOf(rivposi) === -1)
        {
          Allpiece.push(rivposi)
          index++
        }
    }
    //对手收到是否先手
    else if(temp.type === 203) //非房主接受
    {
       isFirst.value = temp.whoFirst? 1:2
       myTurn.value = temp.whoFirst
       if(myTurn.value)
       showToast({
        message: '我方先手下棋',
        duration: 5000
      });
      start = true
    }
    //判断获胜
    else if(temp.type === 233)
    {      
      start = false
      Allpiece = [] //清空记录的棋子
      myTurn.value = false
      gameOver.value = true
      if(temp.winningId === ws.playerData.id)// 这个必不会阻塞，因为这个棋子是你自己下的
      {
        alert('牛逼')
      }
      else {
        setTimeout(()=>{
          fail.value++
          if(fail.value == 3) 
          {
            alert('这小子指定是开挂了')
            return
          } 
          alert('输了耶，再干他一次试试？')
          },500)
      }
    }
     //房主离开房间开了
    else if(temp.type === 206)
    {
      alert('房主跑路了')
      ws.sendMsg(JSON.stringify({type:101,data:{id:ws.playerData.id}}))
      router.replace('/')

      closeDialog()
    }
    //对手离开了
    else if(temp.type === 207)
    {
      rival.value = { id:-1,name:'等待玩家...'}
      showToast('对方已退出')
      myTurn.value = false
      
      //房主还没点击开始游戏的时候就离开了，退出房主的dialog
      closeDialog()
      //中途离开
      lastpiece[rivposi] = false

      pieceNum.value = [] as any

      rivalshow.value = false; 
    }
    // 再来一把
    else if(temp.type === 232)
    {
      for(let i = 0;i<temp.data.ids.length;i++)
      {
        if(rival.value.id === temp.data.ids[i])
        {
          rivalshow.value = true;
          break;
        }
      }
      if(temp.data.allReady)
      {
        //清空棋盘
        pieceNum.value = [] as any
        //提示游戏开始
        showNotify({ type: 'primary', message: '游戏开始' })
        //清空了还需要把最后一个棋子的呼吸效果去掉
        lastpiece[rivposi] = false
        //服务器应该也会清空，然后发来
        first();
        //关掉准备
        rivalshow.value = false;
        hostshow.value = false;
        //禁止下棋
        myTurn.value = false
        //关闭悔棋
        pieced.value = false 

      }     
    }
    //悔棋
    else if(temp.type === 208)
    {      
      // 需要同意方、、、、、、////
      if(temp.data.ids.indexOf(ws.playerData.id) === -1) 
      {       
        showConfirmDialog({
          message:'对方想要悔棋，元芳你怎么看？',
          confirmButtonText : "放他一马",
          cancelButtonText : "不要"
        })
          .then(() => {
            if(myTurn.value === false) //同意方已经下棋了
            {
              agreeRegret()
              regret()
            }
            else{
              agreeRegret()
              myTurn.value = false
            }
            pieced.value = false //同意了就没法悔棋
          })
          .catch(() => {
            ws.sendMsg(JSON.stringify({type:109,data:{id:ws.playerData.id,isMyTurn:myTurn.value,agree:false}}))
          });
      }
      //悔棋方、、、、、、////
      if(temp.data.ids.indexOf(ws.playerData.id) !== -1)
      {        
        pieced.value = true //点击悔棋后暂时不显示，收到消息后显示
        if(temp.data.agree && myTurn.value === false) //对方还未下棋
        {
          regret()
          myTurn.value = true
        }
        else if(temp.data.agree && myTurn.value === true) //对方已经下棋了
        {
          regret()
          // pieceNum.value[rivposi] = 0
          pieceNum.value[Allpiece[index--]] = 0
          Allpiece.pop()

          lastpiece[rivposi] = false //清掉高亮特效
          myTurn.value = true
        }
        else{
          showToast({
            message: '惨遭拒绝',
            position: 'top',
            duration: 6000
          });
        }
        console.log(Allpiece);
        //如果棋盘上没有了自己的棋子，就禁止悔棋
        if(host)
        {
          if(Allpiece.length === 0)
            pieced.value = false ////禁止悔棋
        }
        else{
          if(Allpiece.length === 1)
            pieced.value = false ////禁止悔棋
        }
      }
    }
    //聊天
    else if(temp.type === 209)
    {
      danmulist.value.push({id:Math.random(),text : temp.data.text}) 
    }
    //掉线
    else if(temp.type === 250)
    {
      showDialog({
        title: '错误',
        message: '掉线了兄dé',
      }).then(() => {
        location.reload();
      });
    }
}

//标题栏逻辑
const onClickLeft = () =>{
const result = confirm("你确定退出吗？")
if(result)
{
  router.replace('/menu')
    setTimeout(()=>{
      ws.sendMsg(JSON.stringify({type:101,data:{id:ws.playerData.id}}))
    },100)
}
}

//下棋逻辑
const play = (item:number) => {
  // 我的回合
  if(myTurn.value === true)
  {
    posi.value = item
    const row = Math.floor(item / 13) + 1
    const col = item % 13
    if(pieceNum.value[posi.value] !== 1 && pieceNum.value[posi.value] !== 2)
      ws.sendMsg(JSON.stringify({type:104,data:{id:ws.playerData.id,position:{x:row,y:col},no:xqNumber.value}}))
    else
      {
        showToast({
          message: '此处无法下棋',
          icon: 'warn-o',
          duration:5000
      })
      }
  }
}
  
//点击了再来一局
const again = () => {
  gameOver.value = false //消失再来一局
  pieced.value = false
  if(host)
    hostshow.value = true 
  else
    rivalshow.value = true
  
  ws.sendMsg(JSON.stringify({type:108,data:{id:ws.playerData.id}}))
}

//悔棋
const repiece = () => {
  //这是我的棋子的位置posi.value  
  //这是对手的棋子位置 rivposi.value  
  ws.sendMsg(JSON.stringify({type:109,data:{id:ws.playerData.id,isMyTurn:myTurn.value,agree:true}}))
    pieced.value = false  //禁止重复点击
}

//弹幕内容
const danmulist  = ref([{text:'欢迎进入房间~✨'}]) as Ref<BarrageItem[]>
//使在80px，40%的位置
const anchors = [
      80,
      Math.round(0.4 * window.innerHeight),
      // Math.round(0.7 * window.innerHeight),
    ];
const height = ref(anchors[0]);
const danmu = ref('')

//发送弹幕
const sendDanmu = () => {
  height.value = anchors[0]
  ws.sendMsg(JSON.stringify({type:110,data:{id:ws.playerData.id,text:danmu.value}}))
  danmu.value = ''
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
  
  <div class="huihe" v-if="start">
    <van-tag  type="primary" v-if="myTurn">我方回合</van-tag>
    <van-tag  type="primary" v-else>对方回合</van-tag>
  </div>
  <!-- 用户和棋子 -->
  <div class="rival">
      <span>{{host?rival.name:ws.playerData.name}}
        <van-tag :show="host?rivalshow:hostshow" type="success">已准备</van-tag>
      </span>
      <piece class="rivpiece" :piece-num="host?isFirst==1?2:1:isFirst"></piece>
  </div>
  <div class="me">
      <span><van-tag :show="host?hostshow:rivalshow" type="success">已准备</van-tag>
        {{host?ws.playerData.name : rival.name }}
      </span>
      <piece class="mepiece" :piece-num="host?isFirst:isFirst==1?2:1"></piece>
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
           <piece v-for="item in 169" :lastpiece="lastpiece[item]" :pieceNum ="pieceNum[item]" @click="play(item)"></piece>             
        </div>
        <!-- 声音 -->
        <!-- <audio ref="chessAudio" src="/piecevideo.mp3"></audio> -->

  </div>
  <div class="box1">
<!-- 游戏结束显示 -->
    <button class="btn" v-if="gameOver&&rival.id !== -1" @click="again">再来一局</button>
    <button class="btn" v-else-if="!gameOver&&rival.id !== -1&& pieced" @click="repiece">悔棋</button>
  </div>

  <!-- 输入框 -->
  <van-floating-panel v-model:height="height" :anchors="anchors">
  <div style="text-align: center;margin-top: -10px;" >
    <p @click="height = anchors[1]">发送弹幕</p>
    <van-cell-group inset> 
      <van-field v-model="danmu" label="弹幕" placeholder="请输入你发送的内容" clickable/>
    </van-cell-group>

  <button class="btn" v-if="isWindows && danmu === ''" @click="height = 80" style="margin-top: 46px;" >取消</button>
  <button class="btn" v-else @click="sendDanmu" style="margin-top: 46px;" >发送</button>
  </div>
  </van-floating-panel>

  <!-- 弹幕 -->
  <van-barrage v-model="danmulist" class="danmu" style="width: 100%;">
     <div class="video" auto-play style="width: 100%; height: 150px" ></div>
  </van-barrage>
</div>  
</template>

<style scoped>
.danmu{
    float: left;
    width: 100%;
    height: 150px;
    position: absolute;
    top: 46px;
    left: 0px;
}
.box{
  margin:0 auto;
  width:375px ;
  position: relative;
  overflow-x: hidden;
}
.t1{
   border: 5px solid #030303;
   background-color: #e7c633;
   width:372.5px; 
   height:365px; 
   border-collapse:collapse; 
   margin: 10px 0 0 0;
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
  margin-top: 10px;
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
  top:27px;
  left: 17px;
}
.rival{
  width: 175px;
  height: 50px;
  position: absolute;
  left: 0;
  top: 75px;
  align-items: center;
}
.me{
  width: 175px;
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
.huihe{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
