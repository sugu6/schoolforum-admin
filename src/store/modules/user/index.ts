import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from "@/api/user";
import { clearToken } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import { UserState } from "./types";
import useAppStore from "../app";

const useUserStore = defineStore("user", {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: "",
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      if (import.meta.env.MODE !== "production") {
        return new Promise((resolve) => {
          this.role = this.role === "user" ? "admin" : "user";
          resolve(this.role);
        });
      }
      return Promise.resolve(this.role);
    },
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    resetInfo() {
      this.$reset();
    },

    async info() {
      try {
        const res = await getUserInfo();
        const user = res.data;

        // 防御性检查
        if (!user) {
          throw new Error("获取用户信息失败：响应为空");
        }

        this.setInfo({
          name: user.username || "",
          avatar: user.avatarUrl || "",
          email: user.email || "",
          role: (user.role as any) || "",
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        throw error;
      }
    },

    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);

        // 防御性检查：确保响应数据结构正确
        if (!res || !res.data) {
          throw new Error("登录响应格式错误：数据为空");
        }

        const loginData = res.data;

        if (!loginData.user) {
          throw new Error("登录响应格式错误：用户信息缺失");
        }

        this.setInfo({
          name: loginData.user.username || "",
          avatar: loginData.user.avatarUrl || "",
          email: loginData.user.email || "",
          role: (loginData.user.role as any) || "",
        });
      } catch (err) {
        clearToken();
        console.error("Login error:", err);
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    async logout() {
      try {
        await userLogout();
      } catch {
        // 忽略 logout API 错误，确保本地状态清理仍能执行
      }
      this.logoutCallBack();
    },
  },
});

export default useUserStore;
