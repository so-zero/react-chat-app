import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import Input from "../components/Input";
import uploadFile from "../server/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);

    setData({ ...data, avatar: uploadPhoto?.url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response?.data?.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          avatar: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div className="flex justify-center items-center py-1">
          <img src={logo} alt="logo" width={70} height={60} />
        </div>
        <h3 className="text-xl text-center p-3">회원가입</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Name :"
              htmlFor="name"
              type="text"
              id="name"
              name="name"
              placeholder="이름을 입력하세요."
              value={data.name}
              onChange={handleChange}
            />
            <Input
              label="Email :"
              htmlFor="email"
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력하세요."
              value={data.email}
              onChange={handleChange}
            />
            <Input
              label="Password :"
              htmlFor="password"
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요."
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className="border-t border-gray-200 ">
            <label
              htmlFor="file"
              className="block text-sm font-medium leading-6 text-gray-900 mt-4"
            >
              Photo :
              <div className="mt-2 w-full rounded-md border-0 p-1.5 ring-1 ring-inset ring-gray-300 flex items-center">
                <button className="w-fit p-2 bg-primary rounded-lg text-white cursor-pointer">
                  FILE UPLOAD
                </button>
                <p className="text-sm ml-3 text-gray-400">
                  {uploadPhoto?.name ? uploadPhoto?.name : "사진을 선택하세요."}
                </p>
              </div>
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleUploadPhoto}
              className="hidden"
            />
          </div>
          <div className="border-t border-gray-200 ">
            <button className="mt-4 block w-full bg-primary text-white font-bold rounded-md px-3 py-2 hover:bg-secondary leading-relaxed tracking-wide">
              회원가입
            </button>
          </div>
        </form>
        <Link
          to="/email"
          className="block mt-3 text-sm text-center text-gray-500 underline cursor-pointer"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
