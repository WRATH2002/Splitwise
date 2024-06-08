import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { IoCalendarSharp } from "react-icons/io5";
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

const QuickSplitInfo = () => {
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
    <div className="w-full h-[100px] flex justify-between items-center pb-[20px] px-[20px]">
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-start">
        <span className=" flex justify-center items-center text-[12px] text-[#828282]">
          <IoCalendarSharp className="text-[12px] mr-[8px]" />
          {monthNames[month - 1]},{" "}
          <span className="text-white ml-[4px]">Split Expense</span>
        </span>
        <span className=" font-[google] font-normal text-[22px] text-[#ff6c00] flex justify-start items-center">
          <BiRupee className="ml-[-3px] " /> 2405
        </span>
        <span className="font-[google] font-normal text-[13px] text-[#ff6c00]">
          Remaining
        </span>
      </div>
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-end">
        <span className=" flex justify-center items-center text-[12px] text-[#828282] opacity-0">
          {/* <IoCalendarSharp className="text-[12px] mr-[8px]" /> */}
          {monthNames[month - 1]}
        </span>
        <span className=" font-[google] font-normal text-[22px] text-[#828282] flex justify-start items-center">
          <span className="opacity-0">0</span>
          <RiDonutChartFill className="mr-[9px]" /> <MdOutlineBarChart />
        </span>
        <span className="font-[google] font-normal text-[13px] text-[#828282] flex justify-end items-center">
          Curr. Income{" "}
          <span className="text-white flex justify-end items-center ml-[6px]">
            <BiRupee className=" " />
            60000
          </span>
        </span>
      </div>
    </div>
  );
};

export default QuickSplitInfo;
