import axios from "axios";

const sellerDashboardApi = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const getSellerDashboardApi = async () => {
  const response = await sellerDashboardApi.get("/seller/dashboard");
  return response.data;
};