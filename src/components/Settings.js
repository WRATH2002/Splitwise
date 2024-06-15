import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { FaGooglePlay } from "react-icons/fa";
import OutsideClickHandler from "react-outside-click-handler";

const Settings = () => {
  const [pop, setPop] = useState(false);
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };
  return (
    <>
      {pop ? (
        <div
          className="w-full h-[100svh]  flex justify-center items-end bg-[#0000003e] p-[20px] fixed top-0 left-0  z-40"
          style={{ zIndex: 70 }}
          // onClick={() => {
          //   setNotificationModal(false);
          // }}
        >
          <OutsideClickHandler
            onOutsideClick={() => {
              setPop(false);
            }}
          >
            <div
              className="w-full z-50 h-auto bg-[#fff5ee] drop-shadow-sm   text-black  rounded-[20px] font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[30px]"
              style={{ zIndex: 100 }}
              onClick={() => {
                // setNotificationModal(true);
              }}
            >
              <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
                Information about our App
              </span>

              <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[5px]  ">
                Our app is almost ready for launch! While we're putting the
                final touches on it before releasing it on Google Play, we
                invite you to explore our website in the meantime. If you
                encounter any bugs or issues, please let us know.
              </span>
              <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-start whitespace-pre-wrap mt-[5px]  ">
                Thank you for your patience and support! Stay tuned for exciting
                updates!
              </span>

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                <div
                  className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                  onClick={() => {
                    setPop(false);
                  }}
                >
                  Ok
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full h-full bg-[#fff5ee] p-[20px] text-black font-[google] font-normal flex flex-col justify-start items-start">
        <div className="w-full ">
          <div className="w-[90px] aspect-square rounded-full object-cover bg-[#ffeadc]"></div>
          <div></div>
        </div>
        <div className="w-full border-[.7px] border-[#fee6d7] my-[20px]"></div>
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

        <div
          className="w-[calc(100%-40px)] fixed h-[100px] bottom-[60px] left-[20px] font-[google] font-normal text-black rounded-3xl flex flex-col justify-center items-center bg-[#ffe6d7] text-[14px]"
          onClick={() => {
            setPop(!pop);
            // setNewIncome("");
            // setError("");
          }}
        >
          <span className="text-[#6d6d6d]">Coming Soon to</span>
          <span className="flex justify-center items-center text-[19px] font-semibold tracking-wide">
            <FaGooglePlay className="text-[25px] mr-[10px]" /> Google Pay
          </span>
        </div>
      </div>
    </>
  );
};

export default Settings;
