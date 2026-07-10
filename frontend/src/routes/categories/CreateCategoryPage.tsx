import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useActionData, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { categoryCreateSchema, type CreateCategoryInput } from "../../schemas/categorySchemas";
import type { CategoryRead } from "../../types/category";
import type { CreateCategoryLoaderData } from "./categoryLoaders";

type CategoryActionData = {
  error?: string;
  intent?: "create-category" | "update-category";
  categoryId?: number;
};

type EditCategoryFormProps = {
  category: CategoryRead;
  actionData?: CategoryActionData;
  isSubmitting: boolean;
  onCancel: () => void;
};

function EditCategoryForm({ category, actionData, isSubmitting, onCancel }: EditCategoryFormProps) {
  const submit = useSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
    },
  });

  function onSubmit(formData: CreateCategoryInput) {
    submit(
      {
        ...formData,
        categoryId: String(category.id),
        intent: "update-category",
      },
      { method: "post" }
    );
  }

  const backendError =
    actionData?.intent === "update-category" && actionData.categoryId === category.id
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
        <label htmlFor={`category-name-${category.id}`} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Name
        </label>
        <input
          id={`category-name-${category.id}`}
          type="text"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `category-name-${category.id}-error` : undefined}
          {...register("name")}
          className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
        />
        {errors.name?.message && (
          <p id={`category-name-${category.id}-error`} className="mt-2 text-sm font-semibold text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`category-description-${category.id}`} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Description
        </label>
        <textarea
          id={`category-description-${category.id}`}
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? `category-description-${category.id}-error` : undefined}
          {...register("description")}
          className="mt-1 block w-full resize-y rounded-md bg-white px-3 py-2 text-sm leading-6 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
        />
        {errors.description?.message && (
          <p id={`category-description-${category.id}-error`} className="mt-2 text-sm font-semibold text-red-600">
            {errors.description.message}
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

function CreateCategoryPage() {
  const { categories } = useLoaderData() as CreateCategoryLoaderData;
  const actionData = useActionData() as CategoryActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    actionData?.intent === "update-category" ? actionData.categoryId || null : null
  );
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(formData: CreateCategoryInput) {
    submit({ ...formData, intent: "create-category" }, { method: "post" });
  }

  const createError = actionData?.intent === "create-category" ? actionData.error : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl">
          Create category
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Add a category that groups related posts together.
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
              placeholder="FastAPI"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "category-name-error" : undefined}
              {...register("name")}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
            />
            {errors.name?.message && (
              <p id="category-name-error" className="mt-2 text-sm font-semibold text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Posts about building APIs with FastAPI"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "category-description-error" : undefined}
              {...register("description")}
              className="mt-2 block w-full resize-y rounded-md bg-white px-3 py-2 text-base leading-7 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
            />
            {errors.description?.message && (
              <p id="category-description-error" className="mt-2 text-sm font-semibold text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-indigo-600"
          >
            {isSubmitting ? "Creating..." : "Create category"}
          </button>
        </form>

        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Existing categories
          </h2>
          <div className="mt-4 divide-y divide-gray-200 rounded-md border border-gray-200">
            {categories.length === 0 ? (
              <p className="px-4 py-5 text-sm text-gray-500">
                No categories yet.
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="px-4 py-4">
                  {editingCategoryId === category.id ? (
                    <EditCategoryForm
                      category={category}
                      actionData={actionData}
                      isSubmitting={isSubmitting}
                      onCancel={() => setEditingCategoryId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <span className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                            {category.slug}
                          </span>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            aria-label="Category actions"
                            onClick={() =>
                              setOpenCategoryMenuId(
                                openCategoryMenuId === category.id ? null : category.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          >
                            <span className="text-xl leading-none">...</span>
                          </button>

                          {openCategoryMenuId === category.id && (
                            <div className="absolute right-0 top-10 z-10 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryId(category.id);
                                  setOpenCategoryMenuId(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <Form method="delete">
                                <input type="hidden" name="categoryId" value={category.id} />
                                <input type="hidden" name="intent" value="delete-category" />
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
                      {category.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {category.description}
                        </p>
                      )}
                    </>
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

export default CreateCategoryPage;
