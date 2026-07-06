import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/home/HomePage";
import LoginPage from "./routes/users/LoginPage";
import PostPage from "./routes/posts/PostPage";
import CreatePostPage from "./routes/posts/CreatePostPage";
import RootLayout from './layout/RootLayout';
import CreateCategoryPage from './routes/categories/CreateCategoryPage';
import CreateTagPage from './routes/tags/CreateTagPage';
import UserPage from './routes/users/UserPage';
import { homeLoader } from './routes/Home/homeLoader';
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homeLoader
      },
      {
        path: "User/:id",
        Component: UserPage
      },
      {
        path: "login",
        Component: LoginPage
      },
      {
        path: "posts/:id",
        Component: PostPage
      },
      {
        path: "create-post",
        Component: CreatePostPage
      },
      {
        path: "create-category",
        Component: CreateCategoryPage
      },
      {
        path: "create-tag",
        Component: CreateTagPage
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
