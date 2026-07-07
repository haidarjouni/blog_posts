import { Link } from "react-router-dom";
import type { PostRead } from "../types/post";

type ListPostsProps = {
  posts: PostRead[];
};

export default function ListPosts({ posts }: ListPostsProps) {
     return (
          <>
               {posts.map((post) => (          
                    <article key={post.id} className="py-10 first:pt-12 sm:py-12">
                    <div className="flex flex-wrap items-center gap-3">
                    <time className="text-sm font-semibold text-gray-400">
                         {post.created_at.split("T")[0]}
                    </time>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                         {post.category.name}
                    </span>
                    </div>

                    <Link to={`/posts/${post.id}`} className="group mt-4 block">
                    <h2 className="text-2xl font-bold text-gray-900 transition group-hover:text-gray-600">
                         {post.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-600">
                         {post.content}
                    </p>
                    </Link>
                    <div>
                         <Link
                              to={`/users/${post.author.id}`}
                              className="mt-8 flex w-fit items-center gap-3 rounded-full pr-4 transition hover:bg-gray-50"
                         >
                              <p className="font-bold text-gray-900">{post.author.username}</p>
                         </Link>
                         <p className="text-sm font-semibold text-gray-400">
                              {post.tags?.map((tag) => `#${tag.name}`).join(", ")}
                         </p>
                    </div>
                    </article>
             ))}
          </>
     );
}
