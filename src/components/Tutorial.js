import React, { useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaFilter, FaLongArrowAltDown } from "react-icons/fa";
import { Line, Circle } from "rc-progress";
// import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import ExpenseBarGraph from "./ExpenseBarGraph";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoChevronRight } from "react-icons/go";
import { FiPlus } from "react-icons/fi";

const Info = [
  {
    info: "This shows total expense you have done in the month and total budget remaining this month .",
  },
  {
    info: "This shows your current budget and a progress bar for better visualisation.",
  },
  {
    info: "This shows total expense you have done in the month (left) and total budget remaining this month (right).",
  },
  {
    info: "This is the section where your Transaction History of this month is shown. You can see transaction history of different months and you can filter them acccordingly.",
  },
  {
    info: "From here you can add your new transactions that you have done and can keep record of it.",
  },
  {
    info: "This shows your current budget and a progress bar for better visualisation.",
  },
  {
    info: "This shows total expense you have done in the month (left) and total budget remaining this month (right).",
  },
  {
    info: "This shows your current budget and a progress bar for better visualisation.",
  },
];

const Tutorial = () => {
  const [part, setPart] = useState(0);
  return (
    <div className="w-full h-[100svh] fixed top-0 left-0 bg-[#0000003e] z-50 font-[google] font-normal text-[15px] ">
      <div className=" w-[calc(100%-40px)] p-[20px] h-auto bg-[#FFF5EE] flex flex-col justify-start items-center fixed left-[20px] bottom-[20px] rounded-[20px]">
        {/* <span>
          This shows total expense you have done in the month (left) and total
          budget remaining this month (right).
        </span> */}
        <span>{Info[part].info}</span>
        <div className="w-full flex justify-end items-center mt-[15px]">
          <div
            className={
              " cursor-pointer" + (part == 0 ? " text-[#a5a5a5]" : " ")
            }
            onClick={() => {
              if (part > 0) {
                setPart(part - 1);
              }
            }}
          >
            Previous
          </div>
          <div
            className="ml-[25px] cursor-pointer"
            onClick={() => {
              setPart(part + 1);
            }}
          >
            Next
          </div>
        </div>
      </div>
      {part == 0 ? (
        <div
          className="w-[calc((100%-40px)/2)] fixed h-[35px] left-[10px] top-[101px] border-[2px] border-[#ffffff] bg-[#fff5ee] pl-[8px] rounded-[10px] flex justify-start items-center"
          //   style={{ transition: ".3s" }}
        >
          <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
            <span className=" flex justify-start items-center text-[#000000]">
              <BiRupee className="ml-[-3px] " /> 890.00
            </span>

            <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#00bb00] ">
              <FaLongArrowAltDown className="mb-[4px] mr-[5px] text-[15px]" />{" "}
              <BiRupee className="ml-[-3px] mb-[3px]" />
              9110
            </span>
          </span>
        </div>
      ) : part == 1 ? (
        <div
          className="w-[calc((100%-0px)/2)] fixed h-[35px] left-[10px] top-[132px] border-[2px] border-[#ffffff] bg-[#fff5ee] pl-[10px] flex justify-start items-center pt-0 rounded-[10px]"
          //   style={{ transition: ".3s" }}
        >
          <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center ">
            <Line
              percent={25}
              strokeWidth={6}
              trailColor="#b7b7b7"
              trailWidth={2}
              strokeColor={"" + (25 < 75 ? " #00bb00" : " #c43b31")}
              className="h-[4px]"
            />{" "}
            <span className="whitespace-nowrap flex justify-center items-center ml-[10px] cursor-pointer">
              <BiRupee className="ml-[-3px] " /> 10,000{" "}
              <span className="text-[#828282] ml-[4px] font-normal">
                [ Budget ]{" "}
              </span>
            </span>
          </span>
        </div>
      ) : part == 2 ? (
        <div
          className="w-[calc((100%-40px)/2)] fixed h-[40px] right-[10px] top-[129px] border-[2px] border-[#ffffff] bg-[#fff5ee] rounded-[10px] flex justify-end items-center pr-[9px]"
          //   style={{ transition: ".3s" }}
        >
          <span
            className="font-[google] font-normal text-[13px] text-[#828282] flex justify-end items-center cursor-pointer "
            // style={{ transitionDelay: ".4s" }}
          >
            Curr. Income{" "}
            <span className="text-[black] flex justify-end items-center ml-[6px]">
              <BiRupee className=" " />
              {"50,000"}
            </span>
          </span>
        </div>
      ) : part == 3 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[148px] left-[10px] top-[192px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px]"
          //   style={{ transition: ".3s" }}
        >
          <span className="text-[#828282] font-[google] font-normal text-[14px] w-full  flex justify-between h-[30px] items-start ">
            <div className="flex justify-start items-center">
              Transaction History,{" "}
              <span className=" ml-[4px] text-[black] cursor-pointer flex justify-start items-center">
                {"June"} - {2024}{" "}
                <MdKeyboardArrowDown className="text-[21px]" />
              </span>
            </div>
            <div className="w-[30px] h-full flex justify-end items-center text-black text-[14px]">
              <FaFilter />
            </div>
          </span>
          <span className=" w-full h-[100px] rounded-3xl border-[1px] border-[#ffe6d7] bg-[#ffe6d7]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black]">
            No Transactions done this Month
          </span>
        </div>
      ) : (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[80px] left-[10px] top-[332px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] "
          //   style={{ transition: ".3s" }}
        >
          <div className="w-full h-[60px]  px-[10px] font-[google] font-normal text-[15px] bg-[#ffeadc] rounded-3xl border-[1px] border-[#ffe6d7]  text-[#000000] cursor-pointer flex justify-center items-center">
            <div className="w-[30px]  flex justify-start items-center text-[20px] text-[#000000] ">
              <FiPlus />
            </div>
            <div className="w-[calc(100%-130px)]  ">Add New Transaction</div>
            <div className="w-[100px]  flex flex-col justify-center items-end">
              {/* <div className="text-[12px] text-[#b1b1b1]">{props?.date}</div>
        <div>{props?.amount} /-</div> */}
              <GoChevronRight className="text-[22px] text-[#000000]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
