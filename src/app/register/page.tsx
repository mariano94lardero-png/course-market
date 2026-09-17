import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Crear cuenta</h1>
      <p className="mb-6 text-sm text-gray-600">
        Con tu cuenta podés crear y vender tus propios cursos, o comprar los de otros.
      </p>
      <RegisterForm />
      <p className="mt-6 text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
