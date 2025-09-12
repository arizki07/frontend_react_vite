// layouts/users/ProfileLayouts.tsx
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Eye, User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthApi } from "@/api/auth/AuthApi";
import { UserApi } from "@/api/user/UserApi";
import { toast } from "sonner";

export function ProfileLayouts() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    id: number;
    name: string;
    username: string;
    role: "admin" | "user";
    createdBy: string;
    updatedBy: string;
    createdAt: string;
  }>({
    id: 0,
    name: "",
    username: "",
    role: "user",
    createdBy: "",
    updatedBy: "",
    createdAt: "",
  });

  // Fetch profile user yang sedang login
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await AuthApi.me();
        const user = res.data;
        setProfile({
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role as "admin" | "user",
          createdBy:
            user.created_by !== null ? user.created_by.toString() : "-",
          updatedBy:
            user.updated_by !== null ? user.updated_by.toString() : "-",
          createdAt: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "-",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Gagal mengambil data profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Skeleton component
  const Skeleton = ({ className }: { className?: string }) => (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );

  // Save profile update
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await UserApi.updateUser(profile.id, {
        name: profile.name,
        username: profile.username,
        role: profile.role,
      });
      toast.success("Profile berhasil diperbarui!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Gagal memperbarui profile!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-lg font-semibold m-1 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
          Data Profile
        </h2>
      </div>

      {/* Card */}
      <div className="border rounded-2xl shadow-sm overflow-hidden">
        {/* Background cover + Avatar */}
        <div
          className="relative h-40 w-full bg-cover bg-center"
          style={{ backgroundImage: loading ? "" : `url('/bg.jpeg')` }}
        >
          {loading && <Skeleton className="absolute inset-0 w-full h-full" />}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            {loading ? (
              <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
            ) : (
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Name & Role */}
        <div className="mt-16 text-center mb-6">
          {loading ? (
            <>
              <Skeleton className="h-6 w-32 mx-auto rounded" />
              <Skeleton className="h-4 w-20 mx-auto mt-2 rounded" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.role}</p>
            </>
          )}
        </div>

        {/* Form: Grid 2 kolom */}
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Name", "Username", "Role"].map((label) => (
            <div key={label} className="flex flex-col gap-1">
              {loading ? (
                <Skeleton className="h-4 w-20 rounded mb-1" />
              ) : (
                <Label>{label}</Label>
              )}
              {loading ? (
                <Skeleton className="h-10 w-full rounded" />
              ) : (
                <Input
                  value={profile[label.toLowerCase() as keyof typeof profile]}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      [label.toLowerCase()]: e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          {loading ? (
            <>
              <Skeleton className="h-7 w-20 rounded" />
              <Skeleton className="h-7 w-20 rounded" />
            </>
          ) : (
            <>
              {/* Detail Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-purple-200 border-purple-900 text-purple-900 hover:bg-purple-100 dark:bg-purple-500 dark:border-purple-900 dark:text-white dark:hover:bg-purple-800 h-7 px-3 shadow shadow-purple-300 hover:shadow-purple-400 flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Detail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Profile Detail</DialogTitle>
                    <DialogDescription>
                      Informasi lengkap user {profile.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {Object.entries(profile).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <Label className="capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </Label>
                        <Input value={value as string} readOnly />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-green-200 border-green-900 text-green-900 hover:bg-green-100 dark:bg-green-500 dark:border-green-900 dark:text-white dark:hover:bg-green-800 h-7 px-3 shadow shadow-green-300 hover:shadow-green-400 flex items-center gap-1">
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Ubah informasi user {profile.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {["name", "username", "role"].map((key) => (
                      <div key={key} className="flex flex-col gap-1">
                        <Label htmlFor={`edit-${key}`} className="capitalize">
                          {key}
                        </Label>
                        <Input
                          id={`edit-${key}`}
                          value={profile[key as keyof typeof profile]}
                          onChange={(e) =>
                            setProfile({ ...profile, [key]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => console.log("Cancel edit")}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
