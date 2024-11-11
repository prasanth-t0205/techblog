import React, { useState } from "react";
import { Clock, Edit2, Trash2, ArrowLeft, Share2 } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../context/axios";
import { toast } from "react-toastify";

const PostDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    },
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      navigate("/");
      toast.success("Post deleted successfully");
    },
  });

  const myPost = authUser?._id === post?.user?._id;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this post: ${post.title}`,
          url: window.location.href,
        });
      } catch (err) {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShareModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="md:max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Posts
          </button>
          <div className="flex space-x-4">
            {myPost && (
              <>
                <Link
                  to={`/edit/${post._id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="w-5 h-5" />
                </Link>
                <button
                  onClick={deletePost}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleShare}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="relative h-96 overflow-hidden rounded-lg">
            <img
              src={post?.img}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <h1 className="absolute bottom-0 left-0 right-0 text-4xl sm:text-5xl font-bold text-white p-8 leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="p-8">
            <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center mr-6">
                <img
                  src={post.user.profileImg}
                  alt={post.user.username}
                  className="sm:w-10 w-5 sm:h-10 h-5 rounded-full mr-3 border-2 border-blue-500"
                />
                <span>{post.user.username}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <p className=" sm:text-sm text-xs">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${window.location.href}`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Share on Twitter
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Share on Facebook
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full bg-gray-200 dark:bg-gray-700 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDisplay;
