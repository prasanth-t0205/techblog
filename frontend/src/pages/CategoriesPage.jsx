import React, { useState } from "react";
import {
  Grid,
  Zap,
  Shield,
  Cloud,
  Wifi,
  Smartphone,
  Cpu,
  BarChart2,
  X,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../context/axios";
import { Link } from "react-router-dom";

const categories = [
  { name: "AI", icon: <Zap />, color: "bg-blue-500" },
  { name: "Blockchain", icon: <Grid />, color: "bg-green-500" },
  { name: "Cybersecurity", icon: <Shield />, color: "bg-red-500" },
  { name: "Cloud Computing", icon: <Cloud />, color: "bg-purple-500" },
  { name: "Internet of Things", icon: <Wifi />, color: "bg-yellow-500" },
  { name: "Virtual Reality", icon: <Smartphone />, color: "bg-indigo-500" },
  { name: "Robotics", icon: <Cpu />, color: "bg-pink-500" },
  { name: "Data Science", icon: <BarChart2 />, color: "bg-teal-500" },
];

const samplePosts = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    excerpt:
      "Exploring how artificial intelligence is revolutionizing medical diagnoses and treatment plans.",
    category: "AI",
  },
  {
    id: 2,
    title: "Blockchain: Beyond Cryptocurrency",
    excerpt:
      "Discovering the potential applications of blockchain technology in various industries.",
    category: "Blockchain",
  },
  {
    id: 3,
    title: "Cybersecurity in the Age of IoT",
    excerpt:
      "Addressing the unique challenges of securing interconnected devices in the Internet of Things.",
    category: "Cybersecurity",
  },
  {
    id: 4,
    title: "Cloud Computing: Scalability for Startups",
    excerpt:
      "How cloud technologies are enabling small businesses to compete with industry giants.",
    category: "Cloud Computing",
  },
  {
    id: 5,
    title: "Smart Cities and IoT Integration",
    excerpt:
      "Exploring the role of IoT in creating more efficient and sustainable urban environments.",
    category: "Internet of Things",
  },
  {
    id: 6,
    title: "VR in Education: A New Frontier",
    excerpt:
      "Examining the potential of virtual reality to transform traditional learning experiences.",
    category: "Virtual Reality",
  },
  {
    id: 7,
    title: "Robotics in Manufacturing: The New Industrial Revolution",
    excerpt:
      "How robotics is reshaping production lines and increasing efficiency in manufacturing.",
    category: "Robotics",
  },
  {
    id: 8,
    title: "Big Data Analytics: Predicting Consumer Behavior",
    excerpt:
      "Leveraging data science to understand and forecast market trends and consumer preferences.",
    category: "Data Science",
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const filteredPosts =
    selectedCategory && posts
      ? posts.filter((post) => post.category === selectedCategory)
      : [];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:pt-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Categories
      </h1>

      {selectedCategory ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            <X className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
            {selectedCategory}
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {post.title}
                  </h3>
                  <div
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: post.content.substring(0, 150) + "...",
                    }}
                  />
                  <Link
                    to={`/post/${post._id}`}
                    className="mt-3 sm:mt-4 inline-block text-blue-500 hover:underline text-sm sm:text-base"
                  >
                    Read more
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">
                No posts found in this category
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className="group bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center p-4 sm:p-6">
                <div
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {React.cloneElement(category.icon, {
                    className: "w-6 h-6 sm:w-8 sm:h-8",
                  })}
                </div>
                <div className="ml-4 sm:ml-6 flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-blue-500 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                    Explore the latest trends
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
            </button>
          ))}
        </div>
      )}
      <section className="mb-16 mt-16">
        <h2 className="text-3xl font-bold mb-8">All Blogs</h2>
        {postsLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
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

      <section className="mb-5">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Stay updated with the latest in tech. Get our top stories delivered
            to your inbox weekly.
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
    </div>
  );
}
