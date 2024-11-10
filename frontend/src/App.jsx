import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./context/axios";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./pages/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesPage from "./pages/CategoriesPage";
import PostDisplay from "./pages/PostDisplay";
import EditPost from "./pages/EditPost";
import Notification from "./pages/Notification";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        console.error(error.response.data.message || "Something went wrong");
      }
    },
  });

  if (isLoading) {
    return null;
  }
  return (
    <ThemeProvider>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={`/`} />}
        />
        <Route
          path="/register"
          element={!authUser ? <SignupPage /> : <Navigate to={`/`} />}
        />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/create"
            element={authUser ? <CreatePost /> : <Navigate to={`/login`} />}
          />
          <Route
            path="/edit/:id"
            element={authUser ? <EditPost /> : <Navigate to={`/login`} />}
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/notifications"
            element={authUser ? <Notification /> : <Navigate to={`/login`} />}
          />
          <Route path="/post/:id" element={<PostDisplay />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
