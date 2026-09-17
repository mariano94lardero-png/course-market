import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/course-form";
import { LessonForm } from "@/components/lesson-form";
import {
  updateCourseAction,
  addLessonAction,
  updateLessonAction,
  deleteLessonAction,
  moveLessonAction,
  togglePublishAction,
} from "@/lib/actions/courses";

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { courseId } = await params;
  const { error } = await searchParams;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course || course.instructorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar curso</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
          ← Volver a mis cursos
        </Link>
      </div>

      {error === "needs-lessons" && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Agregá al menos una lección antes de publicar el curso.
        </p>
      )}

      <section className="mb-10 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              course.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {course.published ? "Publicado" : "Borrador"}
          </span>
          <form action={togglePublishAction.bind(null, courseId)}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {course.published ? "Despublicar" : "Publicar curso"}
            </button>
          </form>
        </div>
        <CourseForm
          action={updateCourseAction.bind(null, courseId)}
          initialTitle={course.title}
          initialDescription={course.description}
          initialPrice={(course.priceCents / 100).toFixed(2)}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Lecciones ({course.lessons.length})
        </h2>

        <ul className="mb-8 flex flex-col gap-3">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <details>
                <summary className="flex cursor-pointer items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {i + 1}. {lesson.title}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <form action={moveLessonAction.bind(null, courseId, lesson.id, "up")}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        className="rounded border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveLessonAction.bind(null, courseId, lesson.id, "down")}>
                      <button
                        type="submit"
                        disabled={i === course.lessons.length - 1}
                        className="rounded border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </form>
                    <form action={deleteLessonAction.bind(null, courseId, lesson.id)}>
                      <button
                        type="submit"
                        className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </form>
                  </span>
                </summary>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <LessonForm
                    action={updateLessonAction.bind(null, courseId, lesson.id)}
                    initialTitle={lesson.title}
                    initialContent={lesson.content}
                    submitLabel="Guardar lección"
                  />
                </div>
              </details>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4">
          <h3 className="mb-3 font-medium text-gray-900">Agregar lección</h3>
          <LessonForm action={addLessonAction.bind(null, courseId)} />
        </div>
      </section>
    </div>
  );
}
