// src/components/layout/BreadcrumbCollapsed.tsx

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";

type BreadcrumbItemProps = {
  label: string;
  href?: string; // href opsional, kalau kosong dianggap sebagai page aktif
};

export function BreadcrumbCollapsed({ path }: { path: BreadcrumbItemProps[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((item, index) => {
          const isLast = index === path.length - 1;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
