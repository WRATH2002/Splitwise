import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaCheckCircle, FaReceipt, FaShopify } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { HiMiniBell } from "react-icons/hi2";
import { IoFastFood, IoGitNetworkOutline } from "react-icons/io5";
import { LuArrowLeft, LuChevronRight, LuCornerDownRight } from "react-icons/lu";
import {
  MdCall,
  MdCallSplit,
  MdMedication,
  MdOutlineTravelExplore,
} from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import {
  QuerySnapshot,
  arrayRemove,
  arrayUnion,
  onSnapshot,
  where,
} from "firebase/firestore";
import {
  IoIosCard,
  IoIosCheckmarkCircle,
  IoMdCall,
  IoMdInformationCircle,
} from "react-icons/io";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
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
import { QR } from "react-qr-rounded";
import { RxPerson } from "react-icons/rx";
import { TbClockFilled } from "react-icons/tb";

const MemberProfile = (props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tempIsPaid, setTempIsPaid] = useState(false);

  useEffect(() => {
    fetchName(props?.userId);
    console.log(props?.isPaid);
  }, []);

  function fetchName(ownerid) {
    const userRef = db.collection("Expense").doc(ownerid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setName(snapshot?.data()?.Name);
      setPhone(snapshot?.data()?.Phone);
    });
  }

  function havePaid() {
    const user = firebase.auth().currentUser;
    let res = props?.usersPaid?.reduce((acc, users) => {
      if (users?.Owner == props?.userId) {
        acc = 1;
      } else if (users?.Sender === props?.userId) {
        acc = 1;
      }

      return acc;
    }, 0);

    if (res === 1) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    let result;
    // const user = firebase.auth().currentUser;
    if (props?.userId === props?.owner) {
      result = true;
    } else {
      result = havePaid();
    }

    // console.log(result);

    // props?.setIsPaid(result);
    setTempIsPaid(result);
  }, [props?.userId, props?.usersPaid]);
  return (
    <>
      <div
        className="w-full flex justify-start items-center mt-[5px]"
        onClick={() => {
          props?.setNotificationModal(!props?.notificationModal);
          props?.setIsPaid(tempIsPaid);
          props?.setNotName(name);
        }}
      >
        <div className="w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center text-[24px] ">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-[15px] w-[calc(100%-65px)] flex justify-between items-center">
          <div className="w-auto flex flex-col justify-center items-start">
            <span className="text-[16px]">{name}</span>
            <span className="text-[14px] text-[#6f6f6f] mt-[-3px] flex justify-start items-center">
              <IoMdCall className="text-[14px] mr-[4px]" /> {phone}
            </span>
          </div>
          <div className="w-auto rounded-2xl  flex justify-end items-center text-[14px] ">
            {props?.isOwner ? (
              <>
                {tempIsPaid ? (
                  <>
                    Paid{" "}
                    <IoIosCheckmarkCircle className="text-[16px] ml-[5px] text-[#00bb00] z-40" />
                  </>
                ) : (
                  <>
                    Pending{" "}
                    <TbClockFilled className="text-[16px] ml-[5px] text-[#e61d0f] z-40" />{" "}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
const paymentName = ["Online UPI", "Credit/Debit Card", "Cash"];
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

export const MoreAboutTransaction = (props) => {
  const [section, setSection] = useState(1);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("");
  const [normalTransaction, setNormalTransaction] = useState([]);
  const [splitRemaining, setSplitRemaining] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notName, setNotName] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  useEffect(() => {
    fetchName(props?.data?.Owner);
    fetchNormalTransaction();
  }, []);

  useEffect(() => {
    getSameSplitTransaction();
  }, [normalTransaction]);

  function fetchName(ownerid) {
    const userRef = db.collection("Expense").doc(ownerid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setName(snapshot?.data()?.Name);
    });
  }

  function calculateDuration(dateString) {
    // Parse the date string in the format "MM-DD-YYYY"
    const [day, month, year] = dateString.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day); // Month is 0-indexed
    // console.log(inputDate);

    // Get the current date
    const currentDate = new Date();
    // console.log(currentDate);

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

  function addToTransaction() {
    const user = firebase.auth().currentUser;
    const presentDate =
      new Date().getDate() +
      "/" +
      (parseInt(new Date().getMonth()) + parseInt(1)) +
      "/" +
      new Date().getFullYear();
    db.collection("Expense")
      .doc(props?.data?.Owner)
      .update({
        NormalTransaction: arrayUnion({
          Amount: (
            parseFloat(props?.data?.Amount) / parseInt(props?.data?.MemberCount)
          )
            .toFixed(2)
            .toString(),
          TotalAmount: props?.data?.Amount,
          BillUrl: props?.data?.BillUrl,
          Category: props?.data?.Category,
          Date: presentDate,
          SplitDate: props?.data?.Date,
          Lable: "Split Ref : " + props?.data?.Lable,
          MemberCount: props?.data?.MemberCount,
          Members: props?.data?.Members,
          Mode: mode,
          Owner: props?.data?.Owner,
          TransactionType: props?.data?.TransactionType,
          MoneyIsAdded: true,
          Sender: user.uid,
        }),
      });

    db.collection("Expense")
      .doc(user.uid)
      .update({
        NormalTransaction: arrayUnion({
          Amount: (
            parseFloat(props?.data?.Amount) / parseInt(props?.data?.MemberCount)
          )
            .toFixed(2)
            .toString(),
          TotalAmount: props?.data?.Amount,
          BillUrl: props?.data?.BillUrl,
          Category: props?.data?.Category,
          Date: presentDate,
          SplitDate: props?.data?.Date,
          Lable: "Split Paid : " + props?.data?.Lable,
          MemberCount: props?.data?.MemberCount,
          Members: props?.data?.Members,
          Mode: mode,
          Owner: props?.data?.Owner,
          TransactionType: props?.data?.TransactionType,
          MoneyIsAdded: false,
          Sender: user.uid,
        }),
      });

    // const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user.uid)
      .update({
        SplitTransaction: arrayRemove(props?.data),
      });

    db.collection("Expense")
      .doc(user.uid)
      .update({
        SplitTransaction: arrayUnion({
          Amount: props?.data?.Amount,
          // TotalAmount: props?.data?.Amount,
          BillUrl: props?.data?.BillUrl,
          Category: props?.data?.Category,
          Date: props?.data?.Date,
          // SplitDate: props?.data?.Date,
          Lable: props?.data?.Lable,
          MemberCount: props?.data?.MemberCount,
          Members: props?.data?.Members,
          Mode: mode,
          Owner: props?.data?.Owner,
          TransactionType: props?.data?.TransactionType,
          // MoneyIsAdded: false,
          // Sender: user.uid,
          Paid: true,
        }),
      });

    props?.setShowMore(false);

    setMode("");
  }

  function getSameSplitTransaction() {
    let newArr = normalTransaction?.filter((data) => {
      // console.log((data?.Lable).slice(12));
      if (
        data?.TotalAmount == props?.data?.Amount &&
        data?.BillUrl == props?.data?.BillUrl &&
        data?.Category == props?.data?.Category &&
        data?.SplitDate == props?.data?.Date &&
        (data?.Lable).slice(12) == props?.data?.Lable &&
        data?.MemberCount == props?.data?.MemberCount &&
        // data?.Members == props?.data?.Members &&
        // data?.Mode == props?.data?.Mode &&
        data?.Owner == props?.data?.Owner &&
        data?.TransactionType == props?.data?.TransactionType
      ) {
        return data;
      }
    });

    // console.log("newArr");
    // console.log(newArr);
    // console.log(newArr.length);
    setSplitRemaining(newArr);
  }

  function fetchNormalTransaction() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setNormalTransaction(snapshot?.data()?.NormalTransaction);
      // setIncome(snapshot?.data()?.TotalIncome);
      // console.log(snapshot?.data()?.Online);
    });
  }

  return (
    <>
      {confirmModal ? (
        <div className="w-full h-[100svh] fixed z-50 bg-[#70708628] p-[20px] top-0 left-0 flex justify-center items-center backdrop-blur-md">
          <div className="w-full h-auto p-[30px] py-[23px] bg-[#ffffff] rounded-3xl flex flex-col justify-center items-start">
            <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
              Confirm Transaction
              {/* <span className="text-[#de8544] ml-[10px]">Transaction</span> */}
            </span>

            <span className="w-full text-[14px] text-[#0000007e] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[10px]  ">
              Are you sure you want to proceed? Once confirmed, the owner will
              be notified of your transaction. Have you already paid your share
              of the bill?
            </span>

            {/* <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center mt-[10px]">
              <span className="mr-[5px] text-[#000000]">Label :</span>{" "}
              {props?.data?.Lable}
            </span>
            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center ">
              <span className="mr-[5px] text-[#000000]">Expense :</span>{" "}
              <BiRupee /> {formatAmountWithCommas(props?.data?.Amount)}
            </span>
            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center ">
              <span className="mr-[5px] text-[#000000]">To Pay :</span>{" "}
              <BiRupee />{" "}
              {formatAmountWithCommas(
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2)
              )}
            </span> */}
            <span
              className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-center whitespace-pre-wrap   cursor-pointer mt-[10px]"
              onClick={() => {
                // setInclude(!include);
              }}
            >
              <div
                className="w-full flex flex-col justify-start items-start"
                // onClick={() => {
                //   setInclude(!include);
                //   // setNewIncome("");
                //   // setError("");
                // }}
              >
                <span className="font-[google] font-normal mb-[10px] mt-[10px]">
                  Select a Payment Mode
                </span>
                <div className="flex flex-col justify-end items-start  w-full h-0 ">
                  <div
                    className={
                      "w-[calc(100%-100px)] rounded-xl mt-[5px] h-[150px] mb-[5px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start  border border-[#ebe6ff] bg-[#ece9f5] p-[15px] py-[9px] left-[50px]" +
                      (categoryDropdown ? " flex" : " hidden")
                    }
                  >
                    {/* <div className="w-full py-[6px] flex justify-start items-center">
                            Select Category
                          </div>
                          <div className="w-full my-[6px] flex justify-start items-center border border-[#beb0f4]"></div> */}
                    {paymentName.map((data, index) => {
                      return (
                        <div
                          className="w-full py-[6px] flex justify-start items-center z-50"
                          onClick={() => {
                            setMode(data);
                            setCategoryDropdown(false);
                          }}
                        >
                          {/* <SmallSizeIcon Category={data} /> */}
                          <div className="" key={index}>
                            {data}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="w-full h-auto flex justify-start items-center">
                  <div
                    className="w-full h-auto flex justify-start items-center z-50"
                    onClick={() => {
                      setCategoryDropdown(!categoryDropdown);
                    }}
                  >
                    <div
                      className={
                        "outline-none w-full h-[45px] rounded-xl bg-transparent border border-[#beb0f4]  px-[10px] text-black font-[google] font-normal text-[16px] z-40 flex justify-start items-center"
                      }
                      // placeholder="Price"
                      // value={price}
                    >
                      {mode}
                    </div>
                    <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]">
                      {categoryDropdown ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-chevron-up"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* <span
                    className={
                      "p-[5px] w-auto px-[10px] mb-[5px]  rounded-md h-[40px] border border-[#beb0f4] flex justify-center items-center" +
                      (mode == "Online UPI"
                        ? " bg-[#beb0f4] text-[black]"
                        : " text-[#535353]")
                    }
                    onClick={() => {
                      setMode("Online UPI");
                    }}
                  >
                    Online UPI
                  </span>
                  <span
                    className={
                      "p-[5px] w-auto px-[10px] mb-[5px]  rounded-md h-[40px] border border-[#beb0f4] flex justify-center items-center" +
                      (mode == "Credit/Debit Card"
                        ? " bg-[#beb0f4] text-[black]"
                        : " text-[#535353]")
                    }
                    onClick={() => {
                      setMode("Credit/Debit Card");
                    }}
                  >
                    Credit/Debit Card
                  </span>
                  <span
                    className={
                      "p-[10px] w-auto px-[20px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#beb0f4] flex justify-center items-center" +
                      (mode == "Cash"
                        ? " bg-[#beb0f4] text-[black]"
                        : " text-[#535353]")
                    }
                    onClick={() => {
                      setMode("Cash");
                    }}
                  >
                    Cash
                  </span> */}
                </div>
              </div>
            </span>

            <div className="w-full flex justify-center items-end font-[google] font-normal text-[15px] text-black mt-[20px]">
              <div
                className="flex justify-center mr-[15px]  px-[15px] py-[10px] rounded-3xl bg-[#efefef] text-[black] items-center cursor-pointer  "
                onClick={() => {
                  setConfirmModal(false);
                  setMode("");
                  // setInclude(false);
                  // setNewIncome("");
                  // setError("");
                }}
              >
                Cancel
              </div>
              {mode.length == 0 ? (
                <>
                  <div className=" flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#e8e3fd] items-center text-[#0000006c]  ">
                    Confirm
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#beb0f4] text-[black] items-center cursor-pointer  "
                    onClick={() => {
                      // updateIncome();
                      // deleteReminder();
                      setConfirmModal(false);
                      addToTransaction();
                    }}
                  >
                    Confirm
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {notificationModal && props?.owner ? (
        <>
          <div
            className="w-full h-[100svh]  flex justify-center items-end bg-[#0000003e] p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
            // onClick={() => {
            //   setNotificationModal(false);
            // }}
          >
            <OutsideClickHandler
              onOutsideClick={() => {
                setNotificationModal(false);
              }}
            >
              <div
                className="w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-[20px] font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]"
                style={{ zIndex: 100 }}
                onClick={() => {
                  // setNotificationModal(true);
                }}
              >
                <span className="text-[22px] mb-[10px]">
                  Send Notification to "{notName}"
                </span>
                <span className="text-[#828282]">
                  {isPaid ? (
                    <>
                      Uh ! It seems like the person has already paid his
                      splitted amount. Please check your Expense History .
                    </>
                  ) : (
                    <>
                      A notification will be send to the person about this split
                      transaction as a reminder. Do you want to continue ?
                    </>
                  )}
                </span>
                <div className="w-full flex justify-end items-center mt-[14px] ">
                  {isPaid ? (
                    <></>
                  ) : (
                    <div
                      className="mr-[25px] cursor-pointer"
                      onClick={() => {
                        setNotificationModal(false);
                      }}
                    >
                      Cancel
                    </div>
                  )}
                  <div
                    className=" cursor-pointer text-[#6bb7ff]"
                    onClick={() => {
                      if (isPaid === true) {
                        setNotificationModal(false);
                      } else {
                        setNotificationModal(false);
                      }
                      // setNotificationModal(true);
                    }}
                  >
                    Ok
                  </div>
                </div>
              </div>
            </OutsideClickHandler>
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
        <div className=" h-[30px] flex justify-start items-center mb-[20px]">
          {/* <LuArrowLeft className="text-[24px] h-[30px] flex justify-start items-center" />{" "} */}
        </div>
        <div className="w-full h-[calc(100svh-50px)] flex flex-col justify-start items-start overflow-y-scroll overflow-x-hidden">
          <div className="w-full h-auto rounded-2xl bg-[#ebebf5] flex flex-col justify-start items-start p-[20px]">
            <div className="w-full h-auto flex justify-between items-center">
              <div className="w-full h-auto flex flex-col justify-start items-start">
                <span className="text-[25px] w-[90%] overflow-hidden text-ellipsis line-clamp-1 ">
                  {props?.data?.Lable}
                </span>
                <span className="flex justify-start items-center mt-[-3px]">
                  <LuCornerDownRight className="text-[24px]" />{" "}
                  <span className="mt-[4px] ml-[3px]">
                    {props?.data?.Members?.length === 0 ? (
                      <></>
                    ) : (
                      <>Members {props?.data?.Members?.length} , </>
                    )}{" "}
                    <span className="text-[#6f6f6f]">
                      {(props?.data?.Date).split("/")[0]}{" "}
                      {months[parseInt((props?.data?.Date).split("/")[1]) - 1]}{" "}
                      {(props?.data?.Date).split("/")[2]}
                    </span>
                  </span>
                </span>

                {/* <span className="flex justify-start items-center mt-[3px]">
                Spent <BiRupee className="text-[20px] ml-[2px]" />{" "}
                <span className="text-[20px]">25,000.00</span>
              </span> */}
              </div>
              <div className="text-[55px]">
                {props?.data?.Category === "Food & Drinks" ? (
                  <IoFastFood />
                ) : props?.data?.Category === "Shopping" ? (
                  <FaShopify />
                ) : props?.data?.Category === "Grocery" ? (
                  <HiShoppingBag />
                ) : props?.data?.Category === "Medical" ? (
                  <FaTruckMedical />
                ) : props?.data?.Category === "Travel" ? (
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
            </div>
            <div className="w-[calc(100%+70px)] h-auto flex justify-center items-center ml-[-35px] my-[5px]">
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
              <div className="w-full border-b-[2px] border-[#d1d1d1] border-dashed "></div>
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
            </div>
            <div className="w-full h-auto flex flex-col justify-start items-start ">
              <div className="w-full flex justify-start items-start h-auto">
                <div className="w-[60%] h-auto flex flex-col justify-start items-start text-[14px]">
                  <span className="">Date</span>
                  <span className="text-[#6f6f6f] mt-[-3px]">
                    {formatDate(props?.data?.Date)}
                  </span>
                  <span className="mt-[3px]">Category</span>
                  <span className="text-[#6f6f6f] mt-[-3px]">
                    {props?.data?.Category}
                  </span>
                  <span className="mt-[3px]">Payment Method</span>
                  <span className="text-[#6f6f6f] mt-[-3px]">
                    {props?.data?.Mode}
                  </span>
                  {props?.data?.TransactionType === "Split" ? (
                    <>
                      <span className="mt-[3px]">Splitted By</span>
                      <span className="text-[#6f6f6f] mt-[-3px]">
                        {props?.owner ? <>You</> : <>{name}</>}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="w-[40%] h-auto flex flex-col justify-start items-start">
                  <span className="text-[15px] mb-[10px]">
                    Scan for Reciept
                  </span>
                  <QR
                    className="w-full aspect-square"
                    color="#000"
                    backgroundColor="#ebebf5"
                    rounding={100}
                    errorCorrectionLevel="L"
                  >
                    https://qph.cf2.quoracdn.net/main-qimg-e68b4c3d6705f994907bb86a1b6a5803-lq
                  </QR>
                </div>
              </div>
              <div className="w-full h-auto mt-[20px] flex justify-evenly items-center py-[20px] rounded-2xl bg-[#ffffff]">
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#6f6f6f]">Spent</span>
                  <span className="text-[20px] mt-[-4px]">
                    {formatAmountWithCommas(props?.data?.Amount)}
                  </span>
                </div>
                <div className="border border-[#eaeaea] rounded-full h-[40px]"></div>
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#6f6f6f]">
                    {props?.owner ? <>Owed</> : <>Due</>}
                  </span>
                  <span
                    className={
                      "text-[20px] mt-[-4px] " +
                      (props?.owner
                        ? formatAmountWithCommas(
                            parseFloat(props?.data?.Amount) -
                              (
                                parseFloat(props?.data?.Amount) /
                                parseInt(props?.data?.MemberCount)
                              ).toFixed(2) *
                                (splitRemaining.length + 1)
                          ) == 0
                          ? " text-[#000000]"
                          : " text-[#00bb00]"
                        : props?.data?.Paid
                        ? " text-[#000000]"
                        : " text-[#e61d0f]")
                    }
                  >
                    {props?.owner ? (
                      <>
                        {formatAmountWithCommas(
                          parseFloat(props?.data?.Amount) -
                            (
                              parseFloat(props?.data?.Amount) /
                              parseInt(props?.data?.MemberCount)
                            ).toFixed(2) *
                              (splitRemaining.length + 1)
                        )}
                      </>
                    ) : (
                      <>
                        {props?.data?.Paid ? (
                          <>0.00</>
                        ) : (
                          <>
                            {formatAmountWithCommas(
                              (
                                parseFloat(props?.data?.Amount) /
                                parseInt(props?.data?.MemberCount)
                              ).toFixed(2)
                            )}
                          </>
                        )}
                      </>
                    )}
                  </span>
                </div>
                <div className="border border-[#eaeaea] rounded-full h-[40px]"></div>
                <div className="flex flex-col justify-center items-center ">
                  <span className="text-[14px] text-[#6f6f6f]">
                    {props?.owner ? <>Debtors</> : <>Members</>}
                  </span>
                  <span className="text-[20px] mt-[-4px]">
                    {props?.owner ? (
                      <>
                        {parseInt(props?.data?.MemberCount) -
                          splitRemaining.length -
                          1}
                        /{props?.data?.MemberCount}
                      </>
                    ) : (
                      <>{props?.data?.MemberCount}</>
                    )}
                  </span>
                </div>
                {/* <div className="flex flex-col justify-center items-center">
                <span className="text-[14px] text-[#6f6f6f]">Per Head</span>
                <span className="text-[20px]">5,000.00</span>
              </div> */}
              </div>
            </div>
          </div>
          {/* {props?.owner ? ( */}
          <div className="w-full h-auto rounded-2xl bg-[#ebebf5] flex flex-col justify-start items-start p-[20px] mt-[20px]">
            <div className="w-full h-auto flex justify-between items-center">
              <div className="w-full h-auto flex flex-col justify-start items-start">
                <span className="text-[25px] w-[90%] overflow-hidden text-ellipsis line-clamp-1 ">
                  {props?.owner ? <>Memeber's Status</> : <>Payment Status</>}
                </span>
                <span className="flex justify-start items-center mt-[-3px]">
                  {props?.owner ? (
                    <>
                      <RxPerson className="text-[18px]" />{" "}
                    </>
                  ) : (
                    <>
                      <LuCornerDownRight className="text-[24px]" />{" "}
                    </>
                  )}

                  <span className="mt-[4px] ml-[3px]">
                    {props?.owner ? (
                      <>{props?.data?.MemberCount}</>
                    ) : (
                      <>
                        {props?.data?.Paid ? (
                          <span className=" text-[#00bb00]">Paid</span>
                        ) : (
                          <span className=" text-[#e61d0f]">Pending</span>
                        )}
                      </>
                    )}
                  </span>
                </span>
                {/* <span className="flex justify-start items-center mt-[3px]">
                Spent <BiRupee className="text-[20px] ml-[2px]" />{" "}
                <span className="text-[20px]">25,000.00</span>
              </span> */}
              </div>
              <div className="">
                {" "}
                <IoIosCard className="text-[55px] " />
              </div>
            </div>
            <div className="w-[calc(100%+70px)] h-auto flex justify-center items-center ml-[-35px] my-[5px]">
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
              <div className="w-full border-b-[2px] border-[#d1d1d1] border-dashed "></div>
              <div className="w-[30px] aspect-square rounded-full bg-[white]"></div>
            </div>
            {props?.owner ? (
              <>
                <div className="w-full h-auto flex flex-col justify-start items-start ">
                  <div className="w-full h-auto flex flex-col justify-start items-center ">
                    {props?.data?.Members.map((data) => {
                      return (
                        <MemberProfile
                          userId={data}
                          usersPaid={splitRemaining}
                          notificationModal={notificationModal}
                          setNotificationModal={setNotificationModal}
                          isPaid={isPaid}
                          setIsPaid={setIsPaid}
                          setNotName={setNotName}
                          owner={props?.data?.Owner}
                          isOwner={props?.owner}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-auto flex  justify-between items-center ">
                  <div className="flex flex-col justify-center items-start">
                    <span className="text-[14px] text-[#6f6f6f]">To Pay</span>
                    <span className="text-[24px] mt-[-3px]">
                      {formatAmountWithCommas(
                        (
                          parseFloat(props?.data?.Amount) /
                          parseInt(props?.data?.MemberCount)
                        ).toFixed(2)
                      )}
                    </span>
                  </div>
                  {props?.data?.Paid ? (
                    <>
                      <div className="flex justify-center items-center px-[10px] py-[5px] rounded-xl text-white bg-[#00bb00] ">
                        Paid
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex justify-center items-center px-[10px] py-[5px] rounded-xl bg-[white] cursor-pointer"
                        onClick={() => {
                          setConfirmModal(true);
                        }}
                      >
                        Mark Paid
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {/* ) : ( */}
          {/* <></> */}
          {/* )} */}
        </div>
      </div>
    </>
  );
};

const SplitTransaction = (props) => {
  const [showMore, setShowMore] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [name, setName] = useState("");
  const [normalTransaction, setNormalTransaction] = useState([]);
  const [splitRemaining, setSplitRemaining] = useState([]);

  function checkOwner(ownerid) {
    const user = firebase.auth().currentUser;
    if (user.uid === ownerid) return true;
    else return false;
  }

  useEffect(() => {
    fetchName(props?.data?.Owner);
    fetchNormalTransaction();
  }, [props?.data?.Owner]);

  useEffect(() => {
    getSameSplitTransaction();
  }, [normalTransaction]);

  function fetchName(ownerid) {
    const userRef = db.collection("Expense").doc(ownerid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
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
    return `${monthName}, ${dayWithSuffix}`;
  }

  function getSameSplitTransaction() {
    let newArr = normalTransaction?.filter((data) => {
      if (
        data?.TotalAmount == props?.data?.Amount &&
        data?.BillUrl == props?.data?.BillUrl &&
        data?.Category == props?.data?.Category &&
        data?.SplitDate == props?.data?.Date &&
        (data?.Lable).slice(12) == props?.data?.Lable &&
        data?.MemberCount == props?.data?.MemberCount &&
        // data?.Members == props?.data?.Members &&
        // data?.Mode == props?.data?.Mode &&
        data?.Owner == props?.data?.Owner &&
        data?.TransactionType == props?.data?.TransactionType
      ) {
        return data;
      }
    });
    setSplitRemaining(newArr);
  }

  function fetchNormalTransaction() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setNormalTransaction(snapshot?.data()?.NormalTransaction);
      // setIncome(snapshot?.data()?.TotalIncome);
      // console.log(snapshot?.data()?.Online);
    });
  }

  return (
    <>
      {showMore ? (
        <MoreAboutTransaction
          showMore={showMore}
          setShowMore={setShowMore}
          data={props?.data}
          owner={checkOwner(props?.data?.Owner)}
        />
      ) : (
        <></>
      )}

      <div
        className="independentTran  w-[calc(100%-40px)] min-h-[64px]  font-[google] font-normal text-[15px] text-white flex justify-center items-center  cursor-pointer  border-b-[.7px] border-[#f2eeff]"
        onClick={() => {
          setShowMore(true);
        }}
      >
        <div className="w-[30px] flex justify-start items-center text-[22px] ">
          {checkOwner(props?.data?.Owner) ? (
            <IoGitNetworkOutline
              className={
                "" +
                (!props?.data?.PaymentStatus
                  ? parseFloat(props?.data?.Amount) -
                      (
                        parseFloat(props?.data?.Amount) /
                        parseInt(props?.data?.MemberCount)
                      ).toFixed(2) *
                        (splitRemaining.length + 1) ===
                    0
                    ? " text-[#d5d5d5]"
                    : " text-[#00bb00]"
                  : " text-[#828282]")
              }
            />
          ) : (
            <IoGitNetworkOutline
              className={
                "" +
                (!props?.data?.PaymentStatus
                  ? props?.data?.Paid === true
                    ? " text-[#d5d5d5]"
                    : " text-[#de8544]"
                  : " text-[#828282]")
              }
            />
          )}
        </div>
        <div
          className={
            "w-[calc(100%-130px)] px-[10px] flex flex-col justify-center items-start " +
            (!props?.data?.PaymentStatus ? " text-black" : " text-[#828282]")
          }
        >
          <span
            className={
              "text-[16px]" +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#d5d5d5] "
                : " ")
            }
          >
            {props?.data?.Lable}
          </span>
          <span
            className={
              "text-[14px]  " +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#d5d5d5]"
                : " text-[#828282]")
            }
          >
            {/* {props?.member} Members */}
            {checkOwner(props?.data?.Owner) ? (
              <>
                <span className="">By</span>, You
              </>
            ) : (
              <>
                <span className="">By</span>, {name}
              </>
            )}
          </span>
        </div>
        <div
          className={
            "w-[100px] whitespace-nowrap overflow-visible flex flex-col justify-center items-end" +
            (!props?.data?.PaymentStatus ? " text-black" : " text-[#828282]")
          }
        >
          {checkOwner(props?.data?.Owner) ? (
            <>
              <div
                className={
                  "text-[16px] w-full flex justify-end items-center whitespace-nowrap" +
                  (parseFloat(props?.data?.Amount) -
                    (
                      parseFloat(props?.data?.Amount) /
                      parseInt(props?.data?.MemberCount)
                    ).toFixed(2) *
                      (splitRemaining.length + 1) ===
                  0
                    ? " text-[#d5d5d5]"
                    : " text-[#00bb00]")
                }
              >
                {/* {formatAmountWithCommas(
                  (
                    parseFloat(props?.data?.Amount) -
                    parseFloat(props?.data?.Amount) / props?.data?.MemberCount
                  ).toFixed(2)
                )}{" "} */}
                {formatAmountWithCommas(
                  parseFloat(props?.data?.Amount) -
                    (
                      parseFloat(props?.data?.Amount) /
                      parseInt(props?.data?.MemberCount)
                    ).toFixed(2) *
                      (splitRemaining.length + 1)
                )}{" "}
                /-
              </div>
            </>
          ) : (
            <>
              <div
                className={
                  "text-[16px] w-full flex justify-end items-center whitespace-nowrap" +
                  (props?.data?.Paid === true
                    ? " text-[#d5d5d5]"
                    : " text-[#de8544]")
                }
              >
                {formatAmountWithCommas(
                  (
                    parseFloat(props?.data?.Amount) / props?.data?.MemberCount
                  ).toFixed(2)
                )}{" "}
                /-
              </div>
            </>
          )}
          <div
            className={
              "text-[13px] " +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#00000057]"
                : " text-[#00000057]")
            }
          >
            {formatDate(props?.data?.Date)}
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitTransaction;
