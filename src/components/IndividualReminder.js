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
            className="w-full h-[100svh]  flex flex-col justify-end items-center backdrop-blur-sm bg-[#68777b7a] p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
            // onClick={() => {
            //   setNotificationModal(false);
            // }}
          >
            <OutsideClickHandler
              onOutsideClick={() => {
                setApproveModal(false);
              }}
            >
              <div className="w-full flex flex-col justify-end items-start h-[40px]">
                <div className="w-full h-auto flex justify-start items-end z-30">
                  <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal   h-[40px] bg-[#ffffff] flex  justify-start items-end rounded-t-[22px] px-[20px]">
                    <span className="mt-[10px]">Dismiss Reminder</span>
                  </div>
                  <div className="h-[20px] aspect-square inRound"></div>
                  <div
                    className="h-[35px]  aspect-square rounded-full cursor-pointer bg-[#e4f2ff] ml-[-15px] mb-[5px] flex justify-center items-center text-[20px] "
                    onClick={() => {
                      setApproveModal(false);
                    }}
                  >
                    <HiOutlinePlus className="rotate-45" />
                  </div>
                </div>
              </div>
              <div
                className="w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]"
                style={{ zIndex: 100 }}
                onClick={() => {
                  // setNotificationModal(true);
                }}
              >
                {/* <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
                  Confirm{" "}
                  <span className="text-[#000000] ml-[5px]">Transaction</span>
                </span> */}

                <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap  ">
                  Have you done this transaction already. If you dismiss this
                  reminder, you will not be notified later. Do you really want
                  to dismiss this reminder ?
                </span>

                <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-center mt-[10px]">
                  {/* <span className="text-[22px] mr-[6px]">◍</span>{" "} */}
                  <span className="mr-[5px] text-[#000000]">Label :</span>{" "}
                  {props?.data?.Lable}
                </span>
                <span className="w-full text-[14px] text-[#000000] font-[google] mt-[0px] font-normal flex justify-start items-center ">
                  {/* <span className="text-[22px] mr-[6px]">◍</span>{" "} */}
                  <span className="mr-[5px] text-[#000000]">Amount :</span>{" "}
                  <BiRupee /> {formatAmountWithCommas(props?.data?.Amount)}
                </span>

                <span
                  className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-center whitespace-pre-wrap   cursor-pointer mt-[10px]"
                  onClick={() => {
                    setInclude(!include);
                    // setNewIncome("");
                    // setError("");
                  }}
                >
                  <div
                    className={
                      "w-[18px] h-[18px] rounded-md border-[1.5px] border-[#6bb7ff] mr-[6px]  flex justify-center items-center" +
                      (include ? " bg-[#6bb7ff]" : " bg-transparent")
                    }
                    // onClick={() => {
                    //   setInclude(!include);
                    //   // setNewIncome("");
                    //   // setError("");
                    // }}
                  >
                    {" "}
                    <HiCheck className="text-[#fff5ee]" />
                  </div>
                  <span>Include this transaction in Budget</span>
                </span>

                <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                  <div
                    className="h-full mr-[25px] flex justify-center items-center cursor-pointer  "
                    onClick={() => {
                      setApproveModal(false);
                      setInclude(false);
                      // setNewIncome("");
                      // setError("");
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className="h-full  flex justify-center items-center text-[#3aa0ff] cursor-pointer "
                    onClick={() => {
                      // updateIncome();
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
          "w-full min-h-[90px] mb-[5px]  rounded-2xl flex font-[google] justify-center items-center font-normal " +
          (getRemainingTime(props?.data?.Date).includes("due")
            ? " bg-[#181F32]"
            : " bg-[#181F32]")
        }
      >
        <div className="w-[60px] h-full flex flex-col justify-center items-center">
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
              ? " bg-[#F4F5F7] text-[#4a4a4a]"
              : " bg-[#F4F5F7] text-[#6a6a6a]")
          }
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
              ? " bg-[#F4F5F7] text-[#e61d0f]"
              : " bg-[#F4F5F7] text-[#000000]")
          }
        >
          <div className="text-[13px] ">
            {getRemainingTime(props?.data?.Date)}
          </div>
          <div
            className={
              "text-[#ffffff] w-[30px] h-[30px] mt-[5px] rounded-full text-[18px] flex justify-center items-center cursor-pointer" +
              (getRemainingTime(props?.data?.Date).includes("due")
                ? " bg-[#181F32] "
                : " bg-[#181F32] ")
            }
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
