"use client";

import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/modules/headers/Navbar'
import React from 'react'
import { FaCheck, FaCrown, FaGem, FaGraduationCap, FaHandHoldingUsd, FaHeart, FaLock, FaRocket, FaStar } from 'react-icons/fa';
import DonationHeaderSection from '@/components/modules/donation/DonationHeaderSection';
import FundSelectionSidebar from '@/components/modules/donation/FundSelectionSidebar';
import SelectedFundHeader from '@/components/modules/donation/SelectedFundHeader';
import DonationForm from '@/components/modules/donation/DonationForm';
import DonationInfo from '@/components/modules/donation/DonationInfo';
import DonationSkeleton from '@/components/modules/donation/DonationSkeleton';

const Donation = () => {
  const [selectedFund, setSelectedFund] = useState('educational-scholarships');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

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
        'Tech gadget grants',
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

  // Simulate page loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    if (!donationAmount || donationAmount === '0') {
      alert('Please select or enter a donation amount');
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        fund: selectedFund,
        amount: donationAmount,
        customAmount: customAmount
      };

      console.log('Processing donation:', paymentData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Redirecting to payment gateway with amount: ৳${donationAmount}`);
      
    } catch (error) {
      console.error('Donation error:', error);
      alert('Error processing donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  if (pageLoading) {
    return <DonationSkeleton />;
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <Head>
          <title>Support SMARTEDU HUB - Make a Donation</title>
          <meta name="description" content="Contribute to educational causes such as scholarships, funding programs, and institutional development." />
        </Head>

        {/* Header Section */}
        <DonationHeaderSection />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-16 -mt-10">
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
                />
              </div>

              {/* Additional Info */}
              <DonationInfo/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Donation