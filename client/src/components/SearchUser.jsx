import React, { useState, useEffect } from "react";
import { TbMoodSearch } from "react-icons/tb";
import Loading from "./Loading";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { VscClose } from "react-icons/vsc";

export default function SearchUser({ onClose }) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;

    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-8">
        <div className="h-14 overflow-hidden flex bg-white rounded">
          <input
            type="text"
            placeholder="유저 검색하기"
            className="w-full h-full py-1.5 px-4 outline-none placeholder:text-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-14 w-14 flex justify-center items-center text-gray-600 ">
            <TbMoodSearch size={25} />
          </div>
        </div>

        <div className="bg-white mt-2 w-full p-4 rounded">
          {searchUser.length === 0 && !loading && (
            <p className="text-center font-bold text-gray-700">
              유저가 없습니다!
            </p>
          )}

          {loading && <Loading />}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user) => {
              return <UserCard key={user._id} user={user} onClose={onClose} />;
            })}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl lg:text-3xl p-2 lg:p-3  hover:text-white"
        onClick={onClose}
      >
        <button>
          <VscClose />
        </button>
      </div>
    </div>
  );
}
