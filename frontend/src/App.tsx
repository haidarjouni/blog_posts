import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import RootLayout from './layout/RootLayout';
import CreateCategoryPage from './pages/CreateCategoryPage';
import CreateTagPage from './pages/CreateTagPage';
import UserPage from './pages/UserPage';
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage
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
