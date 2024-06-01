import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/Input";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { setToken } from "../redux/userSlice";

export default function CheckPassword() {
  const [data, setData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, [navigate, location?.state?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div className="flex justify-center items-center py-1 flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.avatar}
          />
          <h2 className="text-sm text-gray-500 mt-1">
            {location?.state?.name}
          </h2>
        </div>
        <h3 className="text-xl text-center p-3">로그인</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
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
            <button className="mt-4 block w-full bg-primary text-white font-bold rounded-md px-3 py-2 hover:bg-secondary leading-relaxed tracking-wide">
              로그인
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
