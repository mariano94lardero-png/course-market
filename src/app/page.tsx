import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { lessons: true, purchases: true } },
    },
  });

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Aprendé de instructores reales
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Cursos en texto, creados por su propia gente, listos para comprar y empezar hoy mismo.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Creá y vendé tu propio curso
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Cursos disponibles</h2>

        {courses.length === 0 ? (
          <p className="text-gray-600">Todavía no hay cursos publicados. ¡Sé el primero!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-1 line-clamp-3 flex-1 text-sm text-gray-600">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">por {course.instructor.name}</span>
                  <span className="font-semibold text-gray-900">
                    ${(course.priceCents / 100).toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {course._count.lessons} lecciones · {course._count.purchases} alumnos
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
