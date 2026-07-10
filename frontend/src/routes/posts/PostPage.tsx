import { useState } from "react";
import { Form, Link, useLoaderData, useNavigation, useOutletContext } from "react-router-dom";
import type { PostDetailLoaderData } from "./postsLoader";
import type { UserRead } from "../../types/user";
function PostPage() {
  const { post } = useLoaderData() as PostDetailLoaderData;
  const navigation = useNavigation();
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [openPostMenuId, setOpenPostMenuId] = useState<boolean>(false);
  const isSubmitting = navigation.state === "submitting";
  const paragraphs = post.content.split("\n").filter(Boolean);
  const user = useOutletContext<{ user: UserRead | null }>().user;
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20 lg:py-24">
      <Link
        to="/"
        className="text-sm font-semibold text-gray-500 transition hover:text-gray-900"
      >
        Back to posts
      </Link>

      <header className="mt-8 border-b border-gray-200 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-x-5">
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
          {(user?.id === post.author.id || user?.is_admin) && (
            <>
              <div className="relative">
                <button
                  type="button" aria-label="Comment actions"
                  onClick={() => setOpenPostMenuId(!openPostMenuId)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-xl leading-none">...</span>
                  </button>
                    {openPostMenuId === true && (
                      <div className="absolute right-0 top-10 z-10 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <Form method="delete" >
                          <input type="hidden" name="post_id" value={post.id} />
                          <input type="hidden" name="intent" value="delete-post" />
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
            </>
          )}  
        </div>

        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-6xl">
          {post.title}
        </h1>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Written by
            </p>
            <Link
              to={`/users/${post.author.id}`}
              className="mt-1 block text-base font-bold text-gray-900 transition hover:text-gray-600"
            >
              {post.author.username}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 text-center"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-10 space-y-6 text-lg leading-8 text-gray-700">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-14 border-t border-gray-200 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Discussion
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
            </h2>
          </div>
        </div>

        <Form method="post" className="mt-8">
          <input type="hidden" name="intent" value="create-comment" />
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900">
            Add a comment
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            placeholder="Share your thoughts..."
            className="mt-2 block w-full resize-y rounded-md bg-white px-3 py-2 text-base leading-7 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? "Posting..." : "Post comment"}
          </button>
        </Form>

        <div className="mt-10 space-y-4">
          {post.comments.length === 0 ? (
            <p className="rounded-md border border-dashed border-gray-300 px-4 py-8 text-center text-base text-gray-500">
              No comments yet. Be the first to start the discussion.
            </p>
          ) : (
            post.comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-md border border-gray-200 bg-white p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold uppercase text-white">
                      {comment.author.username.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">
                        {comment.author.username}
                      </p>
                      <time className="text-sm font-semibold text-gray-400">
                        {comment.created_at.split("T")[0]}
                      </time>
                    </div>
                  </div>
                  {(user?.id === comment.author.id || user?.is_admin) && (
                    <div className="relative">
                      <button
                        type="button" aria-label="Comment actions"
                        onClick={() =>setOpenCommentMenuId(openCommentMenuId === comment.id ? null : comment.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                        <span className="text-xl leading-none">...</span>
                      </button>

                      {openCommentMenuId === comment.id && (
                        <div className="absolute right-0 top-10 z-10 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setOpenCommentMenuId(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <Form method="delete" >
                            <input type="hidden" name="comment_id" value={comment.id} />
                            <input type="hidden" name="intent" value="delete-comment" />
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

                {editingCommentId === comment.id ? (
                  <Form method="patch" className="mt-4 space-y-3">
                    <input type="hidden" name="intent" value="update-comment" />
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <textarea
                      name="content"
                      required
                      rows={4}
                      defaultValue={comment.content}
                      className="block w-full resize-y rounded-md bg-white px-3 py-2 text-base leading-7 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </Form>
                ) : (
                  <p className="mt-4 text-base leading-7 text-gray-700">
                    {comment.content}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </article>
  );
}

export default PostPage;
