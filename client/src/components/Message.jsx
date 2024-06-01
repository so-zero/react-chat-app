import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { MdPerson, MdPersonOff } from "react-icons/md";
import { BiDotsVertical } from "react-icons/bi";
import { BsCaretLeftFill } from "react-icons/bs";
import { PiCameraPlusFill } from "react-icons/pi";
import { IoImages } from "react-icons/io5";
import { ImVideoCamera } from "react-icons/im";
import uploadFile from "../server/uploadFile";
import { VscClose } from "react-icons/vsc";
import Loading from "./Loading";
import { RiSendPlaneFill } from "react-icons/ri";
import moment from "moment";

export default function Message() {
  const params = useParams();
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const user = useSelector((state) => state.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    avatar: "",
    online: false,
    _id: "",
  });
  const [openUpload, setOpenUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadOpen = () => {
    setOpenUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenUpload(false);
    setMessage({ ...message, imageUrl: uploadPhoto.url });
  };

  const handleClearUploadImage = () => {
    setMessage({ ...message, imageUrl: "" });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenUpload(false);
    setMessage({ ...message, videoUrl: uploadPhoto.url });
  };

  const handleClearUploadVideo = () => {
    setMessage({ ...message, videoUrl: "" });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage({ ...message, text: value });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div>
      <header className="sticky top-0 h-20 border-b-[1px] flex justify-between items-center px-5">
        <div className="flex items-center gap-4">
          <Link to="/" className="lg:hidden hover:text-primary">
            <BsCaretLeftFill size={20} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.avatar}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-md lg:text-sm text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p>
              {dataUser?.online ? (
                <MdPerson size={20} className="text-green-500" />
              ) : (
                <MdPersonOff size={20} className="text-gray-400" />
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <BiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-144px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-gray-100">
        <div className="flex flex-col gap-3 p-2" ref={currentMessage}>
          {allMessage.map((message) => {
            return (
              <div
                className={`p-2 my-1 rounded-md w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user._id === message.msgByUserId
                    ? "ml-auto bg-sky-300"
                    : "bg-white"
                }`}
              >
                <div className="w-full ">
                  {message?.imageUrl && (
                    <img
                      src={message?.imageUrl}
                      alt="uploadImage"
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {message?.videoUrl && (
                    <video
                      src={message?.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="text-ellipsis line-clamp-1">{message?.text}</p>
                <p className="text-xs ml-auto w-fit mt-1">
                  {moment(message.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {message?.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-gray-400 bg-opacity-10 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary"
              onClick={handleClearUploadImage}
            >
              <VscClose size={25} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message?.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {message?.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-gray-400 bg-opacity-10 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary"
              onClick={handleClearUploadVideo}
            >
              <VscClose size={25} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message?.videoUrl}
                alt="uploadVideo"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className="h-16 bg-white border-t-[1px] flex items-center px-4">
        <div className="relative">
          <button
            className="flex justify-center items-center w-11 h-11 rounded-full hover:text-primary"
            onClick={handleUploadOpen}
          >
            <PiCameraPlusFill size={23} />
          </button>

          {openUpload && (
            <div className="bg-white shadow rounded absolute bottom-12 w-36 p-2 border-[1px]">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 px-3 hover:bg-gray-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <IoImages size={20} />
                  </div>
                  <p className="text-xs">Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 px-3 hover:bg-gray-200 cursor-pointer"
                >
                  <div className="text-violet-500">
                    <ImVideoCamera size={20} />
                  </div>
                  <p className="text-xs">Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="메세지를 입력하세요."
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className="px-3 hover:text-primary">
            <RiSendPlaneFill size={25} />
          </button>
        </form>
      </section>
    </div>
  );
}
