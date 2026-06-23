import { useDispatch } from "react-redux";
import {
  addItem,
  decrementCartItemQuantity,
  getItems,
  incrementCartItemQuantity,
  removeCartItem,
} from "../service/cart.api";
import {
  decrementCartitem,
  incrementCartitem,
  insertItem,
  insertItems,
  removeItem,
} from "../states/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleGetItems = async () => {
    const data = await getItems();
    dispatch(insertItems(data.cart.items));
  };

  const handleAddItem = async ({ productId, variantId }) => {
    const data = await addItem({ productId, variantId });
    handleGetItems();
    dispatch(insertItem(data.cartItem));
    return data;
  };

  const handleIncrementCartItemQuantity = async ({ productId, variantId }) => {
    const data = await incrementCartItemQuantity({ productId, variantId });
    dispatch(incrementCartitem({ productId, variantId }));
  };

  const handleDecrementCartItemQuantity = async ({ productId, variantId }) => {
    const data = await decrementCartItemQuantity({ productId, variantId });
    dispatch(decrementCartitem({ productId, variantId }));
  };

  const handleRemoveItem = async ({ productId, variantId }) => {
    const data = await removeCartItem({ productId, variantId });
    handleGetItems();
    dispatch(removeItem({ productId, variantId }));
    return data;
  };

  return {
    handleAddItem,
    handleGetItems,
    handleIncrementCartItemQuantity,
    handleDecrementCartItemQuantity,
    handleRemoveItem,
  };
};
