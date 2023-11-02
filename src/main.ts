import { createApp } from 'vue'
import App from './App.vue'
// import mitt from "mitt";        //事件组件
import {ChessWebSocket} from "./tool/WebSocket";
import '@/style/common.css'
// const EventBus = mitt();
// import useVant from '@/utils/vant-ui'
import router from './router/index.js'

const cws = new ChessWebSocket("192.168.1.161:9900");

setInterval(cws.ImAlive,60 * 1000) ;

const app = createApp(App);
app.provide("$ws",cws)

// useVant(app)

app.use(router)
app.mount('#app')

