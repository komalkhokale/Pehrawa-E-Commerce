import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { SquarePen, Trash2 } from "lucide-react";

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [localVariants, setLocalVariants] = useState([]);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [variantErrors, setVariantErrors] = useState({});
  const [isSavingVariant, setIsSavingVariant] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const [newVariant, setNewVariant] = useState({
    images: [],
    color: "",
    size: "",
    stock: "",
    price: "",
  });



  const { productId } = useParams();

  const {
    handleGetProductById,
    handleAddProductVariant,
    handleDeleteProduct,
    handleUpdateProductVariant,
    handleDeleteProductVariant,
  } = useProduct();

  const [editingVariant, setEditingVariant] = useState(null);

 

  const variantInputClass = (field) =>
    `w-full bg-transparent border-b py-2 focus:outline-none ${
      variantErrors[field]
        ? "border-red-600"
        : "border-[#d0c5b5] focus:border-[#745a27]"
    }`;

  const ErrorText = ({ name }) =>
    variantErrors[name] ? (
      <p className="text-[11px] mt-1 text-red-600">{variantErrors[name]}</p>
    ) : null;

  async function fetchProductDetails() {
    setLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const prod = data?.product || data;

      setProduct(prod);
      setLocalVariants(prod?.variants || []);
    } catch (error) {
      console.error("Failed to fetch product details", error);
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleStockChange = (index, newStock) => {
    const updatedVariants = [...localVariants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      stock: Number(newStock),
    };
    setLocalVariants(updatedVariants);
  };

  const validateVariant = () => {
    const errors = {};

    if (!newVariant.color.trim()) errors.color = "Color is required";
    if (!newVariant.size) errors.size = "Size is required";
    if (!newVariant.stock || Number(newVariant.stock) <= 0)
      errors.stock = "Stock must be greater than 0";
    if (newVariant.price && Number(newVariant.price) <= 0)
      errors.price = "Price must be greater than 0";

    setVariantErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleAddNewVariant = async () => {
   if (!validateVariant()) return;

   setIsSavingVariant(true);

   try {
     const formData = new FormData();

     newVariant.images.forEach((image) => {
       formData.append("images", image.file || image);
     });

     formData.append("color", newVariant.color);
     formData.append("size", newVariant.size);
     formData.append("stock", newVariant.stock);
     formData.append("priceAmount", newVariant.price);
     formData.append("priceCurrency", "INR");

     if (editingVariant) {
       await handleUpdateProductVariant(
         product._id,
         editingVariant._id,
         formData,
       );
       toast.success("Variant updated successfully");
     } else {
       await handleAddProductVariant(productId, newVariant);
       toast.success("Variant added successfully");
     }

     await fetchProductDetails();

     setIsAddingVariant(false);
     setEditingVariant(null);
     setNewVariant({
       images: [],
       color: "",
       size: "",
       stock: "",
       price: "",
     });
     setVariantErrors({});
   } catch (error) {
     toast.error(error.response?.data?.message || "Failed to save variant");
   } finally {
     setIsSavingVariant(false);
   }
 };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 7 - newVariant.images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(`Only ${availableSlots} more images allowed`);
    }

    const newImageObjects = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewVariant((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageObjects],
    }));

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = newVariant.images[index];

    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const updatedImages = newVariant.images.filter((_, i) => i !== index);

    setNewVariant((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };



 const handleEditVariant = (variant) => {
   setEditingVariant(variant);
   setIsAddingVariant(true);

   setNewVariant({
     images: [],
     color: variant.color || "",
     size: variant.size || "",
     stock: variant.stock || "",
     price: variant.price?.amount || "",
   });
 };

  

  const handleDeleteVariant = async (variant) => {
    try {
      await handleDeleteProductVariant(product._id, variant._id);

      toast.success("Variant deleted");

      fetchProductDetails();
    } catch (error) {
      toast.error("Failed to delete variant");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">
        Loading gallery...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24">
      <header className="sticky top-0 z-10 bg-[#fbf9f6]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl tracking-wide uppercase">
          {product.title?.substring(0, 20)}
          {product.title?.length > 20 ? "..." : ""}
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/seller/product/edit/${product._id}`)}
            className="px-5 py-2 border border-[#745a27] text-[#745a27] hover:bg-[#745a27] hover:text-white transition cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              {product.variants?.[0]?.images?.length > 0 ? (
                <img
                  src={product.variants[0].images[0].url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7f7668]">
                  No Image
                </div>
              )}
            </div>

            {product.variants?.[0]?.images?.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.variants[0].images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Thumb ${i}`}
                    className="w-16 h-20 object-cover bg-[#f5f3f0] shrink-0"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4 uppercase">
              {product.title}
            </h2>

            <p className="text-[#6e6258] text-lg mb-6 leading-relaxed max-w-md">
              {product.description}
            </p>

            <div className="text-2xl tracking-wide font-light mb-8">
              {product.variants?.[0]?.price?.amount}{" "}
              {product.variants?.[0]?.price?.currency}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f3f0] p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="font-serif text-3xl uppercase">
              Variants & Inventory
            </h3>

            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="bg-[#745a27] text-white px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#5a4312] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon /> Add New Variant
              </button>
            )}
          </div>

          {isAddingVariant && (
            <div className="bg-white p-6 md:p-8 mb-12 shadow-[0_20px_40px_rgba(27,28,26,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif text-xl uppercase">
                  {editingVariant ? "Edit Variant" : "Create Variant"}
                </h4>

                <button
                  onClick={() => {
                    setIsAddingVariant(false);
                    setVariantErrors({});
                    setIsAddingVariant(false);
                    setEditingVariant(null);
                    setVariantErrors({});
                    setNewVariant({
                      images: [],
                      color: "",
                      size: "",
                      stock: "",
                      price: "",
                    });
                  }}
                  className="text-[#7f7668] hover:text-[#1b1c1a] text-sm uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">
                      Color
                    </label>

                    <input
                      type="text"
                      value={newVariant.color}
                      onChange={(e) => {
                        setNewVariant({
                          ...newVariant,
                          color: e.target.value,
                        });
                        setVariantErrors((prev) => ({ ...prev, color: "" }));
                      }}
                      className={variantInputClass("color")}
                      placeholder="Black"
                    />

                    <ErrorText name="color" />
                  </div>

                  <div className="mt-5">
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">
                      Size
                    </label>

                    <select
                      value={newVariant.size}
                      onChange={(e) => {
                        setNewVariant({
                          ...newVariant,
                          size: e.target.value,
                        });
                        setVariantErrors((prev) => ({ ...prev, size: "" }));
                      }}
                      className={variantInputClass("size")}
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>

                    <ErrorText name="size" />
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">
                        Initial Stock
                      </label>

                      <input
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) => {
                          setNewVariant({
                            ...newVariant,
                            stock: e.target.value,
                          });
                          setVariantErrors((prev) => ({ ...prev, stock: "" }));
                        }}
                        className={variantInputClass("stock")}
                      />

                      <ErrorText name="stock" />
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">
                        Price Amount
                      </label>

                      <input
                        type="number"
                        value={newVariant.price}
                        onChange={(e) => {
                          setNewVariant({
                            ...newVariant,
                            price: e.target.value,
                          });
                          setVariantErrors((prev) => ({ ...prev, price: "" }));
                        }}
                        placeholder="Default if empty"
                        className={`${variantInputClass("price")} placeholder:text-[#d0c5b5]`}
                      />

                      <ErrorText name="price" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258]">
                      Image Upload
                    </label>

                    <span className="text-xs text-[#7f7668]">
                      {newVariant.images.length}/7
                    </span>
                  </div>

                  {newVariant.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {newVariant.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-[4/5] bg-[#f5f3f0]"
                        >
                          <img
                            src={img.previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {newVariant.images.length < 7 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-[#6e6258]
                        file:mr-4 file:py-2 file:px-4
                        file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a]
                        hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-xs file:tracking-wider file:font-serif
                        cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleAddNewVariant}
                  disabled={isSavingVariant}
                  className="bg-gradient-to-r from-[#745a27] to-[#c9a96e] text-white px-8 py-3 uppercase tracking-wider text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingVariant
                    ? "Saving..."
                    : editingVariant
                      ? "Update Variant"
                      : "Save Variant"}
                </button>
              </div>
            </div>
          )}

          {localVariants.length === 0 ? (
            <div className="py-12 text-center text-[#6e6258]">
              <p>No variants have been created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {localVariants.map((variant, idx) => (
                <div
                  key={variant._id || idx}
                  className="bg-white overflow-hidden border border-[#ece6dc] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-5 flex gap-5 items-start">
                    <div className="w-30 overflow-hidden bg-[#f5f3f0] shrink-0">
                      {variant.images?.length > 0 ? (
                        <img
                          src={variant.images[0].url}
                          alt="Variant"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7f7668]">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="space-y-2">
                          <span className="block bg-[#f5f3f0] px-3 py-1 text-[11px] uppercase tracking-wider text-[#4d463a]">
                            Color : {variant.color}
                          </span>

                          <span className="inline-block bg-[#f5f3f0] px-3 py-1 text-[11px] uppercase tracking-wider text-[#4d463a]">
                            Size : {variant.size}
                          </span>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {/* Edit */}
                          <button
                            onClick={() => handleEditVariant(variant)}
                            className="w-10 h-10 border border-[#d9cbb8] flex items-center justify-center text-[#745a27] hover:bg-[#745a27] hover:text-white transition cursor-pointer"
                          >
                            <SquarePen size={17} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteVariant(variant)}
                            className="w-10 h-10 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 text-xl font-serif text-[#1b1c1a]">
                        {variant.price?.amount
                          ? `${variant.price.amount} ${variant.price.currency}`
                          : `${product.variants?.[0]?.price?.amount} ${product.variants?.[0]?.price?.currency}`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-[#ece6dc] bg-[#faf8f4] flex items-center justify-between px-5 py-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#8a7b68]">
                      Current Stock
                    </label>

                    <input
                      type="number"
                      value={variant.stock || 0}
                      onChange={(e) => handleStockChange(idx, e.target.value)}
                      className="w-24 text-center text-xl font-serif bg-transparent border-b border-[#cdbb9e] focus:outline-none focus:border-[#745a27]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-l bg-[#fbf9f6] shadow-2xl p-10">
            <p className="uppercase tracking-[0.35em] text-xs text-[#C9A96E] mb-6">
              Confirm Delete
            </p>

            <h2 className="font-serif text-2xl font-medium leading-tight mb-6">
              Delete this product?
            </h2>

            <p className="text-lg text-[#6e6258] mb-12">
              <span className="font-medium">"{product.title}"</span> will be
              removed permanently.
            </p>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-[#d9cbb8] py-4 uppercase tracking-[0.25em] hover:bg-[#f3eee7] transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await handleDeleteProduct(product._id);

                    toast.success("Product deleted");

                    setShowDeleteModal(false);

                    navigate("/seller/products");
                  } catch (err) {
                    toast.error("Delete failed");
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white uppercase tracking-[0.25em] transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductDetails;
            