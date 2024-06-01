import React from "react";
import logo from "../images/logo.png";

export default function EmptyState() {
  return (
    <div className="flex items-center flex-col gap-3 ">
      <img src={logo} alt="logo" width={150} />
      <p className="text-sm mt-2 text-gray-600">
        유저를 선택한 후 메시지를 작성해 보세요.
      </p>
    </div>
  );
}
