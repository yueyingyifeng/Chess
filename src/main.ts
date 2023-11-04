import { createApp } from 'vue'
import App from './App.vue'
// import mitt from "mitt";        //事件组件
import {ChessWebSocket} from "./tool/WebSocket";
import '@/style/common.css'
// const EventBus = mitt();
import router from './router/index.js'

let cws : ChessWebSocket; 
new Promise(async (resovle)=>{
    cws = new ChessWebSocket("ws:/192.168.1.161:9900");
    let state = await cws.isConnect();
    resovle(state);
})
.then(e=>{
    setInterval(cws.ImAlive,30 * 1000) ;
    const app = createApp(App);
    app.provide("$ws",cws)
    
    // useVant(app)
    
    app.use(router)
    // app.use(pinia)
    app.mount('#app')
})
.catch(e=>{
    console.log("error" + e);
});


