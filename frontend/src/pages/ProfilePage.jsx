import React, { useState, useRef, useEffect } from "react";
import { Edit2, Loader, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../context/axios";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const { username } = useParams();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [profileImage, setProfileImage] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/profile/${username}`);
      return response.data.user;
    },
    onSuccess: (data) => {
      setProfileImage(data.profileImg);
    },
  });

  const { data: userPosts } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/user/${username}`);
      return response.data;
    },
    enabled: !!username,
  });

  const followMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.post(`/users/follow/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosInstance.post("/users/update", updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["authUser"]);
      setIsEditing(false);
    },
  });

  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    socialLinks: user?.socialLinks || [],
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        socialLinks: user.socialLinks || [],
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const myProfile = authUser?._id === user?._id;
  const iamFollowing = authUser?.following?.includes(user?._id);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialLinksChange = (index, value) => {
    const newSocialLinks = [...profileData.socialLinks];
    newSocialLinks[index] = value;
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: newSocialLinks,
    }));
  };

  const handleAddSocialLink = () => {
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: [...prevData.socialLinks, ""],
    }));
  };

  const handleRemoveSocialLink = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: prevData.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleFollow = () => {
    followMutation.mutate(user._id);
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...profileData,
      profileImg: profileImage,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateProfileMutation.mutate({
      ...profileData,
      deleteProfileImage: true,
    });
    setProfileImage(null);
  };

  return (
    <div className="min-h-screen mt-16 py-10">
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="p-6 sm:p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            {myProfile && (
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                      aria-label="Save changes"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader className=" animate-spin h-5 w-5" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={toggleEditing}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEditing}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <img
                  src={profileImage || user?.profileImg || "/user.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:bg-zinc-700"
                />
                {!myProfile && (
                  <button
                    onClick={handleFollow}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {iamFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
                {isEditing && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Change Photo
                    </button>
                    {profileImage && (
                      <button
                        onClick={handleRemovePhoto}
                        className="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {userPosts?.length || 0}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Posts
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                      {user?.followers?.length || 0}
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Followers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullname"
                      value={profileData.fullname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.fullname}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user?.bio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Social Links
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {profileData.socialLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) =>
                            handleSocialLinksChange(index, e.target.value)
                          }
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                          placeholder="https://example.com"
                        />
                        <button
                          onClick={() => handleRemoveSocialLink(index)}
                          className="px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddSocialLink}
                      className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Add Link
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside text-gray-900 dark:text-white">
                    {user?.socialLinks?.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Published Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts?.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={post.img || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h4>
                    <p
                      className="text-gray-600 dark:text-gray-300 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: post.content.substring(0, 100),
                      }}
                    />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Published {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
