import React, { useEffect, useMemo, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Boxes,
  AlertTriangle,
  PackageCheck,
  PackageX,
} from "lucide-react";

const Inventory = () => {
  const navigate = useNavigate();
  const { handleGetSellerProduct } = useProduct();

  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const products = sellerProducts || [];

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const getStock = (product) =>
    product?.variants?.reduce(
      (sum, variant) => sum + Number(variant.stock || 0),
      0,
    ) || 0;

  const getImage = (product) =>
    product?.variants?.[0]?.images?.[0]?.url ||
    product?.images?.[0]?.url ||
    "/snitch_editorial_warm.png";

  const stats = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + getStock(product),
      0,
    );

    const healthy = products.filter((product) => getStock(product) > 5).length;

    const low = products.filter((product) => {
      const stock = getStock(product);
      return stock > 0 && stock <= 5;
    }).length;

    const out = products.filter((product) => getStock(product) === 0).length;

    return {
      totalStock,
      healthy,
      low,
      out,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = getStock(product);

      const matchesSearch =
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase()) ||
        product.gender?.toLowerCase().includes(search.toLowerCase());

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Healthy" && stock > 5) ||
        (stockFilter === "Low Stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "Out of Stock" && stock === 0);

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  const getStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        className: "bg-[#fff3d8] text-[#9a6a00]",
      };
    }

    return {
      label: "Healthy",
      className: "bg-green-100 text-green-700",
    };
  };

  const statCards = [
    {
      label: "Total Stock",
      value: stats.totalStock,
      icon: Boxes,
    },
    {
      label: "Healthy Products",
      value: stats.healthy,
      icon: PackageCheck,
    },
    {
      label: "Low Stock",
      value: stats.low,
      icon: AlertTriangle,
    },
    {
      label: "Out of Stock",
      value: stats.out,
      icon: PackageX,
    },
  ];

  return (
    <div className="px-6 lg:px-12 xl:px-16 py-10">
   

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-[#fbf9f6] border border-[#e4d8c8] p-7 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8a78]">
                  {card.label}
                </p>

                <Icon size={18} className="text-[#C9A96E]" />
              </div>

              <h2
                className="mt-5 text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="bg-[#fbf9f6] border border-[#e4d8c8] p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5ADA3]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, category or gender..."
              className="w-full bg-[#f6f2ea] border border-[#e4d8c8] py-4 pl-12 pr-4 outline-none text-sm"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-[#f6f2ea] border border-[#e4d8c8] px-4 outline-none text-sm"
          >
            <option value="All">All Stock</option>
            <option value="Healthy">Healthy</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-[#fbf9f6] border border-[#e4d8c8] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[90px_1.7fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b border-[#e4d8c8] text-[10px] uppercase tracking-[0.24em] text-[#9b8a78]">
          <span>Image</span>
          <span>Product</span>
          <span>Category</span>
          <span>Variants</span>
          <span>Stock</span>
          <span>Status</span>
        </div>

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const stock = getStock(product);
            const status = getStatus(stock);

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/seller/product/${product._id}`)}
                className="grid grid-cols-1 lg:grid-cols-[90px_1.7fr_1fr_1fr_1fr_120px] gap-4 px-6 py-5 border-b border-[#e4d8c8] items-center hover:bg-[#f6f2ea] transition cursor-pointer"
              >
                <img
                  src={getImage(product)}
                  alt={product.title}
                  className="w-20 h-24 object-cover bg-[#e4d8c8]"
                />

                <div>
                  <h3
                    className="text-2xl leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-[#7A6E63] mt-1 line-clamp-1">
                    {product.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm">{product.category || "—"}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5ADA3] mt-1">
                    {product.gender || "—"}
                  </p>
                </div>

                <p className="text-sm">{product.variants?.length || 0}</p>

                <p className="text-sm font-medium">{stock}</p>

                <span
                  className={`inline-block text-center px-3 py-2 text-[10px] uppercase tracking-[0.18em] ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })
        ) : (
          <div className="min-h-[360px] flex items-center justify-center text-center p-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E] mb-4">
                Empty
              </p>

              <h2
                className="text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No inventory found.
              </h2>

              <p className="mt-4 text-sm text-[#7A6E63]">
                Try another search or stock filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
