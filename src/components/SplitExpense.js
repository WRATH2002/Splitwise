import React, { useEffect, useState } from "react";
import SplitTransaction from "./SplitTransaction";
import QuickSplitInfo from "./QuickSplitInfo";
import { FiPlus } from "react-icons/fi";
import TopNavbar from "./TopNavbar";
import { BiRupee } from "react-icons/bi";

import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/colors/teal.css";
import Button from "react-multi-date-picker/components/button";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";

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

const SplitExpense = () => {
  const [splitModal, setSplitModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");
  const [addedMember, setAddedMember] = useState([]);
  const [personName, setPersonName] = useState("");
  useEffect(() => {
    const currentDate = new Date();
    setPreDate(currentDate.getDate());
    console.log(value);
  }, []);

  function addPerson() {
    const newMember = { user: personName };
    setAddedMember((prevMembers) => [...prevMembers, newMember]);
    setPersonName("");
  }

  const [value, setValue] = useState();

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  return (
    <>
      {addModal ? (
        <div className="w-full h-[100svh] fixed  bg-[#00000071] top-0 left-0 flex justify-center items-center backdrop-blur-md z-50">
          <div className=" w-[320px] h-auto p-[30px]   bg-[#212121] rounded-3xl flex flex-col justify-start items-start ">
            <span className="w-full text-[25px] text-white font-[google] font-normal flex justify-start items-center mb-[10px] mt-[-10px]">
              Add <span className="text-[#98d832] ml-[10px]">Member</span>
            </span>
            <input
              className="outline-none rounded-md w-full h-[40px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[15px]"
              placeholder="Name"
              value={personName}
              onChange={(e) => {
                setPersonName(e.target.value);
              }}
            />
            <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-white h-[20px] mt-[20px]">
              <div
                className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                onClick={() => {
                  setPersonName("");
                  setAddModal(false);
                }}
              >
                Cancel
              </div>
              <div
                className="h-full  flex justify-center items-center text-[#98d832] cursor-pointer "
                onClick={() => {
                  // addToFirebase();
                  addPerson();
                  setAddModal(false);
                }}
              >
                Add
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {splitModal === true ? (
        // <div
        //   className="w-full h-[100svh] fixed z-50 bg-[#00000071] top-0 left-0 flex justify-center items-center backdrop-blur-md"
        //   onClick={() => {
        //     setSplitModal(false);
        //   }}
        // >
        //   <div
        //     className="w-[320px] h-auto p-[30px] bg-[#171717] rounded-3xl flex flex-col justify-center items-start"
        //     style={{ zIndex: "51" }}
        //   >
        //     <span className="w-full text-[22px] text-white font-[google] font-normal flex justify-start items-center ">
        //       Split Bill <span className="text-[#98d832] ml-[10px]">Info</span>
        //     </span>
        //     <div className="flex w-full justify-between items-center mt-[10px]">
        //       <input
        //         className="outline-none w-full h-[40px] bg-black px-[10px] text-white font-[google] font-normal text-[14px]"
        //         placeholder="label"
        //       ></input>
        //     </div>
        //     <div className="flex w-full justify-between items-center mt-[10px]">
        //       {/* <input
        //           className="outline-none w-[calc((100%-30px)/2)] h-[40px] bg-black px-[10px] text-white font-[google] font-normal text-[14px]"
        //           placeholder="Date"
        //         ></input> */}
        //       <input
        //         className="outline-none w-[calc((100%-30px)/2)] h-[40px] bg-black px-[10px] text-white font-[google] font-normal text-[14px]"
        //         placeholder="Amount"
        //       ></input>
        //     </div>
        //   </div>
        // </div>
        <div className="w-full h-[100svh] fixed z-30 bg-[#00000071] top-0 left-0 flex justify-center items-center backdrop-blur-md">
          <div className=" w-[320px] h-auto max-h-[80%]  py-[30px] bg-[#212121] rounded-3xl flex flex-col justify-start items-start z-40">
            <div className="w-[320px] h-auto overflow-y-scroll px-[30px] bg-[#212121] rounded-3xl flex flex-col justify-start items-start z-40">
              <span className="w-full text-[25px] text-white font-[google] font-normal flex justify-start items-center ">
                Transaction{" "}
                <span className="text-[#98d832] ml-[10px]">Info</span>
              </span>

              <div className="flex flex-col w-full justify-between items-start mt-[20px]">
                <span className="text-[#d2d2d2] font-[google] font-normal text-[15px] mb-[10px]">
                  About Transaction{" "}
                  <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                </span>
                <div
                  className={
                    " w-auto  rounded-md flex justify-start items-center bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                    (label?.length === 0
                      ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#535353] text-[15px]"
                      : " h-[1px] mb-[-1px] z-50 border border-[#212121] text-[#98d832] text-[14px]")
                  }
                  style={{ transition: ".4s" }}
                >
                  Label
                </div>
                <input
                  className="outline-none rounded-md w-full h-[40px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[15px]"
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
                      (value === undefined
                        ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#535353] text-[15px]"
                        : " h-[1px] mb-[-1px] z-50 border border-[#212121] text-[#98d832] text-[14px]")
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
                    // minDate={new Date().setDate(0)}
                    // maxDate={new Date().setDate(preDate)}
                    // render={<InputIcon />}
                    buttons={false}
                    value={value}
                    onChange={setValue}
                    format="DD/MM/YYYY"
                    shadow={false}
                    render={(value, openCalendar) => {
                      return (
                        <button
                          className="border-[1px] border-[#535353] flex justify-start items-center px-[10px] font-[google] text-[15px] w-[125px] h-[40px] rounded-md text-white"
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
                      " w-auto  flex justify-start items-center rounded-md bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                      (price?.length === 0
                        ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#535353] text-[15px] ml-[20px]"
                        : " h-[1px] mb-[-1px] z-50 border border-[#212121] text-[#98d832] text-[14px] ml-[5px]")
                    }
                    style={{ transition: ".4s" }}
                  >
                    Amount
                  </div>
                  <div className="w-full h-[40px] flex justify-start items-center">
                    {/* <div className="w-[20px] h-[50px] flex justify-center items-center mr-[-30px] text-white ">
                      <BiRupee className="text-[17px]" />
                    </div> */}
                    <input
                      className="outline-none w-full h-[40px] rounded-md pl-[10px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
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
              <div className="flex flex-col w-full justify-center items-start mt-[20px] font-[google] font-normal text-white text-[15px]">
                <span className="text-[#d2d2d2]">
                  Select Category{" "}
                  <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                </span>
                <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                  <span
                    className={
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Shopping"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Medical"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Grocery"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Travel"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Entertainment"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Food & Drinks"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (category == "Other"
                        ? " bg-[#98d832] text-[black]"
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
              <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-white text-[15px]">
                <span className="text-[#d2d2d2]">
                  Select Mode of Transaction{" "}
                  <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                </span>
                <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                  <span
                    className={
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (mode == "Online UPI"
                        ? " bg-[#98d832] text-[black]"
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
                      "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#535353] flex justify-center items-center" +
                      (mode == "Offline Cash"
                        ? " bg-[#98d832] text-[black]"
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
              <div
                className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-white text-[15px]"
                onClick={() => {
                  setAddModal(true);
                }}
              >
                <span className="text-[#d2d2d2] mb-[10px]">
                  Tag Members{" "}
                  <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                </span>
                {addedMember.map((data) => {
                  return (
                    <div className="w-full h-[30px] flex justify-start items-center">
                      <BsPersonFill className="text-[15px] mr-[8px]" />{" "}
                      {data?.user}
                    </div>
                  );
                })}
                <div className="w-full flex justify-start items-center text-[#98d832] text-[15px] h-[30px]">
                  <MdOutlineAddCircleOutline className="text-[18px] text-[#98d832] mr-[8px]" />{" "}
                  Add Member
                </div>
              </div>
              <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-white text-[15px]">
                <span className="text-[#d2d2d2]">Upload Reciept / Bill</span>
                <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                  <span className="p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md w-[80px] h-[80px] border border-[#535353] flex justify-center items-center text-[#535353]">
                    <IoMdCloudUpload className="text-[25px]" />{" "}
                    <span className="ml-[10px]">Upload Photo</span>
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-white h-[20px] mt-[20px]">
                <div
                  className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                  onClick={() => {
                    setSplitModal(false);
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
                  className="h-full  flex justify-center items-center text-[#98d832] cursor-pointer "
                  onClick={() => {
                    // addToFirebase();
                    setSplitModal(false);
                  }}
                >
                  Add
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#171717] border-none">
        <TopNavbar />
      </div>
      <div className="h-[calc(100%-60px)] w-full bg-[#171717] flex justify-start items-center flex-col  text-white py-[20px] border-none">
        <QuickSplitInfo />
        <div className="w-[calc(100%-40px)] border-[.7px] border-[#3d3d3d]"></div>

        <SplitTransaction
          name={"Aminia - Chicken Roll Party"}
          amount={2345}
          date={"23 May, 2024"}
          member={14}
          return={false}
          status={true}
        />
      </div>
      <div
        className="w-[40px] h-[40px] rounded-full bg-[#98d832] fixed right-[20px] bottom-[70px] flex justify-center items-center"
        onClick={() => {
          setSplitModal(true);
        }}
      >
        <FiPlus className="text-black text-[23px]" />
      </div>
    </>
  );
};

export default SplitExpense;
