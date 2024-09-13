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
import OutsideClickHandler from "react-outside-click-handler";
import { MdKeyboardArrowDown } from "react-icons/md";
import Tutorial from "./Tutorial";
import { HiOutlinePlus } from "react-icons/hi";
import { TbArrowBigLeftLinesFilled, TbTransactionRupee } from "react-icons/tb";

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

const monthNamess = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const years = [
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const HomePage = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(parseInt(new Date().getFullYear()));
  const [reminderCount, setReminderCount] = useState(0);
  const [filterPos, setFilterPos] = useState(5);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [end, setEnd] = useState(false);
  const [chooseMonth, setChooseMonth] = useState(false);
  const [section, setSection] = useState(true);
  const [dueReminderShow, setDueReminderShow] = useState(false);
  const [UIColor, setUIColor] = useState("");
  const [UIIndex, setUIIndex] = useState("");

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
      setDueReminderShow(snapshot?.data()?.DueReminder);
      setUIColor(snapshot?.data()?.Theme);
      setUIIndex(snapshot?.data()?.SecondaryTheme);
      console.log("snapshot?.data()?.SecondaryTheme");
      console.log(snapshot?.data()?.SecondaryTheme);
      // setTempTransactionHistory(snapshot?.data()?.Reminders);
    });
  }

  useEffect(() => {
    console.log("UI color");
    console.log(UIIndex);
  }, [UIIndex]);

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
  }, [transactionHistory, month, year]);

  useEffect(() => {
    console.log(tempTransactionHistory);
  }, [tempTransactionHistory]);

  function getObjectsForCurrentMonthAndYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    setTempTransactionHistory(
      transactionHistory.filter((item) => {
        const dateArr = item.Date.split("/").map(Number);
        // console.log("dateeeee");
        // console.log(month, " + ", year);
        // const itemDate = new Date(year, month - 1, day); // Month is 0-indexed for Date object
        // console.log(itemDate);
        // return itemDate.getMonth() === month && itemDate.getFullYear() === year;
        console.log(dateArr[1], month, dateArr[2], year);
        console.log(dateArr[1] - 1 === month && dateArr[2] - 1 === year);
        return dateArr[1] === month && dateArr[2] === year;
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
    <>
      {showFilterModal ? (
        <>
          <div
            className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex flex-col justify-end items-center p-[20px] z-50 font-[google] font-normal"
            style={{ zIndex: 70 }}
            onClick={() => {
              setShowFilterModal(false);
            }}
          >
            <>
              <div
                className="min-w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-3xl  font-[google] font-normal text-[15px] flex flex-col justify-center items-start p-[30px] py-[25px] "
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <span className="text-[22px]  mb-[10px]">Filter By</span>
                <span
                  className=" h-[15px] mt-[5px] flex justify-start items-center w-full cursor-pointer"
                  onClick={() => {
                    sortObjectsByDateAsc();
                    setShowFilterModal(!showFilterModal);
                    setFilterPos(1);
                  }}
                >
                  Date in Ascending Order{" "}
                  {filterPos == 1 ? (
                    <>
                      <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
                <span
                  className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
                  onClick={() => {
                    sortObjectsByDateDesc();
                    setShowFilterModal(!showFilterModal);
                    setFilterPos(2);
                  }}
                >
                  Date in Descending Order{" "}
                  {filterPos == 2 ? (
                    <>
                      <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
                <span
                  className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
                  onClick={() => {
                    sortObjectsByAmountAsc();
                    setShowFilterModal(!showFilterModal);
                    setFilterPos(3);
                  }}
                >
                  Price from Low to High{" "}
                  {filterPos == 3 ? (
                    <>
                      <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
                <span
                  className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
                  onClick={() => {
                    sortObjectsByAmountDesc();
                    setShowFilterModal(!showFilterModal);
                    setFilterPos(4);
                  }}
                >
                  Price from High to Low{" "}
                  {filterPos == 4 ? (
                    <>
                      <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
                <span
                  className="mt-[12px] h-[15px] flex justify-start items-center w-full cursor-pointer"
                  onClick={() => {
                    getObjectsForCurrentMonthAndYear();
                    setShowFilterModal(!showFilterModal);
                    setFilterPos(5);
                  }}
                >
                  Normal{" "}
                  {filterPos == 5 ? (
                    <>
                      <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
                <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                  <div
                    className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                    onClick={() => {
                      setShowFilterModal(false);
                    }}
                  >
                    Done
                  </div>
                </div>
              </div>
            </>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* <div
        className={
          "w-full h-[100svh] flex justify-center items-end font-[google] px-[20px] fixed top-0 left-0 pb-[20px] text-[14px]" +
          (!showFilterModal
            ? " z-0 bg-transparent backdrop-blur-none"
            : " z-40 bg-[#70708628] backdrop-blur-md")
        }
        style={{ transition: ".4s" }}
      >
        <div
          className={
            "  rounded-3xl bg-[#ffffff] z-50 flex justify-center items-center p-[30px]" +
            (showFilterModal
              ? " mt-[0px] opacity-100 rubberAnimate"
              : " mb-[-200px] w-[150px]  opacity-0")
          }
          style={{ transition: ".3s" }}
        >
          <div
            className={
              " rounded-3xl flex flex-col justify-end items-start " +
              (showFilterModal ? " opacity-100 rubberAnimate2" : " opacity-0")
            }
            //   style={{ transitionDelay: " .2s" }}
          >
            <span className="text-[22px]  mb-[10px]">Filter By</span>
            <span
              className=" h-[15px] mt-[5px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByDateAsc();
                setShowFilterModal(!showFilterModal);
                setFilterPos(1);
              }}
            >
              Date in Ascending Order{" "}
              {filterPos == 1 ? (
                <>
                  <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                </>
              ) : (
                <></>
              )}
            </span>
            <span
              className="mt-[8px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByDateDesc();
                setShowFilterModal(!showFilterModal);
                setFilterPos(2);
              }}
            >
              Date in Descending Order{" "}
              {filterPos == 2 ? (
                <>
                  <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                </>
              ) : (
                <></>
              )}
            </span>
            <span
              className="mt-[8px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByAmountAsc();
                setShowFilterModal(!showFilterModal);
                setFilterPos(3);
              }}
            >
              Price from Low to High{" "}
              {filterPos == 3 ? (
                <>
                  <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                </>
              ) : (
                <></>
              )}
            </span>
            <span
              className="mt-[8px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                sortObjectsByAmountDesc();
                setShowFilterModal(!showFilterModal);
                setFilterPos(4);
              }}
            >
              Price from High to Low{" "}
              {filterPos == 4 ? (
                <>
                  <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                </>
              ) : (
                <></>
              )}
            </span>
            <span
              className="mt-[8px] h-[15px] flex justify-start items-center w-full cursor-pointer"
              onClick={() => {
                getObjectsForCurrentMonthAndYear();
                setShowFilterModal(!showFilterModal);
                setFilterPos(5);
              }}
            >
              Normal{" "}
              {filterPos == 5 ? (
                <>
                  <TbArrowBigLeftLinesFilled className=" ml-[7px] text-[#181F32]" />{" "}
                </>
              ) : (
                <></>
              )}
            </span>
            <div className="w-full h-auto mt-[10px] flex justify-end items-end">
              <div
                className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                onClick={() => {
                  setShowFilterModal(false);
                }}
              >
                Done
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {chooseMonth ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40"
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

              <div
                className={
                  "min-w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-3xl font-[google] font-normal text-[14px] flex flex-wrap justify-start items-start py-[25px]  px-[30px]" +
                  (section ? " rounded-tr-3xl" : " rounded-tl-3xl")
                }
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <span className="text-[22px] w-full  mb-[20px] flex justify-between items-center">
                  {section ? <>Select Month of ({year}) </> : <>Select Year </>}
                  <div
                    className="cursor-pointer w-[35px] h-[35px] rounded-xl flex justify-center items-center "
                    style={{ backgroundColor: `${UIColor}` }}
                    onClick={() => {
                      setSection(!section);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-calendar-cog"
                    >
                      <path d="m15.2 16.9-.9-.4" />
                      <path d="m15.2 19.1-.9.4" />
                      <path d="M16 2v4" />
                      <path d="m16.9 15.2-.4-.9" />
                      <path d="m16.9 20.8-.4.9" />
                      <path d="m19.5 14.3-.4.9" />
                      <path d="m19.5 21.7-.4-.9" />
                      <path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                      <path d="m21.7 16.5-.9.4" />
                      <path d="m21.7 19.5-.9-.4" />
                      <path d="M3 10h18" />
                      <path d="M8 2v4" />
                      <circle cx="18" cy="18" r="3" />
                    </svg>
                  </div>
                </span>
                <div className="w-full flex justify-between items-center">
                  {" "}
                </div>
                {section ? (
                  <>
                    {monthNamess?.map((name, index) => {
                      return (
                        <>
                          {monthNamess[month - 1] === name ? (
                            <span
                              key={index}
                              className=" w-[calc((100%-0px)/4)] font-[google] text-[14.5px] my-[2.5px] text-[black] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-0px)/4)] font-[google] text-[14.5px] my-[2.5px] text-[#b8b8b8] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {
                                setMonth(index + 1);
                                setChooseMonth(false);
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
                              className=" w-[calc((100%-0px)/4)] my-[2.5px] rounded-md flex justify-center text-[black] items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-0px)/4)] my-[2.5px] rounded-md flex justify-center text-[#b8b8b8] items-center min-h-[35px] cursor-pointer"
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

      {/* <Tutorial /> */}
      <div className="w-full h-[calc(100svh-60px)] bg-[#ffffff] flex flex-col justify-start items-center ">
        {/* <TopNavbar /> */}
        <QuickInfo
          month={month}
          year={year}
          data={tempTransactionHistoryOne[0]}
          UIColor={UIColor}
        />
        {/* <div className="w-[calc(100%-40px)] border-[.7px] border-[#eff7ff]"></div> */}
        <span className="text-[#00000057] font-[google]  font-normal text-[14px] w-full  flex justify-between h-[50px] items-center px-[20px] ">
          <div className="flex justify-start items-center">
            {/* Transaction History,{" "} */}
            <span
              className={`ml-[0px] text-[14px] text-[black] cursor-pointer flex justify-start items-center px-[7px]  h-full rounded-xl  py-[7px] pl-[11px] bg-[${UIColor}]`}
              style={{ backgroundColor: `${UIColor}` }}
              onClick={() => {
                setChooseMonth(true);
              }}
            >
              {monthNames[month - 1]} - {year}{" "}
              <MdKeyboardArrowDown className="text-[21px]" />
            </span>
          </div>
          {tempTransactionHistory?.length !== 0 ? (
            <div
              className="w-[30px] h-full flex justify-end items-center text-black text-[14px] -rotate-90"
              onClick={() => {
                setShowFilterModal(!showFilterModal);
              }}
            >
              {/* <FaFilter /> */}
              <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-bar-chart-2"
              >
                <line x1="18" x2="18" y1="20" y2="10" />
                <line x1="12" x2="12" y1="20" y2="4" />
                <line x1="6" x2="6" y1="20" y2="14" />
              </svg>
            </div>
          ) : (
            <></>
          )}
        </span>
        <div className="w-full h-0 flex justify-end items-start px-[20px]"></div>

        <div
          className={
            "w-full h-auto  flex flex-col items-center justify-start " +
            (reminderCount === 0 || dueReminderShow == false
              ? " max-h-[calc(100%-190px)]"
              : " max-h-[calc(100%-300px)]")
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
            {tempTransactionHistory?.length === 0 ? (
              <>
                <span className=" w-[calc(100%-40px)] h-[100px]  rounded-3xl border-[1px] border-[#ebebf500] bg-[#ebebf500]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black] z-10">
                  <span className="z-10 text-[16px] flex justify-center items-center">
                    No Transactions Found{" "}
                    <div className="ml-[10px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-satellite"
                      >
                        <path d="M13 7 9 3 5 7l4 4" />
                        <path d="m17 11 4 4-4 4-4-4" />
                        <path d="m8 12 4 4 6-6-4-4Z" />
                        <path d="m16 8 3-3" />
                        <path d="M9 21a6 6 0 0 0-6-6" />
                      </svg>
                    </div>
                  </span>
                  {/* <TbTransactionRupee className="text-[70px] text-[#ebebf5] z-0 fixed " /> */}
                </span>
              </>
            ) : (
              <>
                {tempTransactionHistory?.map((data, index) => {
                  const isLast = index === tempTransactionHistory.length - 1;
                  return (
                    <>
                      <IndependentTransaction
                        // photo={url}
                        index={index}
                        count={tempTransactionHistory.length}
                        data={data}
                        isLast={isLast}
                        UIColor={UIColor}
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
              </>
            )}
          </div>
        </div>
        {tempTransactionHistory?.length === 0 ? (
          <></>
        ) : (
          <>
            {end ? (
              <></>
            ) : (
              <div class="bg-[#c3e2ff]  animate-bounce w-[30px] h-[30px] rounded-full flex justify-center items-center mt-[-30px]">
                <LuArrowDown className="text-[#000000] text-[18px]" />
              </div>
            )}
          </>
        )}

        {/* <div className="w-full h-[70px]  flex justify-center items-end"> */}
        <AddIndependentTransaction UIColor={UIColor} />
        {/* </div> */}

        {dueReminderShow ? (
          <>
            {reminderCount !== 0 ? (
              <Remiders
                setReminderCount={setReminderCount}
                data={tempTransactionHistoryOne}
                UIColor={UIColor}
                UIIndex={UIIndex}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        {/* <BottomNavbar /> */}
      </div>
    </>
  );
};

export default HomePage;
