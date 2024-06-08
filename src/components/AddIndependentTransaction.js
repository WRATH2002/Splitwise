// import { Datepicker } from "flowbite-datepicker";
import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaAngleRight, FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { GoChevronRight } from "react-icons/go";
import { IoCalendar, IoCalendarClear } from "react-icons/io5";
// import Datepicker from "tailwind-datepicker-react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/colors/teal.css";
import Button from "react-multi-date-picker/components/button";
import { IoMdCloudUpload } from "react-icons/io";

const options = {
  title: "Demo Title",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-gray-700 dark:bg-gray-800",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "bg-red-500",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
  disabledDates: [],
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
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

const AddIndependentTransaction = () => {
  const [addNewTransaction, setAddNewTransaction] = useState(false);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    setPreDate(currentDate.getDate());
    console.log(value?.day + "/" + value?.month?.number + "/" + value?.year);
  }, []);

  const [value, setValue] = useState(new Date());

  function addToFirebase() {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user.uid)
      .update({
        NormalTransaction: arrayUnion({
          Lable: label,
          Date: value?.day + "/" + value?.month?.number + "/" + value?.year,
          Amount: price,
          TransactionType: "Single",
          Members: "0",
          Category: category,
          Mode: mode,
          BillUrl: bill,
        }),
      });

    setLabel("");
    setPrice("");
    setCategory("");
    setMode("");
    setBill("");
  }

  // const [show, setShow] = useState < boolean > false;
  // const handleChange = () => {
  //   console.log(selectedDate);
  // };
  // const handleClose = () => {
  //   setShow(!state);
  // };
  // let [value, setValue] = useState(new Date());

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  return (
    <>
      {addNewTransaction === true ? (
        <>
          <div className="w-full h-[100svh] fixed z-30 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
            <div className="w-[320px] max-h-[400px] py-[27px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start z-40">
              <div className="w-full h-auto px-[30px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
                <span className="w-full text-[25px] text-black font-[google] font-normal flex justify-start items-center ">
                  Transaction{" "}
                  <span className="text-[#de8544] ml-[10px]">Info</span>
                </span>

                <div className="flex flex-col w-full justify-between items-start mt-[20px]">
                  <span className="text-[#000000] font-[google] font-normal text-[15px] mb-[10px]">
                    About Transaction{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div
                    className={
                      " w-auto  rounded-md flex justify-start items-center bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                      (label?.length === 0
                        ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                        : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
                    }
                    style={{ transition: ".4s" }}
                  >
                    Label
                  </div>
                  <input
                    className="outline-none rounded-md w-full h-[40px] bg-transparent border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[15px] z-40"
                    // placeholder="Label"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  ></input>
                </div>
                {/* <div className="flex w-full justify-between h-[50px] items-center mt-[10px]"></div> */}

                <div className="flex w-full justify-between items-center mt-[10px]">
                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[40px]">
                    <div
                      className={
                        " w-auto  flex justify-start items-center bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                        (value?.length === 0
                          ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                          : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
                      }
                      style={{ transition: ".4s" }}
                    >
                      Date
                    </div>
                    <DatePicker
                      // inputClass="custom-input"
                      style={{
                        width: "320px",
                      }}
                      arrow={false}
                      className="bg-[#212121] teal h-full min-w-[260px] flex justify-center items-center font-[google] font-normal  bg-transparent border-[1px] border-[#535353]"
                      disableYearPicker
                      disableMonthPicker
                      weekDays={weekDays}
                      months={months}
                      minDate={new Date().setDate(0)}
                      maxDate={new Date().setDate(preDate)}
                      // render={<InputIcon />}
                      buttons={false}
                      value={value}
                      onChange={setValue}
                      format="DD/MM/YYYY"
                      shadow={false}
                      render={(value, openCalendar) => {
                        return (
                          <button
                            className="border-[1px] border-[#ffd8be] flex justify-start items-center px-[10px] font-[google] text-[15px] w-[125px] h-[40px] rounded-md text-black z-40"
                            onClick={openCalendar}
                          >
                            {value}
                          </button>
                        );
                      }}

                      // render={<InputIcon />}
                    />
                  </div>

                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[40px] ">
                    <div
                      className={
                        " w-auto  flex justify-start items-center rounded-md bg-transparent ml-[5px]    font-[google] font-normal " +
                        (price?.length === 0
                          ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px] ml-[20px] px-[19px]"
                          : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px] ml-[5px] px-[5px]")
                      }
                      style={{ transition: ".4s" }}
                    >
                      Amount
                    </div>
                    {/* <BiRupee /> */}
                    <div className="w-full h-[40px] flex justify-start items-center">
                      <div className="w-[30px] h-[50px] flex justify-center items-center mr-[-30px] text-black ">
                        <BiRupee className="text-[17px]" />
                      </div>
                      <input
                        className="outline-none w-full h-[40px] rounded-md pl-[25px] bg-transparent border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] z-40"
                        // placeholder="Price"
                        value={price}
                        onChange={(e) => {
                          console.log(isNumeric(e.target.value));
                          if (isNumeric(e.target.value) === true) {
                            setPrice(e.target.value);
                          }
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
                {/* <div className="flex w-full justify-between items-center mt-[10px]">
                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Transaction Type"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                ></input>

             

                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px]  bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Members"
                  onChange={(e) => {
                    setMember(e.target.value);
                  }}
                ></input>
              </div> */}
                <div className="flex flex-col w-full justify-center items-start mt-[20px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">
                    Select Category{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Shopping"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Shopping");
                      }}
                    >
                      Shopping
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Medical"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Medical");
                      }}
                    >
                      Medical
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Grocery"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Grocery");
                      }}
                    >
                      Grocery
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Travel"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Travel");
                      }}
                    >
                      Travel
                    </span>

                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Entertainment"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Entertainment");
                      }}
                    >
                      Entertainment
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Food & Drinks"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Food & Drinks");
                      }}
                    >
                      Food & Drinks
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Other"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Other");
                      }}
                    >
                      Other
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">
                    Select Mode of Transaction{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
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
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
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
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">Upload Reciept / Bill</span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span className="p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md w-[80px] h-[80px] border border-[#ffd8be] bg-[#ffddc5] flex justify-center items-center text-[#535353]">
                      <IoMdCloudUpload className="text-[25px]" />{" "}
                      <span className="ml-[10px]">Upload Photo</span>
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                  <div
                    className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                    onClick={() => {
                      setAddNewTransaction(false);
                      setLabel("");
                      setPrice("");
                      setCategory("");
                      setMode("");
                      setBill("");
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                    onClick={() => {
                      addToFirebase();
                      setAddNewTransaction(false);
                    }}
                  >
                    Add
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        className="w-[calc(100%-40px)] h-[60px]  px-[10px] font-[google] font-normal text-[15px] bg-[#ffeadc] rounded-2xl border-[1px] border-[#ffe6d7]  text-[#000000] cursor-pointer flex justify-center items-center"
        onClick={() => {
          setAddNewTransaction(true);
        }}
      >
        <div className="w-[30px]  flex justify-start items-center text-[20px] text-[#000000] ">
          <FiPlus />
        </div>
        <div className="w-[calc(100%-130px)]  ">Add New Transaction</div>
        <div className="w-[100px]  flex flex-col justify-center items-end">
          {/* <div className="text-[12px] text-[#b1b1b1]">{props?.date}</div>
        <div>{props?.amount} /-</div> */}
          <GoChevronRight className="text-[22px] text-[#000000]" />
        </div>
      </div>
    </>
  );
};

export default AddIndependentTransaction;
