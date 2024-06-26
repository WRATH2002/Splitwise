import React from "react";
import { IoGitNetworkOutline } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import {
  MdCallSplit,
  MdHistory,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { RiDonutChartFill, RiDonutChartLine } from "react-icons/ri";

const BottomNavbar = (props) => {
  return (
    <div className="w-full h-[60px] flex justify-between items-center px-[20px] bg-[#ffffff] mt-0">
      <div className="flex w-[calc(100%-40px)] h-[60px] justify-start items-center text-[24px] fixed bottom-0">
        {props?.segment == 1 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-0"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-gradient-to-r from-[#5fdfe8] to-[#23a8d2] rounded-t-full  z-0"></div>
          </div>
        ) : props?.segment == 2 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*1)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-gradient-to-r from-[#5fdfe8] to-[#23a8d2] rounded-t-full  z-0 "></div>
          </div>
        ) : props?.segment == 3 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*2)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-gradient-to-r from-[#5fdfe8] to-[#23a8d2] rounded-t-full  z-0"></div>
          </div>
        ) : props?.segment == 4 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*3)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-gradient-to-r from-[#5fdfe8] to-[#23a8d2] rounded-t-full  z-0"></div>
          </div>
        ) : (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*4)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-gradient-to-r from-[#5fdfe8] to-[#23a8d2] rounded-t-full  z-0"></div>
          </div>
        )}
      </div>
      <div className="flex w-full h-full justify-between items-center z-10 text-[24px] bg-transparent ">
        <div className="w-[calc(100%/5)] h-full flex justify-center items-center">
          <MdHistory
            className={
              "text-[27px] cursor-pointer" +
              (props?.segment === 1 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 1) {
                props?.setSegment(1);
              }
            }}
          />
        </div>
        <div className="w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer">
          <RiDonutChartLine
            className={
              " cursor-pointer" +
              (props?.segment === 2 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 2) {
                props?.setSegment(2);
              }
            }}
          />
        </div>
        <div className="w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer ">
          <MdOutlineTipsAndUpdates
            className={
              " cursor-pointer" +
              (props?.segment === 3 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 3) {
                props?.setSegment(3);
              }
            }}
          />
        </div>

        <div className="w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer">
          <IoGitNetworkOutline
            className={
              " cursor-pointer" +
              (props?.segment === 4 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 4) {
                props?.setSegment(4);
              }
            }}
          />
        </div>
        <div className="w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer">
          <LuSettings2
            className={
              " cursor-pointer" +
              (props?.segment === 5 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 5) {
                props?.setSegment(5);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
