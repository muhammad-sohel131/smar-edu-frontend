"use client";

import React from "react";
import { FaTrophy, FaCrown } from "react-icons/fa";
import PageBanner from "@/components/modules/common/PageBanner";

const LeaderboardHeroSection = () => {
  return (
    <PageBanner
      badgeIcon={FaTrophy}
      badgeSubIcon={FaCrown}
      title="SmartEdu Hub Rankings"
      description="Compete with global changemakers. Track your impact. Lead the sustainable learning revolution."
    />
  );
};

export default LeaderboardHeroSection;