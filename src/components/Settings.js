import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";

const Settings = () => {
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };
  return (
    <div className="w-full h-full bg-[#fff5ee] p-[20px] text-black font-[google] font-normal flex flex-col justify-start items-start">
      <div className="w-full ">
        <div className="w-[90px] aspect-square rounded-full object-cover bg-[#de8544]"></div>
        <div></div>
      </div>
      <div className="w-full border-[.7px] border-[#3d3d3d] my-[20px]"></div>
      <div className="w-auto flex justify-start items-center my-[7px]"></div>
      <div className="w-auto flex justify-start items-center my-[7px]">
        Set / Change Budget
      </div>
      <div className="w-auto flex justify-start items-center my-[7px]">
        <IoIosWallet className="mr-[10px] text-[20px] text-[#de8544]" /> Set /
        Change Income
      </div>
      <div className="w-auto flex justify-start items-center my-[7px]">
        <MdSavings className="mr-[10px] text-[20px] text-[#de8544]" /> Total
        Savings
      </div>
      <div className="w-auto flex justify-start items-center my-[7px]">
        <BiSolidReport className="mr-[10px] text-[20px] text-[#de8544]" /> Get
        Report
      </div>
      <div
        className="w-auto flex justify-start items-center my-[7px]"
        onClick={() => {
          userSignOut();
        }}
      >
        <IoLogOut className="mr-[10px] text-[20px] text-[#de8544]" /> Log Out
      </div>
    </div>
  );
};

export default Settings;
