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
            className="w-full h-[100svh]  flex flex-col justify-end items-start  backdrop-blur-md bg-[#181f3240] p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
            onClick={() => {
              setShowFilterModal(false);
            }}
          >
            {/* <OutsideClickHandler
              onOutsideClick={() => {
                setShowFilterModal(false);
              }}
            > */}
            <>
              <div className="w-full flex flex-col justify-end items-start h-[40px]">
                <div className="w-full h-auto flex justify-start items-end z-30">
                  <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                    <span className="mt-[10px]">Filter By</span>
                  </div>
                  <div className="h-[20px] aspect-square inRound"></div>
                  <div
                    className="h-[35px]  aspect-square rounded-full cursor-pointer bg-[#181F32] text-[white] ml-[-15px] mb-[5px] flex justify-center items-center text-[20px] "
                    onClick={() => {
                      setShowFilterModal(false);
                    }}
                  >
                    <HiOutlinePlus className="rotate-45" />
                  </div>
                </div>
              </div>
              <div
                className="min-w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]"
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <span
                  className=" h-[15px] flex justify-start items-center w-full cursor-pointer"
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
              </div>
            </>
            {/* </OutsideClickHandler> */}
          </div>
        </>
      ) : (
        <></>
      )}

      {chooseMonth ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center backdrop-blur-sm bg-[#68777b7a] p-[20px] fixed top-0 left-0  z-40"
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
              <div className="w-full h-[45px] flex justify-between items-end rounded-t-3xl font-[google] font-normal bg-[#b7bec0] text-[14px]">
                <div className="w-[calc(100%-40px)] h-[20px] bg-[#ffffff]  fixed z-30"></div>

                <div
                  className={
                    "w-[calc(100%/2)] h-full flex justify-center items-center z-40 pb-[5px] " +
                    (!section
                      ? " bg-[#c1c1c1] pt-0 pl-0 p-[5px] rounded-br-3xl rounded-tr-3xl"
                      : " bg-[#ffffff] p-0 rounded-t-3xl cursor-pointer r")
                  }
                >
                  <div
                    className="w-full h-full flex justify-center items-center rounded-[20px] bg-[#ffffff] cursor-pointer  text-[16px]"
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
                      ? " bg-[#c1c1c1] pt-0 pr-0 p-[5px] rounded-bl-3xl rounded-tl-3xl"
                      : " bg-[#ffffff] p-0 rounded-t-3xl cursor-pointer")
                  }
                >
                  <div
                    className="w-full rounded-[20px] h-full flex justify-center items-center z-50 bg-[#ffffff] cursor-pointer text-[16px]"
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
                  "min-w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl font-[google] font-normal text-[14px] flex flex-wrap justify-start items-start py-[17.5px]  px-[17.5px]" +
                  (section ? " rounded-tr-3xl" : " rounded-tl-3xl")
                }
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <div className="w-full flex justify-between items-center">
                  {" "}
                </div>
                {section ? (
                  <>
                    {monthNames?.map((name, index) => {
                      return (
                        <>
                          {monthNames[month - 1] === name ? (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#acebff] bg-[#acebff] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#acebff] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
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
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#acebff] bg-[#acebff] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border border-[#acebff] rounded-md flex justify-center items-center min-h-[35px] cursor-pointer"
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

      {/* <div className="w-full h-[100svh] bg-[white] left-0 top-0 fixed flex flex-col justify-start items-start p-[20px] z-50 font-[google] font-normal">
        <span className="text-[22px] ">Notifications</span>
        <div className="w-full border border-[#efebff] my-[15px]"></div>
        <div className="w-full h-auto flex flex-col justify-start items-start">
          <div className="w-full h-auto flex justify-start items-start p-[20px] border border-[#efebff] bg-[#efebff] rounded-2xl">
           
            <div className="w-full h-auto flex flex-col justify-start items-center">
              <span className="text-black text-[18px] font-[satoshi] font-semibold flex justify-start items-center w-full">
                <svg
                  className="mr-[5px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                4573.38 has been Credited
              </span>
              <span className="text-[15px] font-[google] m-[7px] text-[#000000e2]">
                Himadri Purkait has paid 4573.38 /- for split transaction{" "}
                <b className="text-[black]">House Rent</b>
              </span>
            </div>
          </div>
          <div className="w-full h-auto flex justify-start items-start p-[20px] border border-[#efebff] bg-[#efebff] rounded-2xl mt-[10px]">
           
            <div className="w-full h-auto flex flex-col justify-start items-center">
              <span className="text-black text-[18px] font-[satoshi] font-semibold flex justify-start items-center w-full">
                <svg
                  className="mr-[5px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                4573.38 has been Credited
              </span>
              <span className="text-[15px] font-[google] m-[7px] text-[#000000e2]">
                Himadri Purkait has paid 4573.38 /- for split transaction{" "}
                <b className="text-[black]">House Rent</b>
              </span>
              <span className="w-full flex justify-end items-center">
                <span className="px-[15px] py-[7px] rounded-xl flex justify-center text-[14px] items-center bg-[#ccbffc]">
                  Mark as Read
                </span>
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* <Tutorial /> */}
      <div className="w-full h-[calc(100svh-60px)] bg-[#ffffff] flex flex-col justify-start items-center ">
        {/* <TopNavbar /> */}
        <QuickInfo
          month={month}
          year={year}
          data={tempTransactionHistoryOne[0]}
        />
        {/* <div className="w-[calc(100%-40px)] border-[.7px] border-[#eff7ff]"></div> */}
        <span className="text-[#00000057] font-[google]  font-normal text-[14px] w-full mt-[20px] flex justify-between h-[30px] items-start px-[20px] ">
          <div className="flex justify-start items-center">
            Transaction History,{" "}
            <span
              className=" ml-[2px] text-[14px] text-[black] cursor-pointer flex justify-start items-center px-[6px] pl-[8px] h-full rounded-full  py-[2px]"
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
              ? " max-h-[calc(100%-240px)]"
              : " max-h-[calc(100%-370px)]")
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
                <span className=" w-[calc(100%-40px)] h-[100px] rounded-3xl border-[1px] border-[#ebebf500] bg-[#ebebf500]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black] z-10">
                  <span className="z-10">No Transactions Done</span>
                  <TbTransactionRupee className="text-[70px] text-[#ebebf5] z-0 fixed " />
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
                        data={data}
                        isLast={isLast}
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

        <div className="w-full h-[70px]  flex justify-center items-end">
          <AddIndependentTransaction />
        </div>

        {dueReminderShow ? (
          <>
            {reminderCount !== 0 ? (
              <Remiders
                setReminderCount={setReminderCount}
                data={tempTransactionHistoryOne}
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
