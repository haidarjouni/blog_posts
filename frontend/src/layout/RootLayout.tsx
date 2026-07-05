import { Outlet } from "react-router-dom"; // or "react-router" for v7+
import Navbar  from "../components/Navbar";
function RootLayout() {
     return (
          <>
               <Navbar />
               <main className="content-area">
                    <Outlet /> 
               </main>

          </>
     )
}

export default RootLayout