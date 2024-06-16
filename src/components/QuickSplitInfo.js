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
    <div className="w-full h-[120px] flex justify-between items-center font-[google] font-normal px-[20px]">
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
        <span className=" flex justify-center items-center text-[14px] text-[#000000]">
          {/* <IoCalendarSharp className="text-[12px] mr-[8px]" /> */}
          Total you will get
        </span>
        <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
          <span className=" flex justify-start items-center text-[#00bb00]">
            <BiRupee className="ml-[-4px] " /> {props?.willGet}
          </span>
        </span>
        <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center mt-[5px]">
          <span
            className="whitespace-nowrap flex justify-center items-center ml-[1px]"
            onClick={() => {
              // setBudgetModal(true);
            }}
          >
            {props?.count}
            <span className="text-[#828282] ml-[4px] font-normal">
              Transactions{" "}
            </span>
          </span>
        </span>
      </div>
      <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
        <span className=" flex justify-center items-center text-[14px] text-[#000000] ">
          Total you to pay
        </span>
        <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
          <span className=" flex justify-start items-center text-[#c43b31]">
            <BiRupee className="ml-[-3px] " /> {props?.willPay}
          </span>
        </span>
        <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center mt-[5px]">
          <span
            className="whitespace-nowrap flex justify-center items-center "
            onClick={() => {
              // setBudgetModal(true);
            }}
          >
            {props?.payCount}
            <span className="text-[#828282] ml-[4px] font-normal">
              Transactions
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default QuickSplitInfo;
