import { AuditLogsLayouts } from "@/layouts/AuditLogsLayouts";
import { DashboardLayout } from "@/layouts/DashboardLayouts";

export default function AuditLogs() {
  return (
    <DashboardLayout
      breadcrumbPath={[{ label: "Audit Logs", href: "/audit/logs" }]}
    >
      <div className="px-4 lg:px-6">
        <AuditLogsLayouts />
      </div>
    </DashboardLayout>
  );
}
