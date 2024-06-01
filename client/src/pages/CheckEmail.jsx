import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export default function CheckEmail() {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response?.data?.message);

      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div className="flex justify-center items-center py-1">
          <FaUserCircle size={70} className="text-primary" />
        </div>
        <h3 className="text-xl text-center p-3">로그인</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
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
          </div>
          <div className="border-t border-gray-200 ">
            <button className="mt-4 block w-full bg-primary text-white font-bold rounded-md px-3 py-2 hover:bg-secondary leading-relaxed tracking-wide">
              다음
            </button>
          </div>
        </form>
        <Link
          to="/register"
          className="block mt-3 text-sm text-center text-gray-500 underline cursor-pointer"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
