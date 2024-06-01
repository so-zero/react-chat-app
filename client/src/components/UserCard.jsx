import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

export default function UserCard({ user, onClose }) {
  return (
    <Link
      to={`/${user?._id}`}
      className="flex items-center gap-5 p-2 lg:p-4 rounded-md cursor-pointer hover:bg-gray-200"
      onClick={onClose}
    >
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.avatar}
          userId={user?._id}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-xs text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
}
