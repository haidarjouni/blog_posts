import { Form, Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

function Navbar() {
     const { data: user } = useCurrentUser();
     const navigationItems = [
          { name: "Home", href: "/" },
          ...(user ? [{ name: "View Profile", href: `/users/${user.id}` }] : []),
          ...(user ? [{ name: "Create Post", href: "/create-post" }] : []),
          ...(user?.is_admin
               ? [
                    { name: "Create Category", href: "/create-category" },
                    { name: "Create Tag", href: "/create-tag" },
               ]
               : []),
     ];

     return (
          <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
               <div className="w-44"></div>

               <ul className="md:flex hidden items-center gap-10">
                    {navigationItems.map((item) => (
                         <li key={item.href}>
                              <Link className="hover:text-gray-500/80 transition" to={item.href}>
                                   {item.name}
                              </Link>
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
