import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import type { EditPostLoaderData } from "./postsLoader";

function EditPostPage() {
  const { post, categories, tags } = useLoaderData() as EditPostLoaderData;
  const navigation = useNavigation();
  const selectedTagIds = new Set(post.tags.map((tag) => tag.id));
  const isSubmitting = navigation.state === "submitting";

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

      <Form method="patch" className="mt-10 space-y-8 border-t border-gray-200 pt-10">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post.title}
            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            defaultValue={post.content}
            className="mt-2 block w-full resize-y rounded-md bg-white px-3 py-2 text-base leading-7 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category_id" className="block text-sm font-semibold text-gray-900">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={post.category.id}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-900">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={post.status}
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
                  name="tags"
                  value={tag.id}
                  defaultChecked={selectedTagIds.has(tag.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                {tag.name}
              </label>
            ))}
          </div>
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
      </Form>
    </div>
  );
}

export default EditPostPage;
