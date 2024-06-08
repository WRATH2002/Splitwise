import React from "react";
import { BiRupee } from "react-icons/bi";
import { HiCheck } from "react-icons/hi";

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

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const IndividualReminder = (props) => {
  function monthName(data) {
    // console.log(props?.data);
    let arr = data.split("/");
    return monthsShort[parseInt(arr[1]) - 1];
  }
  function date(data) {
    let arr = data.split("/");
    return arr[0];
  }
  function formatAmountWithCommas(amountStr) {
    // Convert the string to a number
    const amount = parseFloat(amountStr);

    // Check if the conversion was successful
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }

    // Format the number with commas
    return amount.toLocaleString();
  }
  function getRemainingTime(dateString) {
    // Parse the input date string
    const [day, month, year] = dateString.split("/").map(Number);
    const targetDate = new Date(year, month - 1, day);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const diffTime = targetDate - currentDate;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Handle future dates
    if (diffDays > 0) {
      if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
      } else if (diffDays >= 7) {
        const diffWeeks = Math.floor(diffDays / 7);
        return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
      } else {
        return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
      }
    }
    // Handle past dates
    else {
      if (diffDays < -30) {
        const diffMonths = Math.floor(Math.abs(diffDays) / 30);
        return `due, ${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
      } else if (diffDays <= -7) {
        const diffWeeks = Math.floor(Math.abs(diffDays) / 7);
        return `due, ${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
      } else {
        const absDays = Math.abs(diffDays);
        return `due, ${absDays} day${absDays !== 1 ? "s" : ""}`;
      }
    }
  }

  return (
    <div
      className={
        "w-full min-h-[80px] my-[5px]  rounded-2xl flex font-[google] justify-center items-center font-normal border-[1px] border-[#ffe6d7]" +
        (getRemainingTime(props?.data?.Date).includes("due")
          ? " bg-[#ffa43c]"
          : " bg-[#ffddc5]")
      }
    >
      <div className="w-[50px] h-full flex flex-col justify-center items-center">
        <div className="text-[12px] text-[#000000]">
          {monthName(props?.data?.Date)}
        </div>
        <div className="text-black text-[20px] ">{date(props?.data?.Date)}</div>
      </div>
      <div
        className={
          "w-[calc(100%-150px)] h-[80px] bg-[#ffeadc] flex flex-col justify-center items-start px-[10px] " +
          (getRemainingTime(props?.data?.Date).includes("due")
            ? " bg-[#fec686] text-[#4a4a4a]"
            : " bg-[#ffddc5] text-[#6a6a6a]")
        }
      >
        <div className="text-[14px] leading-[19px]  line-clamp-2 w-full overflow-hidden text-ellipsis">
          {props?.data?.Lable}
        </div>
        <div className="text-black text-[17px] w-full flex justify-start items-center ">
          <BiRupee className="ml-[-3px]" />{" "}
          {formatAmountWithCommas(props?.data?.Amount)}
        </div>
      </div>
      <div
        className={
          "w-[100px] min-h-[80px] bg-[#ffeadc] flex flex-col justify-center items-end rounded-r-2xl pr-[15px]" +
          (getRemainingTime(props?.data?.Date).includes("due")
            ? " bg-[#fec686] text-[#fa690e]"
            : " bg-[#ffddc5] text-[#000000]")
        }
      >
        <div className="text-[13px] ">
          {getRemainingTime(props?.data?.Date)}
        </div>
        <div
          className={
            "text-white w-[30px] h-[30px] mt-[5px] rounded-full text-[18px] flex justify-center items-center cursor-pointer" +
            (getRemainingTime(props?.data?.Date).includes("due")
              ? " bg-[#f88239] "
              : " bg-[#de8544] ")
          }
          onClick={() => {
            // setApproveModal(true);
          }}
        >
          <HiCheck />
        </div>
      </div>
    </div>
  );
};

export default IndividualReminder;

// ff6666;
// ffb3b3;
