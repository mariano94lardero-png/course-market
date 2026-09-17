import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const purchases = await prisma.purchase.findMany({
    where: { studentId: session.user.id, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Mis compras</h1>

      {purchases.length === 0 ? (
        <p className="text-gray-600">
          Todavía no compraste ningún curso.{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Explorá el catálogo
          </Link>
          .
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {purchases.map(({ course }) => (
            <li key={course.id} className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900">{course.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                por {course.instructor.name} · {course._count.lessons} lecciones
              </p>
              <Link
                href={`/learn/${course.slug}`}
                className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Continuar curso
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
