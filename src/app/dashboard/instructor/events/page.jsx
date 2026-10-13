import MyEventsHistory from "@/components/modules/dashboard/events/MyEventsHistory";

export const metadata = {
  title: "My Events | Instructor Dashboard",
  description: "View and manage your registered events, passes, and schedule as an instructor.",
};

export default function InstructorEventsPage() {
  return <MyEventsHistory role="instructor" />;
}
