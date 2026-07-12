import axios from "axios"


const productApiInstance = axios.create({
    baseURL: "https://pehrawa.onrender.com/api/products",
    withCredentials: true,
})




export async function createProduct(formData) {
  const response = await productApiInstance.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}



export async function getSellerProducts() {

    const response = await productApiInstance.get("/seller")

    return response.data

}


export async function getAllProducts() {
    
    const response = await productApiInstance.get("/")

    return response.data
    
}

export async function getProductById(productId) {
    
    const response = await productApiInstance.get(`/detail/${productId}`)

    return response.data
    
}   

export async function addProductVariant(productId, newProductVariant) {

    const formData = new FormData();

    newProductVariant.images.forEach((image) => {
        formData.append("images", image.file);
    });

    formData.append("color", newProductVariant.color);
    formData.append("size", newProductVariant.size);
    formData.append("stock", newProductVariant.stock);
    formData.append("priceAmount", newProductVariant.price);
    formData.append("priceCurrency", "INR");

    const response = await productApiInstance.post(
        `/${productId}/variants`,
        formData
    );

    return response.data;
}   

export async function updateProduct(productId, formData) {
  const response = await productApiInstance.patch(`/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteProduct(productId) {
  const response = await productApiInstance.delete(`/${productId}`);

  return response.data;
}

export async function updateProductVariant(productId, variantId, formData) {
  const response = await productApiInstance.patch(
    `/${productId}/variants/${variantId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteProductVariant(productId, variantId) {
  const response = await productApiInstance.delete(
    `/${productId}/variants/${variantId}`
  );

  return response.data;
}