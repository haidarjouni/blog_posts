import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/home/HomePage";
import LoginPage from "./routes/login/LoginPage";
import PostPage from "./routes/posts/PostPage";
import CreatePostPage from "./routes/posts/CreatePostPage";
import RootLayout from './layout/RootLayout';
import CreateCategoryPage from './routes/categories/CreateCategoryPage';
import CreateTagPage from './routes/tags/CreateTagPage';
import UserPage from './routes/users/UserPage';
import { homeLoader } from './routes/home/homeLoader';
import { loginAction, logoutAction } from './routes/login/loginAction';
import { rootLoader } from './layout/rootLoader';
import { signupAction } from './routes/signup/signupAction';
import { SignupPage } from './routes/signup/SignupPage';
import { createPostLoader, getPostByIdLoader } from './routes/posts/postsLoader';
import { createCommentAction, createPostsAction } from './routes/posts/postsAction';
import { createCategoryAction } from './routes/categories/categoryActions';
import { createCategoryLoader } from './routes/categories/categoryLoaders';
import { createTagAction } from './routes/tags/tagActions';
import { createTagLoader } from './routes/tags/tagLoaders';
import { userLoader } from './routes/users/userLoad';
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: rootLoader,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homeLoader
      },
      {
        path: "users/:id",
        Component: UserPage,
        loader: userLoader
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
        path: "logout",
        action: logoutAction
      },
      {
        path: "posts/:id",
        Component: PostPage,
        loader: getPostByIdLoader,
        action: createCommentAction
      },
      {
        path: "create-post",
        Component: CreatePostPage,
        loader: createPostLoader,
        action: createPostsAction
      },
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
