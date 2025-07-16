import { Outlet } from "react-router";
import DashboardLayout from "~/components/dashboard/DashboardLayout";

export default function DashboardRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
