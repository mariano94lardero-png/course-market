import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { togglePublishAction, deleteCourseAction } from "@/lib/actions/courses";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lessons: true, purchases: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis cursos creados</h1>
        <Link
          href="/dashboard/courses/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Nuevo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-600">
          Todavía no creaste ningún curso.{" "}
          <Link href="/dashboard/courses/new" className="text-indigo-600 hover:underline">
            Creá el primero
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{course.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {course._count.lessons} lecciones · {course._count.purchases} ventas · $
                  {(course.priceCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/courses/${course.id}/edit`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Editar
                </Link>
                <form action={togglePublishAction.bind(null, course.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {course.published ? "Despublicar" : "Publicar"}
                  </button>
                </form>
                <form action={deleteCourseAction.bind(null, course.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
