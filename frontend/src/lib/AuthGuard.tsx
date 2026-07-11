import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "../routes/errors/LoadingPage";
import { useCurrentUser } from "../hooks/useCurrentUser";
import DefaultErrorPage from "../routes/errors/DefaultErrorPage";

export default function AuthGuard({ allowedRoles }: { allowedRoles?: string[] }) {
     const { data: currentUser, isError, isLoading } = useCurrentUser();
     
     if (isLoading) return <LoadingPage />;
     if (isError) return <DefaultErrorPage message="We could not check your session. Please try again." />;
     if (!currentUser) return <Navigate to="/login" replace />;
     if (allowedRoles?.includes("admin") && !currentUser.is_admin) return <Navigate to="/unauthorized" replace />;

     return <Outlet />;
}
