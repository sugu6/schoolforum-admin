import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import eventBus from "@/utils/event-bus";
import router from "./router";
import store from "./store";
import i18n from "./locale";
import directive from "./directive";
import App from "./App.vue";
import useUserStore from "./store/modules/user";
import "@/assets/style/global.scss";
import "@/api/interceptor";

const app = createApp(App);

app.use(ArcoVueIcon);
app.use(router);
app.use(store);
app.use(i18n);
app.use(directive);

eventBus.on("auth:failed", async () => {
  const userStore = useUserStore();

  try {
    await userStore.logout();
  } catch (error) {
    console.error("登出失败:", error);
  } finally {
    window.location.reload();
  }
});

app.mount("#app");
