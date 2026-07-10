import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useActionData, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { postCreateSchema, type CreatePostFormInput, type CreatePostInput } from "../../schemas/postSchemas";
import type { EditPostLoaderData } from "./postsLoader";

type PostActionData = {
  error?: string;
};

function EditPostPage() {
  const { post, categories, tags } = useLoaderData() as EditPostLoaderData;
  const actionData = useActionData() as PostActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormInput, unknown, CreatePostInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      category_id: post.category.id,
      status: post.status === "published" ? "published" : "draft",
      tags: post.tags.map((tag) => tag.id),
    },
  });

  function onSubmit(formData: CreatePostInput) {
    submit(
      {
        ...formData,
        category_id: String(formData.category_id),
        tags: formData.tags.map(String),
      },
      { method: "patch" }
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 lg:py-20">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Edit post
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Update the post content, category, status, or tags.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8 border-t border-gray-200 pt-10" noValidate>
        {actionData?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {actionData.error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
            Title
          </label>
          <input
            id="title"
            type="text"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            {...register("title")}
            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
          />
          {errors.title?.message && (
            <p id="title-error" className="mt-2 text-sm font-semibold text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900">
            Content
          </label>
          <textarea
            id="content"
            rows={12}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? "content-error" : undefined}
            {...register("content")}
            className="mt-2 block w-full resize-y rounded-md bg-white px-3 py-2 text-base leading-7 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
          />
          {errors.content?.message && (
            <p id="content-error" className="mt-2 text-sm font-semibold text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category_id" className="block text-sm font-semibold text-gray-900">
              Category
            </label>
            <select
              id="category_id"
              aria-invalid={Boolean(errors.category_id)}
              aria-describedby={errors.category_id ? "category-error" : undefined}
              {...register("category_id")}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 aria-invalid:outline-red-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id?.message && (
              <p id="category-error" className="mt-2 text-sm font-semibold text-red-600">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-900">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-gray-900">Tags</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={tag.id}
                  {...register("tags")}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                {tag.name}
              </label>
            ))}
          </div>
          {errors.tags?.message && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              {errors.tags.message}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-8 sm:flex-row sm:justify-end">
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
