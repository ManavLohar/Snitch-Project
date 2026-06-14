import { ProductModel } from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;
  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  const product = await ProductModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images,
    seller: seller._id,
  });

  res.status(201).json({
    message: "Product created successfully!",
    success: true,
    product,
  });
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;

  const products = await ProductModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Products fetched successfully!",
    success: true,
    products,
  });
};

export const getAllProducts = async (req, res) => {
  const { productId } = req.query;
  console.log(productId);

  let products;
  let product;

  if (productId) {
    product = await ProductModel.findOne({ _id: productId });
  } else {
    products = await ProductModel.find();
  }

  return res.status(200).json({
    message: "Products fetched successfully!",
    success: true,
    products: products ? products : product,
  });
};

export const getProduct = async (req, res) => {
  const productId = req.query.productId;
  const product = await ProductModel.findOne({ _id: productId });
  return res.status(200).json({
    message: "Product fetched successfully!",
    success: true,
    product,
  });
};
