"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Navbar from '@/components/modules/headers/Navbar';
import { useSearchParams } from 'next/navigation';
import {
  FaCheck,
  FaCrown,
  FaGem,
  FaGraduationCap,
  FaHandHoldingUsd,
  FaHeart,
  FaLock,
  FaRocket,
  FaStar,
  FaSearch,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import DonationHeaderSection from '@/components/modules/donation/DonationHeaderSection';
import FundSelectionSidebar from '@/components/modules/donation/FundSelectionSidebar';
import SelectedFundHeader from '@/components/modules/donation/SelectedFundHeader';
import DonationForm from '@/components/modules/donation/DonationForm';
import DonationInfo from '@/components/modules/donation/DonationInfo';
import DonationTracker from '@/components/modules/donation/DonationTracker';
import { toast } from 'react-toastify';

const DonationContent = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const phoneParam = searchParams.get('phone') || '';
  const successParam = searchParams.get('success') === 'true';
  const failedParam = searchParams.get('failed') === 'true';
  const canceledParam = searchParams.get('canceled') === 'true';
  const amountParam = searchParams.get('amount') || '';
  const nameParam = searchParams.get('name') || '';

  const [activeTab, setActiveTab] = useState(
    tabParam === 'track' || phoneParam ? 'track' : 'donate'
  );
  const [showSuccessBanner, setShowSuccessBanner] = useState(successParam);
  const [selectedFund, setSelectedFund] = useState('educational-scholarships');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  // Sync tab and trigger toast if redirected with success
  useEffect(() => {
    if (tabParam === 'track' || phoneParam) {
      setActiveTab('track');
    }
    if (successParam) {
      setShowSuccessBanner(true);
      toast.success("Donation completed successfully! Thank you for your support ❤️");
    } else if (failedParam) {
      toast.error("Donation payment was not completed. Please try again.");
    } else if (canceledParam) {
      toast.info("Donation payment was canceled.");
    }
  }, [tabParam, phoneParam, successParam, failedParam, canceledParam]);

  const donationOptions = [
    { value: '500', label: '৳500', popular: false },
    { value: '1000', label: '৳1000', popular: true },
    { value: '2500', label: '৳2500', popular: false },
    { value: '5000', label: '৳5000', popular: false },
    { value: '10000', label: '৳10000', popular: false },
  ];

  const funds = [
    {
      id: 'educational-scholarships',
      title: 'Educational Scholarships',
      description: 'Provide scholarships and financial aid to deserving students pursuing their tech and educational journey.',
      icon: FaGraduationCap,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      badge: 'Most Popular',
      examples: [
        'Tuition fee assistance',
        'Research & project grants',
        'Internship opportunities',
        'Learning materials'
      ],
      impact: 'Supports 50+ students annually'
    },
    {
      id: 'institutional-development',
      title: 'Institutional Development',
      description: 'Support the development of modern learning facilities, platforms, and tech-focused ecosystems.',
      icon: FaRocket,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      badge: 'Infrastructure',
      examples: [
        'E-learning platform upgrades',
        'New tech-focused courses',
        'Digital libraries',
        'System integrations'
      ],
      impact: 'Benefits all SMARTEDU users'
    },
    {
      id: 'funding-programs',
      title: 'Special Funding Programs',
      description: 'Fund innovative educational programs, tech workshops, and student-led initiatives.',
      icon: FaHandHoldingUsd,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600',
      badge: 'Innovation',
      examples: [
        'Tech workshops and seminars',
        'Hackathons and competitions',
        'Research and development',
        'Startup incubation'
      ],
      impact: 'Empowers tech enthusiasts'
    }
  ];

  const selectedFundData = funds.find(fund => fund.id === selectedFund);

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setDonationAmount(value);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <Head>
          <title>Support SMARTEDU HUB - Make a Donation</title>
          <meta name="description" content="Contribute to educational causes such as scholarships, funding programs, and institutional development." />
        </Head>

        {/* Header Section */}
        <DonationHeaderSection />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12 -mt-10">
          {/* Success Banner when returning from payment */}
          {showSuccessBanner && (
            <div className="mb-10 max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-2xl relative overflow-hidden border border-emerald-400/30 animate-fadeIn">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                    🎉
                  </div>
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-800/60 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2 uppercase tracking-wider">
                      <FaCheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Payment Confirmed</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Thank You{nameParam ? `, ${decodeURIComponent(nameParam)}` : ""}!
                    </h2>
                    <p className="text-emerald-100 text-sm sm:text-base mt-1.5 leading-relaxed">
                      Your donation{amountParam ? ` of ৳${amountParam}` : ""} has been received successfully! Your contribution history and live records are shown below.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuccessBanner(false)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition self-end sm:self-center flex-shrink-0"
                  title="Close Banner"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* View Mode Toggle: Donate vs Track */}
          <div className="flex items-center justify-center mb-10">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-200/80 inline-flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('donate')}
                className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center space-x-2.5 transition-all duration-300 ${
                  activeTab === 'donate'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaHandHoldingUsd className="w-5 h-5" />
                <span>Make a Donation</span>
              </button>

              <button
                onClick={() => setActiveTab('track')}
                className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center space-x-2.5 transition-all duration-300 ${
                  activeTab === 'track'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaSearch className="w-4 h-4" />
                <span>Track by Phone</span>
              </button>
            </div>
          </div>

          {activeTab === 'donate' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Fund Selection Sidebar */}
              <FundSelectionSidebar
                selectedFund={selectedFund}
                setSelectedFund={setSelectedFund}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
                funds={funds}
              />

              {/* Donation Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Selected Fund Header */}
                  <SelectedFundHeader
                    selectedFundData={selectedFundData}
                  />

                  {/* Donation Form */}
                  <DonationForm
                    donationOptions={donationOptions}
                    donationAmount={donationAmount}
                    customAmount={customAmount}
                    handleAmountSelect={handleAmountSelect}
                    handleCustomAmount={handleCustomAmount}
                    handleDonation={handleDonation}
                    isLoading={isLoading}
                    selectedFundData={selectedFundData}
                    onSwitchToTrack={() => setActiveTab('track')}
                  />
                </div>

                {/* Additional Info */}
                <DonationInfo />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <DonationTracker
                initialPhone={phoneParam}
                onDonateClick={() => setActiveTab('donate')}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Donation = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DonationContent />
    </Suspense>
  );
};

export default Donation;