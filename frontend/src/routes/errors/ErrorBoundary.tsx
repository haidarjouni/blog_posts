import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import DefaultErrorPage from "./DefaultErrorPage";
import NotFoundPage from "./NotFoundPage";
import UnauthorizedPage from "./UnauthorizedPage";

export default function RootErrorBoundary() {
     const error = useRouteError();
     if (isRouteErrorResponse(error)) {
          const message = typeof error.data === "string" ? error.data : undefined;
          if(error.status === 404){
               return <NotFoundPage message={message} />;
          }
          if(error.status === 403){
               return <UnauthorizedPage message={message} />;
          } 
          return <DefaultErrorPage message={message} />;
     }else{
          return <DefaultErrorPage />;
     }
}
