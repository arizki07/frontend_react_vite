import { useEffect, useState } from "react";
import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { AuthApi } from "@/api/auth/AuthApi";
import { Code } from "lucide-react";

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[];
}) {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await AuthApi.me();
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return null; // Bisa diganti skeleton sidebar kalau mau

  // Filter menu berdasarkan role
  const filteredItems =
    role === "admin"
      ? items
      : items.filter((item) => ["Dashboard", "Profile"].includes(item.title));

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 active:text-gray-900 min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>React JS + Vite</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Code />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`flex items-center gap-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary-foreground"
                  } rounded-md transition-colors duration-200`}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 w-full"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
