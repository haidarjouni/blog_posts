import { useState } from "react";
import { Form, useLoaderData, useNavigation } from "react-router-dom";
import type { CreateTagLoaderData } from "./tagLoaders";

function CreateTagPage() {
  const { tags } = useLoaderData() as CreateTagLoaderData;
  const navigation = useNavigation();
  const [openTagMenuId, setOpenTagMenuId] = useState<number | null>(null);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const isSubmitting = navigation.state === "submitting";

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
        <Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="create-tag" />
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="Backend"
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? "Creating..." : "Create tag"}
          </button>
        </Form>

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
                    <Form method="patch" className="space-y-3">
                      <input type="hidden" name="intent" value="update-tag" />
                      <input type="hidden" name="tagId" value={tag.id} />
                      <div>
                        <label htmlFor={`tag-name-${tag.id}`} className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Name
                        </label>
                        <input
                          id={`tag-name-${tag.id}`}
                          name="name"
                          type="text"
                          required
                          maxLength={100}
                          defaultValue={tag.name}
                          className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTagId(null)}
                          className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex h-9 items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                        >
                          Save
                        </button>
                      </div>
                    </Form>
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
