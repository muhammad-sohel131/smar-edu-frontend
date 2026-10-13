import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import PageBanner from "@/components/modules/common/PageBanner";

const DonationHeaderSection = ({ totalDonations, donorsCount }) => {
  return (
    <PageBanner
      badgeIcon={FaHeart}
      badgeSubIcon={FaStar}
      title="Support SMARTEDU HUB"
      description="Your generosity fuels our integrated educational ecosystem. Empower tech enthusiasts, support student scholarships, and drive education forward."
    />
  );
};

export default DonationHeaderSection;
