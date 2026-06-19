import { useDispatch } from "react-redux";
import { addItem, getItems } from "../service/cart.api";
import { insertItem } from "../states/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();
  const handleAddItem = async ({ productId, variantId }) => {
    const data = await addItem({ productId, variantId });
    // dispatch(insertItem(data.cart));
    return data;
  };

  const handleGetItems = async () => {
    const data = await getItems();
    dispatch(insertItem(data.cart.items));
  };

  return { handleAddItem, handleGetItems };
};
