import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSessionAction, confirmCheckoutSessionAction } from "@/lib/actions/checkout";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    purchase?: "success" | "cancelled" | "error";
    session_id?: string;
  }>;
}) {
  const { slug } = await params;
  const { purchase, session_id } = await searchParams;

  if (purchase === "success" && session_id) {
    await confirmCheckoutSessionAction(session_id);
  }

  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true, bio: true } },
      lessons: { orderBy: { order: "asc" }, select: { id: true, title: true } },
    },
  });

  if (!course) {
    notFound();
  }

  const isOwner = session?.user?.id === course.instructorId;

  if (!course.published && !isOwner) {
    notFound();
  }

  const purchase_ = session?.user?.id
    ? await prisma.purchase.findUnique({
        where: { studentId_courseId: { studentId: session.user.id, courseId: course.id } },
      })
    : null;

  const hasAccess = isOwner || purchase_?.status === "PAID";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {!course.published && isOwner && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Este curso todavía es un borrador. Solo vos podés verlo hasta que lo publiques desde el{" "}
          <Link href="/dashboard" className="underline">
            dashboard
          </Link>
          .
        </p>
      )}

      {purchase === "success" && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          ¡Compra realizada con éxito! Ya podés acceder al curso.
        </p>
      )}
      {purchase === "cancelled" && (
        <p className="mb-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
          Pago cancelado. Podés intentar de nuevo cuando quieras.
        </p>
      )}
      {purchase === "error" && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          No se pudo iniciar el pago. Si sos el administrador del sitio, revisá que
          STRIPE_SECRET_KEY esté configurada correctamente en el archivo .env.
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Creado por <span className="font-medium">{course.instructor.name}</span>
          </p>
          <p className="mt-4 whitespace-pre-line text-gray-700">{course.description}</p>

          <h2 className="mt-8 mb-3 text-lg font-semibold text-gray-900">
            Contenido del curso ({course.lessons.length} lecciones)
          </h2>
          <ul className="flex flex-col gap-2">
            {course.lessons.map((lesson, i) => (
              <li
                key={lesson.id}
                className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              >
                {i + 1}. {lesson.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-3xl font-bold text-gray-900">
            ${(course.priceCents / 100).toFixed(2)}
          </p>

          {isOwner ? (
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="mt-4 block rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-700"
            >
              Administrar curso
            </Link>
          ) : hasAccess ? (
            <Link
              href={`/learn/${course.slug}`}
              className="mt-4 block rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-500"
            >
              Ir al curso
            </Link>
          ) : (
            <form action={createCheckoutSessionAction.bind(null, course.id)}>
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                {session ? "Comprar ahora" : "Ingresá para comprar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
