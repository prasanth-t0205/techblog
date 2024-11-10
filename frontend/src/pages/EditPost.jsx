import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import axiosInstance from "../context/axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const queryClient = useQueryClient();

  const categories = [
    "AI",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "Internet of Things",
    "Virtual Reality",
    "Robotics",
    "Data Science",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["code-block"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "color",
    "background",
    "code-block",
  ];

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = axiosInstance.get(`/posts/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setImg(post.img);
    }
  }, [post]);

  const { mutate: editPost, isPending } = useMutation({
    mutationFn: async (updatedPost) => {
      const res = await axiosInstance.put(`/posts/edit/${id}`, updatedPost);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post edited successfully");
      queryClient.invalidateQueries(["post", id]);
      navigate(`/`);
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to edit post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Title, content, and category are required");
      return;
    }
    editPost({ title, img, content, category });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-neutral-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              Edit Post
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your title"
                className="w-full p-4 text-xl bg-transparent border dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setImg(e.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                ref={imgRef}
                className="hidden"
              />

              {img ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImg(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imgRef.current.click()}
                  className="w-full h-64 border-2 border-dashed dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">
                    Click to upload cover image
                  </span>
                </button>
              )}
            </div>

            <div className="rounded-xl overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="h-72 mb-12"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 disabled:opacity-70"
            >
              {isPending ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
