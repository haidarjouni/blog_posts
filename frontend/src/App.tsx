import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/home/HomePage";
import LoginPage from "./routes/login/LoginPage";
import PostPage from "./routes/posts/PostPage";
import CreatePostPage from "./routes/posts/CreatePostPage";
import EditPostPage from "./routes/posts/EditPostPage";
import RootLayout from './layout/RootLayout';
import CreateCategoryPage from './routes/categories/CreateCategoryPage';
import CreateTagPage from './routes/tags/CreateTagPage';
import UserPage from './routes/users/UserPage';
import EditUserPage from './routes/users/EditUserPage';
import { homeLoader } from './routes/home/homeLoader';
import { loginAction, logoutAction } from './routes/login/loginAction';
import { signupAction } from './routes/signup/signupAction';
import { SignupPage } from './routes/signup/SignupPage';
import { createPostLoader, editPostLoader, getPostByIdLoader } from './routes/posts/postsLoader';
import { createCommentAction, createPostsAction, updatePostAction } from './routes/posts/postsAction';
import { createCategoryAction } from './routes/categories/categoryActions';
import { createCategoryLoader } from './routes/categories/categoryLoaders';
import { createTagAction } from './routes/tags/tagActions';
import { createTagLoader } from './routes/tags/tagLoaders';
import { userLoaderWithPosts, userLoader } from './routes/users/userLoad';
import { userAction } from './routes/users/userAction';
import RootErrorBoundary from './routes/errors/ErrorBoundary';
import NotFoundPage from './routes/errors/NotFoundPage';
import UnauthorizedPage from './routes/errors/UnauthorizedPage';
import AuthGuard from './lib/AuthGuard';
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homeLoader
      },
      //public
      {
        path: "*",
        Component: NotFoundPage
      },
      {
        path: "signup",
        Component: SignupPage,
        action: signupAction
      },
      {
        path: "login",
        Component: LoginPage,
        action: loginAction
      },
      {
        path: "unauthorized",
        Component: UnauthorizedPage
      },
      {
        path: "users/:id",
        Component: UserPage,
        loader: userLoaderWithPosts,
        action: userAction
      },
      {
        path: "posts/:id",
        Component: PostPage,
        loader: getPostByIdLoader,
        action: createCommentAction
      },
      // Authenticated routes
      {
        element: <AuthGuard />,
        children: [
            {
              path: "users/:id/edit",
              Component: EditUserPage,
              loader: userLoader,
              action: userAction
            },

            {
              path: "logout",
              action: logoutAction
            },
            {
              path: "posts/:id/edit",
              Component: EditPostPage,
              loader: editPostLoader,
              action: updatePostAction
            },
            {
              path: "create-post",
              Component: CreatePostPage,
              loader: createPostLoader,
              action: createPostsAction
            },
        ]
      },
      // Admin routes
      {
        element: <AuthGuard allowedRoles={["admin"]} />,
        children: [
          {
            path: "create-category",
            Component: CreateCategoryPage,
            loader: createCategoryLoader,
            action: createCategoryAction
          },
          {
            path: "create-tag",
            Component: CreateTagPage,
            loader: createTagLoader,
            action: createTagAction
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
