export class ChessWebSocket{
    public ws : WebSocket;
    public id : number;
    constructor(){
        this.ws = new WebSocket("ws:/192.168.1.161:9900");
        this.id = -1;
    }

    getId() {
        return new Promise((resolve, reject) => {
            this.ws.onmessage = function(e) {
              const i = JSON.parse(e.data);
              resolve(i.id);
            };
        });
    }
};