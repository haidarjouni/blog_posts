import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    date: "Mar 16, 2020",
    category: "Marketing",
    title: "Blog Post Title",
    summary:
      "This is a brief summary of the blog post. It provides an overview of the content and entices readers to click through to read more.",
    author: "Sleepy Bear",
    role: "User",
  },
  {
    id: 2,
    date: "Apr 2, 2020",
    category: "Writing",
    title: "How to Start a Useful Blog",
    summary:
      "A simple look at turning rough notes, ideas, and drafts into posts people can actually read and enjoy.",
    author: "Mira Stone",
    role: "Author",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24 lg:py-32">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Latest posts
        </p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-6xl">
          From the Blog
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
          Welcome to our blog. Here you'll find the latest posts, updates, and
          notes from the people writing them.
        </p>
      </header>

      <section className="mt-14 divide-y divide-gray-200 border-t border-gray-200 sm:mt-16">
        {posts.map((post) => (
          <article key={post.id} className="py-10 first:pt-12 sm:py-12">
            <div className="flex flex-wrap items-center gap-3">
              <time className="text-sm font-semibold text-gray-400">
                {post.date}
              </time>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                {post.category}
              </span>
            </div>

            <Link to={`/posts/${post.id}`} className="group mt-4 block">
              <h2 className="text-2xl font-bold text-gray-900 transition group-hover:text-gray-600">
                {post.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600">
                {post.summary}
              </p>
            </Link>

            <Link
              to={`/User/${post.id}`}
              className="mt-8 flex w-fit items-center gap-3 rounded-full pr-4 transition hover:bg-gray-50"
            >
              
              <div>
                <p className="font-bold text-gray-900">{post.author}</p>
                <p className="text-sm font-semibold text-gray-400">
                  {post.role}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
