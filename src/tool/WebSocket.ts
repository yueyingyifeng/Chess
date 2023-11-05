import { PlayerData } from "./PlayerData";
import {  showLoadingToast } from 'vant';
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
            console.log("fail to connect server");
        }
    }

    public isConnect() {
        const toast = showLoadingToast({
            type:"loading",
            message: '奋力连接中...',
            forbidClick: true,
            duration:0
          });
        return new Promise((res)=>{
           setInterval(()=>{
            if(this.readyState === this.OPEN){
                res(this.OPEN);
                toast.close()
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
