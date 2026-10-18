// app/dashboard/page.tsx
"use client"
import AdminDashboard from "@/components/modules/dashboard/admin/AdminDashboard";
import InstructorDashboard from "@/components/modules/dashboard/instructorr/InstructorDashboard";
import StudentDashboard from "@/components/modules/dashboard/student/StudentDashboard";
import { useAuth } from "@/hooks/useAuth";


export default function DashboardHome() {
  const {user} = useAuth();

  if (!user) {
    return null;
  }

  const role = user.role?.toUpperCase();

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "INSTRUCTOR") {
    return <InstructorDashboard />;
  }

  return <StudentDashboard />;
}