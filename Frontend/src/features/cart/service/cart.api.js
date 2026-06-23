import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItem = async ({ productId, variantId, quantity }) => {
  const response = await cartApiInstance.post(
    `/add/${productId}/${variantId}`,
    { quantity },
  );
  return response.data;
};

export const incrementCartItemQuantity = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/quantity/increment/${productId}/${variantId}`,
  );
  return response.data;
};

export const decrementCartItemQuantity = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/quantity/decrement/${productId}/${variantId}`,
  );
  return response.data;
};

export const removeCartItem = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/remove/${productId}/${variantId}`,
  );
  return response.data;
};

export const getItems = async () => {
  const response = await cartApiInstance.get("/");
  return response.data;
};
