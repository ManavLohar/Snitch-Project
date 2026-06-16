import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const res = await productApiInstance.get("/seller");
  return res.data;
}

export async function getAllProducts() {
  const res = await productApiInstance.get("/");
  return res.data;
}

export async function getProductById({ productId }) {
  const res = await productApiInstance.get(`/?productId=${productId}`);
  return res.data;
}

export async function addProductVariant({ productId, formData }) {
  const res = await productApiInstance.post(`/${productId}/variants`, formData);
  return res.data;
}

export async function updateVariantStock({ productId, variantId, stock }) {
  const res = await productApiInstance.patch(
    `/${productId}/variants/${variantId}/stock`,
    { stock },
  );
  return res.data;
}

export async function deleteVariant({ productId, variantId }) {
  const res = await productApiInstance.delete(
    `/${productId}/variants/${variantId}`,
  );
  return res.data;
}
