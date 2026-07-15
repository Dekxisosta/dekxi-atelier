import AdminDashboardClient from "@/components/AdminDashboardClient";

// Auth is already enforced by middleware.ts before this page ever renders,
// so there's no client-side redirect flash here.
export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
