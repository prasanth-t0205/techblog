import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Get in Touch
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="text-blue-500" />
              <div>
                <h3 className="font-medium dark:text-white">Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  contact@blog.com
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="text-blue-500" />
              <div>
                <h3 className="font-medium dark:text-white">Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Chennai, India
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="text-blue-500" />
              <div>
                <h3 className="font-medium dark:text-white">Phone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  +91 1234567890
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
            ></textarea>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
