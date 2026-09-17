"use client";

import { useActionState } from "react";

type CourseFormAction = (
  prevState: string | undefined,
  formData: FormData
) => Promise<string | undefined>;

export function CourseForm({
  action,
  initialTitle = "",
  initialDescription = "",
  initialPrice = "",
  submitLabel = "Guardar",
}: {
  action: CourseFormAction;
  initialTitle?: string;
  initialDescription?: string;
  initialPrice?: string;
  submitLabel?: string;
}) {
  const [message, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Título del curso
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={initialDescription}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Precio (USD)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={initialPrice}
          className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {message && <p className="text-sm text-indigo-700">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
