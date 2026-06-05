import { useDispatch } from "react-redux";
import { createProduct, getAllProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();
  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  };

  const handleGetProducts = async () => {
    const data = await getAllProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  };

  return { handleCreateProduct, handleGetProducts };
};
