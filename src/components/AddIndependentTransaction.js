// import { Datepicker } from "flowbite-datepicker";
import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaAngleRight, FaPlus, FaShopify } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { GoChevronRight } from "react-icons/go";
import { IoCalendar, IoCalendarClear, IoFastFood } from "react-icons/io5";
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
import { Label } from "recharts";
import { HiReceiptRefund, HiShoppingBag } from "react-icons/hi2";
import { FaTruckMedical } from "react-icons/fa6";
import { GiAutoRepair, GiPartyPopper } from "react-icons/gi";
import {
  MdElectricBolt,
  MdOutlineAirplanemodeActive,
  MdOutlinePets,
  MdSchool,
} from "react-icons/md";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import { PiSealQuestionFill } from "react-icons/pi";
import { HiOutlinePlus } from "react-icons/hi";

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

  // useEffect(() => {
  //   const currentDate = new Date();
  //   setPreDate(currentDate.getDate());
  //   console.log(value?.day + "/" + value?.month?.number + "/" + value?.year);
  // }, []);

  const [value, setValue] = useState(
    new Date().getDate() +
      "/" +
      parseInt(parseInt(new Date().getMonth()) + 1) +
      "/" +
      new Date().getFullYear()
  );

  function addToFirebase() {
    const user = firebase.auth().currentUser;
    if (value.length == undefined) {
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
    } else {
      db.collection("Expense")
        .doc(user.uid)
        .update({
          NormalTransaction: arrayUnion({
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
    }

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

  useEffect(() => {
    console.log(value);
    console.log(value.length);
  }, [value]);

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  return (
    <>
      {addNewTransaction === true ? (
        <>
          <div className="w-full h-[100svh] fixed z-30 bg-[#68686871] top-0 left-0 flex flex-col justify-end items-start p-[20px] ">
            <div className="w-full flex flex-col justify-end items-start h-[40px]">
              <div className="w-[calc(100%-40px)] h-[20px] bg-[#ffffff] fixed z-20"></div>
              <div className="w-full h-auto flex justify-start items-center z-30">
                <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                  {/* {part + 1}/
                  {props?.budget == 0 && props?.income == 0 ? (
                    <>{Info.length}</>
                  ) : (
                    <>{Info.length - 1}</>
                  )} */}
                  <span className="mt-[10px]">Transaction Info</span>
                </div>
                <div className="w-[calc(100%-80px)] bg-[#bcb6b3] h-[40px] rounded-bl-[22px] ">
                  <div
                    className="h-[35px] aspect-square rounded-full bg-[#ffffff] ml-[5px] mb-[5px] flex justify-center items-center text-[20px] "
                    onClick={() => {
                      setAddNewTransaction(false);
                      setLabel("");
                      setPrice("");
                      setCategory("");
                      setMode("");
                      setBill("");
                    }}
                  >
                    <HiOutlinePlus className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[calc(100svh-80px)] py-[20px] bg-[#ffffff]  rounded-b-3xl rounded-tr-3xl flex flex-col justify-center items-start z-40">
              <div className="w-full h-auto px-[20px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
                <span className="w-full text-[25px] text-black font-[google] font-normal flex justify-start items-center ">
                  {/* Transaction{" "}
                  <span className="text-[#de8544] ml-[10px]">Info</span> */}
                </span>

                <div className="flex flex-col w-full justify-between items-start ">
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
                    className="outline-none rounded-md w-full h-[40px] bg-transparent border border-[#acebff] px-[10px] text-black font-[google] font-normal text-[15px] z-40"
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
                            className="border-[1px] border-[#acebff] flex justify-start items-center px-[10px] font-[google] text-[15px] w-[125px] h-[40px] rounded-md text-black z-40"
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
                        className="outline-none w-full h-[40px] rounded-md pl-[25px] bg-transparent border border-[#acebff] px-[10px] text-black font-[google] font-normal text-[14px] z-40"
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
                  <div className="w-[calc(100%+5px)] flex justify-start items-center flex-wrap text-[#535353] ml-[-5px] mt-[10px]">
                    <span
                      className={
                        "cursor-pointer p-[10px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Shopping"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Shopping");
                      }}
                    >
                      <FaShopify className="mr-[10px] " />
                      Shopping
                    </span>

                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Grocery"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Grocery");
                      }}
                    >
                      <HiShoppingBag className="mr-[10px] " /> Grocery
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Food & Drinks"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Food & Drinks");
                      }}
                    >
                      <IoFastFood className="mr-[10px] " /> Food & Drinks
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Medical"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Medical");
                      }}
                    >
                      <FaTruckMedical className="mr-[10px] " /> Medical
                    </span>

                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Entertainment"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Entertainment");
                      }}
                    >
                      <GiPartyPopper className="mr-[10px] " /> Entertainment
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Electricity Bill"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#000000]")
                      }
                      onClick={() => {
                        setCategory("Electricity Bill");
                      }}
                    >
                      <MdElectricBolt className="mr-[10px] " /> Electricity Bill
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Petrol / Diesel"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Petrol / Diesel");
                      }}
                    >
                      <BsFillFuelPumpFill className="mr-[10px]" /> Petrol /
                      Diesel
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Travel"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Travel");
                      }}
                    >
                      <MdOutlineAirplanemodeActive className="rotate-45 mr-[10px]" />{" "}
                      Travel
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Taxi Fare"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Taxi Fare");
                      }}
                    >
                      <BsTaxiFrontFill className="mr-[10px]" /> Taxi Fare
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Car Maintanance"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Car Maintanance");
                      }}
                    >
                      <GiAutoRepair className="mr-[10px]" /> Car Maintanance
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Education"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Education");
                      }}
                    >
                      <MdSchool className="mr-[10px]" /> Education
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px]  mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Pet Care"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Pet Care");
                      }}
                    >
                      <MdOutlinePets className="mr-[10px]" /> Pet Care
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (category == "Other"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Other");
                      }}
                    >
                      <PiSealQuestionFill className="mr-[10px]" /> Others
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
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (mode == "Online UPI"
                          ? " bg-[#acebff] text-[black]"
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
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (mode == "Credit/Debit Card"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setMode("Credit/Debit Card");
                      }}
                    >
                      Credit/Debit Card
                    </span>
                    <span
                      className={
                        "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                        (mode == "Cash"
                          ? " bg-[#acebff] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setMode("Cash");
                      }}
                    >
                      Cash
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">Upload Reciept / Bill</span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span className="p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md w-[80px] h-[80px] border border-[#acebff] flex justify-center items-center text-[#535353]">
                      <IoMdCloudUpload className="text-[25px]" />{" "}
                      <span className="ml-[10px]">Upload Photo</span>
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                  <div
                    className="h-full mr-[25px] flex justify-center items-center cursor-pointer  "
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
                  {label?.length != 0 &&
                  value?.length != 0 &&
                  price?.length != 0 &&
                  category?.length != 0 &&
                  mode?.length != 0 ? (
                    <>
                      <div
                        className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                        onClick={() => {
                          // if (
                          //   label?.length != 0 &&
                          //   value?.length != 0 &&
                          //   price?.length != 0 &&
                          //   category?.length != 0 &&
                          //   mode?.length != 0
                          //   // bill?.length != 0
                          // ) {
                          addToFirebase();
                          setAddNewTransaction(false);
                          // }
                        }}
                      >
                        Update
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="h-full  flex justify-center items-center text-[#ffc194]  "
                        onClick={() => {
                          // if (
                          //   label?.length != 0 &&
                          //   value?.length != 0 &&
                          //   price?.length != 0 &&
                          //   category?.length != 0 &&
                          //   mode?.length != 0
                          //   // bill?.length != 0
                          // ) {
                          //   addToFirebase();
                          //   setAddNewTransaction(false);
                          // }
                        }}
                      >
                        Update
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        className="w-[calc(100%-40px)] h-[60px]  px-[10px] font-[google] font-normal text-[15px] bg-[#e4f2ff] rounded-3xl text-[#000000] cursor-pointer flex justify-center items-center"
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
