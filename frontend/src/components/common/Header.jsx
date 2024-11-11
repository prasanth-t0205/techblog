import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
  Plus,
  LogIn,
  Search,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../context/axios";
import SearchModal from "../SearchModal";

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      navigate("/login");
      console.log("Logged out successfully");
    },
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-md z-50 text-black dark:text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={toggleMenu} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <Link
              to={`/`}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer"
            >
              TechBlog
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            <Link
              to={`/`}
              className="hover:text-purple-500 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to={`/categories`}
              className="hover:text-purple-500 transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              to={`/about`}
              className="hover:text-purple-500 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to={`/contact`}
              className="hover:text-purple-500 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              <Search className="w-5 h-5" />
            </button>
            {authUser && (
              <Link to={`/notifications`}>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700">
                  <Bell className="w-5 h-5" />
                </button>
              </Link>
            )}

            {!authUser && (
              <Link to={`/login`}>
                <button className="bg-purple-500 text-center text-white p-2 rounded-full hover:bg-purple-600 transition-colors duration-200">
                  <LogIn className="w-4 h-4" />
                </button>
              </Link>
            )}

            <div className="relative" ref={profileRef}>
              {authUser && (
                <button
                  onClick={toggleProfile}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors duration-200"
                >
                  <img
                    src={authUser?.profileImg || "/user.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              )}

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg py-2">
                  <Link
                    to={`/profile/${authUser?.username}`}
                    onClick={toggleProfile}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to={`/create`}
                    onClick={toggleProfile}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Link>
                  <button
                    onClick={mutate}
                    className="flex w-full items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 text-black dark:text-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleMenu}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              to={`/`}
              className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 group"
            >
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                Home
              </span>
            </Link>
            <Link
              to={`/categories`}
              className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 group"
            >
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                Categories
              </span>
            </Link>
            <Link
              to={`/about`}
              className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 group"
            >
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                About
              </span>
            </Link>
            <Link
              to={`/contact`}
              className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 group"
            >
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                Contact
              </span>
            </Link>
          </nav>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;
