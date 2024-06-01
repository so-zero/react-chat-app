import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { PiWechatLogo } from "react-icons/pi";
import SearchUser from "./SearchUser";
import { IoImages } from "react-icons/io5";
import { ImVideoCamera } from "react-icons/im";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const [editUser, setEditUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [searchUser, setSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);

      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[80px,1fr] bg-white border-r-[1px] ">
      <div className="pt-7 flex flex-col justify-between bg-white border-r-[1px]">
        <div className="flex flex-col items-center space-y-1 gap-3 ">
          <NavLink
            className={({ isActive }) =>
              `gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer ${
                isActive && "bg-gray-100 text-black"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses className="h-6 w-6 shrink-0" />
          </NavLink>
          <div
            className="gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer"
            title="user"
            onClick={() => setSearchUser(true)}
          >
            <FaUserGroup className="h-6 w-6 shrink-0" />
          </div>
          <div
            className="gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer"
            title="logout"
            onClick={handleLogout}
          >
            <TbLogout2 className="h-6 w-6 shrink-0" />
          </div>
        </div>
        <div className="mb-7 flex flex-col justify-between items-center">
          <button
            className="cursor-pointer hover:opacity-75 transition"
            title={user?.name}
            onClick={() => setEditUser(true)}
          >
            <Avatar
              width={50}
              height={50}
              name={user?.name}
              imageUrl={user?.avatar}
              userId={user?._id}
            />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-20 flex items-center">
          <h2 className="text-2xl lg:text-xl font-bold p-5">Message</h2>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-5">
              <div className="flex justify-center items-center my-3 text-gray-400">
                <PiWechatLogo size={80} />
              </div>
              <p className="text-lg text-center text-gray-400">
                start a conversation
              </p>
            </div>
          )}

          {allUser.map((conv) => {
            return (
              <Link
                to={`/${conv?.userDetails?._id}`}
                key={conv?._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.avatar}
                    name={conv?.userDetails?.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <div className="flex items-center gap-2">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <IoImages />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <ImVideoCamera />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary font-semibold rounded-full text-white">
                    {conv?.unseenMsg}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* edit user details */}
      {editUser && (
        <EditUserDetails onClose={() => setEditUser(false)} user={user} />
      )}

      {/* search user */}
      {searchUser && <SearchUser onClose={() => setSearchUser(false)} />}
    </div>
  );
}
