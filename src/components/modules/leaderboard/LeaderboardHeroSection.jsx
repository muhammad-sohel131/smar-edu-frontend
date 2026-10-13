"use client";

import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaCrown,
  FaStar,
  FaUniversity,
  FaMapMarkerAlt,
  FaAward,
  FaUsers,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import PageBanner from "@/components/modules/common/PageBanner";

const LeaderboardHeroSection = () => {
  const [stats, setStats] = useState({
    activePlayers: "1,250+",
    schools: "45",
    regions: "5",
    pointsEarned: "2.5M+"
  });

  // Fetch global leaderboard stats
  const { data: leaderboardData } = useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => {
      const response = await api.get('/gamification/leaderboard?scope=global&limit=1000');
      return response.data?.data || [];
    }
  });

  // Fetch schools leaderboard stats
  const { data: schoolsData } = useQuery({
    queryKey: ['schoolsStats'],
    queryFn: async () => {
      const response = await api.get('/gamification/leaderboard/schools?limit=100');
      return response.data?.data || [];
    }
  });

  // Calculate stats from API data
  useEffect(() => {
    if (leaderboardData && schoolsData) {
      const uniqueRegions = new Set();
      let totalPoints = 0;
      
      // Process leaderboard data
      leaderboardData.forEach((user) => {
        if (user.city) {
          uniqueRegions.add(user.city);
        }
        totalPoints += user.totalPoints || 0;
      });

      // Calculate unique schools with data
      const schoolsWithData = schoolsData.filter((school) => 
        school.schoolName && school.totalPoints > 0
      );

      setStats({
        activePlayers: leaderboardData.length.toString(),
        schools: schoolsWithData.length.toString(),
        regions: uniqueRegions.size.toString(),
        pointsEarned: formatPoints(totalPoints)
      });
    }
  }, [leaderboardData, schoolsData]);

  // Helper function to format points
  const formatPoints = (points) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M+`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K+`;
    }
    return points.toString();
  };

  const statItems = [
    { 
      value: stats.activePlayers, 
      label: "Active Players", 
      icon: FaUsers,
      color: "text-[#FBBF24]"
    },
    { 
      value: stats.schools, 
      label: "Schools", 
      icon: FaUniversity,
      color: "text-[#FBBF24]"
    },
    { 
      value: stats.regions, 
      label: "Regions", 
      icon: FaMapMarkerAlt,
      color: "text-[#FBBF24]"
    },
    // { 
    //   value: stats.pointsEarned, 
    //   label: "Points Earned", 
    //   icon: FaAward,
    //   color: "text-[#FBBF24]"
    // },
  ];

  return (
    <>
      <PageBanner
        badgeIcon={FaTrophy}
        badgeSubIcon={FaCrown}
        title="SmartEdu Hub Rankings"
        description="Compete with global changemakers. Track your impact. Lead the sustainable learning revolution."
      />

      {/* Dynamic Stats Grid - Floating cleanly below the banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
          {statItems.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-3 sm:p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-[var(--shadow-medium)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-2 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-gray-800">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LeaderboardHeroSection;