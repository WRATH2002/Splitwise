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
import Editor from "./Editor";

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
const ReminderPage = () => {
  const [addModal, setAddModal] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [tempTransactionHistoryCurr, setTempTransactionHistoryCurr] = useState(
    []
  );
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
  const [monthlyReminderShow, setMonthlyReminderShow] = useState(false);
  const [notePreview, setNotePreview] = useState(false);
  // const [Date, Date] = useState("");
  const [reminderDate, setReminderDate] = useState(
    new Date().getDate() +
      "/" +
      parseInt(parseInt(new Date().getMonth() + 1)) +
      "/" +
      new Date().getFullYear()
  );
  const [UIColor, setUIColor] = useState("");
  const [UIIndex, setUIIndex] = useState("");

  useEffect(() => {
    fetchMonth();
    fetchReminders();
    console.log(tempTransactionHistory);
  }, []);

  useEffect(() => {
    if (
      tempTransactionHistory != undefined &&
      tempTransactionHistory.length != 0
    ) {
      setTempTransactionHistoryCurr(
        tempTransactionHistory?.filter((data) => {
          if (
            data?.Date?.split("/")[1] == parseInt(new Date().getMonth()) + 1 &&
            data?.Date?.split("/")[2] == parseInt(new Date().getFullYear())
          ) {
            return data;
          }
        })
      );
    }
  }, [tempTransactionHistory]);

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
  }, [transactionHistory, month, year, monthlyReminderShow]);

  function sortTransactionsByDate() {
    if (monthlyReminderShow) {
      setTempTransactionHistory(
        transactionHistory.sort((a, b) => {
          const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA - dateB;
        })
      );
    } else {
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
  }

  function filterByPresentDate(data) {
    // let preMonth = new Date().getMonth() + 1;
    const newData = data?.filter((obj) => {
      let dateArr = obj?.Date?.split("/");
      // console.log(preMonth);
      if (
        parseInt(dateArr[1]) <= parseInt(month) &&
        parseInt(dateArr[2]) <= parseInt(year)
      ) {
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
      setMonthlyReminderShow(snapshot?.data()?.MonthlyReminder);
      setNotePreview(snapshot?.data()?.NotePreviewBlur);
      setUIColor(snapshot?.data()?.Theme);
      setUIIndex(snapshot?.data()?.SecondaryTheme);
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
            UIColor={UIColor}
            UIIndex={UIIndex}
          />
        </>
      ) : (
        <></>
      )}

      {chooseMonth ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
          >
            <>
              {/* <div
                className="w-full h-[calc(100svh-200px)]"
                onClick={() => {
                  setChooseMonth(false);
                }}
              ></div> */}

              {/* <div
                className={
                  "min-w-full z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-3xl font-[google] font-normal text-[14px] flex flex-wrap justify-start items-start py-[17.5px]  px-[17.5px]" +
                  (section ? " rounded-tr-3xl" : " rounded-tl-3xl")
                }
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <div className="w-full flex justify-start items-start h-[45px]">
                  <div
                    className={
                      "px-[10px] py-[5px] rounded-[14px]  " +
                      (section
                        ? " border border-[#191A2C]  bg-[#191A2C] text-[white]"
                        : " border border-[#191A2C]")
                    }
                    onClick={() => {
                      setSection(true);
                    }}
                  >
                    Month
                  </div>
                  <div
                    className={
                      "px-[10px] py-[5px] rounded-[14px] border border-[#191A2C] ml-[8px]" +
                      (!section
                        ? " border border-[#191A2C]  bg-[#191A2C] text-[white]"
                        : " border border-[#191A2C]")
                    }
                    onClick={() => {
                      setSection(false);
                    }}
                  >
                    Year
                  </div>
                </div>
                {section ? (
                  <>
                    {monthsShort?.map((name, index) => {
                      return (
                        <>
                          {monthsShort[month - 1] === name ? (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border  rounded-[14px] flex justify-center items-center min-h-[35px] cursor-pointer text-white"
                              style={{
                                backgroundColor: `#191A2C`,
                                border: `1px solid ${UIColor}`,
                              }}
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border  rounded-[14px] flex justify-center items-center min-h-[35px] cursor-pointer"
                              style={{
                                backgroundColor: ``,
                                border: `1px solid transparent`,
                              }}
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
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border  rounded-[14px] flex justify-center items-center min-h-[35px] cursor-pointer"
                              style={{
                                backgroundColor: `#191A2C`,
                                border: `1px solid ${UIColor}`,
                              }}
                              onClick={() => {}}
                            >
                              {name}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className=" w-[calc((100%-20px)/4)] mx-[2.5px] my-[2.5px]  border  rounded-[14px] flex justify-center items-center min-h-[35px] cursor-pointer"
                              style={{
                                backgroundColor: ``,
                                border: `1px solid transparent`,
                              }}
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
              </div> */}

              <div
                className="w-full h-[calc(100svh-200px)]"
                onClick={() => {
                  setChooseMonth(false);
                }}
              ></div>

              <div
                className={
                  "min-w-full z-50 h-auto bg-[#ffffff]   text-black  rounded-3xl font-[google] font-normal text-[14px] flex flex-wrap justify-start items-start py-[25px]  px-[30px]" +
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
      {/* <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#ffffff] border-none">
        <TopNavbar />
      </div> */}

      {sec === "Note" ? (
        <div className="w-full h-[calc(100%)]  flex flex-col justify-start items-start flex-wrap  font-[google] ">
          <div className="w-[100%] h-[140px] flex  justify-between items-center  bg-[#ffffff] p-[20px]  ">
            <div className="w-[calc((100%-40px)/2)]  flex flex-col justify-center items-start font-[google] font-normal text-[25px] text-white ">
              <span className="text-[#000000] text-[14px]">
                Total Due
                {/* by -{" "}
                <span className="text-black ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span> */}
              </span>
              <span className="flex justify-start items-center text-[#000000] mt-[0px]">
                <BiRupee className="ml-[-3px]" />{" "}
                {formatAmountWithCommas(due()?.acc)}
              </span>
              <span
                className="flex justify-start items-center text-[14px] py-[2px] px-[7px] rounded-xl  text-[#000000] mt-[0px]"
                style={{ backgroundColor: `${UIColor}` }}
              >
                x {due()?.count}
              </span>
            </div>
            <div className="w-[40px] h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
              <div
                className="w-[40px] h-[40px] rounded-2xl flex justify-center items-center"
                style={{ backgroundColor: `${UIColor}` }}
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
              <span className="text-[#000000] text-[14px]">
                Total Upcoming
                {/* for -{" "}
                <span className="text-black ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span> */}
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px]">
                <BiRupee className="text-black ml-[-3px]" />{" "}
                <div className="text-[#000000]">
                  {formatAmountWithCommas(upcoming()?.acc)}
                </div>
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px] text-[14px]">
                <div
                  className="py-[2px] px-[7px] rounded-xl  text-[#000000] flex justify-center items-center"
                  style={{ backgroundColor: `${UIColor}` }}
                >
                  x {upcoming()?.count}
                </div>
              </span>
            </div>
          </div>
          <div className="w-full h-[45px] mt-[-42px] z-50 flex justify-center items-start text-[#000000] mb-[8px] text-[14px] font-[google] font-normal  px-[4px] py-[4px]">
            <div className="w-auto h-full border border-[#efefef] rounded-xl flex justify-start items-center px-[3px] py-[3px]">
              <div
                className={
                  "h-[30px] w-[80px] fixed bg-[#191A2C] rounded-[9px] z-0" +
                  (sec == "Note" ? " ml-[80px]" : " ml-[0px]")
                }
                style={{ transition: ".3s" }}
              ></div>
              <div
                className={
                  "w-[80px] flex justify-center items-center h-full px-[10px] rounded-[9px]  text-[#000000] z-10" +
                  (sec == "Reminder" ? " text-white" : " text-black")
                }
                style={{ transition: ".3s" }}
                onClick={() => {
                  setSec("Reminder");
                }}
              >
                Reminders
              </div>

              <div
                className={
                  "w-[80px] flex justify-center items-center h-full px-[10px] rounded-[9px]  z-10" +
                  (sec == "Note" ? " text-white" : " text-black")
                }
                style={{ transition: ".3s" }}
                onClick={() => {
                  setSec("Note");
                }}
              >
                Notes
              </div>
            </div>
          </div>
          <div className="w-full max-h-[calc(100%-160px)] h-auto overflow-y-scroll flex justify-start items-start flex-wrap px-[15px] ">
            <div
              className="min-w-[calc((100%-20px)/2)] text-[16px] min-h-[100px] max-h-[100px]  rounded-2xl mx-[5px] mb-[10px] flex justify-center items-center cursor-pointer bg-[#F9F9F9] border border-[#efefef]"
              // style={{ backgroundColor: `${UIColor}` }}
            >
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
                      "text-[22px] z-0" + (edit ? " rotate-45" : " rotate-0")
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
                      "w-[calc((100%-20px)/2)] min-h-[210px] max-h-[210px]  rounded-2xl mx-[5px] mb-[10px] flex flex-col justify-between items-start overflow-hidden p-[20px] cursor-pointer" +
                      (index % 2 != 0 ? " mt-[-110px]" : " mt-[0px]") +
                      (deleteData.includes(data)
                        ? " bg-[#dddddd] "
                        : " bg-[#F4F5F7] ")
                    }
                    style={{
                      backgroundColor: deleteData.includes(data)
                        ? `#dddddd`
                        : "#F9F9F9",
                      border: "1px solid #efefef",
                      // : `${UIColor}`,
                    }}
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
                    {/* <div className="w-[calc(100%+40px)] ml-[-20px] h-[210px] bg-[#191a2c00] backdrop-blur-[8px] flex justify-center items-center relative mb-[-210px] mt-[-20px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00000085"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-folder-lock"
                      >
                        <rect width="8" height="5" x="14" y="17" rx="1" />
                        <path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" />
                        <path d="M20 17v-2a2 2 0 1 0-4 0v2" />
                      </svg>
                    </div> */}
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
                            "w-[26px] h-[26px] rounded-full border border-[#efefef]  flex justify-center items-center" +
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
        <div className="w-full h-[calc(100svh-60px)] bg-[#ffffff]">
          <div className="w-[100%] h-[140px] flex  justify-between items-center  bg-[#ffffff] p-[20px]  ">
            <div className="w-[calc((100%-40px)/2)]  flex flex-col justify-center items-start font-[google] font-normal text-[25px] text-black ">
              <span className="text-[#000000] text-[14px]">
                Total Due
                {/* by -{" "}
                <span className="text-black ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span> */}
              </span>
              <span className="flex justify-start items-center text-[#000000] mt-[0px]">
                <BiRupee className="ml-[-3px]" />{" "}
                {formatAmountWithCommas(due()?.acc)}
              </span>
              <span
                className="flex justify-start items-center text-[14px] py-[2px] px-[7px] rounded-xl text-[#000000] mt-[0px]"
                style={{ backgroundColor: `${UIColor}` }}
              >
                x {due()?.count}
              </span>
            </div>
            <div className="w-[40px] h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
              <div
                className="w-[40px] h-[40px] rounded-2xl flex justify-center items-center"
                style={{ backgroundColor: `${UIColor}` }}
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
            <div className="w-[calc((100%-40px)/2)]  flex flex-col justify-center items-end font-[google] font-normal text-[25px] text-black ">
              <span className="text-[#000000] text-[14px]">
                Total Upcoming
                {/* for -{" "}
                <span className="text-black ml-[3px]">
                  {monthsShort[parseInt(new Date().getMonth())]}
                </span> */}
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px]">
                <BiRupee className="text-black ml-[-3px]" />{" "}
                <div className="text-[#000000]">
                  {formatAmountWithCommas(upcoming()?.acc)}
                </div>
              </span>
              <span className="flex justify-start items-center text-[#e61d0f] mt-[0px] text-[14px]">
                <div
                  className="py-[2px] px-[7px] rounded-xl text-[#000000] flex justify-center items-center"
                  style={{ backgroundColor: `${UIColor}` }}
                >
                  x {upcoming()?.count}
                </div>
              </span>
            </div>
          </div>
          <div className="w-full h-[45px] mt-[-42px] z-50 flex justify-center items-start text-[#000000] mb-[8px] text-[14px] font-[google] font-normal  px-[4px] py-[4px]">
            <div className="w-auto h-full border border-[#efefef] rounded-xl flex justify-start items-center px-[3px] py-[3px]">
              <div
                className={
                  "h-[30px] w-[80px] fixed bg-[#191A2C] rounded-[9px] z-0" +
                  (sec == "Note" ? " ml-[80px]" : " ml-[0px]")
                }
                style={{ transition: ".3s" }}
              ></div>
              <div
                className={
                  "w-[80px] flex justify-center items-center h-full px-[10px] rounded-[9px]  text-[#000000] z-10" +
                  (sec == "Reminder" ? " text-white" : " text-black")
                }
                style={{ transition: ".3s" }}
                onClick={() => {
                  setSec("Reminder");
                }}
              >
                Reminders
              </div>

              <div
                className={
                  "w-[80px] flex justify-center items-center h-full px-[10px] rounded-[9px]  z-10" +
                  (sec == "Note" ? " text-white" : " text-black")
                }
                style={{ transition: ".3s" }}
                onClick={() => {
                  setSec("Note");
                }}
              >
                Notes
              </div>
            </div>
          </div>

          <RedminderDate
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            tempTransactionHistory={tempTransactionHistoryCurr}
            setAddModal={setAddModal}
            UIColor={UIColor}
            UIIndex={UIIndex}
          />
          <div className="flex justify-start items-center text-[14px] font-[google] font-normal mt-[10px] px-[20px] text-[#00000057] whitespace-nowrap">
            {/* Reminders,{" "} */}
            <span
              className={
                "  ml-[0px] text-[14px]  cursor-pointer flex justify-start items-center px-[7px]  h-full rounded-xl  py-[7px] pl-[11px]" +
                (monthlyReminderShow ? " text-[#00000057]" : " text-[black]")
              }
              style={{
                backgroundColor: `${UIColor}`,
              }}
              onClick={() => {
                if (monthlyReminderShow) {
                } else {
                  setChooseMonth(true);
                }
                // setAddModal(true);
                // setSplitModal(true);
              }}
            >
              {monthsShort[month - 1]} - {year}{" "}
              <MdKeyboardArrowDown className="text-[21px]" />
            </span>
          </div>

          <div className="contt w-full h-[calc(100%-305px)] flex flex-col justify-start items-center overflow-y-scroll mt-[10px] px-[20px]">
            {tempTransactionHistory.length == 0 ? (
              <>
                <span className=" w-[calc(100%-40px)] h-[100px] rounded-3xl border-[1px] border-[#ebebf500] bg-[#ebebf500]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black] z-10">
                  <span className="z-10 text-[16px] flex justify-center items-center">
                    No Reminders Found{" "}
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
                        UIColor={UIColor}
                        UIIndex={UIIndex}
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
            UIColor={UIColor}
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

export default ReminderPage;
