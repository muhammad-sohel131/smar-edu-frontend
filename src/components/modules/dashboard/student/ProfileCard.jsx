"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  CalendarDays,
  Phone,
  Mail,
  AtSign,
  BadgeCheck,
  IdCard,
  School,
  MapPin,
  Edit3,
  Award,
  Target,
  Globe,
  Briefcase,
  Heart,
  Star,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    pointsEarned: 0,
    currentStreak: 0,
    rank: "Beginner",
  });

  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data?.data;
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesRes = await api.get("/users/stats/courses");
        const pointsRes = await api.get("/users/stats/points");
        setStats({
          coursesCompleted: coursesRes.data?.count || 0,
          pointsEarned: pointsRes.data?.points || 0,
          currentStreak: pointsRes.data?.streak || 0,
          rank: pointsRes.data?.rank || "Beginner",
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    if (userData) fetchStats();
  }, [userData]);

  const profile = userData
    ? {
        name: userData.name || "",
        userName: userData.email?.split("@")[0] || "",
        phone: userData.phone || "",
        email: userData.email || "",
        organization: userData.organization || "",
        region: userData.region || "",
        intro: userData.intro || "",
        picture: userData.picture || "",
        registrationDate: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
        bio: userData.intro || "",
        gender: userData.gender || "",
        dob: userData.dob
          ? new Date(userData.dob).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      }
    : {};

  const handleSaveProfile = async (formData) => {
    try {
      const updateData = {
        name: formData.name || userData?.name,
        phone: formData.phone,
        organization: formData.organization,
        region: formData.region,
        intro: formData.bio,
        gender: formData.gender,
        dob: formData.dob,
      };
      await api.patch("/users/me", updateData);
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const fullName = profile.name || userData?.name || "Loading...";
  const initials =
    fullName !== "Loading..."
      ? fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm p-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative mx-auto w-14 h-14 mb-4">
              <div className="w-14 h-14 rounded-full border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 animate-pulse text-[var(--color-primary)]" />
              </div>
            </div>
            <p className="text-base font-medium text-gray-500">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/3 via-white to-[var(--color-secondary)]/3 pointer-events-none" />

      {/* Cover Banner */}
      <div className="relative h-28 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent-special)]" />
        {/* decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative px-6 pb-8 md:px-8">
        {/* Avatar */}
        <div className="relative -mt-14 inline-flex">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent-special)] to-[var(--color-secondary)] opacity-50 blur-md" />
            <div className="relative w-24 h-24 rounded-full bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-2xl font-bold">
                {initials || <User className="w-10 h-10" />}
              </div>
            </div>
          </div>
        </div>

        {/* Name & Actions Row */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{fullName}</h2>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-special)] shadow-sm">
                <Award className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            {/* Badges row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ProfileBadge color="primary">
                <AtSign className="mr-1 h-3 w-3" />@{profile.userName}
              </ProfileBadge>
              <ProfileBadge color="secondary">
                <CalendarDays className="mr-1 h-3 w-3" />
                Member since {profile.registrationDate}
              </ProfileBadge>
              <ProfileBadge color="accent">
                <Target className="mr-1 h-3 w-3" />
                {stats.rank}
              </ProfileBadge>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-[var(--color-primary)]/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Edit3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
            Edit Profile
          </button>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Bio Card */}
          <ProfileInfoCard
            title="About Me"
            icon={<Heart className="h-4 w-4 text-[var(--color-primary)]" />}
            accentColor="primary"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {profile.bio || "No bio added yet. Share something about yourself!"}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5" />
              Profile verified
            </div>
          </ProfileInfoCard>

          {/* Info cards column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal Info */}
            <ProfileInfoCard
              title="Personal Information"
              icon={<User className="h-4 w-4 text-[var(--color-primary)]" />}
              accentColor="primary"
            >
              <InfoGrid>
                <InfoItem icon={<IdCard className="h-4 w-4 text-[var(--color-primary)]" />} label="Full Name" value={fullName} highlighted />
                <InfoItem icon={<AtSign className="h-4 w-4 text-[var(--color-primary)]" />} label="Username" value={profile.userName} />
                <InfoItem icon={<BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" />} label="Gender" value={profile.gender || "Not specified"} />
                <InfoItem icon={<CalendarDays className="h-4 w-4 text-[var(--color-primary)]" />} label="Date of Birth" value={profile.dob || "Not specified"} />
              </InfoGrid>
            </ProfileInfoCard>

            {/* Contact Info */}
            <ProfileInfoCard
              title="Contact Details"
              icon={<Mail className="h-4 w-4 text-[var(--color-secondary)]" />}
              accentColor="secondary"
            >
              <InfoGrid>
                <InfoItem icon={<Phone className="h-4 w-4 text-[var(--color-secondary)]" />} label="Phone" value={profile.phone || "Not specified"} highlighted />
                <InfoItem icon={<Mail className="h-4 w-4 text-[var(--color-secondary)]" />} label="Email" value={profile.email} />
                <InfoItem icon={<Globe className="h-4 w-4 text-[var(--color-secondary)]" />} label="Region" value={profile.region || "Not specified"} />
                <InfoItem icon={<CalendarDays className="h-4 w-4 text-[var(--color-secondary)]" />} label="Member Since" value={profile.registrationDate} />
              </InfoGrid>
            </ProfileInfoCard>

            {/* Education */}
            <ProfileInfoCard
              title="Education & Organization"
              icon={<Briefcase className="h-4 w-4 text-[var(--color-accent-special)]" />}
              accentColor="accent"
            >
              <InfoGrid>
                <InfoItem icon={<School className="h-4 w-4 text-[var(--color-accent-special)]" />} label="Organization" value={profile.organization || "Not specified"} highlighted />
                <InfoItem icon={<MapPin className="h-4 w-4 text-[var(--color-accent-special)]" />} label="Location" value={profile.region || "Not specified"} />
                <InfoItem icon={<Users className="h-4 w-4 text-[var(--color-accent-special)]" />} label="Role" value={userData?.role || "Student"} />
                <InfoItem
                  icon={<Star className="h-4 w-4 text-[var(--color-accent-special)]" />}
                  label="Status"
                  value="Active"
                  badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-200"
                />
              </InfoGrid>
            </ProfileInfoCard>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        profile={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </section>
  );
}

/* ——— Subcomponents ——— */

function ProfileBadge({ children, color = "primary" }) {
  const colorMap = {
    primary: "bg-[var(--color-primary)]/8 text-[var(--color-primary)] border border-[var(--color-primary)]/15",
    secondary: "bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] border border-[var(--color-secondary)]/15",
    accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent-special)] border border-[var(--color-accent)]/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colorMap[color]}`}>
      {children}
    </span>
  );
}

function ProfileInfoCard({ title, icon, accentColor = "primary", children }) {
  const borderMap = {
    primary: "border-t-[var(--color-primary)]",
    secondary: "border-t-[var(--color-secondary)]",
    accent: "border-t-[var(--color-accent-special)]",
  };
  return (
    <div className={`rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden border-t-2 ${borderMap[accentColor]}`}>
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-[var(--color-background)]">{icon}</div>
        <h3 className="text-sm font-bold text-[var(--color-text)]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoGrid({ children }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function InfoItem({ icon, label, value, highlighted = false, badgeColor }) {
  return (
    <div className={`rounded-lg p-3 transition-colors ${highlighted ? "bg-[var(--color-background)]" : "hover:bg-[var(--color-background)]"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      {badgeColor ? (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
      )}
    </div>
  );
}