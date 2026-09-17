import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@demo.com" },
    update: {},
    create: {
      name: "Ana Instructora",
      email: "instructor@demo.com",
      passwordHash,
      bio: "Desarrolladora y creadora de contenido educativo.",
    },
  });

  await prisma.user.upsert({
    where: { email: "alumno@demo.com" },
    update: {},
    create: {
      name: "Beto Alumno",
      email: "alumno@demo.com",
      passwordHash,
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "introduccion-a-next-js" },
    update: {},
    create: {
      title: "Introducción a Next.js",
      slug: "introduccion-a-next-js",
      description:
        "Aprendé los fundamentos de Next.js: rutas, componentes de servidor, formularios y despliegue. Un curso pensado para quienes ya saben React y quieren dar el salto a un framework full-stack.",
      priceCents: 2999,
      published: true,
      instructorId: instructor.id,
    },
  });

  const lessons = [
    {
      title: "¿Qué es Next.js y por qué usarlo?",
      content:
        "Next.js es un framework de React para construir aplicaciones full-stack. En esta lección vemos sus ventajas frente a una SPA tradicional: renderizado en servidor, rutas basadas en archivos y una experiencia de desarrollo integrada.",
    },
    {
      title: "El App Router y los Server Components",
      content:
        "El App Router organiza tu aplicación en carpetas dentro de app/. Por defecto, cada componente es un Server Component: se ejecuta en el servidor, puede acceder directamente a la base de datos, y no envía JavaScript extra al navegador.",
    },
    {
      title: "Server Actions: formularios sin API routes",
      content:
        "Las Server Actions te permiten definir funciones que corren en el servidor y se invocan directamente desde un <form>, sin necesidad de crear un endpoint de API manualmente. Son la forma recomendada de manejar mutaciones de datos.",
    },
  ];

  for (let i = 0; i < lessons.length; i++) {
    await prisma.lesson.upsert({
      where: { id: `${course.id}-seed-lesson-${i}` },
      update: {},
      create: {
        id: `${course.id}-seed-lesson-${i}`,
        courseId: course.id,
        title: lessons[i].title,
        content: lessons[i].content,
        order: i + 1,
      },
    });
  }

  console.log("Seed completado:");
  console.log("  Instructor: instructor@demo.com / password123");
  console.log("  Alumno:     alumno@demo.com / password123");
  console.log(`  Curso demo: /courses/${course.slug}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
