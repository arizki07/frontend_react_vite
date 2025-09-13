/* eslint-disable react-refresh/only-export-components */
export enum ModalType {
  create,
  edit,
  detail,
  password,
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/api/user/UserApi";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

interface UserModalProps {
  user?: User | null;
  open: boolean;
  onClose: () => void;
  mode?: ModalType;
  onSubmit?: (
    data: Partial<User> & { password?: string; confirm_password?: string }
  ) => Promise<void>;
}

export function UserModal({
  user,
  open,
  onClose,
  mode = ModalType.create,
  onSubmit,
}: UserModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setRole(user.role);
      setPassword("");
      setConfirmPassword("");
    } else {
      setName("");
      setUsername("");
      setRole("user");
      setPassword("");
      setConfirmPassword("");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!onSubmit) return;

    let payload: Partial<User> & {
      password?: string;
      confirm_password?: string;
    } = {};

    if (mode === ModalType.create) {
      payload = {
        name,
        username,
        role,
        password,
        confirm_password: confirmPassword,
      };
    } else if (mode === ModalType.edit) {
      payload = { name, username, role };
    } else if (mode === ModalType.password) {
      payload = { password, confirm_password: confirmPassword };
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const isDetail = mode === ModalType.detail;
  const isPassword = mode === ModalType.password;
  let title: string = "";

  switch (mode) {
    case ModalType.create:
      title = "Create User";
      break;
    case ModalType.edit:
      title = "Edit User";
      break;
    case ModalType.detail:
      title = "User Detail";
      break;
    case ModalType.password:
      title = "Edit Password";
      break;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isPassword && (
            <>
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDetail}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isDetail}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "user")}
                  className="w-full border p-2 rounded-md"
                  disabled={isDetail}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </>
          )}

          {(mode === ModalType.create || isPassword) && (
            <>
              <div className="flex flex-col relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex flex-col relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {!isDetail && (
            <Button onClick={handleSubmit}>
              {mode === ModalType.create && "Create"}
              {mode === ModalType.edit && "Update"}
              {mode === ModalType.password && "Update Password"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
