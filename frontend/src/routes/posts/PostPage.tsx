import { Link, useLoaderData } from "react-router-dom";
import type { PostDetailLoaderData } from "./postsLoader";
function PostPage() {
  const { post } = useLoaderData() as PostDetailLoaderData;
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 lg:py-20">
      <Link
        to="/"
        className="text-sm font-semibold text-gray-500 transition hover:text-gray-900"
      >
        Back to posts
      </Link>

      <header className="mt-8 border-b border-gray-200 pb-10">
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

        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-6xl">
          {post.title}
        </h1>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-10 space-y-6 text-lg leading-8 text-gray-700">
        {post.content.split("\n").filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export default PostPage;
