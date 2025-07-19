import { Outlet } from "react-router";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { AuthGuard } from "~/guards/AuthGuard";

export default function DashboardRoute() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AuthGuard>
  );
}
