import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Ingresar</h1>
      <LoginForm />
      <p className="mt-6 text-sm text-gray-600">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Registrate
        </Link>
      </p>
    </div>
  );
}
