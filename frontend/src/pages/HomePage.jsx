import React from "react";
import axiosInstance from "../context/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const { data: randomPosts, isLoading: randomLoading } = useQuery({
    queryKey: ["randomPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/random?count=4");
      return res.data;
    },
  });
  return (
    <div className="min-h-screen  text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 py-8 mt-16">
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Explore the Future of Tech
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                Dive into cutting-edge innovations and stay ahead in the rapidly
                evolving world of technology.
              </p>
              <Link
                to="/categories"
                className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors duration-200"
              >
                Start Reading
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
          {postsLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.slice(0, 6).map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <div
                      className="text-gray-600 dark:text-gray-300 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: post.content.substring(0, 100) + "...",
                      }}
                    />
                    <Link
                      to={`/post/${post._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Popular Blogs</h2>
          {randomLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {randomPosts?.map((post) => (
                <div
                  key={post._id}
                  className="flex bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-1/3 object-cover h-48"
                  />
                  <div className="w-2/3 p-4">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <div
                      className="text-gray-600 dark:text-gray-300 text-sm mb-2"
                      dangerouslySetInnerHTML={{
                        __html: post.content.substring(0, 100) + "...",
                      }}
                    />
                    <Link
                      to={`/post/${post._id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Stay updated with the latest in tech. Get our top stories
              delivered to your inbox weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
