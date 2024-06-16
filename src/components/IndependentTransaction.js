import React, { useEffect, useState } from "react";
import { FaShopify } from "react-icons/fa";
import { GiAutoRepair, GiPartyPopper } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { FaKitMedical, FaTruckMedical } from "react-icons/fa6";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import {
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
          ) : props?.data?.Category === "Grocery" ? (
            <HiShoppingBag />
          ) : props?.data?.Category === "Medical" ? (
            <FaTruckMedical />
          ) : props?.data?.Category === "Travel" ? (
            // <MdOutlineTravelExplore />
            // <PiMapPinLineFill />
            // <BiSolidPlaneTakeOff />
            <MdOutlineAirplanemodeActive className="rotate-45" />
          ) : props?.data?.Category === "Entertainment" ? (
            <GiPartyPopper />
          ) : props?.data?.Category === "Electricity Bill" ? (
            <MdElectricBolt />
          ) : props?.data?.Category === "Petrol / Diesel" ? (
            <BsFillFuelPumpFill />
          ) : props?.data?.Category === "Taxi Fare" ? (
            <BsTaxiFrontFill />
          ) : props?.data?.Category === "Car Maintanance" ? (
            <GiAutoRepair />
          ) : props?.data?.Category === "Education" ? (
            <MdSchool />
          ) : props?.data?.Category === "Pet Care" ? (
            <MdOutlinePets />
          ) : (
            <>
              <PiSealQuestionFill />
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
                : " text-[#c43b31]")
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
                <FiArrowUpRight className="text-[#c43b31] ml-[5px] text-[19px]" />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndependentTransaction;
