import React, { useEffect, useState } from "react";
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
import { RxCross2 } from "react-icons/rx";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import {
  QuerySnapshot,
  arrayUnion,
  onSnapshot,
  where,
} from "firebase/firestore";

const MemberProfile = () => {
  return (
    <>
      <div className="bg-[#505050] rounded-full w-[calc((100%-50px)/6)] aspect-square ml-[10px] mb-[10px]"></div>
    </>
  );
};

const AboutTransaction = (props) => {
  const [section, setSection] = useState(1);
  const [showReciept, setShowReciept] = useState(false);
  const [duration, setDuration] = useState("");

  const [name, setName] = useState("");

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

  // const a = document.querySelector("#showBill");
  // a.addEventListener("click", function () {
  //   console.log("clicked");
  // });

  useEffect(() => {
    setDuration(calculateDuration(props?.data?.Date));
  }, [props?.data?.Date]);

  function calculateDuration(dateString) {
    // Parse the date string in the format "MM-DD-YYYY"
    const [day, month, year] = dateString.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day); // Month is 0-indexed
    console.log(inputDate);

    // Get the current date
    const currentDate = new Date();
    console.log(currentDate);

    // Calculate the difference in milliseconds
    const diffInMillis = currentDate - inputDate;

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

    // Convert days to years, months, weeks, and days
    const years = Math.floor(diffInDays / 365);
    const remainingDaysAfterYears = diffInDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30); // Approximate month duration
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30;
    const weeks = Math.floor(remainingDaysAfterMonths / 7);
    const days = remainingDaysAfterMonths % 7;

    // Return the duration as an object
    // console.log(diffInDays);
    if ((diffInDays / 365).toFixed(1) >= 1) {
      return (diffInDays / 365).toFixed(1) + " years ago";
    } else if ((diffInDays / 30).toFixed(1) >= 1) {
      return (diffInDays / 30).toFixed(0) + " months ago";
    } else if (Math.floor(diffInDays / 7) >= 1) {
      return Math.floor(diffInDays / 7) + " weeks ago";
    } else {
      return diffInDays + " days ago";
    }
  }
  function formatDateString(dateString) {
    // Parse the date string in the format "MM-DD-YYYY"
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-indexed for Date object

    // Array of month names
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

    // Function to get the day suffix
    function getDaySuffix(day) {
      if (day > 3 && day < 21) return "th"; // 4th to 20th
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

    // Get the formatted date string
    const dayWithSuffix = day + getDaySuffix(day);
    const monthName = monthNames[month - 1]; // Use month - 1 here
    const formattedDate = `${dayWithSuffix} ${monthName}, ${year}`;

    return formattedDate;
  }

  return (
    <>
      {showReciept ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 flex justify-center items-center z-40 fixed bg-[#1717177a] backdrop-blur-md">
            <div
              className="fixed top-[20px] left-[20px] rounded-full bg-[#171717] flex justify-center items-center"
              onClick={() => {
                setShowReciept(!showReciept);
              }}
            >
              <RxCross2 className="text-white text-[24px] " />
            </div>
            <img
              src="https://qph.cf2.quoracdn.net/main-qimg-e68b4c3d6705f994907bb86a1b6a5803-lq"
              className="max-w-[calc(100%-40px)] max-h-[calc(100%-40px)] w-full object-cover"
            ></img>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-[100svh] fixed top-0 left-0 flex justify-start items-center flex-col p-[20px] bg-[#FFF5EE] z-30">
        <div className="w-full h-[40px] flex justify-between items-center">
          <div
            className="w-[40px] aspect-square flex justify-start items-center cursor-pointer"
            onClick={() => {
              props?.setShowMore(false);
            }}
          >
            <FiArrowLeft className="text-[black] text-[23px]" />
          </div>
          <div
            className="w-[40px] aspect-square flex justify-end items-center cursor-pointer"
            onClick={() => {
              // props?.setShowMore(false);
            }}
          >
            <HiMiniBell className="text-[#000000] text-[23px]" />
          </div>
        </div>

        <div className="w-full h-[60px] flex justify-center items-center text-[#de8544] text-[55px]">
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
            <></>
          )}
          {/* <IoFastFood className="text-[55px] text-[#98d832]" /> */}
        </div>
        <div className="font-[google] font-normal h-[50px]  text-black mt-[15px] text-[24px] w-full flex flex-col justify-center items-center">
          <span>{props?.data?.Lable}</span>
          <span className="text-[15px] text-[#828282]">
            {props?.data?.TransactionType === "Normal" ? (
              <></>
            ) : (
              <>{props?.data?.MemberCount} members,</>
            )}{" "}
            {duration}
          </span>
        </div>
        {/* <div className="w-full border-[.7px] border-[#fee6d7] my-[30px]"></div> */}
        {/* <div className="w-[260px] h-[1.5px] bg-gradient-to-r from-[#2a2a2a]  via-[#caff76] via-50% to-[#2a2a2a] mb-[-1.5px] z-50 "></div> */}
        {/* <div className="w-full h-[100px] mb-[-100px] flex justify-center items-start bg-[#282828] rounded-2xl ">
          <div className="min-w-[80px] min-h-[40px] rounded-b-full bg-[#41f6ea]"></div>
        </div> */}
        <div className="w-full h-[100px] mt-[30px] flex justify-between bg-[#ffeadc] border-[1px] border-[#ffe6d7] items-start  backdrop-blur-2xl rounded-2xl p-[20px]  ">
          <div
            className={
              " flex flex-col justify-center " +
              (props?.data?.TransactionType === "Single"
                ? " items-center w-full"
                : " items-start w-[calc(100%/2)]")
            }
          >
            <span className=" flex justify-center items-center text-[14px] text-[#828282] font-[google] font-normal">
              {props?.data?.TransactionType === "Single" ? (
                <span className=" ">Total Expense</span>
              ) : (
                <span className=" ">Paid to You</span>
              )}
            </span>
            <span
              className={
                " font-[google] font-normal text-[26px]  flex justify-start items-center" +
                (props?.data?.MoneyIsAdded
                  ? " text-[#00bb00]"
                  : " text-[#de8544]")
              }
            >
              <BiRupee className="ml-[-3px] " />{" "}
              {formatAmountWithCommas(parseFloat(props?.data?.Amount))}
            </span>
          </div>
          {props?.data?.TransactionType === "Split" ? (
            <div
              className={
                " flex flex-col justify-center " +
                (props?.data?.TransactionType === "Single"
                  ? " items-end w-full"
                  : " items-end w-[calc(100%/2)]")
              }
            >
              <span className=" flex justify-center items-center text-[14px] text-[#828282] font-[google] font-normal">
                <span className=" ">Total Expense</span>
              </span>
              <span className=" font-[google] font-normal text-[26px] text-[#000000] flex justify-start items-center">
                <BiRupee className="ml-[-3px] " />{" "}
                {/* {formatAmountWithCommas(parseFloat(props?.data?.TotalAmount))} */}
              </span>
            </div>
          ) : (
            <></>
          )}
          {/* <div className="w-[calc(100%/2)] flex flex-col justify-center items-end">
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
          </div> */}
        </div>
        <div className="font-[google] font-normal  text-black mt-[15px]  w-full flex flex-col justify-center items-start text-[15px]">
          <span className="text-[16px] w-full flex justify-start items-center h-[40px]">
            <span
              className="text-black h-full w-[calc(100%/2)] flex justify-start items-center  " // {
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
                <span className="text-black ">
                  {formatDateString(props?.data?.Date)}
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Category </span>{" "}
                <span className="text-black ">{props?.data?.Category}</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Total Transaction </span>{" "}
                <span className="text-black flex justify-end items-center">
                  <BiRupee className="" />{" "}
                  {formatAmountWithCommas(parseFloat(props?.data?.Amount))}
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Mode of Transaction </span>{" "}
                <span className="text-black flex justify-end items-center">
                  {props?.data?.Mode}
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Payment Type </span>{" "}
                <span className="text-black ">
                  {props?.data?.TransactionType === "Single" ? (
                    <>{props?.data?.TransactionType}</>
                  ) : (
                    <>{props?.data?.TransactionType}</>
                  )}
                </span>
              </span>
              {props?.data?.TransactionType === "Split" ? (
                <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                  <span>Total Member </span>{" "}
                  <span className="text-black ">
                    {props?.data?.MemberCount}
                  </span>
                </span>
              ) : (
                <></>
              )}
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                {props?.data?.TransactionType === "Single" ? (
                  <></>
                ) : (
                  <>
                    <span>Payment Done By </span>{" "}
                    <span className="text-black ">{name}</span>
                  </>
                )}
              </span>
              <div
                className="w-full h-[60px] rounded-2xl bg-[#ffeadc] border-[1px] border-[#ffe6d7] cursor-pointer mt-[20px] flex justify-between items-center text-[14px] text-black px-[20px]"
                onClick={() => {
                  setShowReciept(!showReciept);
                }}
              >
                <div className="flex justify-start items-center">
                  <FaReceipt className="text-[20px] mr-[9px]" /> View Reciept /
                  Bill
                </div>
                <div>
                  <LuChevronRight className="text-[20px] " />
                </div>
              </div>
              {/* <div className="w-full mt-[30px] flex flex-col justify-start items-center">
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
                </div> */}
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

export default AboutTransaction;
