import { PlayerData } from "./PlayerData";
import {  showToast, showLoadingToast ,showDialog} from 'vant';
import 'vant/es/toast/style'


export class ChessWebSocket extends WebSocket{
    public playerData : PlayerData;
    constructor(url : any){
        super(url);
        this.playerData  = new PlayerData;
    }

    public sendMsg = (msg : string)=>{
        if(this.readyState === this.OPEN){
            this.send(msg);
        }
        else if(this.readyState === this.CONNECTING){
            console.log("Connecting server...");
        }
        else{
            showDialog({
                title: 'Error',
                message: 'fail to connect server',
              }).then(() => {
                location.reload();
              });
        }
    }

    public isConnect() {
        const toast = showLoadingToast({
            type:"loading",
            message: '奋力连接中...',
            forbidClick: true,
            duration:0
          });
        const time = setTimeout(() => {
            toast.close(); // 关闭 Toast
            clearTimeout(time)
            showToast({
                message: '连接失败',
                position: 'top',
              });
          }, 10000);
        return new Promise((res)=>{
           setInterval(()=>{
            if(this.readyState === this.OPEN){
                res(this.OPEN);
                toast.close()
                clearTimeout(time)
            }
           },1000) 
        }) 
    }

    public ImAlive = ()=>{
        if(this.readyState === this.OPEN){
            this.send(JSON.stringify({
                type:120,
                data:{
                    id:this.playerData.id
                }
            }))
        }
    }
}
