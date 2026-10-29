import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
    };

    await productModel.create(productData);

    res.json({ success: true, message: "product added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.findAll();
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.destroy({ where: { id: req.body.id } });
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findByPk(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function to edit single product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const product = await productModel.findByPk(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const files = req.files || {};
    const images = [...(product.image || [])];

    for (let i = 0; i < 4; i++) {
      const file = files[`image${i + 1}`] && files[`image${i + 1}`][0];
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        images[i] = result.secure_url;
      }
    }

    await product.update({
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: images.filter(Boolean),
    });

    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };