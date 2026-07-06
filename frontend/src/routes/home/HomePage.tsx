import { useLoaderData } from "react-router";
import ListPosts from "../../components/ListPosts";
import type { HomeLoaderData } from "./homeLoader";

export default function HomePage() {
  const { posts } = useLoaderData() as HomeLoaderData;
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
        <ListPosts posts={posts} />
      </section>
    </div>
  );
}
