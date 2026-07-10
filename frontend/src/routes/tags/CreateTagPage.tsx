import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useActionData, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { tagCreateSchema, type CreateTagInput } from "../../schemas/tagSchemas";
import type { TagRead } from "../../types/tag";
import type { CreateTagLoaderData } from "./tagLoaders";

type TagActionData = {
  error?: string;
  intent?: "create-tag" | "update-tag";
  tagId?: number;
};

type EditTagFormProps = {
  tag: TagRead;
  actionData?: TagActionData;
  isSubmitting: boolean;
  onCancel: () => void;
};

function EditTagForm({ tag, actionData, isSubmitting, onCancel }: EditTagFormProps) {
  const submit = useSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTagInput>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  function onSubmit(formData: CreateTagInput) {
    submit(
      {
        ...formData,
        tagId: String(tag.id),
        intent: "update-tag",
      },
      { method: "post" }
    );
  }

  const backendError =
    actionData?.intent === "update-tag" && actionData.tagId === tag.id
      ? actionData.error
      : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      {backendError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {backendError}
        </div>
      )}
      <div>
        <label htmlFor={`tag-name-${tag.id}`} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Name
        </label>
        <input
          id={`tag-name-${tag.id}`}
          type="text"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `tag-name-${tag.id}-error` : undefined}
          {...register("name")}
          className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
        />
        {errors.name?.message && (
          <p id={`tag-name-${tag.id}-error`} className="mt-2 text-sm font-semibold text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-9 items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function CreateTagPage() {
  const { tags } = useLoaderData() as CreateTagLoaderData;
  const actionData = useActionData() as TagActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();
  const [openTagMenuId, setOpenTagMenuId] = useState<number | null>(null);
  const [editingTagId, setEditingTagId] = useState<number | null>(
    actionData?.intent === "update-tag" ? actionData.tagId || null : null
  );
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTagInput>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(formData: CreateTagInput) {
    submit({ ...formData, intent: "create-tag" }, { method: "post" });
  }

  const createError = actionData?.intent === "create-tag" ? actionData.error : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl">
          Create tag
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Add a tag that can be attached to posts for quick scanning.
        </p>
      </header>

      <div className="mt-10 grid gap-10 border-t border-gray-200 pt-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {createError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {createError}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Backend"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "tag-name-error" : undefined}
              {...register("name")}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
            />
            {errors.name?.message && (
              <p id="tag-name-error" className="mt-2 text-sm font-semibold text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? "Creating..." : "Create tag"}
          </button>
        </form>

        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Existing tags
          </h2>
          <div className="mt-4 divide-y divide-gray-200 rounded-md border border-gray-200">
            {tags.length === 0 ? (
              <p className="px-4 py-5 text-sm text-gray-500">
                No tags yet.
              </p>
            ) : (
              tags.map((tag) => (
                <div key={tag.id} className="px-4 py-4">
                  {editingTagId === tag.id ? (
                    <EditTagForm
                      tag={tag}
                      actionData={actionData}
                      isSubmitting={isSubmitting}
                      onCancel={() => setEditingTagId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-600">
                        #{tag.name}
                      </span>

                      <div className="relative">
                        <button
                          type="button"
                          aria-label="Tag actions"
                          onClick={() =>
                            setOpenTagMenuId(openTagMenuId === tag.id ? null : tag.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <span className="text-xl leading-none">...</span>
                        </button>

                        {openTagMenuId === tag.id && (
                          <div className="absolute right-0 top-10 z-10 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTagId(tag.id);
                                setOpenTagMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <Form method="delete">
                              <input type="hidden" name="tagId" value={tag.id} />
                              <input type="hidden" name="intent" value="delete-tag" />
                              <button
                                type="submit"
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </Form>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CreateTagPage;
