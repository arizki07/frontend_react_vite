import { DashboardLayout } from "@/layouts/DashboardLayouts";
import { ProfileLayouts } from "@/layouts/users/ProfileLayouts";

export default function Profile() {
  return (
    <DashboardLayout breadcrumbPath={[{ label: "Profile", href: "/profile" }]}>
      <div className="px-4 lg:px-6">
        <ProfileLayouts />
      </div>
    </DashboardLayout>
  );
}
