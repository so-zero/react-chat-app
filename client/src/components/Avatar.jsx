import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Avatar({ userId, name, imageUrl, width, height }) {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-sky-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-gray-200",
    "bg-orange-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-violet-200",
    "bg-purple-200",
  ];

  const randomColor = Math.floor(Math.random() * 12);

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className={`rounded-full text-lg relative ${bgColor[randomColor]}`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="relative overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full font-bold uppercase flex justify-center items-center"
        >
          {avatarName}
        </div>
      ) : (
        <FaUserCircle size={width} className="text-primary" />
      )}

      {isOnline && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-3 w-3" />
      )}
    </div>
  );
}
