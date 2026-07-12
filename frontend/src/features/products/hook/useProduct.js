import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
  addProductVariant,
  updateProduct,
  deleteProduct,
  updateProductVariant,
deleteProductVariant,
} from "../services/product.api.js";

import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    const data = await createProduct(formData);
    return data.product;
  }

  async function handleGetSellerProduct() {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  async function handleGetAllProducts() {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  }

  async function handleGetProductById(productId) {
    const data = await getProductById(productId);
    return data.product;
  }

  async function handleAddProductVariant(productId, newProductVariant) {
    const data = await addProductVariant(productId, newProductVariant);
    return data;
  }

  async function handleUpdateProduct(productId, formData) {
    const data = await updateProduct(productId, formData);
    return data.product;
  }

  async function handleDeleteProduct(productId) {
    const data = await deleteProduct(productId);
    return data;
  }

  async function handleUpdateProductVariant(productId, variantId, formData) {
  const data = await updateProductVariant(productId, variantId, formData);
  return data;
}

async function handleDeleteProductVariant(productId, variantId) {
  const data = await deleteProductVariant(productId, variantId);
  return data;
}

  return {
    handleCreateProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleGetProductById,
    handleAddProductVariant,
    handleUpdateProduct,
    handleDeleteProduct,
    handleUpdateProductVariant,
handleDeleteProductVariant,
  };
};