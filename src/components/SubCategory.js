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
  // const [expand, setExpand] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [sCount, setSCount] = useState("");
  const [sTotal, setSTotal] = useState("");
  const [nCount, setNCount] = useState("");
  const [nTotal, setNTotal] = useState("");

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
    let splitCount = 0;
    let splitAmount = 0;
    let normalCount = 0;
    let normalAmount = 0;

    props?.transactionHistory?.forEach((item) => {
      const [day, month, year] = item.Date.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day); // Month is 0-indexed for Date object

      if (
        item.Category === category &&
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      ) {
        if (item?.TransactionType === "Single") {
          normalCount++;
          if (item?.MoneyIsAdded) {
            normalAmount = normalAmount - parseFloat(item?.Amount);
          } else {
            normalAmount = normalAmount + parseFloat(item?.Amount);
          }
        } else {
          splitCount++;
          if (item?.MoneyIsAdded) {
            splitAmount = splitAmount - parseFloat(item?.Amount);
          } else {
            splitAmount = splitAmount + parseFloat(item?.Amount);
          }
        }
        totalAmount += parseFloat(item.Amount);
        count++;
      }
    });

    // console.log(splitCount, splitAmount, normalCount, normalAmount);

    // setNCount(normalCount);
    // setNTotal(normalAmount);
    // setSCount(splitCount);
    // setSTotal(splitAmount);

    // setCountt(count);

    return [totalAmount, splitCount, splitAmount, normalCount, normalAmount];
  }

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+$/.test(str);
  }

  function update() {
    const user = firebase.auth().currentUser;
    let updateData = {};
    updateData[`CategoryBudget.${props?.data}`] = newBudget;
    const userRef = db.collection("Expense").doc(user?.uid).update(updateData);

    setNewBudget("");
  }

  function deleteData() {
    const user = firebase.auth().currentUser;
    let updateData = {};
    updateData[`CategoryBudget.${props?.data}`] = "newBudget";
    const userRef = db.collection("Expense").doc(user?.uid).update(updateData);
  }

  return (
    <>
      {updateModal === true ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center backdrop-blur-sm bg-[#68777b7a] p-[20px] fixed top-0 left-0  z-50"
            style={{ zIndex: 90 }}
          >
            <div className="w-full flex flex-col justify-end items-start h-[40px]">
              <div className="w-full h-auto flex justify-start items-end z-30">
                <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal   h-[40px] bg-[#ffffff] flex  justify-start items-end rounded-t-[22px] px-[20px]">
                  <span className="mt-[10px]">Update Sub-Budget</span>
                </div>
                <div className="h-[20px] aspect-square inRound"></div>
                <div
                  className="h-[35px]  aspect-square rounded-full cursor-pointer bg-[#e4f2ff] ml-[-15px] mb-[5px] flex justify-center items-center text-[20px] "
                  onClick={() => {
                    setUpdateModal(false);
                    setNewBudget("");
                  }}
                >
                  <HiOutlinePlus className="rotate-45" />
                </div>
              </div>
            </div>
            <div className="min-w-[100%]  h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]">
              <div className="w-full flex justify-start items-center mb-[10px] text-[18px] mt-[-4px]">
                <span className="mr-[4px] text-[#828282]">Category :</span> "
                {props?.data}"
              </div>
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
                    setNewBudget("");
                  }}
                >
                  Cancel
                </div>
                {newBudget.length > 0 ? (
                  <>
                    <div
                      className="h-full  flex justify-center items-center text-[#6bb7ff] cursor-pointer "
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
                    className="h-full  flex justify-center items-center text-[#c2e1ff] cursor-pointer "
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
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-50"
            style={{ zIndex: 90 }}
          >
            <div className="w-full flex flex-col justify-end items-start h-[40px]">
              <div className="w-full h-auto flex justify-start items-end z-30">
                <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                  <span className="mt-[10px]">Delete Sub-Budget</span>
                </div>
                <div className="h-[20px] aspect-square inRound"></div>
                <div
                  className="h-[35px]  aspect-square rounded-full cursor-pointer bg-[#181F32] text-[white] ml-[-15px] mb-[5px] flex justify-center items-center text-[20px] "
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  <HiOutlinePlus className="rotate-45" />
                </div>
              </div>
            </div>
            <div className="min-w-[100%]  h-auto bg-[#ffffff] drop-shadow-sm   text-[#00000085]  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[20px]">
              <div className="flex w-full justify-start items-center text-[14px]">
                Categorical Budget for '{props?.data}' will be removed and you
                will no lonher be able to track budget for this specific
                category. Are you sure you want to do this ?
              </div>

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[15px] ">
                <div
                  className="h-full mr-[25px] flex justify-center items-center  cursor-pointer "
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  Cancel
                </div>

                <div
                  className="h-full  flex justify-center items-center text-[#6bb7ff] cursor-pointer "
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
          "w-full  bg-[#F4F5F7] rounded-2xl p-[20px] flex flex-col justify-start items-start mb-[5px]  overflow-hidden" +
          (props?.expand == props?.data ? " min-h-[180px]" : " min-h-[80px]") +
          (props?.isNeeded === false
            ? " max-h-[80px] cursor-default"
            : " cursor-pointer")
        }
        onClick={() => {
          if (props?.isNeeded === false) {
          } else {
            if (props?.data === props?.expand) {
              props?.setExpand("");
            } else {
              props?.setExpand(props?.data);
            }
          }
        }}
        style={{ transition: ".4s" }}
      >
        <div className="w-full h-[40px] flex justify-start items-center ">
          {props?.isNeeded === false ? (
            <div className=" h-[40px] mr-[10px] flex text-[28px] justify-center items-center ">
              <div className="text-[25px] text-[#23a8d2]">
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
          ) : (
            <></>
          )}
          <div className="w-[calc(100%-40px)] h-full flex  justify-start items-start">
            <div
              className={
                "w-[30px] h-[30px] mt-[0px] mr-[15px] text-[14px] rounded-full bg-[#181F32] text-[#ffffff]  justify-center items-center" +
                (props?.isNeeded === false ? " hidden" : " flex")
              }
            >
              x{getCount(props?.data)}
            </div>
            <span
              className={
                "w-auto h-full   flex-col  items-start" +
                (props?.isNeeded === false
                  ? " flex justify-center mt-[0px] text-[15px]"
                  : " flex justify-start mt-[-2px]")
              }
            >
              <span className="text-[16px]">{props?.data}</span>{" "}
              {props?.isNeeded === false ? (
                <>
                  <div className="flex w-[calc(80%)] justify-start items-center h-[30px] mt-[5px] ">
                    <div className="w-[30px] h-full flex justify-center items-center mr-[-30px]">
                      <BiRupee className="text-black" />
                    </div>
                    <input
                      className="outline-none w-full pl-[26px] rounded-md h-[30px] bg-transparent border border-[#181F32] px-[10px] text-black font-[google] font-normal text-[14px]"
                      placeholder="Enter Budget"
                      value={newBudget}
                      onChange={(e) => {
                        if (isNumeric(e.target.value) === true) {
                          setNewBudget(e.target.value);
                        }
                      }}
                    ></input>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div
                className={
                  "w-auto text-[14px]  justify-start items-center text-[#00000085]" +
                  (props?.isNeeded === false ? " hidden" : " flex")
                }
              >
                {/* <span> */}
                {parseFloat(
                  getTotalAmountForCurrentMonthAndCategory(props?.data)[0]
                ).toFixed(2)}{" "}
                <span className="ml-[3px] ">
                  / {Number(props?.subBudget[props?.data])}
                </span>
              </div>
            </span>
          </div>
          <div
            className={
              "w-[40px] h-[40px] mr-[-40px] flex justify-center items-center " +
              (props?.isNeeded === false ? " hidden" : " flex")
            }
          >
            <div className="text-[20px] text-[#000000]">
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
          {props?.isNeeded == false ? (
            <>
              <div
                className={
                  "h-full w-auto flex justify-end items-center" +
                  (newBudget.length > 0 ? " opacity-100" : " opacity-0")
                }
              >
                <span
                  className="ml-[10px] w-auto px-[15px] h-[35px] font-[google] whitespace-nowrap font-normal text-[14px] rounded-[14px] bg-[#181F32]  flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    update();
                    // setUpdateModal(!updateModal);
                  }}
                >
                  Add
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
          <div
            className={
              "w-[40px] h-[40px] justify-center items-center " +
              (props?.isNeeded === false ? " hidden" : " flex")
            }
          >
            <CircularProgressbar
              value={parseFloat(
                getTotalAmountForCurrentMonthAndCategory(props?.data)[0]
              )}
              maxValue={parseFloat(props?.subBudget[props?.data])}
              strokeWidth={7}
              styles={buildStyles({
                pathTransitionDuration: 2,
                transition: "stroke-dashoffset 0.5s ease 0s",
                pathColor:
                  parseFloat(
                    getTotalAmountForCurrentMonthAndCategory(props?.data)[0]
                  ).toFixed(2) /
                    Number(props?.subBudget[props?.data]) >=
                  75
                    ? "#7364af"
                    : "#7364af",
                textColor: "#f88",
                trailColor: "#ffffff",
                backgroundColor: "#000000",
              })}
            />
          </div>
        </div>
        {props?.expand == props?.data ? (
          <>
            <div
              className="w-full h-[60px] pl-[45px] flex flex-col justify-center items-start text-[14px] pt-[7px] text-[#3d3d3d] opacity-100 "
              style={{ transition: ".2s", transitionDelay: ".3s" }}
            >
              <span className="w-full flex justify-start items-center whitespace-nowrap text-[#00000085]">
                <div className="w-[20px] aspect-square rounded-full text-[12px] mr-[6px] bg-[#181F32] text-[#ffffff] flex justify-center items-center">
                  x{getTotalAmountForCurrentMonthAndCategory(props?.data)[1]}
                </div>
                Single Transactions :{" "}
                {getTotalAmountForCurrentMonthAndCategory(
                  props?.data
                )[2].toFixed(2)}{" "}
              </span>
              <span className="w-full flex justify-start items-center whitespace-nowrap text-[#00000085]">
                <div className="w-[20px] aspect-square rounded-full text-[12px] mr-[6px] bg-[#181F32] text-[#ffffff] flex justify-center items-center">
                  x{getTotalAmountForCurrentMonthAndCategory(props?.data)[3]}
                </div>
                Split Transactions :{" "}
                {getTotalAmountForCurrentMonthAndCategory(
                  props?.data
                )[4].toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-full h-[60px] pl-[45px] flex flex-col justify-center items-start text-[14px] pt-[7px] text-[#3d3d3d]  opacity-0 overflow-hidden">
              <span className="w-full flex justify-start items-center">
                <div className="w-[20px] aspect-square rounded-full text-[12px] mr-[6px] bg-[#c3e2ff] text-[#000000] flex justify-center items-center">
                  x{getTotalAmountForCurrentMonthAndCategory(props?.data)[1]}
                </div>
                Single Transactions :{" "}
                {getTotalAmountForCurrentMonthAndCategory(props?.data)[2]}{" "}
              </span>
              <span className="w-full flex justify-start items-center">
                <div className="w-[20px] aspect-square rounded-full text-[12px] mr-[6px] bg-[#c3e2ff] text-[#000000] flex justify-center items-center">
                  x{getTotalAmountForCurrentMonthAndCategory(props?.data)[3]}
                </div>
                Split Transactions :{" "}
                {getTotalAmountForCurrentMonthAndCategory(props?.data)[4]}
              </span>
            </div>
          </>
        )}

        {props?.expand == props?.data ? (
          <div
            className="w-full h-[50px] flex justify-end items-end opacity-100 "
            style={{ transition: ".2s", transitionDelay: ".3s" }}
          >
            <span
              className="w-auto px-[15px] h-[35px] font-[google] font-normal text-[14px] rounded-[14px] text-[white] bg-[#181F32] hover:bg-[#181F32] flex justify-center items-center"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              Delete
            </span>
            <span
              className="ml-[10px] w-auto px-[15px] h-[35px] font-[google] font-normal text-[14px] rounded-[14px] text-[white] bg-[#181F32] hover:bg-[#181F32] flex justify-center items-center"
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
