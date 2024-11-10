import { Search, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../context/axios";

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
  });

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await axiosInstance.get(`/posts/search/${searchQuery}`);
      return res.data;
    },
    enabled: searchQuery.length > 0,
  });

  const handleSearchInput = (query) => {
    setSearchQuery(query);
  };

  const handleResultClick = (post) => {
    const searchItem = {
      query: searchQuery,
      postId: post._id,
      title: post.title,
      category: post.category,
      username: post.user.username,
    };
    addToRecentSearches(searchItem);
    onClose();
  };

  const addToRecentSearches = (searchItem) => {
    const updatedSearches = [
      searchItem,
      ...recentSearches.filter((s) => s.postId !== searchItem.postId),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const deleteSearch = (searchToDelete) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchToDelete
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-2xl rounded-t-lg shadow-xl mx-4">
        <div className="p-4 border-b dark:border-neutral-700">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full px-4 py-2 bg-transparent focus:outline-none dark:text-white"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              autoFocus
            />
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recent Searches
                </h3>
                <button
                  onClick={clearAllSearches}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between group px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg"
                >
                  <Link
                    to={`/post/${item.postId}`}
                    onClick={onClose}
                    className="flex-1"
                  >
                    <h4 className="font-medium dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category} • by {item.username}
                    </p>
                  </Link>
                  <button
                    onClick={() => deleteSearch(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          )}

          {searchResults?.map((post) => (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              onClick={() => handleResultClick(post)}
              className="block p-4 hover:bg-gray-100 dark:hover:bg-neutral-700 border-b dark:border-neutral-700"
            >
              <h3 className="font-medium dark:text-white">{post.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.category} • by {post.user.username}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
