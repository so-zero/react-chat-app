import React, { useEffect, useRef, useState } from "react";
import { TiPencil } from "react-icons/ti";
import Input from "./Input";
import Avatar from "./Avatar";
import uploadFile from "../server/uploadFile";
import { MdPublishedWithChanges } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function EditUserDetails({ onClose, user }) {
  const [data, setData] = useState({
    name: user?.name,
    avatar: user?.avatar,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData({ ...data, avatar: uploadPhoto?.url });
  };

  const handleOpenPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true,
      });

      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <p className="text-sm font-semibold flex items-center justify-center">
          프로필 편집
          <span className="ml-1">
            <TiPencil size={15} />
          </span>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              label="Name :"
              htmlFor="name"
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="block text-sm font-medium leading-6 text-gray-900 mt-4">
            Photo :
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.avatar}
                name={data?.name}
              />
              <label htmlFor="file">
                <button
                  className="text-xs font-bold flex items-center"
                  onClick={handleOpenPhoto}
                >
                  이미지 변경하기
                  <span className="ml-1">
                    <MdPublishedWithChanges size={14} />
                  </span>
                </button>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-5"></div>
          <div className="mt-5 flex gap-2 w-fit ml-auto">
            <button
              className="border-primary border text-primary px-4 py-2 rounded-md text-sm hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              취소하기
            </button>
            <button
              className="border-primary border bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-secondary"
              type="submit"
            >
              변경하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
