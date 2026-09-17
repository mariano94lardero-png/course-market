import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/signout";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          CourseMarket
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-indigo-600">
            Explorar cursos
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-600">
                Mis cursos creados
              </Link>
              <Link href="/my-courses" className="hover:text-indigo-600">
                Mis compras
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
                >
                  Salir ({session.user.name})
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600">
                Ingresar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
