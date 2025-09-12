import { AppSidebar } from "@/components/shared/app-sidebar";
import { BreadcrumbCollapsed } from "@/components/shared/breadcrumb-collapsed";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import React from "react";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumbPath?: { label: string; href?: string }[];
}

export function DashboardLayout({
  children,
  breadcrumbPath,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          breadcrumb={
            breadcrumbPath ? (
              <BreadcrumbCollapsed path={breadcrumbPath} />
            ) : (
              <h1 className="text-base font-medium">Dashboard</h1>
            )
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
