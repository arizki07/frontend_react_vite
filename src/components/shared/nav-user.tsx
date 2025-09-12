import {
  IconCreditCard,
  IconDotsVertical,
  IconNotification,
  IconUserCircle,
  IconLogout,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Moon, Sun, Monitor } from "lucide-react";

import { useTheme, type Theme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AuthApi } from "@/api/auth/AuthApi";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string }>({
    name: "",
    avatar: "",
  });
  const [loadingLogout, setLoadingLogout] = useState(false);

  const tabs: { value: Theme; icon: LucideIcon; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  // Ambil data user saat component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthApi.me();
        setUser({ name: res.data.name, avatar: res.data.avatar });
      } catch (err: any) {
        toast.error("Gagal mengambil data user");
      }
    };
    fetchUser();
  }, []);

  const handleOpenLogoutConfirm = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    setLoadingLogout(true);
    try {
      await AuthApi.logout();
      window.location.href = "/"; // arahkan ke login setelah logout
    } catch (err: any) {
      toast.error(err.message || "Logout gagal");
    } finally {
      setLoadingLogout(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <IconNotification />0 Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <div className="flex w-full flex-col">
                <div className="flex gap-1 w-full hover:bg-white dark:hover:bg-gray-900">
                  {tabs.map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        "flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                        theme === value
                          ? "bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white"
                          : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={handleOpenLogoutConfirm}
              disabled={loadingLogout}
            >
              <IconLogout />
              {loadingLogout ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun ini? Anda perlu login
              kembali untuk mengakses dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingLogout}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={loadingLogout}
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenu>
  );
}
