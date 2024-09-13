import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { SmallSizeIcon } from "./NornmalSizeIcon";
import { IoMdCloudUpload } from "react-icons/io";

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

const categoryName = [
  "Car Maintanance",
  "Education",
  "Electricity Bill",
  "Entertainment",
  "Food & Drinks",
  "Grocery",
  "Medical",
  "Others",
  "Pet Care",
  "Petrol / Diesel",
  "Shopping",
  "Taxi Fare",
  "Travel",
];

const paymentName = ["Online UPI", "Credit/Debit Card", "Cash"];

const TourExpense = () => {
  const [place, setPlace] = useState([
    { Name: "Blue Lagoon", Time: "9:00 - 10:00" },
    { Name: "Golden Circle Tour", Time: "2:00 - 6:00" },
    { Name: "Northern Ligh Hunting", Time: "9:00 - 10:00" },
  ]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [memberShow, setMemberShow] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (scrollIndex + 1 == place.length) {
      setTimeout(() => {
        setScrollIndex(0);
      }, 4000);
    } else {
      setTimeout(() => {
        setScrollIndex(scrollIndex + 1);
      }, 3000);
    }
  }, [scrollIndex]);
  return (
    <>
      {transactionModal ? (
        <>
          <TransactionModalTrip />
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-full flex justify-start items-start font-[google] font-normal fixed left-0 top-0 z-20">
        <div className="w-full h-[calc(100%)] bg-[#ffffff]   flex flex-col justify-start items-start p-[20px]">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-full flex justify-between items-center">
              <span className="text-[20px]">Switzerland, India</span>
              <span className="text-[20px]">Day 9 / 10</span>
            </div>

            <div className="w-full flex justify-between items-start mt-[7px]">
              <span
                className={
                  "text-[15px]  flex justify-center items-center px-[9px] py-[3px] bg-white rounded-lg text-[black] border-[1.5px] border-[#737373]" +
                  (memberShow
                    ? " fixed w-[calc(100%-40px)] left-[20px] h-[300px] "
                    : " block w-[60px] h-[30px]")
                }
                style={{ transition: ".4s" }}
                onClick={() => {
                  setMemberShow(!memberShow);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="ml-[6px]">4</span>
              </span>
              <span className="text-[15px] flex justify-center h-[30px] items-center px-[9px] py-[3px] rounded-lg text-[black] border-[1.5px] border-[#737373] ">
                <span className="text-[15px] whitespace-nowrap">
                  40000 / 120,000
                </span>
              </span>
            </div>
          </div>
          <span className="text-[14px] w-full flex justify-start items-start mt-[15px]">
            <div className="mr-[8px] pt-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-map-pin"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-start max-h-[50px] overflow-hidden ">
              {place?.map((data, index) => {
                return (
                  <div
                    className="flex flex-col justify-center items-start min-h-[50px]  max-h-[50px]"
                    style={{
                      marginTop: index === 0 ? `${scrollIndex * -50}px` : "0px",
                      transition: ".4s",
                    }}
                  >
                    <span className="text-[15px]">{data?.Name}</span>
                    <span className="text-[13px]">{data?.Time}</span>
                  </div>
                );
              })}
            </div>
          </span>
          <div className="w-full border-b border-[#ebebeb] my-[20px]"></div>
          <div className=" w-full flex flex-col justify-start items-start">
            <div className="w-full flex justify-between items-start py-[10px]">
              <div></div>
              <div
                className="px-[15px] text-[15px] h-[40px] rounded-xl text-white bg-[#191A2c] flex justify-center items-center "
                onClick={() => {
                  setTransactionModal(!transactionModal);
                }}
              >
                <div className="mr-[10px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-tickets"
                  >
                    <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
                    <path d="M6 10V8" />
                    <path d="M6 14v1" />
                    <path d="M6 19v2" />
                    <rect x="2" y="8" width="20" height="13" rx="2" />
                  </svg>
                </div>
                Add
              </div>
              {/* <div className="mb-[20px] w-[40px] overflow-hidden">
              Trip Expenses
            </div>
            <div className="flex flex-col justify-start items-center">
              <div
                className="w-[115px] h-[40px] rounded-2xl bg-[#191A2C] text-white px-[15px] flex justify-between items-center"
                onClick={() => {
                  setMenu(!menu);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-split"
                >
                  <path d="M16 3h5v5" />
                  <path d="M8 3H3v5" />
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
                  <path d="m15 9 6-6" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-trash"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <div
                className={
                  "fixed rounded-3xl bg-[#191A2C] " +
                  (menu
                    ? " w-[300px] h-[210px] mt-[50px]"
                    : " w-[40px] h-[10px] mt-[50px]")
                }
                style={{ transition: ".4s" }}
              ></div>
            </div>
            <div className=" flex justify-center items-center bg-slate-400 rounded-2xl text-[black]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div> */}
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="w-[calc(100%-115px)] h-[50px] flex flex-col justify-center items-start">
                <span className="text-[18px]">Dinner at Reja Restuarant</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  by, Hitesh Sharma
                </span>
              </div>
              <div className="w-[100px]  h-[50px] flex flex-col justify-center items-end">
                <span className="text-[18px]">1239.98</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  12th Jan
                </span>
              </div>
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="w-[calc(100%-115px)] h-[50px] flex flex-col justify-center items-start">
                <span className="text-[18px]">Shopping at Mall</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  by, Ratanu Sinha
                </span>
              </div>
              <div className="w-[100px]  h-[50px] flex flex-col justify-center items-end">
                <span className="text-[18px]">5689.38</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  12th Jan
                </span>
              </div>
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="w-[calc(100%-115px)] h-[50px] flex flex-col justify-center items-start">
                <span className="text-[18px]">Shopping at Mall</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  by, Ratanu Sinha
                </span>
              </div>
              <div className="w-[100px]  h-[50px] flex flex-col justify-center items-end">
                <span className="text-[18px]">5689.38</span>
                <span className="text-[14px] mt-[-4px] text-[#00000085]">
                  12th Jan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TransactionModalTrip = () => {
  const [addNewTransaction, setAddNewTransaction] = useState(false);
  const [subSection, setSubSection] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [paymentDropdown, setCPaymentDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [value, setValue] = useState(
    new Date().getDate() +
      "/" +
      parseInt(parseInt(new Date().getMonth()) + 1) +
      "/" +
      new Date().getFullYear()
  );

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }
  return (
    <>
      <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex flex-col justify-end items-center p-[20px] z-50 font-[google] font-normal">
        <div className="w-full h-[700px] flex flex-col py-[20px] justify-start items-start bg-white rounded-3xl z-10">
          <div className="text-[22px] px-[20px]">Transaction Details</div>
          <div className="w-full h-auto px-[20px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
            <div className="flex flex-col justify-between items-start  w-full ">
              <div className="text-[15px] mt-[10px] text-[#0000005d]">
                Label
              </div>
              <input
                className={
                  "outline-none w-full h-[45px] rounded-lg pl-[10px] bg-[#F5F6FA]  border px-[20px] text-black font-[google] font-normal text-[16px] z-40 border-[#F5F6FA]" +
                  (label == "NotFound"
                    ? " border-[#d02d2d] "
                    : " border-[#F5F6FA] ")
                }
                value={label == "NotFound" ? "" : label}
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              ></input>
            </div>

            <div className="flex w-full justify-between items-center mt-[5px]">
              <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)]">
                <div className="text-[15px] mt-[10px] text-[#0000005d]">
                  Date
                </div>
                <div className="w-full h-[45px] bg-[#F5F6FA] flex justify-center items-center rounded-lg">
                  <div className="w-[30px] h-[45px] flex justify-end  items-center mr-[-30px] text-black z-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.9"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-calendar-plus"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                      <path d="M3 10h18" />
                      <path d="M16 19h6" />
                      <path d="M19 16v6" />
                    </svg>
                  </div>
                  <input
                    className={
                      "outline-none w-full h-[45px] rounded-xl pl-[40px] bg-transparent border px-[20px] text-black font-[google] font-normal text-[16px] z-40 border-[#F5F6FA]"
                    }
                    value={
                      new Date().getDate() +
                      "/" +
                      (parseInt(new Date().getMonth()) + 1) +
                      "/" +
                      new Date().getFullYear()
                    }
                  ></input>
                </div>
              </div>

              <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] ">
                <div className="text-[15px] mt-[10px] text-[#0000005d]">
                  Amount
                </div>
                <div className="w-full h-[45px] bg-[#F5F6FA] flex justify-center items-center rounded-lg">
                  <div className="w-[30px] h-[45px] flex justify-end  items-center mr-[-30px] text-black z-50">
                    <BiRupee className="text-[17px]" />
                  </div>
                  <input
                    className={
                      "outline-none w-full h-[45px] bg-transparent rounded-xl pl-[40px] border px-[20px] text-black font-[google] font-normal text-[16px] z-40 " +
                      (price == "NotFound"
                        ? " border-[#d02d2d] "
                        : " border-[#F5F6FA] ")
                    }
                    value={price == "NotFound" ? "" : price}
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
            <div className="flex w-full  justify-between h-auto items-start  font-[google] font-normal text-black text-[15px]">
              <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] ">
                <div className="text-[15px] mt-[10px] text-[#0000005d]">
                  Category
                </div>
                <div
                  className="w-full h-auto flex justify-start items-center z-50"
                  onClick={() => {
                    setCategoryDropdown(!categoryDropdown);
                    setCPaymentDropdown(false);
                  }}
                >
                  <div
                    className={
                      "outline-none w-full h-[45px] rounded-lg pl-[10px] flex justify-start items-center border px-[20px] text-black font-[google] font-normal text-[16px] z-40 bg-[#F5F6FA] " +
                      (category == "NotFound"
                        ? " border-[#d02d2d] "
                        : " border-[#F5F6FA] ")
                    }
                  >
                    {category == "NotFound" ? <></> : <>{category}</>}
                  </div>
                  <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px] z-40">
                    {categoryDropdown ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-up"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-down"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] ">
                <div className="text-[15px] mt-[10px] text-[#0000005d]">
                  Payment Mode
                </div>
                <div
                  className="w-full h-auto flex justify-start items-center z-50 bg-[#F5F6FA] rounded-lg"
                  onClick={() => {
                    setCPaymentDropdown(!paymentDropdown);
                    setCategoryDropdown(false);
                  }}
                >
                  <div
                    className={
                      "outline-none w-full h-[45px] rounded-xl pl-[10px] flex justify-start whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1 items-center border px-[20px] text-black font-[google] font-normal text-[16px] z-40 bg-[#F5F6FA]" +
                      (mode == "NotFound"
                        ? " border-[#d02d2d] "
                        : " border-[#F5F6FA] ")
                    }
                  >
                    {mode == "NotFound" ? <></> : <>{mode}</>}
                  </div>
                  <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px] z-40">
                    {paymentDropdown ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-up"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-down"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[0px] flex justify-between items-center">
              <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                <div
                  className={
                    "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[145px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px]" +
                    (categoryDropdown ? " flex" : " hidden")
                  }
                >
                  {categoryName.map((data, index) => {
                    return (
                      <div
                        className="w-full py-[6px] flex justify-start items-center z-50"
                        onClick={() => {
                          setCategory(data);
                          setCategoryDropdown(false);
                        }}
                      >
                        <SmallSizeIcon Category={data} />
                        <div className="ml-[15px]" key={index}>
                          {data}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                <div
                  className={
                    "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[145px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px] left-[40px]" +
                    (paymentDropdown ? " flex" : " hidden")
                  }
                >
                  {paymentName.map((data, index) => {
                    return (
                      <div
                        className="w-full py-[6px] flex justify-start items-center z-50"
                        onClick={() => {
                          setMode(data);
                          setCPaymentDropdown(false);
                        }}
                      >
                        <div className="" key={index}>
                          {data}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full justify-center items-start font-[google] font-normal text-black text-[15px]">
              <div
                className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                style={{ transition: ".4s" }}
              ></div>
              <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose ">
                <span
                  className={
                    "p-[10px] flex-grow mb-[5px] ml-[5px] bg-[#F5F6FA] rounded-lg w-[80px] h-[110px] mt-[30px] border  flex justify-center items-center text-[#000000] text-[16px]" +
                    (imageError
                      ? " border-[#d02d2d] text-[#d02d2d]"
                      : " border-[#F5F6FA] text-[#000000]")
                  }
                >
                  {imageError ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-image"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span className="ml-[10px]">Not a Valid Reciept</span>
                    </>
                  ) : (
                    <>
                      {" "}
                      {bill.length == 0 ? (
                        <>
                          <IoMdCloudUpload className="text-[25px]" />
                          <span className="ml-[10px] ">Upload Photo</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-image"
                          >
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <span className="ml-[10px]">Uploaded</span>
                        </>
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="w-full flex mt-[15px] justify-center items-end font-[google] font-normal text-[16px] text-black ">
              <div
                className=" mr-[15px] px-[15px] py-[10px] rounded-lg bg-[#F5F6FA] text-[black] flex justify-center items-center cursor-pointer  "
                onClick={() => {
                  // setAddNewTransaction(false);
                  // setLabel("");
                  // setPrice("");
                  // setCategory("");
                  // setMode("");
                  // setBill("");
                  // setSubSection("");
                }}
              >
                Cancel
              </div>
              {label?.length != 0 &&
              value?.length != 0 &&
              price?.length != 0 &&
              category?.length != 0 &&
              mode?.length != 0 &&
              label != "NotFound" &&
              price != "NotFound" &&
              value != "NotFound" &&
              category != "NotFound" &&
              mode != "NotFound" ? (
                <>
                  <div
                    className=" flex justify-center  px-[15px] py-[10px] rounded-lg bg-[#181F32] text-[white] items-center cursor-pointer "
                    onClick={() => {
                      // setSubSection("");
                      // addToFirebase();
                      // setAddNewTransaction(false);
                    }}
                  >
                    Update
                  </div>
                </>
              ) : (
                <>
                  <div className=" flex justify-center  px-[15px] py-[10px] rounded-lg bg-[#181f3223] items-center text-[#0000006c]  ">
                    Update
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TourExpense;
