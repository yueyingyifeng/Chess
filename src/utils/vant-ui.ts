
import { createApp } from 'vue';
import { Loading,Toast,showDialog,Dialog  } from 'vant';

export default function useVant(app: ReturnType<typeof createApp>) {
  app.use(showDialog);
  app.use(Loading);
  app.use(Toast);
  app.use(Dialog);
}