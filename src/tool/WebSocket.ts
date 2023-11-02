import { PlayerData } from "./PlayerData";

export class ChessWebSocket extends WebSocket{
    public playerData : PlayerData;

    constructor(url : any){
        super(url);
        this.playerData = new PlayerData;
        this.Login();
    }

    private Login(){
        this.getId().then((e)=>{
            let json = {
              type:1,
              data:{
                id:e,
                name:this.playerData.name
              }
            };
            this.playerData.id = e as number;
            
            this.send(JSON.stringify(json))
        })
    }

    private getId() {
        return new Promise((resolve, reject) => {
            this.onmessage = function(e) {
              const i = JSON.parse(e.data);
              resolve(i.id);
            };
        });
    }

    public onMsg(func : any){
        this.onmessage = (e : any) => func();
    }

    public send(msg : string){
        this.send(msg);
    }

    public ImAlive(){
        if(this.readyState == this.OPEN){
            let alive ={
                type:120,
                data:{id:this.playerData.id}
            }
            this.send(JSON.stringify(alive));
        }
    }
};