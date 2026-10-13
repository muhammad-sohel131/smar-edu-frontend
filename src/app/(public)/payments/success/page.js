"use client";

import Link from "next/link";
import { CheckCircle, CreditCard, CalendarDays, Package, Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useOrderBySession } from "@/hooks/useOrder";
import { format } from "date-fns";


export default function Page() {
    const searchParam = useSearchParams()
    const sessionId = searchParam.get("session_id")

    const {data, isLoading} = useOrderBySession(sessionId)

    if(isLoading){
        return <h2>Loading...</h2>
    }

    if (!data || (Array.isArray(data) && data.length === 0) || !data.createdAt) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center brandBg px-6 py-16">
                <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
                    <h1 className="text-3xl font-semibold mb-2 text-red-500">
                        Order Not Found 🔍
                    </h1>
                    <p className="text-gray-600 mb-8">
                        We could not find the details of your payment. Please check your dashboard or contact support if you believe this is an error.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex-1 bg-[var(--color-primary)] text-white font-medium py-3 px-6 rounded-full hover:opacity-90 transition"
                        >
                            Go to Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-full hover:bg-gray-100 transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Determine details based on itemType
    let title = "Payment Successful 🎉";
    let subtitle = "Thank you for your purchase! Your order has been confirmed and payment was successful.";
    let summaryTitle = "Order Summary";
    let totalLabel = "Total";
    let buttonText = "View Order History";
    let targetHref = "/dashboard";
    let footerText = "Thank you for your purchase!";
    let Icon = CheckCircle;
    let iconColor = "text-green-500";

    if (data.itemType === "Donation") {
        const phone = data.donorPhone || data.billingInfo?.phone || "";
        title = "Donation Successful ❤️";
        subtitle = "Thank you for your generosity! Your donation has been received successfully.";
        summaryTitle = "Donation Summary";
        totalLabel = "Donated Amount";
        buttonText = "Track Donation History 🔍";
        targetHref = `/donation?tab=track&phone=${encodeURIComponent(phone)}&success=true`;
        footerText = "Thank you for your support!";
        Icon = Heart;
        iconColor = "text-red-500 animate-pulse";
    } else if (data.itemType === "course") {
        title = "Course Enrolled Successfully 🎓";
        subtitle = "Thank you! Your course registration is confirmed and payment was successful.";
        summaryTitle = "Enrollment Summary";
        totalLabel = "Total Amount Paid";
        buttonText = "Start Learning";
        targetHref = "/dashboard";
        footerText = "Happy learning!";
        Icon = CheckCircle;
    } else if (data.itemType === "event") {
        title = "Event Registered Successfully 🎫";
        subtitle = "Thank you! Your event ticket has been confirmed and payment was successful.";
        summaryTitle = "Registration Summary";
        totalLabel = "Total Price";
        buttonText = "View Events";
        targetHref = "/events";
        footerText = "See you at the event!";
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center brandBg px-6 py-16">
            {/* ✅ Card container */}
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
                {/* Success Icon */}
                <Icon className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />

                {/* Title */}
                <h1 className="text-3xl font-semibold mb-2 brandColor">
                    {title}
                </h1>
                <p className="text-gray-600 mb-8">
                    {subtitle}
                </p>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">{summaryTitle}</h2>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarDays className="w-4 h-4" /> {format(new Date(data.createdAt), "MMMM d, yyyy")}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="flex items-center gap-1 text-gray-800 font-medium">
                            <CreditCard className="w-4 h-4" /> {data.provider}
                        </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
                        <span className="font-semibold text-gray-800">{totalLabel}</span>
                        <span className="font-semibold text-[var(--color-primary)]">{data.price + " " + data.currency}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link
                        href={targetHref}
                        className="flex-1 bg-[var(--color-primary)] text-white font-medium py-3 rounded-full hover:opacity-90 transition text-center"
                    >
                        {buttonText}
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-full hover:bg-gray-100 transition text-center"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-1">
                    {data.itemType === "Donation" ? <Heart className="w-4 h-4 text-red-500" /> : <Package className="w-4 h-4" />}
                    {footerText}
                </div>
            </div>
        </div>
    );
}
