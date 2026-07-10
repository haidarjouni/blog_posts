import { Link } from "react-router-dom";

type UnauthorizedPageProps = {
  message?: string;
};

function UnauthorizedPage({ message }: UnauthorizedPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-4xl items-center px-6 py-16">
      <div className="w-full border-l-4 border-amber-500 pl-6 sm:pl-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
            403
          </span>
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Permission required
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-6xl">
          You cannot access this page
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
          {message || "This page is only available to the owner of the resource or to an admin account."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Back to posts
          </Link>
          <Link
            to="/login"
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UnauthorizedPage;
