import { CourseForm } from "@/components/course-form";
import { createCourseAction } from "@/lib/actions/courses";

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nuevo curso</h1>
      <CourseForm action={createCourseAction} submitLabel="Crear curso" />
    </div>
  );
}
