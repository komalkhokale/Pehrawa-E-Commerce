import axios from "axios";

const sellerAnalyticsApi = axios.create({
  baseURL: "https://pehrawa.onrender.com/api/cart",
  withCredentials: true,
});

export const getSellerAnalyticsApi = async () => {
  const response = await sellerAnalyticsApi.get("/analytics/seller");

  return response.data;
};