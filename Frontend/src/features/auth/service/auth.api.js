import axios from "axios";

const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const response = await authApi.post("/register", {
    fullname,
    email,
    password,
    contact,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const res = await authApi.post("/login", { email, password });
  return res.data;
}

export async function getMe() {
  const res = await authApi.get("/get-me");
  return res.data;
}
