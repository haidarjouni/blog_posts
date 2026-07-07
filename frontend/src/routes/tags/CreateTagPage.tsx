import { Form, useLoaderData, useNavigation } from "react-router-dom";
import type { CreateTagLoaderData } from "./tagLoaders";

function CreateTagPage() {
     const { tags } = useLoaderData() as CreateTagLoaderData;
     const navigation = useNavigation();
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
                         <div className="mt-4 flex flex-wrap gap-3 rounded-md border border-gray-200 p-4">
                              {tags.length === 0 ? (
                                   <p className="text-sm text-gray-500">
                                        No tags yet.
                                   </p>
                              ) : (
                                   tags.map((tag) => (
                                        <span
                                             key={tag.id}
                                             className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-600"
                                        >
                                             #{tag.name}
                                        </span>
                                   ))
                              )}
                         </div>
                    </aside>
               </div>
          </div>
     );
}

export default CreateTagPage;
