import axios from "axios";
import type { RouteRecordNormalized } from "vue-router";

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  age?: number;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  githubId?: string;
  role: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  showFollowing?: boolean;
  showFollowers?: boolean;
  level?: number;
  exp?: number;
  points?: number;
  totalPoints?: number;
  continuousSignDays?: number;
  maxContinuousDays?: number;
  totalSignDays?: number;
  lastSignDate?: string;
  signCards?: number;
}

import type { PageResponse } from "@/types/api";

export interface LoginResponse {
  user: User;
  expiresIn: number;
}

export interface UserListParams {
  pageNumber: number;
  pageSize: number;
}

export function login(data: LoginData) {
  // 使用 URLSearchParams 确保格式与后端期望一致（application/x-www-form-urlencoded）
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);
  return axios.post<LoginResponse>("/users/login", params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

export function logout() {
  return axios.post("/users/logout");
}

export function getUserInfo() {
  return axios.get<User>("/users/info");
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>("/api/user/menu");
}

export async function getUserList(
  params: UserListParams,
): Promise<PageResponse<User>> {
  const res = await axios.get<PageResponse<User>>("/users/list/page", {
    params,
  });
  return res.data;
}

export async function getUserInfoById(id: number): Promise<User> {
  const res = await axios.get<User>(`/users/getInfo/${id}`);
  return res.data;
}

export function deleteUser(id: number) {
  return axios.delete(`/users/remove/${id}`);
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: string;
  isActive?: string;
  bio?: string;
}

export function updateUser(id: number, data: UpdateUserData) {
  // 后端 PUT /users/update 使用 query 参数（含 id），不使用路径变量/JSON body
  return axios.put("/users/update", null, { params: { id, ...data } });
}
