import React from "react";
import { BiRupee } from "react-icons/bi";
import { useState, useEffect } from "react";
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

const AddReminderModal = (props) => {
  const [addNewTransaction, setAddNewTransaction] = useState(false);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(props?.reminderDate);
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    setPreDate(currentDate.getDate());
    console.log(value?.day + "/" + value?.month?.number + "/" + value?.year);
  }, []);

  const [value, setValue] = useState(props?.reminderDate);

  function addToFirebase() {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user.uid)
      .update({
        Reminders: arrayUnion({
          Lable: label,
          Date: value,
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
    props?.setReminderDate("");
  }

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  return (
    <div className="w-full h-[100svh] fixed z-30 bg-[#70708628] top-0 left-0 flex justify-center items-center backdrop-blur-md p-[20px]">
      <div className="w-full max-h-[400px] py-[27px] bg-[#ffffff] drop-shadow-sm rounded-3xl flex flex-col justify-center items-start z-40">
        <div className="w-full h-auto px-[30px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
          <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bell-dot"
            >
              <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              <circle cx="18" cy="8" r="3" />
            </svg>
            &nbsp;&nbsp;Set New{" "}
            <span className="text-[#a397d2] ml-[10px]">Reminder</span>
          </span>

          <div className="flex flex-col w-full justify-between items-start mt-[5px]">
            {/* <span className="text-[#000000] font-[google] font-normal text-[15px] mb-[10px]">
              About Transaction{" "}
              <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
            </span> */}
            <div
              className=" w-auto  rounded-md flex justify-start items-center bg-transparent text-[14px] mb-[5px] text-[#0000005d]  font-[google] font-normal "
              style={{ transition: ".4s" }}
            >
              Label
            </div>
            <input
              className="outline-none rounded-md w-full h-[45px] bg-transparent border border-[#efebff] px-[10px] text-black font-[google] font-normal text-[16px] z-40"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
            ></input>
          </div>
          {/* <div className="flex w-full justify-between h-[50px] items-center mt-[10px]"></div> */}

          <div className="flex w-full justify-between items-center mt-[5px] mb-[10px]">
            <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[45px]">
              <div
                className=" w-auto  rounded-md flex justify-start items-center bg-transparent text-[14px] mb-[5px] text-[#0000005d]  font-[google] font-normal "
                style={{ transition: ".4s" }}
              >
                Due Date
              </div>
              <DatePicker
                // inputClass="custom-input"
                style={{
                  width: "320px",
                }}
                arrow={false}
                className="bg-[#212121] teal h-full w-full flex justify-center items-center font-[google] font-normal  bg-transparent border-[1px] border-[#535353]"
                // disableYearPicker
                // disableMonthPicker
                weekDays={weekDays}
                months={months}
                // minDate={new Date().setDate(0)}
                // maxDate={new Date().setDate(preDate)}
                // render={<InputIcon />}
                // buttons={false}
                value={value}
                onChange={(e) => {
                  setValue(e?.day + "/" + e?.month?.number + "/" + e?.year);
                }}
                format="DD/MM/YYYY"
                shadow={false}
                render={(value, openCalendar) => {
                  return (
                    <div
                      className="border-[1px] border-[#efebff] flex justify-start items-center px-[10px] font-[google] text-[16px] min-w-full h-[45px] rounded-md text-black z-40"
                      onClick={openCalendar}
                    >
                      {value}
                    </div>
                  );
                }}

                // render={<InputIcon />}
              />
            </div>

            <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[45px] ">
              <div
                className=" w-auto  rounded-md flex justify-start items-center bg-transparent text-[14px] mb-[5px] text-[#0000005d]  font-[google] font-normal "
                style={{ transition: ".4s" }}
              >
                Amount
              </div>
              {/* <BiRupee /> */}
              <div className="w-full h-[45px] flex justify-start items-center">
                <div className="w-[30px] h-[50px] flex justify-center items-center mr-[-30px] text-black ">
                  <BiRupee className="text-[17px]" />
                </div>
                <input
                  className="outline-none w-full h-[45px] rounded-md pl-[25px] bg-transparent border border-[#efebff] px-[10px] text-black font-[google] font-normal text-[16px] z-40"
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

          <div className="flex flex-col w-full justify-center items-start mt-[20px] font-[google] font-normal text-black text-[15px]">
            <div
              className=" w-auto  rounded-md flex justify-start items-center bg-transparent text-[14px] mb-[5px] text-[#0000005d]  font-[google] font-normal "
              style={{ transition: ".4s" }}
            >
              Category
            </div>
            <div className="w-full h-[45px] flex justify-start items-center">
              <div
                className="outline-none w-full h-[45px] rounded-md pl-[25px] bg-transparent border border-[#efebff] px-[10px] text-black font-[google] font-normal text-[14px] z-40"
                // placeholder="Price"
                // value={price}
                // onChange={(e) => {
                //   console.log(isNumeric(e.target.value));
                //   if (isNumeric(e.target.value) === true) {
                //     setPrice(e.target.value);
                //   }
                // }}
              >
                {category}
              </div>
              <div className="w-[40px] h-[45px] flex justify-center items-center ml-[-40px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
              <span
                className={
                  "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#efebff] flex justify-center items-center" +
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
          {/* <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
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
          </div> */}

          <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
            <div
              className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
              onClick={() => {
                props?.data(false);
                setLabel("");
                setPrice("");
                setCategory("");
                setMode("");
                setBill("");
                props?.setReminderDate("");
              }}
            >
              Cancel
            </div>
            <div
              className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
              onClick={() => {
                addToFirebase();
                props?.data(false);
              }}
            >
              Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReminderModal;
