import React, { useEffect, useState } from "react";
import { FaHandHoldingMedical, FaShopify } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import {
  MdCallSplit,
  MdElectricBolt,
  MdMedication,
  MdOutlineAirplanemodeActive,
  MdOutlineModeOfTravel,
  MdOutlinePets,
  MdOutlineTravelExplore,
  MdSchool,
} from "react-icons/md";
import { FaKitMedical, FaTruckMedical } from "react-icons/fa6";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import { GiAutoRepair, GiPartyPopper } from "react-icons/gi";
import { HiOutlinePlus, HiReceiptRefund, HiShoppingBag } from "react-icons/hi2";
// import "react-circular-progressbar/dist/styles.css";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { PiMapPinLineFill, PiSealQuestionFill } from "react-icons/pi";
import { BiRupee } from "react-icons/bi";

const SubCategory = (props) => {
  const [expand, setExpand] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  function getCount(category) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let totalAmount = 0;
    let count = 0;

    props?.transactionHistory?.forEach((item) => {
      const [day, month, year] = item.Date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day); // Month is 0-indexed for Date object

      if (
        item.Category === category &&
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      ) {
        totalAmount += item.Amount;
        count++;
      }
    });

    return count;
  }

  function getTotalAmountForCurrentMonthAndCategory(category) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let totalAmount = 0;
    let count = 0;

    props?.transactionHistory?.forEach((item) => {
      const [day, month, year] = item.Date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day); // Month is 0-indexed for Date object

      if (
        item.Category === category &&
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      ) {
        totalAmount += item.Amount;
        count++;
      }
    });

    // setCountt(count);

    return totalAmount;
  }

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+$/.test(str);
  }

  function update() {
    const user = firebase.auth().currentUser;
    const userRef = db
      .collection("Expense")
      .doc(user?.uid)
      .update({ "CategoryBudget.Entertainment": newBudget });

    setNewBudget("");
  }

  function deleteData() {
    const user = firebase.auth().currentUser;
    const userRef = db
      .collection("Expense")
      .doc(user?.uid)
      .update({ "CategoryBudget.Entertainment": "" });
  }

  return (
    <>
      {updateModal === true ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#0000003e] p-[20px] fixed top-0 left-0  z-50"
            style={{ zIndex: 90 }}
          >
            <div className="w-full flex flex-col justify-end items-start h-[40px]">
              <div className="w-[calc(100%-40px)] h-[20px] bg-[#ffffff] fixed z-30"></div>
              <div className="w-full h-auto flex justify-start items-center z-40">
                <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                  {/* {part + 1}/
                  {props?.budget == 0 && props?.income == 0 ? (
                    <>{Info.length}</>
                  ) : (
                    <>{Info.length - 1}</>
                  )} */}
                  <span className="mt-[10px]">
                    Sub-Budget for {props?.data}
                  </span>
                </div>
                <div className="w-[calc(100%-80px)] bg-[#c1c1c1] h-[40px] rounded-bl-[22px] ">
                  <div
                    className="h-[35px] aspect-square rounded-full bg-[#c3e2ff] ml-[5px] mb-[5px] flex justify-center items-center text-[20px] "
                    onClick={() => {
                      //   setBudgetModal(false);
                      //   setNewBudget("");
                      //   setError("");
                      setUpdateModal(false);
                    }}
                  >
                    <HiOutlinePlus className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-[100%]  h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]">
              <div className="flex w-full justify-start items-center">
                <div className="w-[30px] h-full flex justify-center items-center mr-[-30px]">
                  <BiRupee className="text-black" />
                </div>
                <input
                  className="outline-none w-full pl-[26px] rounded-md h-[40px] bg-transparent border border-[#acebff] px-[10px] text-black font-[google] font-normal text-[14px]"
                  placeholder="Enter Budget"
                  value={newBudget}
                  onChange={(e) => {
                    if (isNumeric(e.target.value) === true) {
                      setNewBudget(e.target.value);
                    }
                  }}
                ></input>
              </div>

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[10px] ">
                <div
                  className="h-full mr-[25px] flex justify-center items-center  cursor-pointer "
                  onClick={() => {
                    setUpdateModal(false);
                  }}
                >
                  Cancel
                </div>
                {newBudget.length > 0 ? (
                  <>
                    <div
                      className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                      onClick={() => {
                        setUpdateModal(false);
                        update();
                      }}
                    >
                      Update
                    </div>
                  </>
                ) : (
                  <div
                    className="h-full  flex justify-center items-center text-[#ffc194] cursor-pointer "
                    onClick={() => {}}
                  >
                    Update
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {deleteModal === true ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#0000003e] p-[20px] fixed top-0 left-0  z-50"
            style={{ zIndex: 90 }}
          >
            <div className="w-full flex flex-col justify-end items-start h-[40px]">
              <div className="w-[calc(100%-40px)] h-[20px] bg-[#ffffff] fixed z-30"></div>
              <div className="w-full h-auto flex justify-start items-center z-40">
                <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                  <span className="mt-[10px]">Delete Sub-Budget</span>
                </div>
                <div className="w-[calc(100%-80px)] bg-[#c1c1c1] h-[40px] rounded-bl-[22px] ">
                  <div
                    className="h-[35px] aspect-square rounded-full bg-[#c3e2ff] ml-[5px] mb-[5px] flex justify-center items-center text-[20px] "
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                  >
                    <HiOutlinePlus className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-[100%]  h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]">
              <div className="flex w-full justify-start items-center text-[14px]">
                Categorical Budget for '{props?.data}' will be removed and you
                will no lonher be able to track budget for this specific
                category. Are you sure you want to do this ?
              </div>

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[10px] ">
                <div
                  className="h-full mr-[25px] flex justify-center items-center  cursor-pointer "
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  Cancel
                </div>

                <div
                  className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                  onClick={() => {
                    setDeleteModal(false);
                    deleteData();
                  }}
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        className={
          "w-full  bg-[#e4f2ff] rounded-3xl p-[20px] flex flex-col justify-start items-start mb-[5px] cursor-pointer" +
          (expand ? " min-h-[130px]" : " min-h-[80px]")
        }
        onClick={() => {
          setExpand(!expand);
        }}
        style={{ transition: ".4s" }}
      >
        <div className="w-full h-[40px] flex justify-start items-center ">
          <div className="w-[calc(100%-40px)] h-full flex  justify-start items-start">
            <div className="w-[30px] h-[30px] mt-[0px] mr-[15px] text-[14px] rounded-full bg-[#c3e2ff] text-[#000000] flex justify-center items-center">
              x{getCount(props?.data)}
            </div>
            <span className="w-auto h-full  flex flex-col justify-start items-start">
              <span>{props?.data}</span>{" "}
              <div className="w-auto text-[14px] flex justify-start items-center text-[#828282]">
                {/* <span> */}
                {parseFloat(
                  getTotalAmountForCurrentMonthAndCategory(props?.data)
                ).toFixed(2)}{" "}
                <span className="ml-[3px] ">
                  / {Number(props?.subBudget[props?.data])}
                </span>
              </div>
            </span>
          </div>
          <div className="w-[40px] h-[40px] mr-[-40px] flex justify-center items-center ">
            <div className="text-[20px] text-[#23a8d2]">
              {/* <FaShopify /> */}
              {props?.data === "Food & Drinks" ? (
                <IoFastFood />
              ) : props?.data === "Shopping" ? (
                <FaShopify />
              ) : props?.data === "Grocery" ? (
                <HiShoppingBag />
              ) : props?.data === "Medical" ? (
                <FaTruckMedical />
              ) : props?.data === "Travel" ? (
                // <MdOutlineTravelExplore />
                // <PiMapPinLineFill />
                // <BiSolidPlaneTakeOff />
                <MdOutlineAirplanemodeActive className="rotate-45" />
              ) : props?.data === "Entertainment" ? (
                <GiPartyPopper />
              ) : props?.data === "Electricity Bill" ? (
                <MdElectricBolt />
              ) : props?.data === "Petrol / Diesel" ? (
                <BsFillFuelPumpFill />
              ) : props?.data === "Taxi Fare" ? (
                <BsTaxiFrontFill />
              ) : props?.data === "Car Maintanance" ? (
                <GiAutoRepair />
              ) : props?.data === "Education" ? (
                <MdSchool />
              ) : props?.data === "Pet Care" ? (
                <MdOutlinePets />
              ) : (
                <>
                  <PiSealQuestionFill />
                </>
              )}
            </div>
          </div>
          <div className="w-[40px] h-[40px] flex justify-center items-center ">
            <CircularProgressbar
              value={parseFloat(
                getTotalAmountForCurrentMonthAndCategory(props?.data)
              )}
              maxValue={parseFloat(props?.subBudget[props?.data])}
              strokeWidth={7}
              styles={buildStyles({
                pathTransitionDuration: 2,
                transition: "stroke-dashoffset 0.5s ease 0s",
                pathColor:
                  getTotalAmountForCurrentMonthAndCategory(props?.data) /
                    props?.subBudget[props?.data] >=
                  75
                    ? "#e61d0f"
                    : "#00bb00",
                textColor: "#f88",
                trailColor: "#ffffff",
                backgroundColor: "#000000",
              })}
            />
          </div>
        </div>
        {expand ? (
          <div
            className="w-full h-[50px] flex justify-end items-end opacity-100 "
            style={{ transition: ".2s", transitionDelay: ".3s" }}
          >
            <span
              className="w-auto px-[15px] h-[35px] font-[google] font-normal text-[14px] rounded-[14px] bg-[#c3e2ff] flex justify-center items-center"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              Delete
            </span>
            <span
              className="ml-[10px] w-auto px-[15px] h-[35px] font-[google] font-normal text-[14px] rounded-[14px] bg-[#c3e2ff] flex justify-center items-center"
              onClick={() => {
                setUpdateModal(!updateModal);
              }}
            >
              Update Budget
            </span>
          </div>
        ) : (
          <div className="w-full h-[50px]  justify-end items-end flex opacity-0">
            <span className="w-auto px-[15px] h-[35px] font-[google] font-normal text-[14px] rounded-[14px] bg-[#c3e2ff] flex justify-center items-center">
              Update Budget
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default SubCategory;
