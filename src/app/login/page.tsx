import { Suspense } from "react";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-md flex items-center justify-center">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
