"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(title: string) {
  const base = slugify(title) || "curso";
  let slug = base;
  let i = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

async function requireCourseOwner(courseId: string) {
  const userId = await requireUserId();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== userId) {
    redirect("/dashboard");
  }
  return course;
}

const courseSchema = z.object({
  title: z.string().min(3, "El título es muy corto"),
  description: z.string().min(10, "Agregá una descripción más completa"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

export async function createCourseAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const userId = await requireUserId();

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const { title, description, price } = parsed.data;
  const slug = await uniqueSlug(title);

  const course = await prisma.course.create({
    data: {
      title,
      description,
      slug,
      priceCents: Math.round(price * 100),
      instructorId: userId,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/courses/${course.id}/edit`);
}

export async function updateCourseAction(
  courseId: string,
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  await requireCourseOwner(courseId);

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const { title, description, price } = parsed.data;

  await prisma.course.update({
    where: { id: courseId },
    data: { title, description, priceCents: Math.round(price * 100) },
  });

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath("/dashboard");
  return "Cambios guardados";
}

export async function togglePublishAction(courseId: string) {
  const course = await requireCourseOwner(courseId);

  if (!course.published) {
    const lessonCount = await prisma.lesson.count({ where: { courseId } });
    if (lessonCount === 0) {
      redirect(`/dashboard/courses/${courseId}/edit?error=needs-lessons`);
    }
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { published: !course.published },
  });

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function deleteCourseAction(courseId: string) {
  await requireCourseOwner(courseId);
  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

const lessonSchema = z.object({
  title: z.string().min(2, "El título es muy corto"),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

export async function addLessonAction(
  courseId: string,
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  await requireCourseOwner(courseId);

  const parsed = lessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { courseId },
    _max: { order: true },
  });

  await prisma.lesson.create({
    data: {
      courseId,
      title: parsed.data.title,
      content: parsed.data.content,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
}

export async function updateLessonAction(
  courseId: string,
  lessonId: string,
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  await requireCourseOwner(courseId);

  const parsed = lessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { title: parsed.data.title, content: parsed.data.content },
  });

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return "Lección guardada";
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  await requireCourseOwner(courseId);
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
}

export async function moveLessonAction(
  courseId: string,
  lessonId: string,
  direction: "up" | "down"
) {
  await requireCourseOwner(courseId);

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });

  const index = lessons.findIndex((l) => l.id === lessonId);
  const swapWith = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || swapWith < 0 || swapWith >= lessons.length) {
    return;
  }

  const a = lessons[index];
  const b = lessons[swapWith];

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.lesson.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
}
