import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import toast from "react-hot-toast";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

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
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const inputClass =
    "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]";

  const getInputStyle = (field) => ({
    color: "#1b1c1a",
    borderBottom: errors[field] ? "1px solid #dc2626" : "1px solid #d0c5b5",
    fontFamily: "'Inter', sans-serif",
  });

  const ErrorText = ({ name }) =>
    errors[name] ? (
      <p className="text-[11px] mt-1 text-red-600">{errors[name]}</p>
    ) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.category) newErrors.category = "Please select category";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.size) newErrors.size = "Please select size";
    if (!formData.stock || Number(formData.stock) <= 0)
      newErrors.stock = "Stock must be greater than 0";
    if (!formData.priceAmount || Number(formData.priceAmount) <= 0)
      newErrors.priceAmount = "Valid price is required";
    if (images.length === 0) newErrors.images = "Upload at least 1 image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    const toAdd = Array.from(files).slice(0, remaining);

    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [images],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleFocus = (e) => {
    e.target.style.borderBottomColor = "#C9A96E";
  };

  const handleBlur = (e) => {
    const name = e.target.name;
    e.target.style.borderBottomColor = errors[name] ? "#dc2626" : "#d0c5b5";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("gender", formData.gender);
      data.append("category", formData.category);
      data.append("color", formData.color);
      data.append("size", formData.size);
      data.append("stock", formData.stock);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);

      images.forEach((img) => {
        data.append("images", img.file);
      });

      await handleCreateProduct(data);

      toast.success("Product created successfully");
      navigate("/seller/products");
    } catch (err) {
      console.error("Failed to create product", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 lg:px-12 xl:px-16 py-10">
      <div className="bg-[#fbf9f6] border border-[#e4d8c8] p-6 lg:p-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 xl:gap-16 items-start">
            <div className="space-y-10">
              <section>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E] mb-6">
                  Basic Details
                </p>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Product Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Oversized Linen Shirt"
                      className={inputClass}
                      style={getInputStyle("title")}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <ErrorText name="title" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the product — material, fit, details..."
                      className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#d0c5b5]"
                      style={getInputStyle("description")}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <ErrorText name="description" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                        Gender
                      </label>

                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputClass}
                        style={getInputStyle("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>

                      <ErrorText name="gender" />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                        Category
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClass}
                        style={getInputStyle("category")}
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

                      <ErrorText name="category" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E] mb-6">
                  Pricing & Inventory
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Price Amount
                    </label>

                    <input
                      type="number"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={inputClass}
                      style={getInputStyle("priceAmount")}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <ErrorText name="priceAmount" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Currency
                    </label>

                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className={inputClass}
                      style={getInputStyle("priceCurrency")}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className={inputClass}
                      style={getInputStyle("color")}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Black"
                    />

                    <ErrorText name="color" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Size
                    </label>

                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className={inputClass}
                      style={getInputStyle("size")}
                    >
                      <option value="">Select Size</option>
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>

                    <ErrorText name="size" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={inputClass}
                      style={getInputStyle("stock")}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="10"
                    />

                    <ErrorText name="stock" />
                  </div>
                </div>
              </section>
            </div>

            <aside className="xl:sticky xl:top-36">
              <div className="bg-[#f6f2ea] border border-[#e4d8c8] p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
                    Product Media
                  </p>

                  <span className="text-[10px] text-[#B5ADA3]">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>

                {images.length < MAX_IMAGES && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed px-8 py-16 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: errors.images
                        ? "#dc2626"
                        : isDragging
                          ? "#C9A96E"
                          : "#d0c5b5",
                      backgroundColor: isDragging
                        ? "rgba(201,169,110,0.07)"
                        : "#fbf9f6",
                    }}
                  >
                    <p className="text-sm text-[#7A6E63] text-center">
                      Drop images here or{" "}
                      <span className="text-[#C9A96E] underline underline-offset-4">
                        browse files
                      </span>
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5ADA3]">
                      PNG, JPG, WEBP · Max {MAX_IMAGES}
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}

                <ErrorText name="images" />

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden group bg-[#eae8e5]"
                      >
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                          style={{
                            backgroundColor: "rgba(27,24,20,0.55)",
                            color: "#fbf9f6",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 border-t border-[#e4d8c8] pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSubmitting ? "#7A6E63" : "#1b1c1a",
                      color: "#fbf9f6",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Product"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/seller/products")}
                    className="mt-3 w-full py-4 border border-[#d0c5b5] text-[11px] uppercase tracking-[0.25em] text-[#1b1c1a]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
