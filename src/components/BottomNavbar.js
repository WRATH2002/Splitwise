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
            <div className="w-[30px] h-[6px] bg-[#181F32] rounded-t-full  z-0"></div>
          </div>
        ) : props?.segment == 2 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*1)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-[#181F32] rounded-t-full  z-0 "></div>
          </div>
        ) : props?.segment == 3 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*2)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-[#181F32] rounded-t-full  z-0"></div>
          </div>
        ) : props?.segment == 4 ? (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*3)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-[#181F32] rounded-t-full  z-0"></div>
          </div>
        ) : (
          <div
            className="w-[calc(100%/5)] h-full flex flex-col justify-end items-center ml-[calc((100%/5)*4)]"
            style={{ transition: ".3s" }}
          >
            {/* <div className="w-full h-[10px] rounded-t-full bg-[#ffe6d5] mb-[-4px]"></div> */}
            <div className="w-[30px] h-[6px] bg-[#181F32] rounded-t-full  z-0"></div>
          </div>
        )}
      </div>
      <div className="flex w-full h-full justify-between items-center z-10 text-[24px] bg-transparent ">
        <div
          className={
            "w-[calc(100%/5)] h-full flex justify-center items-center" +
            (props?.segment == 1 ? " text-[#000000]" : " text-[#969696]")
          }
          onClick={() => {
            if (props?.segment !== 1) {
              props?.setSegment(1);
            }
          }}
        >
          {/* <MdHistory
            className={
              "text-[27px] cursor-pointer" +
              (props?.segment === 1 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 1) {
                props?.setSegment(1);
              }
            }}
          /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-history"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
        </div>
        <div
          className={
            "w-[calc(100%/5)] h-full  flex justify-center items-center cursor-pointer" +
            (props?.segment == 2 ? " text-[#000000]" : " text-[#969696]")
          }
          onClick={() => {
            if (props?.segment !== 2) {
              props?.setSegment(2);
            }
          }}
        >
          {/* <RiDonutChartLine
            className={
              " cursor-pointer" +
              (props?.segment === 2 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 2) {
                props?.setSegment(2);
              }
            }}
          /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-map-pin"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div
          className={
            "w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer " +
            (props?.segment == 3 ? " text-[#000000]" : " text-[#969696]")
          }
          onClick={() => {
            if (props?.segment !== 3) {
              props?.setSegment(3);
            }
          }}
        >
          {/* <MdOutlineTipsAndUpdates
            className={
              " cursor-pointer" +
              (props?.segment === 3 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 3) {
                props?.setSegment(3);
              }
            }}
          /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-bell-dot"
          >
            <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            <circle cx="18" cy="8" r="3" />
          </svg>
        </div>

        <div
          className={
            "w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer" +
            (props?.segment == 4 ? " text-[#000000]" : " text-[#969696]")
          }
          onClick={() => {
            if (props?.segment !== 4) {
              props?.setSegment(4);
            }
          }}
        >
          {/* <IoGitNetworkOutline
            className={
              " cursor-pointer" +
              (props?.segment === 4 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 4) {
                props?.setSegment(4);
              }
            }}
          /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-split"
          >
            <path d="M16 3h5v5" />
            <path d="M8 3H3v5" />
            <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
            <path d="m15 9 6-6" />
          </svg>
        </div>
        <div
          className={
            "w-[calc(100%/5)] h-full flex justify-center items-center cursor-pointer" +
            (props?.segment == 5 ? " text-[#000000]" : " text-[#969696]")
          }
          onClick={() => {
            if (props?.segment !== 5) {
              props?.setSegment(5);
            }
          }}
        >
          {/* <LuSettings2
            className={
              " cursor-pointer" +
              (props?.segment === 5 ? " text-[#23a8d2]" : " text-[#000000]")
            }
            onClick={() => {
              if (props?.segment !== 5) {
                props?.setSegment(5);
              }
            }}
          /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-bolt"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
