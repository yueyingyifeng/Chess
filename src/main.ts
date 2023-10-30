import { createApp } from 'vue'
import App from './App.vue'
// import mitt from "mitt";        //事件组件
import {ChessWebSocket} from "./tool/WebSocket";
import '@/style/common.css'
// const EventBus = mitt();

const cws = new ChessWebSocket;

const app = createApp(App);
app.provide("$ws",cws)

app.mount('#app')
