import { createApp } from 'vue'
import App from './App.vue'
import {ChessWebSocket} from "./tool/WebSocket";
import '@/style/common.css'
import router from './router/index.js'

let cws : ChessWebSocket; 
new Promise(async (resovle)=>{
    cws = new ChessWebSocket("ws:/172.22.0.123:9900");
    let state = await cws.isConnect();
    resovle(state);
})
.then(e=>{
    setInterval(cws.ImAlive,30 * 1000) ;
    const app = createApp(App);
    app.provide("$ws",cws)
    app.use(router)
    app.mount('#app')
})
.catch(e=>{
    console.log("error" + e);
});


