
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

function Navbar() {
     return (
          <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
               <div className="w-44"></div>

               <ul className="md:flex hidden items-center gap-10">
                    {navigationItems.map((item) => (
                         <li><a className="hover:text-gray-500/80 transition" href={item.href}>{item.name}</a></li>
                    ))}
               </ul>

               <div className="flex items-center gap-4">
                    <button type="button" className="cursor-pointer bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-20 h-11 rounded-full">
                         Login
                    </button>
                    <button type="button" className="cursor-pointer bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-20 h-11 rounded-full">
                         Sign up
                    </button>
               </div>
          </nav>
     );
}
export default Navbar;
