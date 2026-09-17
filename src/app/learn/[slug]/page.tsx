import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) {
    notFound();
  }

  const isOwner = course.instructorId === session.user.id;

  if (!isOwner) {
    const purchase = await prisma.purchase.findUnique({
      where: { studentId_courseId: { studentId: session.user.id, courseId: course.id } },
    });
    if (purchase?.status !== "PAID") {
      redirect(`/courses/${course.slug}`);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 py-10">
      <aside className="w-64 shrink-0">
        <Link href={`/courses/${course.slug}`} className="text-sm text-indigo-600 hover:underline">
          ← {course.title}
        </Link>
        <h2 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Lecciones
        </h2>
        <ul className="flex flex-col gap-1 text-sm">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.id}>
              <a
                href={`#lesson-${lesson.id}`}
                className="block rounded-md px-2 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                {i + 1}. {lesson.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <main className="min-w-0 flex-1">
        {course.lessons.length === 0 ? (
          <p className="text-gray-600">Este curso todavía no tiene lecciones cargadas.</p>
        ) : (
          <div className="flex flex-col gap-10">
            {course.lessons.map((lesson, i) => (
              <article key={lesson.id} id={`lesson-${lesson.id}`} className="scroll-mt-6">
                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                  {i + 1}. {lesson.title}
                </h1>
                <div className="whitespace-pre-line leading-relaxed text-gray-800">
                  {lesson.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
