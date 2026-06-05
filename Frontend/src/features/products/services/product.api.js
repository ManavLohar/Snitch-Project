import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/product",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

export async function getAllProducts() {
  const res = await productApiInstance.get("/seller");
  return res.data;
}
