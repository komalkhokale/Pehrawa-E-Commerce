import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Edit3,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  Star,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useReview } from "../hook/useReview.js";

const initialReviewData = {
  averageRating: 0,
  totalReviews: 0,

  ratingBreakdown: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },

  reviews: [],
};

const ReviewSection = ({ productId }) => {
  const navigate = useNavigate();

  const {
    handleGetProductReviews,
    handleAddReview,
    handleUpdateReview,
    handleDeleteReview,
  } = useReview();

  const currentUser = useSelector((state) => state.auth?.user);

  const [reviewData, setReviewData] = useState(initialReviewData);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await handleGetProductReviews(productId);

      setReviewData({
        averageRating: Number(response?.averageRating || 0),

        totalReviews: Number(response?.totalReviews || 0),

        ratingBreakdown: {
          ...initialReviewData.ratingBreakdown,
          ...(response?.ratingBreakdown || {}),
        },

        reviews: response?.reviews || [],
      });
    } catch (error) {
      console.error("Reviews fetch error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Reviews load nahi ho sake.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const myReview = useMemo(() => {
    if (!currentUser?._id) {
      return null;
    }

    return reviewData.reviews.find((review) => {
      const reviewUserId =
        typeof review.user === "object" ? review.user?._id : review.user;

      return reviewUserId?.toString() === currentUser._id?.toString();
    });
  }, [reviewData.reviews, currentUser]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPercentage = (count) => {
    if (!reviewData.totalReviews) {
      return 0;
    }

    return Math.round((Number(count || 0) / reviewData.totalReviews) * 100);
  };

  const validateReview = (selectedRating, reviewComment) => {
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      toast.error("Please select a rating");

      return false;
    }

    if (!reviewComment.trim() || reviewComment.trim().length < 3) {
      toast.error("Review must be at least 3 characters");

      return false;
    }

    return true;
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      toast.error("Please login to write a review");
      navigate("/login");

      return;
    }

    if (!validateReview(rating, comment)) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await handleAddReview(productId, {
        rating,
        comment: comment.trim(),
      });

      toast.success(response?.message || "Review added successfully");

      setRating(0);
      setHoveredRating(0);
      setComment("");

      await loadReviews();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Review submit nahi hua.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditRating(Number(review.rating || 0));
    setEditComment(review.comment || "");
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveEditedReview = async (reviewId) => {
    if (!validateReview(editRating, editComment)) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await handleUpdateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      });

      toast.success(response?.message || "Review updated successfully");

      cancelEditing();

      await loadReviews();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Review update nahi hua.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (reviewId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);

      const response = await handleDeleteReview(reviewId);

      toast.success(response?.message || "Review deleted successfully");

      await loadReviews();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Review delete nahi hua.",
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  const renderStars = ({
    value,
    interactive = false,
    onChange,
    onHover,
    size = 20,
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = starValue <= value;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => {
                if (interactive) {
                  onChange?.(starValue);
                }
              }}
              onMouseEnter={() => {
                if (interactive) {
                  onHover?.(starValue);
                }
              }}
              onMouseLeave={() => {
                if (interactive) {
                  onHover?.(0);
                }
              }}
              className={
                interactive
                  ? "transition duration-200 hover:scale-110"
                  : "cursor-default"
              }
              aria-label={`${starValue} star`}
            >
              <Star
                size={size}
                strokeWidth={1.7}
                fill={filled ? "#C9A96E" : "transparent"}
                className={filled ? "text-[#C9A96E]" : "text-[#d7cec3]"}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8 lg:px-16 xl:px-24">
        <div className="flex min-h-[260px] flex-col items-center justify-center border-y border-[#e4e2df]">
          <LoaderCircle size={28} className="animate-spin text-[#C9A96E]" />

          <p className="mt-5 text-[10px] uppercase tracking-[0.26em] text-[#9b8a78]">
            Loading Reviews
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8 lg:px-16 xl:px-24">
      <div className="border-t border-[#e4e2df] pt-16">
        {/* Heading */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E]">
            Customer Experience
          </p>

          <h2
            className="mt-3 text-4xl font-light text-[#1b1c1a] md:text-5xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Ratings & Reviews
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center gap-3 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          {/* Rating summary */}
          <div className="border border-[#e4d8c8] bg-[#fbf9f6] p-7 md:p-9">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8a78]">
              Overall Rating
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-7xl font-light leading-none text-[#1b1c1a]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {reviewData.averageRating.toFixed(1)}
                </p>

                <div className="mt-4">
                  {renderStars({
                    value: Math.round(reviewData.averageRating),
                    size: 21,
                  })}
                </div>

                <p className="mt-3 text-sm text-[#7A6E63]">
                  Based on {reviewData.totalReviews}{" "}
                  {reviewData.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d9cbb9]">
                <MessageSquareText size={25} className="text-[#C9A96E]" />
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = Number(reviewData.ratingBreakdown?.[star] || 0);

                const percentage = getPercentage(count);

                return (
                  <div
                    key={star}
                    className="grid grid-cols-[42px_1fr_35px] items-center gap-3"
                  >
                    <div className="flex items-center gap-1 text-xs text-[#5e5145]">
                      <span>{star}</span>

                      <Star
                        size={12}
                        fill="#C9A96E"
                        className="text-[#C9A96E]"
                      />
                    </div>

                    <div className="h-1.5 overflow-hidden bg-[#ebe4db]">
                      <div
                        className="h-full bg-[#C9A96E] transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="text-right text-xs text-[#9b8a78]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login nahi hai */}
          {!currentUser && (
            <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#e4d8c8] bg-white p-7 text-center md:p-9">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5efe7]">
                <LockKeyhole
                  size={28}
                  strokeWidth={1.5}
                  className="text-[#C9A96E]"
                />
              </div>

              <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">
                Members Only
              </p>

              <h3
                className="mt-3 text-3xl font-light text-[#1b1c1a] md:text-4xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Login to Write a Review
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#7A6E63]">
                Apna product experience share karne ke liye pehle account me
                login karein.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-8 bg-[#1b1c1a] px-10 py-4 text-[10px] uppercase tracking-[0.24em] text-white transition hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
              >
                Login to Continue
              </button>
            </div>
          )}

          {/* Login hai */}
          {currentUser && (
            <div className="border border-[#e4d8c8] bg-white p-7 md:p-9">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">
                Share Your Experience
              </p>

              <h3
                className="mt-3 text-3xl font-light text-[#1b1c1a]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Write a Review
              </h3>

              {/* User already reviewed */}
              {myReview ? (
                <div className="mt-8 border border-[#e4d8c8] bg-[#fbf9f6] p-6">
                  <div className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-green-700"
                    />

                    <div>
                      <p className="text-sm font-medium text-[#1b1c1a]">
                        You have already reviewed this product
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#7A6E63]">
                        Neeche apna existing review edit ya delete kar sakti ho.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitReview} className="mt-8">
                  {/* Rating */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.22em] text-[#7A6E63]">
                      Your Rating
                    </label>

                    <div className="mt-3">
                      {renderStars({
                        value: hoveredRating || rating,
                        interactive: true,
                        onChange: setRating,
                        onHover: setHoveredRating,
                        size: 29,
                      })}
                    </div>

                    <p className="mt-2 text-xs text-[#9b8a78]">
                      {rating > 0
                        ? `${rating} out of 5 selected`
                        : "Select stars to rate this product"}
                    </p>
                  </div>

                  {/* Comment */}
                  <div className="mt-7">
                    <label
                      htmlFor="review-comment"
                      className="text-[10px] uppercase tracking-[0.22em] text-[#7A6E63]"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="review-comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      maxLength={500}
                      rows={6}
                      placeholder="Product quality, fitting aur experience ke baare me likho..."
                      className="mt-3 w-full resize-none border border-[#d9cfc2] bg-[#fbf9f6] px-4 py-4 text-sm leading-6 text-[#1b1c1a] outline-none transition placeholder:text-[#b4a99e] focus:border-[#C9A96E]"
                    />

                    <div className="mt-2 flex justify-between text-xs text-[#9b8a78]">
                      <span>Minimum 3 characters</span>

                      <span>{comment.length}/500</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-7 flex w-full items-center justify-center gap-2 bg-[#1b1c1a] px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-white transition hover:bg-[#C9A96E] hover:text-[#1b1c1a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={15} className="animate-spin" />

                        <span>Submitting</span>
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-[#9b8a78]">
                    Sirf purchased product par review submit kiya ja sakta hai.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Reviews list */}
        <div className="mt-14">
          <div className="flex items-end justify-between gap-5 border-b border-[#e4e2df] pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">
                Community Feedback
              </p>

              <h3
                className="mt-2 text-3xl font-light text-[#1b1c1a]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Customer Reviews
              </h3>
            </div>

            <span className="text-xs uppercase tracking-[0.15em] text-[#9b8a78]">
              {reviewData.totalReviews} Total
            </span>
          </div>

          {reviewData.reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MessageSquareText size={32} className="text-[#C9A96E]" />

              <h4
                className="mt-5 text-3xl font-light text-[#1b1c1a]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                No reviews yet
              </h4>

              <p className="mt-3 max-w-md text-sm leading-6 text-[#7A6E63]">
                Is product ka pehla review likhkar dusre customers ki help karo.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e4e2df]">
              {reviewData.reviews.map((review) => {
                const reviewUserId =
                  typeof review.user === "object"
                    ? review.user?._id
                    : review.user;

                const isOwner =
                  currentUser?._id &&
                  reviewUserId?.toString() === currentUser._id?.toString();

                const isEditing = editingReviewId === review._id;

                return (
                  <article
                    key={review._id}
                    className={`py-8 ${
                      isOwner ? "bg-[#fcfaf7] px-5 md:px-7" : ""
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1b1c1a] text-sm uppercase text-[#C9A96E]">
                          {review.user?.fullname?.charAt(0) || "U"}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="font-medium text-[#1b1c1a]">
                              {review.user?.fullname || "Verified Customer"}
                            </h4>

                            {isOwner && (
                              <span className="bg-[#eee4d5] px-2 py-1 text-[8px] uppercase tracking-[0.18em] text-[#7A6E63]">
                                Your Review
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            {renderStars({
                              value: Number(review.rating || 0),
                              size: 15,
                            })}

                            <span className="text-xs text-[#9b8a78]">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit/Delete only owner */}
                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(review)}
                            className="flex items-center gap-2 border border-[#d7c8b6] px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#5e5145] transition hover:bg-[#1b1c1a] hover:text-white"
                          >
                            <Edit3 size={13} />

                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeReview(review._id)}
                            disabled={deletingReviewId === review._id}
                            className="flex items-center gap-2 border border-red-200 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white disabled:opacity-50"
                          >
                            {deletingReviewId === review._id ? (
                              <LoaderCircle
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={13} />
                            )}

                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit form */}
                    {isEditing ? (
                      <div className="mt-6 border border-[#e4d8c8] bg-white p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                          Edit Rating
                        </p>

                        <div className="mt-3">
                          {renderStars({
                            value: editRating,
                            interactive: true,
                            onChange: setEditRating,
                            size: 25,
                          })}
                        </div>

                        <textarea
                          value={editComment}
                          onChange={(event) =>
                            setEditComment(event.target.value)
                          }
                          maxLength={500}
                          rows={5}
                          className="mt-5 w-full resize-none border border-[#d9cfc2] bg-[#fbf9f6] px-4 py-4 text-sm leading-6 text-[#1b1c1a] outline-none focus:border-[#C9A96E]"
                        />

                        <div className="mt-2 text-right text-xs text-[#9b8a78]">
                          {editComment.length}/500
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 border border-[#d7c8b6] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-[#5e5145] disabled:opacity-60"
                          >
                            <X size={13} />

                            <span>Cancel</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => saveEditedReview(review._id)}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 bg-[#1b1c1a] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C9A96E] hover:text-[#1b1c1a] disabled:opacity-60"
                          >
                            {submitting ? (
                              <LoaderCircle
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={13} />
                            )}

                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-6 max-w-4xl break-words text-sm leading-7 text-[#6f6358]">
                        {review.comment}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
