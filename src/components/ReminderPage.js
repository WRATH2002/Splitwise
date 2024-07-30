import React, { useRef } from "react";
import { BiLeftArrowAlt, BiPlus, BiRupee } from "react-icons/bi";
import TopNavbar from "./TopNavbar";
import { FiBold, FiItalic, FiPlus, FiUnderline } from "react-icons/fi";
import AddReminderModal from "./AddReminderModal";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { useState, useEffect } from "react";
import { arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";
import IndividualReminder from "./IndividualReminder";
import { MdDone, MdKeyboardArrowDown } from "react-icons/md";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { IoCheckboxOutline } from "react-icons/io5";
import { GoStrikethrough } from "react-icons/go";
import {
  PiArrowBendUpLeft,
  PiArrowBendUpRight,
  PiListBulletsBold,
  PiPushPin,
  PiPushPinBold,
} from "react-icons/pi";
import { HiArrowLeft } from "react-icons/hi";
import {
  LuChevronRight,
  LuCornerUpLeft,
  LuCornerUpRight,
  LuLock,
  LuTimer,
  LuUnlock,
} from "react-icons/lu";
import { useLongPress } from "use-long-press";
import { TbTransactionRupee } from "react-icons/tb";
import RedminderDate from "./RedminderDate";

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
  const [notes, setNotes] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(parseInt(new Date().getMonth) + 1);
  const [year, setYear] = useState(parseInt(new Date().getFullYear()));
  const [chooseMonth, setChooseMonth] = useState(false);
  const [section, setSection] = useState(true);
  const [noteEditor, setNoteEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tempData, setTempData] = useState({});
  const [deleteData, setDeleteData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [sec, setSec] = useState("Reminder");
  // const [Date, Date] = useState("");
  const [reminderDate, setReminderDate] = useState("");

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
    console.log(transactionHistory);
  }, [transactionHistory, month, year]);

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

        // transactionHistory.filter((data) => {
        //   if (
        //     data.Date.split("/")[1] == month &&
        //     data.Date.split("/")[2] == year
        //   ) {
        //     return data;
        //   }
        // })
      )
    );
  }

  function filterByPresentDate(data) {
    // let preMonth = new Date().getMonth() + 1;
    const newData = data?.filter((obj) => {
      let dateArr = obj?.Date?.split("/");
      // console.log(preMonth);
      if (parseInt(dateArr[1]) <= parseInt(month)) {
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
      setNotes(snapshot?.data()?.Notes);
      // setTempTransactionHistory(snapshot?.data()?.Reminders);
    });
  }

  function upcoming() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let count = 0;

    let totalUpcoming = tempTransactionHistory.reduce((acc, curr) => {
      let dateArr = curr?.Date?.split("/");
      if (dateArr[1] == month) {
        if (dateArr[0] > date) {
          acc = acc + parseInt(curr.Amount);
          count = count + 1;
        }
      }
      return acc;
    }, 0);

    return { acc: totalUpcoming, count: count };
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
    let count = 0;

    let totalDue = tempTransactionHistory.reduce((acc, curr) => {
      let dateArr = curr?.Date?.split("/");
      if (dateArr[1] <= month) {
        if (dateArr[1] == month) {
          if (dateArr[0] <= date) {
            acc = acc + parseInt(curr.Amount);
            count = count + 1;
          }
        } else {
          acc = acc + parseInt(curr.Amount);
          count = count + 1;
        }
      }
      return acc;
    }, 0);

    return { acc: totalDue, count: count };
  }

  const bind = useLongPress(() => {
    // alert("Your are now in Edit Mode");
    setEdit(true);
  });

  function deleteNoteFromFirebase() {
    const user = firebase.auth().currentUser;
    // const userRef = db.collection("Expense").doc(user?.uid);
    deleteData.forEach((data) => {
      db.collection("Expense")
        .doc(user?.uid)
        .update({
          Notes: arrayRemove(data),
        });
    });
    setDeleteData([]);
  }

  return (
    <div className="w-full h-[calc(100svh-60px)] flex flex-col justify-start items-center">
      {addModal ? (
        <>
          <AddReminderModal
            reminderDate={reminderDate}
            data={setAddModal}
            setReminderDate={setReminderDate}
          />
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
              <div className="w-full h-[45px] flex justify-between items-end bg-transparent rounded-t-3xl font-[google] font-normal text-[14px]">
                <div className="w-[calc(100%-40px)] h-[20px] bg-[#fff5ee]  fixed z-30"></div>

                <div
                  className={
                    "w-[calc(100%/2)] h-full flex justify-center items-center z-40 pb-[5px] " +
                    (!section
                      ? " bg-[#c1b9b4] pt-0 pl-0 p-[5px] rounded-br-3xl rounded-tr-3xl"
                      : " bg-[#fff5ee] p-0 rounded-t-3xl cursor-pointer")
                  }
                >
                  <div
                    className="w-full h-full flex justify-center items-center rounded-[20px] bg-[#fff5ee] cursor-pointer  text-[16px]"
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
                      ? " bg-[#c1b9b4] pt-0 pr-0 p-[5px] rounded-bl-3xl rounded-tl-3xl"
                      : " bg-[#fff5ee] p-0 rounded-t-3xl cursor-pointer")
                  }
                >
                  <div
                    className="w-full rounded-[20px] h-full flex justify-center items-center z-50 bg-[#fff5ee] cursor-pointer text-[16px]"
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
      {/* <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#ffffff] border-none">
        <TopNavbar />
      </div> */}

      {sec === "Note" ? (
        <div className="w-full h-[calc(100%-60px)] overflow-y-scroll flex justify-start items-start flex-wrap p-[15px] font-[google] ">
          <div className="w-full flex justify-start items-start flex-wrap ">
            <div className="min-w-[calc((100%-20px)/2)] text-[16px] min-h-[100px] bg-[#F4F5F7] rounded-2xl mx-[5px] mb-[10px] flex justify-center items-center cursor-pointer">
              <div
                className="w-auto flex justify-center items-center p-[20px]"
                onClick={() => {
                  if (edit) {
                    setEdit(false);
                    setDeleteData([]);
                  } else {
                    setNoteEditor(true);
                  }
                  // setDataClicked(true);
                  // setTitle()
                }}
                style={{ transition: ".4s" }}
              >
                <div className="w-[30px] h-[30px] rounded-full bg-[#181F32] text-[#ffffff] flex justify-center items-center  mr-[10px]">
                  <BiPlus
                    className={
                      "text-[25px] z-0" + (edit ? " rotate-45" : " rotate-0")
                    }
                    style={{ transition: ".4s" }}
                  />
                </div>{" "}
                {edit ? <>Cancel</> : <>Add Note</>}
              </div>
            </div>
            {notes?.map((data, index) => {
              return (
                <>
                  <div
                    className={
                      "w-[calc((100%-20px)/2)] min-h-[210px]  rounded-2xl mx-[5px] mb-[10px] flex flex-col justify-between items-start overflow-hidden p-[20px] cursor-pointer" +
                      (index % 2 != 0 ? " mt-[-110px]" : " mt-[0px]") +
                      (deleteData.includes(data)
                        ? " bg-[#d0d1d4] "
                        : " bg-[#F4F5F7] ")
                    }
                    onClick={() => {
                      if (edit) {
                        if (deleteData.includes(data)) {
                          let temp = deleteData.filter(
                            (dataa) => dataa != data
                          );
                          setDeleteData(temp);
                        } else {
                          setDeleteData((prevItems) => [...prevItems, data]);
                        }
                      } else {
                        setNoteEditor(true);
                        setTitle(data?.Title);
                        setBody(data?.Body);
                        setTempData(data);
                      }
                    }}
                    {...bind()}
                  >
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-[22px] w-full  overflow-hidden line-clamp-1 text-ellipsis">
                        {data?.Title}
                      </span>
                      <span className=" text-[14px] text-[#00000085] w-full overflow-hidden line-clamp-4 text-ellipsis  mt-[4px]">
                        {data?.Body}
                      </span>
                    </div>
                    <div className="w-full flex h-[26px] justify-between items-center">
                      <span className="text-[14px] text-[#00000085]">
                        {data?.Date}
                      </span>
                      {edit ? (
                        <div
                          className={
                            "w-[26px] h-[26px] rounded-full  flex justify-center items-center" +
                            (deleteData.includes(data)
                              ? " bg-[#181F32] text-white"
                              : " bg-[#ffffff] text-white")
                          }
                        >
                          <MdDone className="text-[20px]" />
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* <AiFillDelete className="text-[19px]" /> */}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100%-200px)] bg-[#ffffff]">
          <div className="w-[100%] h-[140px] flex  justify-between items-center  bg-[#191A2C] p-[20px]  mb-[20px]">
            <div className="w-[calc((100%-40px)/2)]  flex flex-col justify-center items-start font-[google] font-normal text-[25px] text-white ">
              <span className="text-[#ffffffd3] text-[14px]">
                Total Due by -{" "}
                <span className="text-white ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span>
              </span>
              <span className="flex justify-start items-center text-[#ffffff] mt-[0px]">
                <BiRupee className="ml-[-3px]" />{" "}
                {formatAmountWithCommas(due()?.acc)}
              </span>
              <span className="flex justify-start items-center text-[14px] py-[2px] px-[7px] rounded-xl bg-[#F4F5F7] text-[#000000] mt-[0px]">
                x {due()?.count}
              </span>
            </div>
            <div className="w-[40px] h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
              <div
                className="w-[40px] h-[40px] rounded-2xl bg-[#F4F5F7] flex justify-center items-center"
                onClick={() => {
                  setAddModal(true);
                  // setSplitModal(true);
                }}
              >
                {/* <FiPlus className="text-black text-[20px]" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
            </div>
            <div className="w-[calc((100%-40px)/2)]  flex flex-col justify-center items-end font-[google] font-normal text-[25px] text-white ">
              <span className="text-[#ffffffd3] text-[14px]">
                Upcoming for -{" "}
                <span className="text-white ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span>
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px]">
                <BiRupee className="text-white ml-[-3px]" />{" "}
                <div className="text-[#ffffff]">
                  {formatAmountWithCommas(upcoming()?.acc)}
                </div>
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px] text-[14px]">
                <div className="py-[2px] px-[7px] rounded-xl bg-[#F4F5F7] text-[#000000] flex justify-center items-center">
                  x {upcoming()?.count}
                </div>
              </span>
            </div>
          </div>

          {/* <div className="w-full h-[50px]  flex justify-center items-center mt-[10px]">
            <div className="h-full w-[calc(100%/2)] flex justify-center items-center">
              <div
                className={
                  "w-[100px] h-[40px] flex justify-center items-center  cursor-pointer" +
                  (sec === "Reminder"
                    ? " border-b-[2px] border-[black]"
                    : " border-b-[2px] border-transparent ")
                }
                onClick={() => {
                  setSec("Reminder");
                }}
              >
                Reminders
              </div>
            </div>
            <div className="h-full w-[calc(100%/2)] flex justify-center items-center">
              <div
                className={
                  "w-[100px] h-[40px] flex justify-center items-center  cursor-pointer" +
                  (sec === "Note"
                    ? "  border-b-[2px] border-[black]"
                    : " border-b-[2px] border-transparent")
                }
                onClick={() => {
                  setSec("Note");
                }}
              >
                Notes
              </div>
            </div>
          </div> */}
          {/* <div className="flex justify-start items-center">
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
          </div> */}
          <RedminderDate
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            tempTransactionHistory={tempTransactionHistory}
            setAddModal={setAddModal}
          />
          <div className="flex justify-start items-center text-[14px] font-[google] font-normal mt-[10px] px-[20px] text-[#00000057]">
            Reminders,{" "}
            <span
              className=" ml-[2px] text-[14px] text-[black] cursor-pointer flex justify-start items-center px-[6px] pl-[8px] h-full rounded-full  py-[2px]"
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
            {tempTransactionHistory.length == 0 ? (
              <>
                <span className=" w-[calc(100%-40px)] h-[100px] rounded-3xl border-[1px] border-[#ebebf500] bg-[#ebebf500]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black] z-10">
                  <span className="z-10">No Reminders Here</span>
                  <LuTimer className="text-[70px] text-[#ebebf5] z-0 fixed " />
                </span>
              </>
            ) : (
              <>
                {tempTransactionHistory.map((dat) => {
                  return (
                    <>
                      <IndividualReminder
                        data={dat}
                        setMonth={setMonth}
                        setYear={setYear}
                      />
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}

      {noteEditor ? (
        <>
          <Editor
            setNoteEditor={setNoteEditor}
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            tempData={tempData}
            setTempData={setTempData}
          />
        </>
      ) : (
        <></>
      )}

      {edit ? (
        <>
          <div
            className={
              "h-[50px]  rounded-r-full bg-[#181F32] top-[75px] left-0 fixed flex justify-end items-center" +
              (sideBar ? " w-[7px]" : " w-[20px] cursor-pointer")
            }
            onClick={() => {
              setSideBar(true);
            }}
            style={{ transition: ".4s" }}
          >
            {sideBar ? (
              <></>
            ) : (
              <>
                <LuChevronRight className="text-[20px] text-[white]" />{" "}
              </>
            )}
          </div>
          <div
            className={
              " h-auto mb-[-10px] mt-[10px]  text-[20px] left-[16px]  flex justify-evenly items-center fixed top-[66px] flex-col w-[50px]  rounded-2xl text-white drop-shadow-md" +
              (sideBar ? " ml-[0px] " : " ml-[-80px]")
            }
            style={{ transition: ".4s" }}
          >
            {/* <div>
              <LuLock className="my-[10px]" />
            </div> */}
            <div className=" h-[150px] bg-[#181F32]   flex justify-evenly items-center flex-col w-[45px] py-[10px] rounded-2xl text-white drop-shadow-sm">
              {/* <div>
              <LuLock className="my-[10px]" />
            </div> */}
              {/* deleteNoteFromFirebase() */}
              {/* <div>
                <LuUnlock className="my-[10px] cursor-pointer" />
              </div> */}
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
                class="lucide lucide-lock"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <svg
                onClick={() => {
                  setSideBar(false);
                  setEdit(false);
                  deleteNoteFromFirebase();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              {/* <div>
                <AiOutlineDelete
                  className="my-[10px] cursor-pointer"
                  
                />
              </div> */}
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
                class="lucide lucide-pin"
              >
                <path d="M12 17v5" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
              {/* <div>
                <PiPushPinBold className="my-[10px] cursor-pointer" />
              </div> */}
            </div>
            <div
              className=" h-[45px] bg-[#181F32]  mt-[10px] flex justify-evenly items-center w-[45px] rounded-3xl text-white drop-shadow-sm"
              onClick={() => {
                setSideBar(false);
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
              {/* <BiPlus className="rotate-45 text-[30px] cursor-pointer" /> */}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const Editor = (props) => {
  const [text, setText] = useState(props?.body);
  const [title, setTitle] = useState(props?.title);
  const [tempData, setTempData] = useState(props?.tempData);
  const [bold, setBold] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [formattedText, setFormattedText] = useState("");
  const [index, setIndex] = useState(0);
  const divRef = useRef(null);
  const textareaRef = useRef(null);

  const handleDivClick = () => {
    // Focus the textarea when the div is clicked
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // Find the starting index of the selected text within the div
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(divRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;

      if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);
        setFormattedText(selectedText);
        setIndex(start);
        console.log("Starting index:", start);
      } else {
        console.log("Selected text: None");
      }
    }
  };

  useEffect(() => {
    let tindex = countBoldTagsUpToIndex();
    setIndex(tindex);
  }, [index]);

  useEffect(() => {
    if (bold === true) {
      splitTextAtWordOccurrence(index);
    }
  }, [bold]);

  function splitTextAtWordOccurrence(tindex) {
    console.log(text.slice(0, tindex));
    console.log(text.slice(tindex + formattedText.length));

    setText(
      text.slice(0, tindex) +
        "<b>" +
        formattedText +
        "</b>" +
        text.slice(tindex + formattedText.length)
    );
  }

  function countBoldTagsUpToIndex() {
    let tempIndex = index;
    for (let i = 0; i <= tempIndex; i++) {
      if (text[i] == "<") {
        if (text[i + 1] == "b" && text[i + 2] == ">") {
          tempIndex = tempIndex + 3;
          i = i + 2;
        } else if (
          text[i + 1] == "/" &&
          text[i + 2] == "b" &&
          text[i + 3] == ">"
        ) {
          tempIndex = tempIndex + 4;
          i = i + 3;
        }
      }
    }

    return tempIndex;

    // if (index < 0 || index > text.length) {
    //   throw new Error("Index out of range.");
    // }

    // const textUpToIndex = text.substring(0, index);
    // const openingTag = "<b>";
    // const closingTag = "</b>";

    // let openingTagCount = 0;
    // let closingTagCount = 0;
    // let position = 0;

    // while ((position = textUpToIndex.indexOf(openingTag, position)) !== -1) {
    //   openingTagCount++;
    //   position += openingTag.length;
    // }

    // position = 0;
    // while ((position = textUpToIndex.indexOf(closingTag, position)) !== -1) {
    //   closingTagCount++;
    //   position += closingTag.length;
    // }

    // return { openingTagCount, closingTagCount };
  }

  function updateNotes() {
    // deleteNoteFromFirebase();
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user?.uid)
      .update({
        Notes: arrayRemove(tempData),
      });

    let month = [
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
    // const user = firebase.auth().currentUser;
    const userRef = db
      .collection("Expense")
      .doc(user?.uid)
      .update({
        Notes: arrayUnion({
          Title: title,
          Body: text,
          Time:
            (new Date().getHours() > 12
              ? new Date().getHours() - 12
              : new Date().getHours()) +
            ":" +
            new Date().getMinutes() +
            " " +
            (new Date().getHours() > 12 ? "PM" : "AM"),
          Date: new Date().getDate() + " " + month[new Date().getMonth()],
        }),
      });

    setTempData({
      Title: title,
      Body: text,
      Time:
        (new Date().getHours() > 12
          ? new Date().getHours() - 12
          : new Date().getHours()) +
        ":" +
        new Date().getMinutes() +
        " " +
        (new Date().getHours() > 12 ? "PM" : "AM"),
      Date: new Date().getDate() + " " + month[new Date().getMonth()],
    });
  }

  return (
    <>
      {confirmModal ? (
        <>
          <div className="fixed w-full h-[100svh] flex justify-center items-center px-[20px] top-0 left-0 z-20 bg-[#68777b7a]">
            <div className="w-full h-auto p-[20px] flex justify-start items-start font-[google] font-normal bg-white flex-col rounded-3xl">
              <span className="text-[22px]">Confirm Update</span>
              <span className="text-[15px] mt-[7px]">
                Previous note data will be erased and current data will be
                updated. Do you want to continue ?
              </span>
              <span className="text-[15px] w-full flex justify-end items-center mt-[10px] ">
                <span
                  className=" cursor-pointer"
                  onClick={() => {
                    setConfirmModal(false);
                  }}
                >
                  Cancel
                </span>
                <span
                  className="ml-[15px] text-[#5db1ff] cursor-pointer"
                  onClick={() => {
                    setConfirmModal(false);
                    updateNotes();
                    props?.setNoteEditor(false);
                    props?.setTempData({});
                    props?.setBody("");
                    props?.setTitle("");
                  }}
                >
                  Update
                </span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="fixed w-full h-[100svh] top-0 left-0 bg-[white] flex flex-col justify-start items-start p-[20px] pt-[10px] font-[google] font-normal z-10">
        <div className="w-full px-[11px] text-[22px] h-[50px] flex justify-start items-center ">
          <div className="w-[30%] h-full flex justify-start items-center">
            <HiArrowLeft
              className="text-[25px]  cursor-pointer"
              onClick={() => {
                props?.setNoteEditor(false);
                props?.setBody("");
                props?.setTitle("");
                props?.setTempData({});
              }}
            />
          </div>
          <div className="w-[70%] h-full flex justify-end items-center">
            <div
              className={
                "w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center" +
                (text.length != 0 ? " text-[#000000]" : " text-[#b8b8b8]")
              }
              onClick={() => {
                if (text.length != 0) {
                  setFormattedText(text);
                  setText("");
                }
              }}
            >
              <LuCornerUpLeft className="text-[25px] " />
            </div>
            <div
              className={
                "w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center" +
                (formattedText.length != 0
                  ? " text-[#000000]"
                  : " text-[#b8b8b8]")
              }
              onClick={() => {
                if (formattedText.length != 0) {
                  setText(formattedText);
                  setFormattedText("");
                }
              }}
            >
              <LuCornerUpRight className="text-[25px] " />
            </div>
            <div
              className="w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center"
              onClick={() => {
                console.log(tempData);
                if (title == props?.title && text == props?.body) {
                } else {
                  if (tempData.Title || tempData.Body) {
                    setConfirmModal(true);
                  } else {
                    updateNotes();
                    props?.setNoteEditor(false);
                    props?.setTempData({});
                    props?.setBody("");
                    props?.setTitle("");
                  }
                }
              }}
            >
              <MdDone
                className={
                  "text-[25px] " +
                  (title == props?.title && text == props?.body
                    ? " text-[#b8b8b8]"
                    : " text-[#000000]")
                }
              />
            </div>
          </div>
        </div>
        <textarea
          placeholder="Title"
          value={title}
          // style={{ whiteSpace: "pre-wrap" }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="placeholder:text-[#b8b8b8] w-full   h-[90px]  text-[30px] outline-none resize-none leading-10 border-none  "
        ></textarea>
        <div className="w-full h-[35px] px-[11px] text-[14px] text-[#929292] flex justify-start items-start">
          {new Date().getDate()} {monthsShort[new Date().getMonth()]}{" "}
          {(new Date().getHours() > 12
            ? new Date().getHours() - 12
            : new Date().getHours()) +
            ":" +
            new Date().getMinutes() +
            " " +
            (new Date().getHours() > 12 ? "PM" : "AM")}{" "}
          <span className="text-[8px] mx-[6px] text-[#b8b8b8] h-full pt-[5px]">
            |
          </span>{" "}
          {text.length} characters
        </div>
        {/* <textarea className="input w-[calc(100%-135px)] ml-[10px]  resize-none px-[20px] pr-[50px] pt-[10px]  outline-none text-[15px] font-[work] font-medium tracking-[.4px] rounded-2xl   h-[45px]   pl-[20px] bg-[#ffffff] text-[black]"></textarea> */}
        <textarea
          id="text-container"
          value={text}
          style={{ whiteSpace: "pre-wrap" }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          // ref={textareaRef}
          placeholder="Start Typing..."
          className="placeholder:text-[#b8b8b8] pt-[0px] w-full  h-[calc(100svh-245px)] overflow-y-scroll   text-[16px] outline-0 resize-none leading-8 border-0 "
        ></textarea>
        {/* <div
          onClick={handleDivClick}
          className=" select-text w-[calc(100%-40px)] fixed bg-transparent h-[calc(100%-230px)] top-[170px] px-[11px] pt-[13px]"
          ref={divRef}
          onMouseUp={handleMouseUp}
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        ></div> */}
      </div>
    </>
  );
};

export default ReminderPage;
