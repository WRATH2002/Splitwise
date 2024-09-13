import React, { useEffect, useState } from "react";
import { FaShopify } from "react-icons/fa";
import { GiAutoRepair, GiPartyPopper } from "react-icons/gi";
import {
  IoFastFood,
  IoGitBranchOutline,
  IoGitMergeOutline,
  IoGitNetworkOutline,
} from "react-icons/io5";
import { FaKitMedical, FaTruckMedical } from "react-icons/fa6";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import {
  MdCallSplit,
  MdElectricBolt,
  MdMedication,
  MdOutlineAirplanemodeActive,
  MdOutlineModeOfTravel,
  MdOutlinePets,
  MdOutlineTravelExplore,
  MdSchool,
} from "react-icons/md";
import AboutTransaction from "./AboutTransaction";
import { HiReceiptRefund, HiShoppingBag } from "react-icons/hi2";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { BiRupee, BiSolidPlaneTakeOff } from "react-icons/bi";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import {
  QuerySnapshot,
  arrayUnion,
  onSnapshot,
  where,
} from "firebase/firestore";

import { PiMapPinLineFill, PiSealQuestionFill } from "react-icons/pi";
import { AiOutlineSwap } from "react-icons/ai";
import NornmalSizeIcon from "./NornmalSizeIcon";

const IndependentTransaction = (props) => {
  const [showTransaction, setShowTransaction] = useState(false);
  const [name, setName] = useState("");
  function formatDate(dateStr) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Split the input date string
    const [day, month, year] = dateStr.split("/").map(Number);

    // Function to get the ordinal suffix
    function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return "th"; // Handle 11th to 19th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    // Get the ordinal day
    const dayWithSuffix = day + getOrdinalSuffix(day);

    // Get the month name
    const monthName = months[month - 1];

    // Return the formatted string
    return `${monthName}, ${dayWithSuffix}`;
  }

  useEffect(() => {
    fetchName(props?.data?.Sender);
  }, [props?.data?.Sender]);

  function fetchName(ownerid) {
    const userRef = db.collection("Expense").doc(ownerid);
    onSnapshot(userRef, (snapshot) => {
      setName(snapshot?.data()?.Name);
    });
  }

  function formatAmountWithCommas(amountStr) {
    // Convert the string to a number
    const amount = parseFloat(amountStr);

    // Check if the conversion was successful
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }

    // Format the number with commas and ensure two decimal places
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function capitalizeFirstLetter(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      {showTransaction ? (
        <AboutTransaction
          data={props?.data}
          UIColor={props?.UIColor}
          // name={props?.name}
          // category={props?.category}
          // amount={props?.amount}
          // date={props?.date}
          // member={props?.member}
          // type={props?.type}
          setShowMore={setShowTransaction}
        />
      ) : (
        <></>
      )}
      <div
        className={
          "independentTran  w-[calc(100%-40px)] min-h-[60px] bg-[#ffffff]   px-[0px]  font-[google] font-normal text-[15px] text-white flex justify-center items-center  cursor-pointer " +
          (props?.index == 0 ? " border-none" : " border-t border-[#f9f9f9]")
        }
        // style={{
        //   border:
        //     props?.index == 0
        //       ? " 0px solid black"
        //       : ` 1px solid ${props?.UIColor}`,
        // }}
        onClick={() => {
          setShowTransaction(true);
        }}
      >
        {props?.data?.TransactionType == "Split" ? (
          <div
            className={
              "w-[30px] h-full flex justify-end items-center  z-10 mr-[-30px]  " +
              (props?.data?.MoneyIsAdded
                ? " text-[#00bb00]"
                : " text-[#e61d0f]")
            }
          >
            {/* <AiOutlineSwap /> */}
            <div className="bg-[#ffffff] mt-[20px] w-[16px] h-[16px] p-[1px] aspect-square rounded-lg flex justify-center items-center">
              {/* <IoGitBranchOutline /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-git-pull-request-arrow"
              >
                <circle cx="5" cy="6" r="3" />
                <path d="M5 9v12" />
                <circle cx="19" cy="18" r="3" />
                <path d="m15 9-3-3 3-3" />
                <path d="M12 6h5a2 2 0 0 1 2 2v7" />
              </svg>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="w-[30px] flex justify-start items-center text-[22px] text-[#000000] z-0 ">
          <NornmalSizeIcon data={props?.data} />
        </div>
        <div className="w-[calc(100%-130px)] h-full flex flex-col justify-center items-start px-[10px] text-black ">
          <span className="w-full overflow-hidden text-ellipsis line-clamp-1 text-[16px]">
            {props?.data?.Lable}
          </span>
          {props?.data?.Sender ? (
            <>
              <span className="w-full flex justify-start items-center text-[13px] text-[#00000057] ">
                By, {name}
              </span>
              {/* <div className="text-[12px] text-[#828282] w-full flex justify-start items-center">
                {formatDate(props?.data?.Date)}
              </div> */}
            </>
          ) : (
            <></>
          )}
          {/* <div className="text-[12px] text-[#828282] w-full flex justify-start items-center">
            {formatDate(props?.data?.Date)}
          </div> */}
        </div>
        <div className="w-[100px]  flex flex-col justify-center items-end">
          <div
            className={
              " flex justify-end items-center whitespace-nowrap text-[16px]" +
              (props?.data?.MoneyIsAdded
                ? " text-[#000000]"
                : " text-[#000000]")
            }
          >
            <BiRupee />
            {formatAmountWithCommas(parseFloat(props?.data?.Amount))}{" "}
            {props?.data?.MoneyIsAdded ? (
              <>
                <FiArrowDownLeft className="text-[#00bb00] ml-[2px] text-[19px] mr-[-3px]" />
              </>
            ) : (
              <>
                <FiArrowUpRight className="text-[#e61d0f] ml-[2px] text-[19px] mr-[-3px]" />
              </>
            )}
          </div>
          <div className="text-[13px] text-[#00000057]">
            {/* {props?.data?.Date} */}
            {formatDate(props?.data?.Date)}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndependentTransaction;
