import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../context/axios";

const Notification = () => {
  const queryClient = useQueryClient();
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const { mutate: clearAllNotifications } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/notifications");
      return res.data;
    },
    onSuccess: () => {
      toast.success("All notifications cleared");
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  return (
    <div className="pt-20 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications?.length > 0 && (
          <button
            onClick={() => clearAllNotifications()}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications?.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">
              No notifications yet
            </p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification._id}
              className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/profile/${notification.from.username}`}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={notification.from.profileImg || user.png}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{notification.from.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.type === "follow" &&
                        "started following you"}
                      {notification.type === "comment" &&
                        "commented on your post"}
                      {notification.type === "post" && "made a new post"}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
