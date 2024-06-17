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
import { MdKeyboardArrowDown } from "react-icons/md";
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
const years = [
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];
const ReminderPage = () => {
  const [addModal, setAddModal] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(parseInt(new Date().getFullYear()));
  const [chooseMonth, setChooseMonth] = useState(false);
  const [section, setSection] = useState(true);

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

      {chooseMonth ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#0000003e] p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
            onClick={() => {
              // setChooseMonth(false);
            }}
          >
            {/* <OutsideClickHandler
              onOutsideClick={() => {
                setShowFilterModal(false);
              }}
            > */}
            <>
              <div
                className="w-full h-[calc(100svh-200px)]"
                onClick={() => {
                  setChooseMonth(false);
                }}
              ></div>
              <div className="w-full h-[45px] flex justify-between items-end bg-transparent rounded-t-[20px] font-[google] font-normal text-[14px]">
                <div className="w-[calc(100%-40px)] h-[20px] bg-[#fff5ee] rounded-t-[-20px]  fixed z-30"></div>

                <div
                  className={
                    "w-[calc(100%/2)] h-full flex justify-center items-center z-40 pb-[5px] " +
                    (!section
                      ? " bg-[#c1b9b4] pt-0 pl-0 p-[5px] rounded-br-[25px] rounded-tr-[25px]"
                      : " bg-[#fff5ee] p-0 rounded-t-full cursor-pointer")
                  }
                >
                  <div
                    className="w-full h-full flex justify-center items-center rounded-full bg-[#fff5ee] cursor-pointer  text-[16px]"
                    onClick={() => {
                      setSection(true);
                    }}
                  >
                    Month
                  </div>
                </div>
                <div
                  className={
                    "w-[calc(100%/2)] h-full flex justify-center items-center z-40 pb-[5px] " +
                    (section
                      ? " bg-[#c1b9b4] pt-0 pr-0 p-[5px] rounded-bl-[25px] rounded-tl-[25px]"
                      : " bg-[#fff5ee] p-0 rounded-t-[20px] cursor-pointer")
                  }
                >
                  <div
                    className="w-full rounded-full h-full flex justify-center items-center z-50 bg-[#fff5ee] cursor-pointer text-[16px]"
                    onClick={() => {
                      setSection(false);
                    }}
                  >
                    Year
                  </div>
                </div>
              </div>

              <div
                className={
                  "min-w-full z-50 h-auto bg-[#fff5ee] drop-shadow-sm   text-black  rounded-b-[20px] font-[google] font-normal text-[14px] flex flex-wrap justify-start items-start py-[17.5px]  px-[17.5px]" +
                  (section ? " rounded-tr-[20px]" : " rounded-tl-[20px]")
                }
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <div className="w-full flex justify-between items-center">
                  {" "}
                </div>
                {section ? (
                  <>
                    {monthsShort?.map((name, index) => {
                      return (
                        <>
                          {monthsShort[month - 1] === name ? (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#ffd8be] bg-[#ffd8be] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#ffd8be] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {
                                setMonth(index + 1);
                              }}
                            >
                              {name}
                            </span>
                          )}
                        </>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {years?.map((name, index) => {
                      return (
                        <>
                          {year === name ? (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#ffd8be] bg-[#ffd8be] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#ffd8be] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {
                                setYear(name);
                              }}
                            >
                              {name}
                            </span>
                          )}
                        </>
                      );
                    })}
                  </>
                )}
              </div>
            </>
            {/* </OutsideClickHandler> */}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#fff5ee] border-none">
        <TopNavbar />
      </div>
      <div className="w-full h-full bg-[#fff5ee] py-[20px]">
        <div className="w-[calc(100%-40px)] ml-[20px] h-[135px] flex  justify-between items-center p-[20px] bg-[#ffeadc] rounded-3xl border-[1px] border-[#ffe6d7] ">
          <div className="w-full  flex flex-col justify-center items-start font-[google] font-normal text-[22px] text-white ">
            <span className="text-[#6c6c6c] text-[14px]">
              Total Due till June
            </span>
            <span className="flex justify-start items-center text-[#c43b31] mt-[-5px]">
              <BiRupee className="ml-[-3px]" /> {formatAmountWithCommas(due())}
            </span>
            <span className="text-[#6c6c6c] text-[14px]">
              Total Upcoming in June
            </span>
            <span className="flex justify-start items-center text-[#c43b31] mt-[-5px]">
              <BiRupee className="ml-[-3px]" />{" "}
              {formatAmountWithCommas(upcoming())}
            </span>
          </div>
          <div className="w-auto h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
            {/* <span className="text-[14px] whitespace-nowrap">New Reminder</span> */}
            <div
              className="w-[40px] h-[40px] rounded-2xl bg-[#ffcba5] flex justify-center items-center"
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
          <span
            className=" ml-[4px] text-black flex justify-start items-center"
            onClick={() => {
              setChooseMonth(true);
              // setAddModal(true);
              // setSplitModal(true);
            }}
          >
            {monthsShort[month - 1]} - {year}{" "}
            <MdKeyboardArrowDown className="text-[21px]" />
          </span>
        </div>

        <div className="contt w-full h-[calc(100%-225px)] flex flex-col justify-start items-center overflow-y-scroll mt-[10px] px-[20px]">
          {tempTransactionHistory.length === 0 ? (
            <>
              <span className="mt-[30px] w-full h-[100px] rounded-3xl border-[1px] border-[#ffe6d7] bg-[#ffe6d7]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black]">
                No Reminders remaining this Month
              </span>
            </>
          ) : (
            <>
              {tempTransactionHistory.map((dat) => {
                return (
                  <>
                    <IndividualReminder data={dat} />
                  </>
                );
              })}
            </>
          )}
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
