import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/layouts/DashboardLayouts";

export default function DashboardPage() {
  return (
    <DashboardLayout
      breadcrumbPath={[{ label: "Dashboard", href: "/dashboard" }]}
    >
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[125px] w-full rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[80px] w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
