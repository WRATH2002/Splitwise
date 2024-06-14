import React from "react";
import { BiRupee } from "react-icons/bi";
import TopNavbar from "./TopNavbar";
import { FiPlus } from "react-icons/fi";
import AddReminderModal from "./AddReminderModal";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import IndividualReminder from "./IndividualReminder";
const monthsShort = [
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
const ReminderPage = () => {
  const [addModal, setAddModal] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    fetchMonth();
    fetchReminders();
    console.log(tempTransactionHistory);
  }, []);

  function fetchMonth() {
    var date = new Date();
    const currMonth = date.getMonth() + 1;
    setMonth(currMonth);
  }

  useEffect(() => {
    if (transactionHistory != undefined) {
      sortTransactionsByDate();
    }
  }, [transactionHistory]);

  function sortTransactionsByDate() {
    setTempTransactionHistory(
      filterByPresentDate(
        transactionHistory.sort((a, b) => {
          const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA - dateB;
        })
      )
    );
  }

  function filterByPresentDate(data) {
    let preMonth = new Date().getMonth() + 1;
    const newData = data?.filter((obj) => {
      let dateArr = obj?.Date?.split("/");
      // console.log(preMonth);
      if (parseInt(dateArr[1]) <= parseInt(preMonth)) {
        // console.log("obj");
        return obj;
      }
    });
    return newData;
  }

  function fetchReminders() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setTransactionHistory(snapshot?.data()?.Reminders);
      // setTempTransactionHistory(snapshot?.data()?.Reminders);
    });
  }

  function upcoming() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;

    let totalUpcoming = tempTransactionHistory.reduce((acc, curr) => {
      let dateArr = curr?.Date?.split("/");
      if (dateArr[1] == month) {
        if (dateArr[0] > date) {
          acc = acc + parseInt(curr.Amount);
        }
      }
      return acc;
    }, 0);

    return totalUpcoming;
  }

  function formatAmountWithCommas(amountStr) {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }
    console.log("check .");
    console.log(amount.toLocaleString().includes("."));
    if (amount.toLocaleString().includes(".")) {
      return amount.toLocaleString();
    } else {
      return amount.toLocaleString() + ".00";
    }
  }

  function due() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;

    let totalDue = tempTransactionHistory.reduce((acc, curr) => {
      let dateArr = curr?.Date?.split("/");
      if (dateArr[1] <= month) {
        if (dateArr[1] == month) {
          if (dateArr[0] <= date) {
            acc = acc + parseInt(curr.Amount);
          }
        } else {
          acc = acc + parseInt(curr.Amount);
        }
      }
      return acc;
    }, 0);

    return totalDue;
  }

  return (
    <div className="w-full h-[calc(100svh-60px)] flex flex-col justify-start items-center">
      {addModal ? (
        <>
          <AddReminderModal data={setAddModal} />
        </>
      ) : (
        <></>
      )}
      <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#fff5ee] border-none">
        <TopNavbar />
      </div>
      <div className="w-full h-full bg-[#fff5ee] py-[20px]">
        <div className="w-[calc(100%-40px)] ml-[20px] h-[135px] flex  justify-between items-center p-[20px] bg-[#ffeadc] rounded-2xl border-[1px] border-[#ffe6d7] ">
          <div className="w-full  flex flex-col justify-center items-start font-[google] font-normal text-[22px] text-white ">
            <span className="text-[#6c6c6c] text-[14px]">
              Total Due till June
            </span>
            <span className="flex justify-start items-center text-[#95241d] mt-[-5px]">
              <BiRupee className="ml-[-3px]" /> {formatAmountWithCommas(due())}
            </span>
            <span className="text-[#6c6c6c] text-[14px]">
              Total Upcoming in June
            </span>
            <span className="flex justify-start items-center text-[#95241d] mt-[-5px]">
              <BiRupee className="ml-[-3px]" />{" "}
              {formatAmountWithCommas(upcoming())}
            </span>
          </div>
          <div className="w-auto h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
            {/* <span className="text-[14px] whitespace-nowrap">New Reminder</span> */}
            <div
              className="w-[40px] h-[40px] rounded-xl bg-[#ffc296] flex justify-center items-center"
              onClick={() => {
                setAddModal(true);
                // setSplitModal(true);
              }}
            >
              <FiPlus className="text-black text-[20px]" />
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center text-[14px] font-[google] font-normal mt-[20px] px-[20px] text-[#828282]">
          Reminders,{" "}
          <span className=" ml-[4px]">
            {monthsShort[new Date().getMonth()]} - {new Date().getFullYear()}
          </span>
        </div>

        <div className="contt w-full h-[calc(100%-225px)] flex flex-col justify-start items-center overflow-y-scroll mt-[10px] px-[20px]">
          {tempTransactionHistory.map((dat) => {
            return (
              <>
                <IndividualReminder data={dat} />
              </>
            );
          })}
        </div>

        {/* <div
          className="w-[35px] h-[35px] rounded-full bg-[#de8544] fixed right-[20px] bottom-[70px] flex justify-center items-center cursor-pointer"
          onClick={() => {
            setAddModal(true);
            // setSplitModal(true);
          }}
        >
          <FiPlus className="text-white text-[20px]" />
        </div> */}
      </div>
    </div>
  );
};

export default ReminderPage;
