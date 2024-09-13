import React, { useEffect, useState } from "react";

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
import { BiRupee } from "react-icons/bi";
import { FaReceipt, FaShopify } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { HiMiniBell } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import { GiAutoRepair } from "react-icons/gi";
import { FaTruckMedical } from "react-icons/fa6";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import {
  MdElectricBolt,
  MdOutlineAirplanemodeActive,
  MdOutlinePets,
  MdSchool,
} from "react-icons/md";
import { HiShoppingBag } from "react-icons/hi2";
import { PiSealQuestionFill } from "react-icons/pi";
import { QRCode } from "react-qrcode";
import { LuArrowLeft, LuCornerDownRight } from "react-icons/lu";
import { QR } from "react-qr-rounded";
import { BigSizeIcon } from "./NornmalSizeIcon";
import { mirage } from "ldrs";
mirage.register();

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

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
  const [scanner, setScanner] = useState(false);
  const [showBill, setShowBill] = useState(false);

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

  const clipPath = `path(borderRadius ${20}px)`;

  // const handleDownload = (urlLink) => {
  //   const link = document.createElement("a");
  //   link.href = urlLink;
  //   link.download = "receipt.jpg"; // This forces the download and sets the default filename
  //   link.click();
  // };

  // const handleDownload = (url) => {
  //   const fileName = "bill";
  //   const aTag = document.createElement("a");
  //   aTag.href = url;
  //   aTag.setAttribute("download", fileName);
  //   document.body.appendChild(aTag);
  //   aTag.click();
  //   aTag.remove();
  // };

  return (
    <>
      {scanner && !showBill ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 flex justify-center items-center z-40 fixed p-[20px] bg-[#70708628] backdrop-blur-md">
            <div className="w-full h-[230px] flex justify-center items-center p-[30px] bg-white rounded-3xl drop-shadow-sm flex-col">
              <l-mirage size="60" speed="2.5" color="#181F32"></l-mirage>
              <span className="text-[17px] mt-[7px]">Scanning QR Code</span>
            </div>
          </div>
        </>
      ) : scanner && showBill ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 flex justify-center items-center z-40 fixed p-[20px] bg-[#70708628] backdrop-blur-md">
            <div
              className="w-[35px] h-[35px] rounded-full bg-[white] flex justify-center items-center fixed top-[20px] left-[20px]"
              onClick={() => {
                setShowBill(false);
                setScanner(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
            <img
              src={props?.data?.BillUrl}
              className="max-w-[100%] bg-[white] max-h-[100%] object-cover"
            ></img>
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="w-full fixed top-0 left-0 h-[100svh] p-[20px] flex flex-col justify-start items-start bg-[white] text-black font-[google] font-normal z-30">
        <div
          className=" h-[30px] fixed left-[20px] top-[20px] flex justify-start items-center"
          onClick={() => {
            props?.setShowMore(false);
          }}
        >
          <LuArrowLeft className="text-[24px] " />{" "}
        </div>
        <div className=" h-[30px] flex justify-start items-center mb-[20px]"></div>
        <div className="w-full h-[calc(100svh-50px)] flex flex-col justify-start items-start overflow-y-scroll overflow-x-hidden">
          <div
            className="w-full h-auto rounded-2xl flex flex-col justify-start items-start p-[20px]"
            style={{ backgroundColor: `${props?.UIColor}` }}
          >
            <div className="w-full h-auto flex justify-between items-center">
              <div className="w-full h-auto flex flex-col justify-start items-start">
                <span className="text-[25px] w-[90%] overflow-hidden text-ellipsis line-clamp-2 leading-7 ">
                  {props?.data?.Lable}
                </span>
                <span className="flex justify-start items-center mt-[-3px]">
                  <LuCornerDownRight className="text-[24px]" />{" "}
                  <span className="mt-[4px] ml-[3px]">
                    {props?.data?.Members?.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        {props?.data?.MoneyIsAdded ? (
                          <span className="text-[#00bb00]">Credited</span>
                        ) : (
                          <span className="text-[#e61d0f]">Debited</span>
                        )}{" "}
                        ,{" "}
                      </>
                    )}{" "}
                    <span className="text-[#6f6f6f]">
                      {/* {(props?.data?.Date).split("/")[0]}{" "}
                      {months[parseInt((props?.data?.Date).split("/")[1]) - 1]}{" "}
                      {(props?.data?.Date).split("/")[2]} */}
                      {props?.data?.TransactionType === "Split" ? (
                        <>Split</>
                      ) : (
                        <>Single</>
                      )}
                    </span>
                  </span>
                </span>

                {/* <span className="flex justify-start items-center mt-[3px]">
                Spent <BiRupee className="text-[20px] ml-[2px]" />{" "}
                <span className="text-[20px]">25,000.00</span>
              </span> */}
              </div>
              <div className="text-[55px]">
                <BigSizeIcon data={props?.data} />
              </div>
            </div>
            <div className="w-[calc(100%+70px)] h-auto flex justify-center items-center ml-[-35px] my-[5px]">
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
              <div className="w-full px-[5px]">
                <div className="w-full border-b-[2px] border-[#d1d1d1] border-dashed "></div>
              </div>
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
            </div>
            <div className="w-full h-auto flex flex-col justify-start items-start ">
              {/* <div className="w-[calc((100%-20px)/2)] h-[65px] rounded-2xl bg-transparent flex justify-center items-start flex-col pl-[0px] p-[15px]">
                <div className="text-[14px] text-[#00000085]">Date</div>
                <div className="text-[18px]">20/05/2024</div>
              </div>
              <div className="w-[calc((100%-20px)/2)] h-[65px] rounded-2xl bg-transparent flex justify-center items-start flex-col p-[15px]">
                <div className="text-[14px] text-[#00000085]">Category</div>
                <div className="text-[18px]">Food & Drinks</div>
              </div>
              <div className="w-[calc((100%-20px)/2)] h-[65px] rounded-2xl bg-transparent flex justify-center items-start flex-col pl-[0px] p-[15px]">
                <div className="text-[14px] text-[#00000085]">Amount</div>
                <div className="text-[18px]">3452.23</div>
              </div>
              <div className="w-[calc((100%-20px)/2)] h-[65px] rounded-2xl bg-transparent flex justify-center items-start flex-col p-[15px]">
                <div className="text-[14px] text-[#00000085]">Trn. Mode</div>
                <div className="text-[18px]">Online UPI</div>
              </div>
              <div className="w-[calc((100%-20px)/2)] h-[65px] rounded-2xl bg-transparent flex justify-center items-start flex-col pl-[0px] p-[15px]">
                <div className="text-[14px] text-[#00000085]">Trn. Type</div>
                <div className="text-[18px]">Normal</div>
              </div>
              <div className="w-[calc((100%-20px)/2)] h-auto rounded-2xl bg-transparent flex justify-center items-start flex-col p-[15px]">
                <QR
                  className="w-full aspect-square"
                  color="#000"
                  backgroundColor="#ebebf5"
                  rounding={100}
                  errorCorrectionLevel="L"
                >
                  {props?.data?.BillUrl}
                </QR>
              </div> */}
              <div className="w-full flex justify-start items-start h-auto">
                <div className="w-[60%] h-auto flex flex-col justify-start items-start text-[14px]">
                  <span className="mt-[5px] text-[14.5px] text-[#9a9a9a]">
                    Date
                  </span>
                  <span className="text-[#000000] mt-[-3px] text-[18px] mb-[10px]">
                    {props?.data?.Date}
                  </span>
                  <span className="mt-[1px] text-[14.5px] text-[#9a9a9a]">
                    Category
                  </span>
                  <span className="text-[#000000] mt-[-3px] text-[18px] mb-[10px]">
                    {props?.data?.Category}
                  </span>
                  <span className="mt-[1px] text-[14.5px] text-[#9a9a9a]">
                    Payment Mode
                  </span>
                  <span className="text-[#000000] mt-[-3px] text-[18px] mb-[10px]">
                    {props?.data?.Mode}
                  </span>
                  {/* <span className="mt-[5px] text-[#9a9a9a]">Payment Type</span>
                  <span className="text-[#000000] mt-[-3px] text-[18px] mb-[10px]">
                    {props?.data?.TransactionType === "Split" ? (
                      <>Split</>
                    ) : (
                      <>Single</>
                    )}
                  </span> */}

                  {props?.data?.TransactionType === "Split" ? (
                    <>
                      <span className="mt-[1px] text-[14.5px] text-[#9a9a9a]">
                        Splitted By
                      </span>
                      <span className="text-[#000000] mt-[-3px] text-[18px] mb-[10px]">
                        {props?.owner ? <>You</> : <>{name}</>}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="w-[40%] h-auto flex flex-col justify-start items-start">
                  <span
                    className="text-[15px] mb-[15px] flex justify-start mt-[5px] items-center"
                    onClick={() => {
                      setScanner(true);
                      setTimeout(() => {
                        setShowBill(true);
                      }, 2500);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-scan-line"
                    >
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                      <path d="M7 12h10" />
                    </svg>{" "}
                    <span className="ml-[5px]">Scan QR</span>
                  </span>
                  <QR
                    className="w-full aspect-square"
                    color="#000"
                    backgroundColor={props?.UIColor}
                    rounding={100}
                    errorCorrectionLevel="L"
                  >
                    {props?.data?.BillUrl}
                  </QR>
                  <a
                    className="w-full py-[8px] mt-[10px] text-[15px] rounded-[10px] flex justify-center items-center bg-[#191A2C] text-white"
                    // onClick={() => {
                    //   handleDownload(props?.data?.BillUrl);
                    // }}
                    target="_blank"
                    href={props?.data?.BillUrl}
                  >
                    <div className="mr-[10px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-download"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </div>{" "}
                    Download
                  </a>
                </div>
              </div>
              <div className="w-full h-auto mt-[20px] flex justify-evenly items-center py-[20px] rounded-2xl bg-[#ffffff] text-[#000000]">
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#a7a7a7]">Amount</span>
                  <span className="text-[20px] mt-[-4px]">
                    {formatAmountWithCommas(props?.data?.Amount)}
                  </span>
                </div>
                <div className="border border-[#f4f4f4] rounded-full h-[40px]"></div>
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#a7a7a7]">Date</span>
                  <span className="text-[20px] mt-[-4px]">
                    {props?.data?.Date}
                  </span>
                </div>
                <div className="border border-[#f4f4f4] rounded-full h-[40px]"></div>
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#a7a7a7]">Type</span>
                  <span className="text-[20px] mt-[-4px]">
                    {props?.data?.TransactionType === "Split" ? (
                      <>Split</>
                    ) : (
                      <>Single</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 
          <div className="w-full h-[300px] mt-[20px] rounded-2xl bg-[#F4F5F9] flex justify-center items-center p-[60px]">
            <QR
              className="h-full aspect-square"
              color="#000"
              backgroundColor="#ebebf5"
              rounding={100}
              errorCorrectionLevel="L"
            >
              {props?.data?.BillUrl}
            </QR>
          </div> */}

          {/* <div className="w-full h-[70px] mt-[20px] rounded-2xl bg-[#181F32] text-[white] font-[google] font-normal text-[18px] flex justify-center items-center p-[20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>{" "}
            &nbsp;&nbsp; Download Reciept
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AboutTransaction;
