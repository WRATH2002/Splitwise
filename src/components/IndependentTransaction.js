import React, { useEffect, useState } from "react";
import { FaShopify } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { MdMedication, MdOutlineTravelExplore } from "react-icons/md";
import AboutTransaction from "./AboutTransaction";
import { HiReceiptRefund } from "react-icons/hi2";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import {
  QuerySnapshot,
  arrayUnion,
  onSnapshot,
  where,
} from "firebase/firestore";

const IndependentTransaction = (props) => {
  const [showTransaction, setShowTransaction] = useState(false);
  const [name, setName] = useState("");
  function formatDate(dateStr) {
    const months = [
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
    return `${dayWithSuffix} ${monthName}, ${year}`;
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

  return (
    <>
      {showTransaction ? (
        <AboutTransaction
          data={props?.data}
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
        className="w-[calc(100%-40px)] min-h-[60px]  font-[google] font-normal text-[15px] text-white flex justify-center items-center border-b-[.7px] border-[#ffede2] cursor-pointer hover:bg-[#fff0e6]"
        onClick={() => {
          setShowTransaction(true);
        }}
      >
        <div className="w-[30px] flex justify-start items-center text-[22px] text-[#de8544]">
          {props?.data?.Category === "Food & Drinks" ? (
            <IoFastFood />
          ) : props?.data?.Category === "Shopping" ? (
            <FaShopify />
          ) : props?.data?.Category === "Medical" ? (
            <MdMedication />
          ) : props?.data?.Category === "Travel" ? (
            <MdOutlineTravelExplore />
          ) : props?.data?.Category === "Entertainment" ? (
            <GiPartyPopper />
          ) : (
            <>
              <HiReceiptRefund />{" "}
            </>
          )}
        </div>
        <div className="w-[calc(100%-130px)] h-full flex flex-col justify-center items-start px-[10px] text-black ">
          <span className="w-full overflow-hidden text-ellipsis line-clamp-1">
            {props?.data?.Lable}
          </span>
          {props?.data?.Sender ? (
            <>
              <span className="w-full flex justify-start items-center text-[14px] text-[#828282] ">
                By, {name}
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="w-[100px]  flex flex-col justify-center items-end">
          <div className="text-[12px] text-[#828282]">
            {formatDate(props?.data?.Date)}
          </div>
          <div
            className={
              " flex justify-end items-center whitespace-nowrap " +
              (props?.data?.MoneyIsAdded
                ? " text-[#00bb00]"
                : " text-[#de8544]")
            }
          >
            <BiRupee />
            {formatAmountWithCommas(parseFloat(props?.data?.Amount))}{" "}
            {props?.data?.MoneyIsAdded ? (
              <>
                <FiArrowDownLeft className="text-[#00bb00] ml-[5px] text-[19px]" />
              </>
            ) : (
              <>
                <FiArrowUpRight className="text-[#de8544] ml-[5px] text-[19px]" />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndependentTransaction;
