"use client";

import { useActionState } from "react";

type LessonFormAction = (
  prevState: string | undefined,
  formData: FormData
) => Promise<string | undefined>;

export function LessonForm({
  action,
  initialTitle = "",
  initialContent = "",
  submitLabel = "Agregar lección",
}: {
  action: LessonFormAction;
  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
}) {
  const [message, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Título de la lección</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Contenido</label>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={initialContent}
          placeholder="Texto de la lección (podés usar Markdown simple)"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {message && <p className="text-sm text-indigo-700">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
