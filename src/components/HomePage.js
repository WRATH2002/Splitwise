import React, { useEffect, useState } from "react";
import TopNavbar from "./TopNavbar";
import IndependentTransaction from "./IndependentTransaction";
import AddIndependentTransaction from "./AddIndependentTransaction";
import QuickInfo from "./QuickInfo";
import BottomNavbar from "./BottomNavbar";
import Remiders from "./Remiders";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import { AiOutlineSwap } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { LuArrowDown } from "react-icons/lu";

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

const HomePage = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [end, setEnd] = useState(false);

  const [transactionHistoryOne, setTransactionHistoryOne] = useState([]);
  const [tempTransactionHistoryOne, setTempTransactionHistoryOne] = useState(
    []
  );

  useEffect(() => {
    // fetchMonth();
    fetchReminders();
    // console.log("tempTransactionHistory");
    // console.log(tempTransactionHistory);
  }, []);

  // function fetchMonth() {
  //   var date = new Date();
  //   const currMonth = date.getMonth() + 1;
  //   setMonth(currMonth);
  // }

  useEffect(() => {
    if (transactionHistoryOne != undefined) {
      sortTransactionsByDate();
    }
  }, [transactionHistoryOne]);

  function sortTransactionsByDate() {
    setTempTransactionHistoryOne(
      filterByPresentDate(
        transactionHistoryOne.sort((a, b) => {
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
      setTransactionHistoryOne(snapshot?.data()?.Reminders);
      // setTempTransactionHistory(snapshot?.data()?.Reminders);
    });
  }

  useEffect(() => {
    setReminderCount(tempTransactionHistoryOne.length);
  }, [tempTransactionHistoryOne, transactionHistoryOne]);

  useEffect(() => {
    fetchMonth();
    fetchTransactionData();
  }, []);

  function fetchMonth() {
    var date = new Date();
    const currMonth = date.getMonth() + 1;
    setMonth(currMonth);
  }

  useEffect(() => {
    if (tempTransactionHistory != undefined) {
      getObjectsForCurrentMonthAndYear();
    }
  }, [transactionHistory]);

  useEffect(() => {
    console.log(tempTransactionHistory);
  }, [tempTransactionHistory]);

  function getObjectsForCurrentMonthAndYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    setTempTransactionHistory(
      tempTransactionHistory.filter((item) => {
        const [day, month, year] = item.Date.split("/").map(Number);
        // console.log("dateeeee");
        // console.log(month, " + ", year);
        const itemDate = new Date(year, month - 1, day); // Month is 0-indexed for Date object

        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      })
    );
  }

  function fetchTransactionData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setTransactionHistory(snapshot?.data()?.NormalTransaction);
      setTempTransactionHistory(snapshot?.data()?.NormalTransaction);
      // setIncome(snapshot?.data()?.TotalIncome);
      // console.log(snapshot?.data()?.Online);
    });
  }

  function sortObjectsByAmountAsc() {
    setTempTransactionHistory(
      tempTransactionHistory.sort(
        (a, b) => parseFloat(a.Amount) - parseFloat(b.Amount)
      )
    );
  }

  function sortObjectsByAmountDesc() {
    setTempTransactionHistory(
      tempTransactionHistory.sort(
        (a, b) => parseFloat(b.Amount) - parseFloat(a.Amount)
      )
    );
  }

  function sortObjectsByDateAsc() {
    setTempTransactionHistory(
      tempTransactionHistory.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.Date.split("/").map(Number);

        // Create date objects for comparison
        const dateA = new Date(yearA, monthA - 1, dayA); // monthA - 1 because months are zero-based
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateA - dateB;
      })
    );
  }

  function sortObjectsByDateDesc() {
    setTempTransactionHistory(
      tempTransactionHistory.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.Date.split("/").map(Number);

        // Create date objects for comparison
        const dateA = new Date(yearA, monthA - 1, dayA); // monthA - 1 because months are zero-based
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB - dateA;
      })
    );
  }

  // useEffect(() => {
  //   const a = document.querySelector("#container");
  //   a.addEventListener("", () => {
  //     console.log("clicked");
  //   });

  //   if (a.scrollHeight - a.scrollTop === a.clientHeight) {
  //     console.log("header bottom reached");
  //     setEnd(true);
  //     // document.removeEventListener("scroll", this.trackScrolling);
  //   }
  // }, []);

  useEffect(() => {
    console.log(reminderCount);
  }, []);

  return (
    <div className="w-full h-[calc(100svh-60px)] bg-[#FFF5EE] flex flex-col justify-start items-center pt-[20px]">
      <TopNavbar />
      <QuickInfo />
      <div className="w-[calc(100%-40px)] border-[.7px] border-[#fee6d7]"></div>
      <span className="text-[#828282] font-[google] font-normal text-[14px] w-full mt-[20px] flex justify-between h-[30px] items-start px-[20px] ">
        <div className="flex justify-start items-center">
          Transaction History,{" "}
          <span className=" ml-[4px]">
            {monthNames[month - 1]} - {new Date().getFullYear()}
          </span>
        </div>
        <div
          className="w-[30px] h-full flex justify-end items-center text-black text-[14px]"
          onClick={() => {
            setShowFilterModal(!showFilterModal);
          }}
        >
          <FaFilter />
        </div>
      </span>
      <div className="w-full h-0 flex justify-end items-start px-[20px]">
        {showFilterModal ? (
          <div className="w-auto h-auto bg-[#ffeee3]  border-[1px] border-[#ffe6d7] rounded-2xl z-20 flex flex-col justify-center items-start font-[google] font-normal text-[14px] p-[20px] text-black ">
            {/* <span className="mb-[7px] h-[15px] flex justify-start items-center text-[#828282]">
              Filter By
            </span>
            <div className="w-full border-[.7px] border-[#fdd3b8]"></div> */}
            <span
              className=" h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByDateAsc();
                setShowFilterModal(!showFilterModal);
              }}
            >
              Date Asc
            </span>
            <span
              className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByDateDesc();
                setShowFilterModal(!showFilterModal);
              }}
            >
              Date Desc
            </span>
            <span
              className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByAmountAsc();
                setShowFilterModal(!showFilterModal);
              }}
            >
              Price (Low - High)
            </span>
            <span
              className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByAmountDesc();
                setShowFilterModal(!showFilterModal);
              }}
            >
              Price (High - Low)
            </span>
            <span
              className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                getObjectsForCurrentMonthAndYear();
                setShowFilterModal(!showFilterModal);
              }}
            >
              Normal
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div
        className={
          "w-full  flex flex-col items-center justify-start " +
          (reminderCount === 0
            ? " max-h-[calc(100%-281.4px)]"
            : " max-h-[calc(100%-391.4px)]")
        }
        style={{ transition: ".4s" }}
        id="container"
      >
        <div
          className="w-full h-auto  overflow-y-scroll flex justify-start items-center flex-col"
          onScroll={() => {
            setEnd(true);
          }}
        >
          {tempTransactionHistory?.map((data) => {
            return (
              <>
                <IndependentTransaction
                  // photo={url}
                  data={data}
                  // name={data?.Lable}
                  // date={data?.Date}
                  // amount={data?.Amount}
                  // category={data?.Category}
                  // member={data?.Mmebers}
                  // type={data?.TransactionType}
                />
              </>
            );
          })}
        </div>
      </div>
      {end ? (
        <></>
      ) : (
        <div class="bg-[#de8544]  animate-bounce w-[30px] h-[30px] rounded-full flex justify-center items-center mt-[-30px]">
          <LuArrowDown className="text-white text-[18px]" />
        </div>
      )}

      <div className="w-full h-[70px]  flex justify-center items-end">
        <AddIndependentTransaction />
      </div>

      {reminderCount !== 0 ? (
        <Remiders
          setReminderCount={setReminderCount}
          data={tempTransactionHistoryOne}
        />
      ) : (
        <></>
      )}
      {/* <BottomNavbar /> */}
    </div>
  );
};

export default HomePage;
