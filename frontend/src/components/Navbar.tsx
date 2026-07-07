import { Form, Link } from "react-router-dom";
import type { UserRead } from "../types/user";

type NavbarProps = {
     user: UserRead | null;
};

type navigationItem = {
     name: string;
     href: string;
};

const navigationItems: navigationItem[] = [
     { name: "Home", href: "/" },
     { name: "Create Post", href: "/create-post" },
     { name: "Create Category", href: "/create-category" },
     { name: "Create Tag", href: "/create-tag" },
];

function Navbar({ user }: NavbarProps) {
     return (
          <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
               <div className="w-44"></div>

               <ul className="md:flex hidden items-center gap-10">
                    {navigationItems.filter(item => {
                         const adminOnlyItems = ["Create Post", "Create Category", "Create Tag"];
                         if (adminOnlyItems.includes(item.name)) {
                              return user && user.is_admin;
                         }
                         return true;
                    }).map((item) => (
                         <li key={item.href}>
                              <a className="hover:text-gray-500/80 transition" href={item.href}>
                                   {item.name}
                              </a>
                         </li>
                    ))}
               </ul>

               <div className="flex items-center gap-4">
                    {!user ? (
                         <>
                         <Link to="/login">
                              <button type="button" className=" cursor-pointer bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-20 h-11 rounded-full">
                                   Login
                              </button>
                         </Link>
                         <Link to="/signup">
                              <button type="button" className=" cursor-pointer bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-20 h-11 rounded-full">
                                   Sign up
                              </button>
                         </Link>
                         </>
                    ) : (
                         <Form method="post" action="/logout">
                              <button type="submit" className=" cursor-pointer bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-20 h-11 rounded-full">
                                   Logout
                              </button>
                         </Form>
                    )}
               </div>
          </nav>
     );
}
export default Navbar;
