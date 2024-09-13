import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { GoAlertFill } from "react-icons/go";
import { HiCheck } from "react-icons/hi";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";
import OutsideClickHandler from "react-outside-click-handler";
import { HiOutlinePlus } from "react-icons/hi2";

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
  const [aprroveModal, setApproveModal] = useState(false);
  const [include, setInclude] = useState(false);

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
        const diffWeeks = Math.round(diffDays / 7);
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
        const diffWeeks = Math.round(Math.abs(diffDays) / 7);
        return `due, ${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
      } else {
        const absDays = Math.abs(diffDays);
        return `due, ${absDays} day${absDays !== 1 ? "s" : ""}`;
      }
    }
  }

  function deleteReminder() {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user?.uid)
      .update({
        // Reminders : arrayRemove({props?.data})
        Reminders: arrayRemove({
          Lable: props?.data?.Lable,
          Date: props?.data?.Date,
          Amount: props?.data?.Amount,
          TransactionType: props?.data?.TransactionType,
          Members: props?.data?.Members,
          Category: props?.data?.Category,
          Mode: props?.data?.Mode,
          BillUrl: props?.data?.BillUrl,
        }),
      });

    if (include) {
      db.collection("Expense")
        .doc(user?.uid)
        .update({
          NormalTransaction: arrayUnion({
            Lable: props?.data?.Lable,
            Date: props?.data?.Date,
            Amount: props?.data?.Amount,
            TransactionType: props?.data?.TransactionType,
            Members: props?.data?.Members,
            Category: props?.data?.Category,
            Mode: props?.data?.Mode,
            BillUrl: props?.data?.BillUrl,
          }),
        });
    }

    // console.log(
    //   props?.data?.Lable,
    //   props?.data?.Date,
    //   props?.data?.Amount,
    //   props?.data?.Category,
    //   props?.data?.BillUrl,
    //   props?.data?.Mode,
    //   props?.data?.TransactionType,
    //   props?.data?.Members
    // );

    setInclude(false);
  }

  return (
    <>
      {aprroveModal ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
          >
            <OutsideClickHandler
              onOutsideClick={() => {
                setApproveModal(false);
              }}
            >
              <div
                className="w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]"
                style={{ zIndex: 100 }}
              >
                <span className="text-[22px]  mb-[10px]">Dismiss Reminder</span>

                <span className="w-full text-[14.5px] text-[#000000a9] mt-[5px] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap  ">
                  Have you already completed this transaction? If you dismiss
                  this reminder, you will not receive any further notifications.
                  Are you sure you want to proceed with dismissing it?
                </span>
                <span
                  className="w-full text-[14.5px] text-[#000000a9] font-[google] font-normal flex justify-start items-center whitespace-pre-wrap   cursor-pointer mt-[10px]"
                  onClick={() => {
                    setInclude(!include);
                  }}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-md  mr-[6px]  flex justify-center items-center"
                    style={{
                      border: `1.5px solid ${props?.UIIndex}`,
                      backgroundColor: include ? `${props?.UIIndex}` : " white",
                    }}
                  >
                    <HiCheck
                      className={
                        "" + (include ? " text-[#ffffff]" : " text-[#ffffff]")
                      }
                    />
                  </div>
                  <span>Include this transaction in Budget</span>
                </span>

                <div className="w-full h-auto mt-[20px] flex justify-end items-end">
                  <div
                    className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
                    onClick={() => {
                      setApproveModal(false);
                      setInclude(false);
                    }}
                    style={{ backgroundColor: `${props?.UIColor} ` }}
                  >
                    Close
                  </div>
                  <div
                    className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                    onClick={() => {
                      deleteReminder();
                      setApproveModal(false);
                    }}
                  >
                    Confirm
                  </div>
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        </>
      ) : (
        <></>
      )}

      <div
        className={
          "w-full min-h-[90px] mb-[5px]  rounded-2xl flex font-[google] justify-center items-center font-normal "
        }
      >
        <div
          className="w-[60px] h-full flex flex-col justify-center items-center rounded-l-2xl"
          style={{ backgroundColor: `#191A2C` }}
        >
          <div className="text-[12px] text-[#ffffff]">
            {monthName(props?.data?.Date)}
          </div>
          <div className="text-white text-[20px] ">
            {date(props?.data?.Date)}
          </div>
        </div>
        <div
          className={
            "w-[calc(100%-160px)] h-full flex flex-col justify-center items-start px-[10px] " +
            (getRemainingTime(props?.data?.Date).includes("due")
              ? " text-[#4a4a4a]"
              : " text-[#6a6a6a]")
          }
          style={{
            backgroundColor: `${props?.UIColor}`,
          }}
        >
          <div className="text-[14px] leading-[19px]  line-clamp-2 w-full overflow-hidden text-black text-ellipsis">
            {props?.data?.Lable}
          </div>
          <div className="text-black text-[17px] w-full flex justify-start items-center ">
            <BiRupee className="ml-[-3px]" />{" "}
            {formatAmountWithCommas(props?.data?.Amount)}
          </div>
        </div>
        <div
          className={
            "w-[100px] h-full flex flex-col justify-center items-end rounded-r-2xl pr-[15px]" +
            (getRemainingTime(props?.data?.Date).includes("due")
              ? " text-[#e61d0f]"
              : " text-[#000000]")
          }
          style={{
            backgroundColor: `${props?.UIColor}`,
          }}
        >
          <div className="text-[13px] ">
            {getRemainingTime(props?.data?.Date)}
          </div>
          <div
            className={
              "text-[#ffffff] w-[30px] h-[30px] mt-[5px] rounded-full text-[18px] flex justify-center items-center cursor-pointer"
            }
            style={{ backgroundColor: `#191A2C` }}
            onClick={() => {
              setApproveModal(true);
            }}
          >
            <HiCheck />
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualReminder;

// ff6666;
// ffb3b3;
