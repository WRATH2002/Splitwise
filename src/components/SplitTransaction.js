import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaCheckCircle, FaReceipt, FaShopify } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { GiPartyPopper } from "react-icons/gi";
import { HiMiniBell } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
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
import { IoMdInformationCircle } from "react-icons/io";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaCircleExclamation } from "react-icons/fa6";

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
        className=" w-full h-[50px] mb-[10px] z-30 flex justify-center items-center font-[google] font-normal text-[16px] cursor-pointer"
        onClick={() => {
          props?.setNotificationModal(!props?.notificationModal);
          props?.setIsPaid(tempIsPaid);
          props?.setNotName(name);
        }}
      >
        <img
          className="w-[45px] aspect-square object-cover rounded-2xl bg-[#ffeadc]  z-30" // {
          //   +
          //   (isPaid ? " grayscale opacity-60" : " grayscale-0")
          // }
          src="https://images.pexels.com/photos/4917253/pexels-photo-4917253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ></img>
        <div className="w-[calc(100%-150px)] h-full px-[15px] flex flex-col justify-center items-start ">
          <span>{name}</span>
          <span className="text-[14px] text-[#828282] flex justify-start items-center">
            <MdCall className="text-[15px] mr-[5px]" /> {phone}
          </span>
        </div>
        <div className="w-[100px] h-full flex justify-end items-center text-[14px] ">
          {props?.isOwner ? (
            <>
              {tempIsPaid ? (
                <>
                  Paid{" "}
                  <FaCheckCircle className="text-[15px] ml-[5px] text-[#00bb00] z-40" />
                </>
              ) : (
                <>
                  Pending{" "}
                  <FaCircleExclamation className="text-[15px] ml-[5px] text-[#de8544] z-40" />{" "}
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        {/* {isPaid ? (
          <div className="w-full h-full flex justify-center items-center mt-[-50px] z-40">
            <FaCheckCircle className="text-[20px] text-[#5aeaff] z-40" /> de8544
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </>
  );
};

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
        <div className="w-full h-[100svh] fixed z-50 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
          <div className="w-[320px] h-auto p-[30px] py-[23px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start">
            <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
              Confirm{" "}
              <span className="text-[#de8544] ml-[10px]">Transaction</span>
            </span>

            <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[5px]  ">
              Have you paid your Splitted Bill already. The owner will be able
              to see your transaction. Do you really want to confirm ?
            </span>

            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center mt-[10px]">
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
            </span>
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
                  Please select Payment Method
                </span>
                <div className="w-full h-auto flex justify-start items-center">
                  <span
                    className={
                      "p-[10px] w-auto px-[20px] mb-[5px]  rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                      (mode == "Online UPI"
                        ? " bg-[#ffddc5] text-[black]"
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
                      "p-[10px] w-auto px-[20px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                      (mode == "Offline Cash"
                        ? " bg-[#ffddc5] text-[black]"
                        : " text-[#535353]")
                    }
                    onClick={() => {
                      setMode("Offline Cash");
                    }}
                  >
                    Offline Cash
                  </span>
                </div>
              </div>
            </span>

            <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
              <div
                className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                onClick={() => {
                  setConfirmModal(false);
                  // setInclude(false);
                  // setNewIncome("");
                  // setError("");
                }}
              >
                Cancel
              </div>
              <div
                className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                onClick={() => {
                  // updateIncome();
                  // deleteReminder();
                  setConfirmModal(false);
                  addToTransaction();
                }}
              >
                Confirm
              </div>
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
                    className=" cursor-pointer text-[#de8544]"
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
      <div className="w-full h-[100svh] fixed top-0 left-0 flex justify-start items-center flex-col p-[20px] bg-[#ffffff] font-[google] font-normal z-30 overflow-y-scroll pt-[50px] pb-[10px]">
        <div className="w-[calc(100%-40px)] h-[40px] flex justify-between items-center fixed top-[20px] ">
          <div
            className="w-[40px] aspect-square flex justify-start items-center cursor-pointer"
            onClick={() => {
              props?.setShowMore(false);
            }}
          >
            <FiArrowLeft className="text-[black] text-[23px]" />
          </div>
          {/* <div
            className="w-[40px] aspect-square flex justify-end items-center cursor-pointer"
            onClick={() => {
              // props?.setShowMore(false);
            }}
          >
            <HiMiniBell className="text-[black] text-[23px]" />
          </div> */}
        </div>

        <div className="w-full h-[60px] flex justify-center items-center text-[#23a8d2]">
          <IoFastFood className="text-[55px] " />
        </div>
        <div className="font-[google] font-normal h-[50px]  text-black mt-[15px] text-[24px] w-full flex flex-col justify-center items-center">
          <span>{props?.data?.Lable}</span>
          <span className="text-[15px] text-[#828282]">
            {props?.data?.Members?.length === 0 ? (
              <></>
            ) : (
              <>{props?.data?.Members?.length} member's, </>
            )}
            {calculateDuration(props?.data?.Date)}
          </span>
        </div>
        {/* <div className="w-full border-[.7px] border-[#fee6d7] my-[30px]"></div> */}
        <div className="w-full flex justify-between items-start bg-[#e4f2ff] border-[1px] border-[#e4f2ff] rounded-2xl p-[20px] mt-[30px] text-black">
          <div className="w-[calc(100%/2)] flex flex-col justify-center items-start">
            <span className=" flex justify-center items-center text-[14px] text-[#828282]">
              {props?.owner ? (
                <span className="text-[#828282] ">Total Remaining</span>
              ) : (
                <span className="text-[#828282]">Total to Pay</span>
              )}
            </span>
            <span
              className={
                " font-[google] font-normal text-[22px]  flex justify-start items-center" +
                (props?.owner ? " text-[#00bb00]" : " text-[#de8544]")
              }
            >
              <BiRupee className="ml-[-3px] " />{" "}
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
                  {formatAmountWithCommas(
                    (
                      parseFloat(props?.data?.Amount) /
                      parseInt(props?.data?.MemberCount)
                    ).toFixed(2)
                  )}
                </>
              )}
            </span>
            {props?.owner ? (
              <>
                <span className="font-[google] font-normal text-[14px]  text-[#828282] flex justify-end items-center">
                  Remaining :{" "}
                  <span className="text-black flex justify-end items-center ml-[6px]">
                    {parseInt(props?.data?.MemberCount) -
                      splitRemaining.length -
                      1}{" "}
                    Person
                  </span>
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="w-[calc(100%/2)] flex flex-col justify-center items-end ">
            <span className=" flex justify-center items-center text-[14px]  text-[#828282]">
              <span className=" ">Total Expense</span>
            </span>
            <span className=" font-[google] font-normal text-[22px]  flex justify-start items-center">
              {/* <BiRupee className="ml-[-3px] " /> 345 /{" "} */}
              <span className="text-[#000000] ml-[5px] flex justify-end items-center">
                <BiRupee className="ml-[-3px] " />{" "}
                {formatAmountWithCommas(props?.data?.Amount)}
              </span>
            </span>
            {/* {props?.owner ? (
              <> */}
            <span className="font-[google] font-normal text-[14px]  text-[#828282] flex justify-end items-center">
              Per Person{" "}
              <span className="text-black flex justify-end items-center ml-[6px]">
                <BiRupee className=" " />
                {formatAmountWithCommas(
                  parseFloat(props?.data?.Amount) /
                    parseInt(props?.data?.MemberCount).toFixed(2)
                )}
              </span>
            </span>
            {/* </>
            ) : (
              <></>
            )} */}
          </div>
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
                  {formatDate(props?.data?.Date)}
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Category </span>{" "}
                <span className="text-black ">{props?.data?.Category}</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Total Transaction </span>{" "}
                <span className="text-black flex justify-end items-center">
                  <BiRupee className="" /> {props?.data?.Amount}
                </span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Payment Method </span>{" "}
                <span className="text-black ">{props?.data?.Mode}</span>
              </span>
              <span className=" text-[#828282] text-[14px] mt-[4px] w-full flex justify-between items-center">
                <span>Bill Splitted By </span>{" "}
                <span className="text-black ">
                  {props?.owner ? <>You</> : <>{name}</>}
                </span>
              </span>
              <div className="w-full h-[60px] rounded-2xl bg-[#e4f2ff]  border-[1px] border-[#e4f2ff] cursor-pointer mt-[20px] flex justify-between items-center text-[14px] text-black px-[20px]">
                <div className="flex justify-start items-center">
                  <FaReceipt className="text-[20px] mr-[9px]" /> View Reciept /
                  Bill
                </div>
                <div>
                  <LuChevronRight className="text-[20px] " />
                </div>
              </div>
              <div className="w-full mt-[20px] flex flex-col justify-start items-center">
                <span className="w-full flex justify-start items-center">
                  Member's
                </span>
                <div className="w-full flex justify-start flex-wrap conta mt-[10px]">
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
              <img
                src="https://media-cdn.tripadvisor.com/media/photo-l/12/e6/36/67/receipt.jpg"
                className="w-[100px] h-[100px] rounded-2xl object-cover mt-[30px]"
              ></img>
            </>
          )}
        </div>
        {props?.owner ? (
          <></>
        ) : (
          <>
            <div className="w-full h-[55px] flex justify-center items-center font-[google] bg-[#ffffff] z-40 font-normal fixed  bottom-0 left-0 text-[#ffffff]  text-[16px]">
              {props?.data?.Paid === true ? (
                <div className="w-auto h-[40px] flex justify-center items-center rounded-full px-[15px] bg-[#8c8c8c] cursor-default">
                  Paid
                </div>
              ) : (
                <div
                  className="w-auto h-[40px] flex justify-center items-center rounded-full px-[15px] bg-[#e4f2ff] cursor-pointer"
                  onClick={() => {
                    setConfirmModal(true);
                  }}
                >
                  Mark as Paid
                </div>
              )}
            </div>
          </>
        )}

        {props?.owner ? (
          <></>
        ) : (
          <>
            <div className="w-full min-h-[55px] "></div>
          </>
        )}
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
    return `${dayWithSuffix} ${monthName}, ${year}`;
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
        className="w-[calc(100%-40px)] min-h-[60px] border-b-[.7px] border-[#ffede2] font-[google] font-normal text-[15px] flex justify-start  items-center cursor-pointer"
        onClick={() => {
          setShowMore(true);
        }}
      >
        <div className="w-[30px] flex justify-start items-center text-[22px] ">
          {checkOwner(props?.data?.Owner) ? (
            <MdCallSplit
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
                    ? " text-[#a3a3a3]"
                    : " text-[#00bb00]"
                  : " text-[#828282]")
              }
            />
          ) : (
            <MdCallSplit
              className={
                "" +
                (!props?.data?.PaymentStatus
                  ? props?.data?.Paid === true
                    ? " text-[#a3a3a3]"
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
              "" +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#a3a3a3]"
                : " ")
            }
          >
            {props?.data?.Lable}
          </span>
          <span
            className={
              "text-[13px] " +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#a3a3a3]"
                : " text-[#828282]")
            }
          >
            {/* {props?.member} Members */}
            {checkOwner(props?.data?.Owner) ? (
              <>
                <span className="">Splitted By</span>, You
              </>
            ) : (
              <>
                <span className="">Splitted By</span>, {name}
              </>
            )}
          </span>
        </div>
        <div
          className={
            "w-[100px]  flex flex-col justify-center items-end" +
            (!props?.data?.PaymentStatus ? " text-black" : " text-[#828282]")
          }
        >
          <div
            className={
              "text-[12px] " +
              (parseFloat(props?.data?.Amount) -
                (
                  parseFloat(props?.data?.Amount) /
                  parseInt(props?.data?.MemberCount)
                ).toFixed(2) *
                  (splitRemaining.length + 1) ===
                0 || props?.data?.Paid === true
                ? " text-[#a3a3a3]"
                : " text-[#828282]")
            }
          >
            {formatDate(props?.data?.Date)}
          </div>

          {checkOwner(props?.data?.Owner) ? (
            <>
              <div
                className={
                  "" +
                  (parseFloat(props?.data?.Amount) -
                    (
                      parseFloat(props?.data?.Amount) /
                      parseInt(props?.data?.MemberCount)
                    ).toFixed(2) *
                      (splitRemaining.length + 1) ===
                  0
                    ? " text-[#a3a3a3]"
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
                  "" +
                  (props?.data?.Paid === true
                    ? " text-[#a3a3a3]"
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
        </div>
      </div>
    </>
  );
};

export default SplitTransaction;
