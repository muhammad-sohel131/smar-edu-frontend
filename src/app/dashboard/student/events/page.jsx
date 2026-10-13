import MyEventsHistory from "@/components/modules/dashboard/events/MyEventsHistory";

export const metadata = {
  title: "My Events | Student Dashboard",
  description: "View and manage your registered events, passes, and schedule.",
};

export default function StudentEventsPage() {
  return <MyEventsHistory role="student" />;
}
