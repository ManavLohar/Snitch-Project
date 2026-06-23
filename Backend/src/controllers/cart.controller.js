import { stockOfVariant } from "../dao/product.dao.js";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;
  const product = await ProductModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found!",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  let cart =
    (await CartModel.findOne({ user: req.user._id })) ||
    (await CartModel.create({ user: req.user._id }));

  const isProductIsAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductIsAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await CartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      {
        $inc: { "items.$.quantity": quantity },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: "Cart updated successfully!",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock!`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.price,
  });

  await cart.save();

  cart = await CartModel.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  const newItem = cart.items[cart.items.length - 1];
  // console.log(newItem);

  return res.status(200).json({
    message: "Product added to cart successfully!",
    success: true,
    cartItem: newItem,
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await ProductModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found!",
      success: false,
    });
  }

  const cart = await CartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found!",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart!`,
      success: false,
    });
  }

  await CartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    {
      returnDocument: "after",
    },
  );

  return res.status(200).json({
    message: "Cart item quantity incremented successfully1",
    success: true,
  });
};

export const decreaseCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await ProductModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found!",
      success: false,
    });
  }

  const cart = await CartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found!",
      success: false,
    });
  }

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    )?.quantity || 0;

  if (itemQuantityInCart <= 1) {
    return res.status(400).json({
      message: `At least one item is required!`,
      success: false,
    });
  }

  await CartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    {
      $inc: { "items.$.quantity": -1 },
    },
    {
      returnDocument: "after",
    },
  );

  return res.status(200).json({
    message: "Cart item quantity decremented successfully1",
    success: true,
  });
};

export const removeCartItem = async (req, res) => {
  const user = req.user;
  const { productId, variantId } = req.params;

  const product = await ProductModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found!",
      success: false,
    });
  }

  const cart = await CartModel.findOne({
    user: user._id,
    "items.product": productId,
    "items.variant": variantId,
  });

  cart.items = cart.items.filter(
    (item) => item.variant.toString() !== variantId,
  );

  await cart.save();
  return res.status(200).json({
    message: "Item removed from cart!",
    success: true,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await CartModel.findOne({ user: user._id }).populate(
    "items.product",
  );

  if (!cart) {
    cart = await CartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully!",
    success: true,
    cart,
  });
};
