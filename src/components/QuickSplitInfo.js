import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { IoCalendarSharp } from "react-icons/io5";
import { LuCornerDownLeft, LuCornerDownRight } from "react-icons/lu";
import { MdOutlineBarChart } from "react-icons/md";
import { RiDonutChartFill } from "react-icons/ri";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const QuickSplitInfo = (props) => {
  const [month, setMonth] = useState(0);

  useEffect(() => {
    fetchMonth();
  });

  function fetchMonth() {
    var date = new Date();
    const currMonth = date.getMonth() + 1;
    setMonth(currMonth);
  }
  return (
    <div className="w-[calc(100%)] h-[140px] flex justify-between items-center font-[google] font-normal px-[20px] bg-[#191A2C]  p-[20px] ">
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
        <span className=" flex justify-center items-center text-[14px] text-[#00bb00] ">
          {/* <IoCalendarSharp className="text-[12px] mr-[8px]" /> */}
          <span className="text-[#00bb00]">Total Owed</span>{" "}
          <svg
            className="text-[#00bb00]"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-down-left"
          >
            <path d="M17 7 7 17" />
            <path d="M17 17H7V7" />
          </svg>
        </span>
        <span className=" font-[google] font-normal text-[25px] text-[#000000] flex justify-start items-center">
          <span className=" flex justify-start items-center text-[#ffffff]">
            <BiRupee className="ml-[-4px] " /> {props?.willGet}{" "}
            {/* <LuCornerDownRight className="text-[25px]" /> */}
          </span>
        </span>
        <span className="font-[google]  text-[14px] text-[#000000]   flex justify-start items-center ">
          <div className="py-[2px] px-[7px] rounded-xl bg-[#F4F5F7] text-[#000000] flex justify-center items-center">
            x {props?.count}
          </div>
          {/* <span
            className="whitespace-nowrap flex justify-center items-center ml-[1px]"
            onClick={() => {
              // setBudgetModal(true);
            }}
          >
            <span className="text-[#828282]  font-normal">Count : </span>
            {props?.count}
          </span> */}
        </span>
      </div>
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
        <span className=" flex justify-center items-center text-[14px] text-[#e61d0f] ">
          <svg
            className="text-[#e61d0f]"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-up-right"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>{" "}
          Total Due
        </span>
        <span className=" font-[google] font-normal text-[25px] text-[#000000] flex justify-start items-center">
          <span className=" flex justify-start items-center text-[#ffffff]">
            <BiRupee className="ml-[-3px] " /> {props?.willPay}{" "}
            {/* <LuCornerDownLeft className="text-[25px]" /> */}
          </span>
        </span>
        <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center ">
          <div className="py-[2px] px-[7px] rounded-xl bg-[#F4F5F7] text-[#000000] flex justify-center items-center">
            x {props?.payCount}
          </div>
        </span>
      </div>
    </div>
  );
};

export default QuickSplitInfo;
