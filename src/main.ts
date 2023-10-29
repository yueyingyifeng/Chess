import { createApp } from 'vue'
import App from './App.vue'
import mitt from "mitt";        //事件组件
import {ws} from "./tool/WebSocket";

const EventBus = mitt();

EventBus.emit("onOpen",ws.onopen);
EventBus.emit("onMsg",ws.onmessage);
EventBus.emit("onClose",ws.onclose);


const app = createApp(App);
app.config.globalProperties.$EventBus = EventBus;
app.config.globalProperties.$ws = ws;

app.mount('#app')
