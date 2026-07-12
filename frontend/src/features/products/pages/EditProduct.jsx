import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { handleGetProductById, handleUpdateProduct } = useProduct();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gender: "",
    category: "",
    color: "",
    size: "",
    stock: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await handleGetProductById(productId);
        const firstVariant = product?.variants?.[0];

        setFormData({
          title: product?.title || "",
          description: product?.description || "",
          gender: product?.gender || "",
          category: product?.category || "",
          color: firstVariant?.color || "",
          size: firstVariant?.size || "",
          stock: firstVariant?.stock || "",
          priceAmount: firstVariant?.price?.amount || "",
          priceCurrency: firstVariant?.price?.currency || "INR",
        });
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      setSaving(true);

      await handleUpdateProduct(productId, data);

      toast.success("Product updated successfully");
      navigate(`/seller/product/${productId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 shadow-[0_20px_50px_rgba(27,28,26,0.06)]">
        <h1 className="font-serif text-3xl uppercase mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            rows="4"
            className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            >
              <option value="">Select Category</option>
              <option value="T-Shirt">T-Shirt</option>
              <option value="Shirt">Shirt</option>
              <option value="Jeans">Jeans</option>
              <option value="Pant">Pant</option>
              <option value="Cargo">Cargo</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Sweatshirt">Sweatshirt</option>
              <option value="Jacket">Jacket</option>
              <option value="Kurta">Kurta</option>
              <option value="Dress">Dress</option>
              <option value="Top">Top</option>
              <option value="Skirt">Skirt</option>
              <option value="Saree">Saree</option>
            </select>

            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Color"
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            />

            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            >
              <option value="">Select Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            />

            <input
              type="number"
              name="priceAmount"
              value={formData.priceAmount}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border-b border-[#d0c5b5] bg-transparent py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-3">
              Upload New Images Optional
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-[#745a27] text-[#745a27]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#745a27] text-white disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
