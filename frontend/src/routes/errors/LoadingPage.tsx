type LoadingPageProps = {
  message?: string;
};

function LoadingPage({ message }: LoadingPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-4xl items-center px-6 py-16">
      <div className="w-full border-l-4 border-indigo-500 pl-6 sm:pl-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
            Loading
          </span>
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Please wait
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Checking your session
          </h1>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
          {message || "The app is loading the data it needs before showing this page."}
        </p>
      </div>
    </section>
  );
}

export default LoadingPage;
