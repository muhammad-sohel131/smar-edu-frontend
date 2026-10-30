"use client";

import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/apiClient";
import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaCrown,
  FaHandHoldingUsd,
  FaHeart,
  FaLock,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaSearch,
  FaCamera,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";

const DonationForm = ({
  donationOptions,
  donationAmount,
  customAmount,
  handleAmountSelect,
  handleCustomAmount,
  handleDonation,
  isLoading,
  selectedFundData,
  loading = false,
  onSwitchToTrack
}) => {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState("sslcommerz");

  // Donor identification fields (no registration required)
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorImage, setDonorImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from authenticated user if available
  useEffect(() => {
    if (user) {
      if (user.name && !donorName) setDonorName(user.name);
      if (user.email && !donorEmail) setDonorEmail(user.email);
      if (user.phone && !donorPhone) setDonorPhone(user.phone);
      if (user.picture && !donorImage) setDonorImage(user.picture);
    }
  }, [user]);

  // Payment providers
  const paymentProviders = [
    { id: "sslcommerz", name: "SSLCommerz", icon: FaCreditCard, description: "Secure Payment Gateway" }
  ];

  // Optional profile image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "donor-avatars");

      let uploadRes;
      try {
        uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        // Fallback to /upload/public
        uploadRes = await api.post("/upload/public", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const url = uploadRes?.data?.data?.url;
      if (url) {
        setDonorImage(url);
        toast.success("Profile photo uploaded successfully!");
      } else {
        throw new Error("No URL returned from upload server");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(err?.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      // reset file input value
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setDonorImage("");
    toast.info("Profile photo removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate donor details
    if (!donorName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!donorEmail.trim() || !/\S+@\S+\.\S+/.test(donorEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    const cleanPhone = donorPhone.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      toast.error("Please enter a valid phone number (used to track your donations)");
      return;
    }

    // Validate amount
    if (!donationAmount || donationAmount === "0" || parseFloat(donationAmount) < 1) {
      toast.error("Please select or enter a valid donation amount");
      return;
    }

    try {
      setIsSubmitting(true);
      // Prepare donation data with optional donor profile image
      const donationData = {
        fund: selectedFundData?.id || "educational-scholarships",
        amount: parseFloat(donationAmount),
        provider: selectedProvider,
        currency: "BDT",
        donorInfo: {
          name: donorName.trim(),
          email: donorEmail.trim(),
          phone: cleanPhone,
          image: donorImage || undefined
        }
      };

      console.log("Processing donation with donor info:", donationData);

      const res = await api.post("orders/donation-checkout", donationData);
      const { checkoutUrl } = res?.data?.data || {};

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.success("Donation initiated successfully!");
      }
    } catch (error) {
      console.error("Donation error:", error);
      const errMsg = error?.response?.data?.message || "Error processing donation. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        {/* Amount Selection Skeleton */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>

          {/* Quick Amount Options Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="p-4 rounded-2xl border-2 border-gray-200 bg-gray-50">
                <div className="h-6 bg-gray-300 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Custom Amount Skeleton */}
          <div className="mt-6">
            <div className="h-6 bg-gray-300 rounded w-48 mb-3"></div>
            <div className="h-12 bg-gray-300 rounded-2xl w-full"></div>
          </div>
        </div>

        {/* Impact Examples Skeleton */}
        <div className="mb-8 p-6 bg-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-gray-400 rounded mr-2"></div>
            <div className="h-6 bg-gray-400 rounded w-40"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="h-4 bg-gray-400 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Info Skeleton */}
        <div className="mb-8 p-6 bg-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <div className="h-6 bg-gray-400 rounded w-40"></div>
          </div>
          <div className="h-4 bg-gray-400 rounded w-full"></div>
        </div>

        {/* Donate Button Skeleton */}
        <div className="h-16 bg-gray-300 rounded-2xl w-full mb-8"></div>

        {/* Trust Badges Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-8 bg-gray-300 rounded-full w-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      {/* Amount Selection */}
      <div className="mb-8">
        <label className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaCrown className="w-6 h-6 text-yellow-500 mr-3" />
          Select Donation Amount
        </label>

        {/* Quick Amount Options */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {donationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAmountSelect(option.value)}
              className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${donationAmount === option.value && !customAmount
                  ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-bold shadow-lg"
                  : "border-gray-200 text-gray-700 hover:border-emerald-300 hover:shadow-md"
                }`}
            >
              {option.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              <div className="text-lg font-semibold">{option.label}</div>
              {option.popular && (
                <div className="text-xs text-gray-500 mt-1">Most Chosen</div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mt-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Or enter custom amount (৳)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold">
              ৳
            </span>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmount}
              placeholder="Enter amount (e.g. 500)"
              className="w-full pl-10 pr-4 py-4 border-1 outline-none border-gray-200 rounded-2xl placeholder-gray-400 focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg font-semibold"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Donor Information (No Registration Required) */}
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-blue-50/60 rounded-2xl border border-emerald-200/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label className="text-xl font-bold text-gray-900 flex items-center">
            <FaUser className="w-5 h-5 text-emerald-600 mr-2" />
            Donor Details
          </label>
          <span className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1 rounded-full shadow-sm">
            ✓ No Account / Registration Needed
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-5">
          Please enter your name, email, and phone number. Your <strong className="text-emerald-700">phone number serves as your unique ID</strong> to track all your donation history anytime!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Donor Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Passport Name / NID Name"
                className="w-full pl-10 pr-3 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Donor Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Verified email address"
                className="w-full pl-10 pr-3 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Donor Phone (Unique Tracker) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center justify-between">
              <span>Phone Number <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Unique Tracker</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-sm" />
              <input
                type="tel"
                required
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="e.g. 01712345678 (+880)"
                className="w-full pl-10 pr-3 py-3 text-sm bg-white border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-bold text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Optional Profile Image Upload */}
        <div className="mt-5 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative shrink-0">
              {donorImage ? (
                <div className="relative">
                  <img
                    src={donorImage}
                    alt="Donor Profile"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition"
                    title="Remove profile photo"
                  >
                    <FaTimes className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/90 border-2 border-dashed border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm">
                  {isUploadingImage ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <FaCamera className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <span>Donor Profile Image</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5 max-w-sm">
                {donorImage
                  ? "Your profile photo is attached and will be displayed on donor records."
                  : "Upload a picture if you wish to be displayed in our donor community (PNG, JPG, WEBP up to 5MB)."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <label
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                isUploadingImage
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : donorImage
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-emerald-500"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
              {isUploadingImage ? (
                <>
                  <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : donorImage ? (
                <>
                  <FaCamera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Change Photo</span>
                </>
              ) : (
                <>
                  <FaCamera className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </>
              )}
            </label>

            {donorImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Provider Selection */}
      <div className="mb-8">
        <label className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaCreditCard className="w-5 h-5 text-blue-500 mr-2" />
          Select Payment Method
        </label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {paymentProviders.map((provider) => {
            const ProviderIcon = provider.icon;
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => setSelectedProvider(provider.id)}
                className={`relative p-3 rounded-xl border-2 text-center transition-all duration-200 ${selectedProvider === provider.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
              >
                <ProviderIcon className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                <div className="text-sm font-semibold">{provider.name}</div>
                <div className="text-xs text-gray-500 mt-1">{provider.description}</div>
                {selectedProvider === provider.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <FaCheck className="w-2 h-2 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* Payment Security */}
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
        <div className="flex items-center space-x-3 text-emerald-800 mb-3">
          <FaLock className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-lg">Bank-Level Security</span>
        </div>
        <p className="text-emerald-700 text-sm">
          Your donation is protected with 256-bit SSL encryption. We partner
          with trusted payment processors to ensure your financial information
          remains completely secure.
        </p>
        <div className="mt-3 text-sm text-emerald-600 font-medium">
          Selected Gateway: {paymentProviders.find(p => p.id === selectedProvider)?.name}
        </div>
      </div>

      {/* Donate Button */}
      <button
        type="submit"
        disabled={isSubmitting || !donationAmount || donationAmount === "0"}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="w-6 h-6 animate-spin" />
            <span>Connecting to Payment Gateway...</span>
          </>
        ) : (
          <>
            <FaHandHoldingUsd className="w-6 h-6" />
            <span>Donate ৳{donationAmount || "0"}</span>
          </>
        )}
      </button>

      {/* Track Link Notice */}
      {onSwitchToTrack && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onSwitchToTrack}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center space-x-1"
          >
            <FaSearch className="w-3.5 h-3.5 mr-1" />
            <span>Already donated? Track your donations using your phone number &rarr;</span>
          </button>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-8 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-gray-500 text-sm">
          {/* SSL Secure Badge */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full w-fit shadow-sm">
            <FaLock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
              SSL Secure
            </span>
          </div>

          {/* Tax Deductible Badge */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full w-fit shadow-sm">
            <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
              Tax Deductible
            </span>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full w-fit shadow-sm">
            <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
              Verified
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DonationForm;
