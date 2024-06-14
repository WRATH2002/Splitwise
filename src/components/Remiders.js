import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { GoAlertFill } from "react-icons/go";
import { HiCheck } from "react-icons/hi";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";

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

const RemiderCard = (props) => {
  const [aprroveModal, setApproveModal] = useState(false);
  const [include, setInclude] = useState(false);

  function formatAmountWithCommas(amountStr) {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }
    // console.log("check .");
    // console.log(amount.toLocaleString().includes("."));
    if (amount.toLocaleString().includes(".")) {
      return amount.toLocaleString();
    } else {
      return amount.toLocaleString() + ".00";
    }
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
        <div
          key={props?.index}
          className="w-full h-[100svh] fixed z-50 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md"
        >
          <div className="w-[320px] h-auto p-[30px] py-[23px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start">
            <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
              Confirm{" "}
              <span className="text-[#de8544] ml-[10px]">Transaction</span>
            </span>

            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[5px]  ">
              Have you done this transaction already. If you dismiss this
              reminder, you will not be notified later. Do you really want to
              dismiss this reminder ?
            </span>

            <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-center mt-[10px]">
              <span className="mr-[5px] text-[#de8544]">Label :</span>{" "}
              {props?.data?.Lable}
            </span>
            <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-center ">
              <span className="mr-[5px] text-[#de8544]">Amount :</span>{" "}
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
                  "w-[18px] h-[18px] rounded-md border-[1.5px] border-[#ffa43c] mr-[6px]  flex justify-center items-center" +
                  (include ? " bg-[#ffa43c]" : " bg-transparent")
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
                className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
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
                className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
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
        </div>
      ) : (
        <></>
      )}
      <div
        className={
          "min-w-[280px] h-full  rounded-2xl flex font-[google] justify-center items-center font-normal ml-[10px]" +
          (getRemainingTime(props?.data?.Date).includes("due")
            ? " bg-[#ffa43c]"
            : " bg-[#ffddc5]")
        }
      >
        <div className="w-[50px] h-full flex flex-col justify-center items-center">
          <div className="text-[12px] text-[#000000]">
            {monthsShort[props?.data?.Date?.split("/")[1] - 1]}
          </div>
          <div className="text-black text-[20px] ">
            {props?.data?.Date?.split("/")[0]}
          </div>
        </div>
        <div
          className={
            "w-[140px] h-full  flex flex-col justify-center items-start px-[10px] " +
            (getRemainingTime(props?.data?.Date).includes("due")
              ? " bg-[#ffd29f] text-[#4a4a4a]"
              : " bg-[#ffeadc] text-[#6a6a6a]")
          }
        >
          <div className="text-[14px] leading-[19px] text-[#6a6a6a] line-clamp-2 w-full overflow-hidden text-ellipsis">
            {props?.data?.Lable}
          </div>
          <div className="text-black text-[17px] w-full flex justify-start items-center ">
            <BiRupee className="ml-[-3px]" />{" "}
            {formatAmountWithCommas(props?.data?.Amount)}
          </div>
        </div>
        <div
          className={
            "w-[90px] h-full flex flex-col justify-center items-end pr-[10px] rounded-r-2xl" +
            (getRemainingTime(props?.data?.Date).includes("due")
              ? " bg-[#ffd29f] text-[#95241d]"
              : " bg-[#ffeadc] text-[#000000]")
          }
        >
          <div className="text-[13px] whitespace-nowrap ">
            {getRemainingTime(props?.data?.Date)}
          </div>
          <div
            className={
              "text-white w-[30px] h-[30px]  mt-[5px] rounded-full text-[20px] flex justify-center items-center cursor-pointer" +
              (getRemainingTime(props?.data?.Date).includes("due")
                ? " bg-[#f88239] "
                : " bg-[#de8544] ")
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

const Remiders = () => {
  const [reminders, setReminders] = useState([]);
  const [tempReminders, setTempReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  function fetchReminders() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setReminders(snapshot?.data()?.Reminders);
    });
  }

  useEffect(() => {
    if (reminders != undefined) {
      sortTransactionsByDate();
    }
  }, [reminders]);

  useEffect(() => {
    if (tempReminders != undefined) {
      console.log(tempReminders);
    }
  }, [tempReminders]);

  function sortTransactionsByDate() {
    setTempReminders(
      fetchUptoPresentMonth(
        reminders.sort((a, b) => {
          const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA - dateB;
        })
      )
    );
  }

  function fetchUptoPresentMonth(data) {
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    let newData = data?.filter((obj) => {
      let dateArr = obj?.Date?.split("/");
      if (dateArr[1] <= month) {
        console.log("yo");
        return obj;
      } else if (dateArr[1] == month + 1) {
        // let newDate = date + 7;
        console.log("yo");
        if (date + 7 > 30) {
          if (parseInt(dateArr[0]) <= date + 7 - 30) {
            console.log(obj.Date);
            return obj;
          }
        }
      }
    });

    return newData;
  }

  return (
    <>
      {/* <div className="w-full h-[130px] "> */}
      <div className="w-full h-[110px] flex overflow-x-scroll items-center pt-[10px]  px-[10px] pr-[20px]">
        {tempReminders.map((data, index) => {
          return (
            <>
              <RemiderCard data={data} index={index} />
            </>
          );
        })}
      </div>
      {/* </div> */}
    </>
  );
};

export default Remiders;
