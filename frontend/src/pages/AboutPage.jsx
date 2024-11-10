import { Globe } from "lucide-react";
import React from "react";

const AboutPage = () => {
  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
          About Blog
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to Blog - a platform where technology meets creativity.
              Share your thoughts, discover new perspectives, and connect with
              fellow tech enthusiasts.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Globe className=" size-32 text-blue-500 animate-spin" />
          </div>
        </div>

        <div className="border-t dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800">
              <h3 className="font-medium mb-2 dark:text-white">
                Share Knowledge
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Empower users to share their expertise and experiences
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800">
              <h3 className="font-medium mb-2 dark:text-white">
                Build Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect like-minded individuals in meaningful discussions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800">
              <h3 className="font-medium mb-2 dark:text-white">
                Inspire Growth
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Foster learning and professional development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
