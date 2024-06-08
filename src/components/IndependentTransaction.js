import React, { useState } from "react";
import { FaShopify } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { MdMedication, MdOutlineTravelExplore } from "react-icons/md";
import AboutTransaction from "./AboutTransaction";
import { HiReceiptRefund } from "react-icons/hi2";

const IndependentTransaction = (props) => {
  const [showTransaction, setShowTransaction] = useState(false);
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
    return `${dayWithSuffix}, ${monthName}, ${year}`;
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
        className="w-[calc(100%-40px)] min-h-[60px]  font-[google] font-normal text-[15px] text-white flex justify-center items-center border-b-[.7px] border-[#ffede2]"
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
        <div className="w-[calc(100%-130px)] px-[10px] text-black ">
          {props?.data?.Lable}
        </div>
        <div className="w-[100px]  flex flex-col justify-center items-end">
          <div className="text-[12px] text-[#828282]">
            {formatDate(props?.data?.Date)}
          </div>
          <div className="text-black">
            {formatAmountWithCommas(parseFloat(props?.data?.Amount))} /-
          </div>
        </div>
      </div>
    </>
  );
};

export default IndependentTransaction;
