"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CreditCard,
  Landmark,
  Wallet,
  DollarSign,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Icon,
} from "lucide-react";
import { useSlugCourses } from "@/hooks/useCourse";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/apiClient";
import { FaFreeCodeCamp } from "react-icons/fa";
import { toast } from "react-toastify";


export default function CheckoutPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
  })
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const { data: course, isLoading } = useSlugCourses(params.get('slug'))

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  const onChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value })
  }

  const getConvertedPrice = (usd) => `৳${Number(usd || 0).toFixed(2)}`;


  const baseCoursePrice = Number(course?.originalPrice ?? course?.price ?? 0);
  const effectiveDiscountPercentage = appliedCoupon
    ? appliedCoupon.discountPercentage
    : (course?.discountPercentage ?? 0);

  const effectiveDiscountAmount = appliedCoupon
    ? Math.round((baseCoursePrice * appliedCoupon.discountPercentage) / 100)
    : (course?.discountAmount ?? 0);

  const finalPayable = Math.max(0, baseCoursePrice - effectiveDiscountAmount);
  const total = finalPayable;

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      setValidatingCoupon(true);
      const res = await api.post("/coupons/validate", {
        code: couponCodeInput.trim().toUpperCase(),
        courseId: course._id
      });
      if (res?.data?.data?.valid) {
        setAppliedCoupon(res.data.data.coupon);
        toast.success(
          `Scholarship coupon "${res.data.data.coupon.code}" (${res.data.data.coupon.discountPercentage}%) applied!`
        );
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      toast.error(
        err?.response?.data?.message || "Invalid coupon or already used"
      );
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    toast.info("Coupon removed");
  };


  const paymentOptions = [
    { id: "sslcommerz", label: "SSLCommerz", icon: ShieldCheck },
  ];

  const card =
    "bg-white shadow-sm rounded-2xl border border-gray-100 backdrop-blur-sm";
  const inputBase =
    "w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 transition";

  const handleSubmit = async () => {
    try{
      const data = {
      provider: paymentMethod,
      courseId: course._id,
      itemType: 'course',
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      billingInfo
    }

    const res = await api.post('orders/checkout', data)
    const { checkoutUrl } = res?.data?.data

    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }

    router.push('/dashboard/student/courses')
    } catch(err) {
      console.error("Checkout submission error:", err);
      toast.error(err?.response?.data?.message || "Failed to initiate payment. Please try again.");
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header bar */}
      <div className="brandBg">
        <div className="container text-gray-600 mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium tracking-wide">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure Checkout — 256-bit SSL Encryption</span>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-4 lg:px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT */}
            <div className="lg:col-span-8 space-y-8">
              {/* Billing */}
              <section className={`${card} p-8`}>
                <h2 className="text-lg font-semibold brandColor mb-5 text-gray-800">
                  Billing Information
                </h2>

                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input onChange={onChange} value={billingInfo.name} name="name" placeholder="Name *" className={inputBase} />
                    <input onChange={onChange} placeholder="Phone (optional)" value={billingInfo.phone} name="phone" className={inputBase} />
                  </div>


                  <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    Save this information for next time
                  </label>
                </form>
              </section>

              {/* Payment */}
              <section className={`${card} p-8`}>
                <h2 className="text-lg font-semibold brandColor mb-6 text-gray-800">
                  Payment Method
                </h2>

                {total === 0 ? '' : <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {paymentOptions.map(({ id, label, icon: Icon }) => {
                      const active = paymentMethod === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          type="button"
                          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border text-sm font-medium transition-all duration-150 ${active
                            ? "bg-[var(--color-primary,#0ea5e9)] text-white border-[var(--color-primary,#0ea5e9)] shadow-md scale-105"
                            : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-white hover:shadow-sm"
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    {paymentMethod === "sslcommerz" && (
                      <Notice title="SSLCommerz" message="You will be redirected to the secure SSLCommerz gateway to complete your payment." />
                    )}
                  </div>
                </>}


                <button
                  className="mt-8 w-full py-3.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--color-primary,#0ea5e9)] to-[var(--color-primary-hover,#0284c7)] hover:opacity-95 transition-all shadow"
                  type="button"
                  onClick={handleSubmit}
                >
                  {total ? `Pay ${getConvertedPrice(total)}`: 'Free Enroll'}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="h-4 w-4" /> Encrypted & Secure Payment
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-4">
              <div className={`${card} p-8 lg:sticky lg:top-10`}>
                <h2 className="text-lg font-semibold brandColor mb-6 text-gray-800">
                  Order Summary
                </h2>

                <ul className="space-y-5">
                  <OrderItem
                    title={course.title}
                    price={getConvertedPrice(course.price)}
                    img={course.thumbnail}
                  />
                </ul>

                <div className="my-6 border-t border-gray-200" />

                <div className="text-sm text-gray-700 space-y-2.5">
                  <Row label="Original Course Price" value={getConvertedPrice(baseCoursePrice)} />
                  {effectiveDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        🎓 Scholarship {appliedCoupon ? `Coupon (${appliedCoupon.code})` : "Subsidy"} ({effectiveDiscountPercentage}%)
                      </span>
                      <span>-{getConvertedPrice(effectiveDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 my-2" />
                  <Row label="Total Payable" value={getConvertedPrice(total)} highlight />
                </div>

                {/* Scholarship Coupon Input */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Have a Scholarship Coupon? (স্কলারশিপ কুপন)
                  </label>
                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Coupon "{appliedCoupon.code}" Applied</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          {appliedCoupon.discountPercentage}% Scholarship Discount
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. SCHOLAR50"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold tracking-wider placeholder:font-normal placeholder:tracking-normal focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCodeInput.trim()}
                        className="px-3.5 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {validatingCoupon ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {effectiveDiscountAmount > 0 && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 rounded-lg flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p>৳{effectiveDiscountAmount.toLocaleString()} is subsidized by our Community Donation Scholarship Fund.</p>
                  </div>
                )}

                <div className="mt-4 bg-gray-50 border border-gray-100 p-3 text-xs text-gray-700 rounded-lg flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-[var(--color-primary,#0ea5e9)] mt-0.5 shrink-0" />
                  <p>7-day, 95% money-back guarantee. No hidden charges.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------- Components -------- */

function Row({ label, value, highlight = false }) {
  return (
    <p
      className={`flex justify-between items-center ${highlight
        ? "font-semibold text-[var(--color-secondary,#0f172a)] text-base"
        : "text-sm"
        }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}

function OrderItem({ title, price, img }) {
  return (
    <li className="flex items-center gap-4">
      <Image
        src={img}
        alt={title}
        width={60}
        height={60}
        className="rounded-md object-cover shadow-sm"
      />
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-[var(--color-primary,#0ea5e9)] font-semibold">{price}</p>
      </div>
    </li>
  );
}

function Notice({ title, message }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/70 text-gray-600 text-sm leading-relaxed">
      <strong>{title}</strong> — {message}
    </div>
  );
}
