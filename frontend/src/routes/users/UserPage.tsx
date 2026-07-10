import { Form, Link, useLoaderData, useOutletContext } from "react-router-dom";
import type { UserDetail, UserRead } from "../../types/user";
import { useState } from "react";

type UserPageProps = {
  user: UserDetail;
}

function UserPage() {
  const { user } = useLoaderData() as UserPageProps;
  const { user: currentUser } = useOutletContext<{ user: UserRead | null }>();
  const [openEditPanel, setOpenEditPanel] = useState<boolean>(false);
  const canManageUser = currentUser?.id === user.id || currentUser?.is_admin;
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20">
      <Link
        to="/"
        className="text-sm font-semibold text-gray-500 transition hover:text-gray-900"
      >
        Back to posts
      </Link>

      <header className="mt-8 border-b border-gray-200 pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold uppercase text-white">
              {user.username.slice(0, 1)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
                  {user.username}
                </h1>
                {user.is_admin && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Admin
                  </span>
                )}
                {canManageUser && (
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="User actions"
                      onClick={() =>
                        setOpenEditPanel(!openEditPanel)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <span className="text-xl leading-none">...</span>
                    </button>

                    {openEditPanel && (
                      <div className="absolute right-0 top-10 z-10 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        <Link to ={`/users/${user.id}/edit`}
                          className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <Form method="delete">
                          <input type="hidden" name="intent"  value="delete-user" />
                          <input type="hidden" name="userId" value={user.id} />
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
                )}
              </div>
              <p className="mt-2 text-base font-semibold text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-64">
            <div className="rounded-md border border-gray-200 px-4 py-3">
              <p className="text-2xl font-bold text-gray-900">{user?.posts.length}</p>
              <p className="text-sm font-semibold text-gray-400">Posts</p>
            </div>
            <div className="rounded-md border border-gray-200 px-4 py-3">
              <p className="text-2xl font-bold text-gray-900">{user?.comments.length}</p>
              <p className="text-sm font-semibold text-gray-400">Comments</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Activity
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Recent posts
            </h2>
          </div>
        </div>

        <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
          {user.posts.map((post) => (
            <article key={post.id} className="py-8">
              <div className="flex flex-wrap items-center gap-3">
                <time className="text-sm font-semibold text-gray-400">
                  {post.created_at.split("T")[0]}
                </time>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                  {post.category.name}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {post.status}
                </span>
              </div>

              <Link to={`/posts/${post.id}`} className="group mt-4 block">
                <h3 className="text-2xl font-bold text-gray-900 transition group-hover:text-gray-600">
                  {post.title}
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
                  {post.content}
                </p>
              </Link>

              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserPage;
