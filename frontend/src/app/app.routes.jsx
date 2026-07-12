import { createBrowserRouter } from "react-router-dom";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Protected from "../features/auth/components/Protected";

import AppLayout from "./AppLayout";

import Home from "../features/products/pages/Home";
import Collection from "../features/products/pages/Collection";
import About from "../features/products/pages/About";
import ProductDetail from "../features/products/pages/ProductDetail";

import Cart from "../features/cart/pages/Cart";
import Wishlist from "../features/wishlist/pages/Wishlist";

import SellerLayout from "../features/products/components/SellerLayout";
import Dashboard from "../features/products/pages/Dashboard";
import Products from "../features/products/pages/Products";
import Inventory from "../features/products/pages/Inventory";
import Orders from "../features/products/pages/Orders";
import Analytics from "../features/products/pages/Analytics";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";

import EditProduct from "../features/products/pages/EditProduct";

import OrderSuccess from "../features/cart/pages/OrderSuccess";

import MyOrders from "../features/cart/pages/MyOrders";

export const routes = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },

      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },

      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },
    ],
  },

  {
    path: "/seller",
    element: (
      <Protected role="seller">
        <SellerLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "product/edit/:productId",
        element: <EditProduct />,
      },
      {
        path: "product/:productId",
        element: <SellerProductDetails />,
      },
    ],
  },
]);