import axios from "axios";

const sellerDashboardApi = axios.create({
  baseURL: "https://pehrawa.onrender.com/api/products",
  withCredentials: true,
});

export const getSellerDashboardApi = async () => {
  const response = await sellerDashboardApi.get("/seller/dashboard");
  return response.data;
};