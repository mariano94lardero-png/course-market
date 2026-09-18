import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/signout";

export async function Navbar() {
  const session = await auth();

  const links = session?.user ? (
    <>
      <Link href="/dashboard" className="block py-2 hover:text-indigo-600 sm:py-0">
        Mis cursos creados
      </Link>
      <Link href="/my-courses" className="block py-2 hover:text-indigo-600 sm:py-0">
        Mis compras
      </Link>
      <form action={signOutAction} className="pt-2 sm:pt-0">
        <button
          type="submit"
          className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-left hover:bg-gray-200 sm:w-auto sm:text-center"
        >
          Salir ({session.user.name})
        </button>
      </form>
    </>
  ) : (
    <>
      <Link href="/login" className="block py-2 hover:text-indigo-600 sm:py-0">
        Ingresar
      </Link>
      <Link
        href="/register"
        className="block w-full rounded-md bg-indigo-600 px-3 py-1.5 text-center text-white hover:bg-indigo-500 sm:w-auto"
      >
        Crear cuenta
      </Link>
    </>
  );

  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          CourseMarket
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 sm:flex">
          <Link href="/" className="hover:text-indigo-600">
            Explorar cursos
          </Link>
          {links}
        </nav>

        <details className="group sm:hidden">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md hover:bg-gray-100">
            <span className="sr-only">Menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-gray-700 group-open:hidden"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="hidden h-6 w-6 text-gray-700 group-open:block"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </summary>
          <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm">
            <Link href="/" className="block py-2 hover:text-indigo-600">
              Explorar cursos
            </Link>
            {links}
          </nav>
        </details>
      </div>
    </header>
  );
}
