import { Outlet, useLoaderData } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { UserRead } from "../types/user";

type RootLoaderData = {
  user: UserRead | null;
};

function RootLayout() {
  const { user } = useLoaderData() as RootLoaderData;

  return (
    <>
      <Navbar user={user} />
      <main className="content-area">
        <Outlet context={{ user }} />
      </main>
    </>
  );
}

export default RootLayout;