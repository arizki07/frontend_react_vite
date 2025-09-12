import { LoginForm } from "@/components/auth/login-form";
import { Code } from "lucide-react"; // <- import icon

export default function LoginPage() {
  return (
    <div className="bg-linear-to-r from-cyan-600 to-blue-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-mediu text-white"
        >
          <div className="bg-primary text-primary-foreground dark:text-primary flex h-6 w-6 items-center justify-center rounded-md text-shadow-amber-400">
            <Code className="h-4 w-4" />
          </div>
          My Apps
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
