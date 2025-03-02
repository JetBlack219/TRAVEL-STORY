import React, { useState } from 'react';  // Importing useState hook
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Correct icon import

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);  // Initialize state

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);  // Toggle password visibility
  };

  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">
      <input
        type={isShowPassword ? "text" : "password"}  // Toggle between password and text
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-primary cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
