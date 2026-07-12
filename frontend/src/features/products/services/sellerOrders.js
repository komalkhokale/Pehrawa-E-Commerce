import axios from "axios";

const sellerOrdersApi = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const getSellerOrdersApi = async () => {
  const response = await sellerOrdersApi.get("/orders/seller");

  return response.data;
};