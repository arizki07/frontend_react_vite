import { DashboardLayout } from "@/layouts/DashboardLayouts";
import { UserLayout } from "@/layouts/users/UserLayouts";

export default function User() {
  return (
    <DashboardLayout breadcrumbPath={[{ label: "Users", href: "/users" }]}>
      <div className="px-4 lg:px-6">
        <UserLayout />
      </div>
    </DashboardLayout>
  );
}
