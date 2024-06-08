import React, { useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaReceipt, FaShopify } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { HiMiniBell } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import {
  MdCallSplit,
  MdMedication,
  MdOutlineTravelExplore,
} from "react-icons/md";

const MemberProfile = () => {
  return (
    <>
      <div className="bg-[#505050] rounded-full w-[calc((100%-50px)/6)] aspect-square ml-[10px] mb-[10px]"></div>
    </>
  );
};

export const MoreAboutTransaction = (props) => {
  const [section, setSection] = useState(1);
  return (
    <>
      <div className="w-full h-[100svh] fixed top-0 left-0 flex justify-start items-center flex-col p-[20px] bg-[#171717] z-30">
        <div className="w-full h-[40px] flex justify-between items-center">
          <div
            className="w-[40px] aspect-square flex justify-start items-center"
            onClick={() => {
              props?.setShowMore(false);
            }}
          >
            <FiArrowLeft className="text-[white] text-[23px]" />
          </div>
          <div
            className="w-[40px] aspect-square flex justify-end items-center"
            onClick={() => {
              // props?.setShowMore(false);
            }}
          >
            <HiMiniBell className="text-[white] text-[23px]" />
          </div>
        </div>

        <div className="w-full h-[60px] flex justify-center items-center">
          <IoFastFood className="text-[55px] text-[#98d832]" />
        </div>
        <div className="font-[google] font-normal h-[50px]  text-white mt-[15px] text-[24px] w-full flex flex-col justify-center items-center">
          <span>Aminia - Chicken Roll Party</span>
          <span className="text-[15px] text-[#828282]">
            8 members, 2 months ago
          </span>
        </div>
        <div className="w-full border-[.7px] border-[#3d3d3d] my-[30px]"></div>
        <div className="w-full flex justify-between items-start bg-[#282828] rounded-2xl p-[20px]">
          <div className="w-[calc(100%/2)] flex flex-col justify-center items-start">
            <span className=" flex justify-center items-center text-[12px] text-[#828282]">
              <span className="text-white ">Total Expense</span>
            </span>
            <span className=" font-[google] font-normal text-[22px] text-[#ffffff] flex justify-start items-center">
              <BiRupee className="ml-[-3px] " /> 3450
            </span>
          </div>
          <div className="w-[calc(100%/2)] flex flex-col justify-center items-end">
            <span className=" flex justify-center items-center text-[12px] text-[#ffffff]">
              <span className=" ">Remaining</span>
            </span>
            <span className=" font-[google] font-normal text-[22px] text-[#ff6c00] flex justify-start items-center">
              <BiRupee className="ml-[-3px] " /> 345 /{" "}
              <span className="text-[#828282] ml-[5px]">3000</span>
            </span>
            <span className="font-[google] font-normal text-[13px] text-[#828282] flex justify-end items-center">
              Per Person{" "}
              <span className="text-white flex justify-end items-center ml-[6px]">
                <BiRupee className=" " />
                345
              </span>
            </span>
          </div>
        </div>
        <div className="font-[google] font-normal  text-white mt-[15px]  w-full flex flex-col justify-center items-start text-[15px]">
          <span className="text-[16px] w-full flex justify-start items-center h-[40px]">
            <span
              className="text-white h-full w-[calc(100%/2)] flex justify-start items-center  " // {
              //   + (section === 1 ? " border-b-[1px] border-[#98d832]" : " border-b-[1px] border-transparent")
              // }
              onClick={() => {
                setSection(1);
              }}
            >
              Transaction Details :
            </span>
            {/* <span
              className={
                "text-white h-full w-[calc(100%/2)] flex justify-end items-center border-b-[1px]" +
                (section === 2 ? " border-[#98d832]" : " border-transparent")
              }
              onClick={() => {
                setSection(2);
              }}
            >
              Bill Info
            </span> */}
          </span>
          {section === 1 ? (
            <>
              <span className=" text-[#828282] text-[14px] w-full flex justify-between items-center mt-[10px]">
                <span>Date </span>{" "}
                <span className="text-white ">28th December, 2024</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Category </span>{" "}
                <span className="text-white ">Food & Drinks</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Total Transaction </span>{" "}
                <span className="text-white flex justify-end items-center">
                  <BiRupee className="" /> 3,450
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Payment Method </span>{" "}
                <span className="text-white ">Online UPI</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Payment Done By </span>{" "}
                <span className="text-white ">You</span>
              </span>
              <div className="w-full h-[60px] rounded-2xl bg-[#282828] cursor-pointer mt-[20px] flex justify-between items-center text-[14px] text-white px-[20px]">
                <div className="flex justify-start items-center">
                  <FaReceipt className="text-[20px] mr-[9px]" /> View Reciept /
                  Bill
                </div>
                <div>
                  <LuChevronRight className="text-[20px] " />
                </div>
              </div>
              <div className="w-full mt-[30px] flex flex-col justify-start items-center">
                <span className="w-full flex justify-start items-center">
                  Member's Owed
                </span>
                <div className="w-full flex justify-start flex-wrap conta mt-[20px]">
                  <MemberProfile />
                  <MemberProfile />
                  <MemberProfile />
                  <MemberProfile />
                  <MemberProfile />
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src="https://media-cdn.tripadvisor.com/media/photo-l/12/e6/36/67/receipt.jpg"
                className="w-[100px] h-[100px] rounded-2xl object-cover mt-[30px]"
              ></img>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const SplitTransaction = (props) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {showMore ? (
        <MoreAboutTransaction showMore={showMore} setShowMore={setShowMore} />
      ) : (
        <></>
      )}
      <div
        className="w-full h-[55px]  font-[google] font-normal text-[15px] flex justify-center items-center px-[20px]"
        onClick={() => {
          setShowMore(true);
        }}
      >
        <div className="w-[30px] flex justify-start items-center text-[22px] ">
          {props?.return ? (
            <MdCallSplit
              className={
                "" + (props?.status ? " text-[#98d832]" : " text-[#828282]")
              }
            />
          ) : (
            <MdCallSplit
              className={
                "" + (props?.status ? " text-[#ff6c00]" : " text-[#828282]")
              }
            />
          )}
        </div>
        <div
          className={
            "w-[calc(100%-130px)] px-[10px] flex flex-col justify-center items-start " +
            (props?.status ? " text-white" : " text-[#828282]")
          }
        >
          <span>{props?.name}</span>
          <span className="text-[12px] text-[#828282]">
            {props?.member} Members
          </span>
        </div>
        <div
          className={
            "w-[100px]  flex flex-col justify-center items-end" +
            (props?.status ? " text-white" : " text-[#828282]")
          }
        >
          <div className="text-[12px] text-[#828282]">{props?.date}</div>
          <div>{props?.amount} /-</div>
        </div>
      </div>
    </>
  );
};

export default SplitTransaction;
