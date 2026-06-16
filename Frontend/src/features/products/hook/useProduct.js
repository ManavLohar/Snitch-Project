import { useDispatch } from "react-redux";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  addProductVariant,
  updateVariantStock,
  deleteVariant,
} from "../services/product.api";
import { setProducts, setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  };

  const handleGetProducts = async () => {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  };

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
  };

  const handleGetProductById = async ({ productId }) => {
    const data = await getProductById({ productId });
    return data.products;
  };

  const handleAddProductVariant = async ({ productId, formData }) => {
    const data = await addProductVariant({ productId, formData });
    return data;
  };

  const handleUpdateVariantStock = async ({ productId, variantId, stock }) => {
    const data = await updateVariantStock({ productId, variantId, stock });
    return data;
  };

  const handleDeleteVariant = async ({ productId, variantId }) => {
    const data = await deleteVariant({ productId, variantId });
    return data;
  };

  return {
    handleCreateProduct,
    handleGetProducts,
    handleGetAllProducts,
    handleGetProductById,
    handleAddProductVariant,
    handleUpdateVariantStock,
    handleDeleteVariant,
  };
};
