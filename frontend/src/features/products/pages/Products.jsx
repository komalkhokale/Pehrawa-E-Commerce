import React, { useEffect, useMemo, useState } from "react";
import { useProduct } from "../../products/hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Eye, Trash2, Plus } from "lucide-react";

const Products = () => {
  const navigate = useNavigate();

  const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const products = sellerProducts || [];

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

  const getPrice = (product) => {
    const price = product?.variants?.[0]?.price || product?.price;

    if (!price?.amount) return "Price not set";

    return `${price.currency || "INR"} ${Number(price.amount).toLocaleString(
      "en-IN",
    )}`;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = getStock(product);

      const matchesSearch =
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase());

      const matchesGender =
        genderFilter === "All" || product.gender === genderFilter;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && stock > 5) ||
        (stockFilter === "Low Stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "Out of Stock" && stock === 0);

      return matchesSearch && matchesGender && matchesStock;
    });
  }, [products, search, genderFilter, stockFilter]);

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    if (!handleDeleteProduct) {
      toast.error("Delete function is not added in useProduct yet");
      return;
    }

    setIsDeleting(true);

    try {
      await handleDeleteProduct(deleteProduct._id);
      toast.success("Product deleted successfully");
      await handleGetSellerProduct();
      setDeleteProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-6 lg:px-12 xl:px-16 py-10">
    

      <div className="bg-[#fbf9f6] border border-[#e4d8c8] p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_190px] gap-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5ADA3]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or category..."
              className="w-full bg-[#f6f2ea] border border-[#e4d8c8] py-4 pl-12 pr-4 outline-none text-sm"
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-[#f6f2ea] border border-[#e4d8c8] px-4 outline-none text-sm"
          >
            <option value="All">All Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-[#f6f2ea] border border-[#e4d8c8] px-4 outline-none text-sm"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-[#fbf9f6] border border-[#e4d8c8] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[90px_1.5fr_1fr_1fr_1fr_140px] gap-4 px-6 py-4 border-b border-[#e4d8c8] text-[10px] uppercase tracking-[0.24em] text-[#9b8a78]">
          <span>Image</span>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Action</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div>
            {filteredProducts.map((product) => {
              const stock = getStock(product);

              return (
                <div
                  key={product._id}
                  className="grid grid-cols-1 lg:grid-cols-[90px_1.5fr_1fr_1fr_1fr_140px] gap-4 px-6 py-5 border-b border-[#e4d8c8] items-center hover:bg-[#f6f2ea] transition cursor-pointer"
                  onClick={() => navigate(`/seller/product/${product._id}`)}
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

                  <p className="text-sm">{getPrice(product)}</p>

                  <div>
                    <span
                      className={`inline-block px-3 py-2 text-[10px] uppercase tracking-[0.18em] ${
                        stock === 0
                          ? "bg-red-100 text-red-700"
                          : stock <= 5
                            ? "bg-[#fff3d8] text-[#9a6a00]"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {stock === 0
                        ? "Out"
                        : stock <= 5
                          ? `${stock} Low`
                          : `${stock} Stock`}
                    </span>
                  </div>

                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/seller/product/${product._id}`)}
                      className="w-10 h-10 bg-[#1b1c1a] text-white flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="w-10 h-10 border border-red-300 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
                No products found.
              </h2>
            </div>
          </div>
        )}
      </div>

      {deleteProduct && (
        <div className="fixed inset-0 z-[999] bg-black/45 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-[#fbf9f6] p-8 shadow-2xl border border-[#e4e2df]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4">
              Confirm Delete
            </p>

            <h2
              className="text-3xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Delete this product?
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#7A6E63]">
              “{deleteProduct.title}” will be removed permanently.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setDeleteProduct(null)}
                disabled={isDeleting}
                className="flex-1 py-3 border border-[#d0c5b5] text-[11px] uppercase tracking-[0.2em]"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
