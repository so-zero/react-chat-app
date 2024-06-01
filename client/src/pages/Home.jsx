import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setUser,
  setSocketConnection,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import EmptyState from "../components/EmptyState";
import io from "socket.io-client";

export default function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[400px,1fr] h-screen max-h-screen">
      <section className={`${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/* message components */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`hidden justify-center items-center ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <EmptyState />
      </div>
    </div>
  );
}
