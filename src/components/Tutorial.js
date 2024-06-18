import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaFilter, FaLongArrowAltDown } from "react-icons/fa";
import { Line, Circle } from "rc-progress";
// import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import ExpenseBarGraph from "./ExpenseBarGraph";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoChevronRight } from "react-icons/go";
import { FiPlus } from "react-icons/fi";

import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaHandHoldingMedical, FaShopify } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";
import SubGraph from "./SubGraph";
import { renderActiveShape } from "./UsageGraph";
import { auth } from "../firebase";
import { db } from "../firebase";

import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import { HiOutlinePlus } from "react-icons/hi";
import { BsSkipEndFill } from "react-icons/bs";

const data = [
  { label: "Shopping", amount: 400 },
  { label: "Entertainment", amount: 300 },
  { label: "Food & Drinks", amount: 300 },
  { label: "Group D", amount: 200 },
  { label: "Group sfd", amount: 200 },
  { label: "Group g", amount: 200 },
];

const COLORS = [
  "#95241d",
  "#b63525",
  "#d74e25",
  "#ea682a",
  "#ee8a56",
  "#f2a87f",
];

const Info = [
  {
    section: 1,
    info: "This displays the total expenses you've incurred this month and the remaining budget for this month.",
  },
  {
    section: 1,
    info: "This displays your current budget along with a progress bar for better visualization.",
  },
  {
    section: 1,
    info: "This shows your total expenses for the month (left) and the total remaining budget for the month (right).",
  },
  {
    section: 1,
    info: "This section displays your Transaction History for the current month. You can also view and filter the transaction history for different months.",
  },
  {
    section: 1,
    info: "From here, you can add new transactions and keep a record of them.",
  },
  {
    section: 2,
    info: "This graph shows how much you have spent in each category from your expenses every month.",
  },
  {
    section: 2,
    info: "This is the Categorical Budget. Here, you can see how much you have spent out of your budget for each specific category you've set a budget for.",
  },
  {
    section: 3,
    info: "This shows your total dues and expenses for the month based on your reminders. You can also create reminders for specific dates (on the right).",
  },
  {
    section: 3,
    info: "Here you can access all of your reminders and disable them once you have completed the transaction.",
  },
  {
    section: 4,
    info: "Here you can see the total amount you are owed by others (left) and the total amount you owe to others (right) from split bills.",
  },
  {
    section: 4,
    info: "Here, you can view all the transactions that you and others have split with you. You can also check the split transaction history from previous months.",
  },
  {
    section: "Almost Done",
    info: "Here, you can view all the transactions that you and others have split with you. You can also check the split transaction history from previous months.",
  },
];

const Tutorial = (props) => {
  const [part, setPart] = useState(0);

  const [newIncome, setNewIncome] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [error, setError] = useState("");

  function doneTutorial() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user.uid).update({
      Tutorial: false,
    });
  }
  function update() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user.uid).update({
      Budget: newBudget,
      TotalIncome: newIncome,
    });
  }

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+$/.test(str);
  }

  useEffect(() => {
    if (parseInt(newBudget) >= Number(newIncome)) {
      setError("* Budet should be less than Income");
    } else {
      setError("");
    }
  }, [newBudget, newIncome]);

  // function fetchBudget() {
  //   const user = firebase.auth().currentUser;
  //   const userRef = db.collection("Expense").doc(user.uid);
  //   onSnapshot(userRef, (snapshot) => {
  //     setBudget(snapshot?.data()?.Budget);
  //     setIncome(snapshot?.data()?.TotalIncome);
  //   });
  // }
  return (
    <div className="w-full h-[100svh] fixed top-0 left-0 bg-[#0000003e] z-50 font-[google] font-normal text-[15px] flex flex-col justify-end p-[20px] items-center">
      <div className="w-full flex flex-col justify-end items-start h-auto">
        <div className="w-[calc(100%-40px)] h-[17px] bg-[#FFF5EE] fixed z-20"></div>
        <div className="w-full h-auto flex justify-start items-center z-30">
          <div className=" w-[80px] p-[20px] py-[9px] h-[34px] bg-[#FFF5EE] flex  justify-start items-center rounded-t-[20px]">
            {part + 1}/
            {props?.budget == 0 && props?.income == 0 ? (
              <>{Info.length}</>
            ) : (
              <>{Info.length - 1}</>
            )}
          </div>
          <div className="w-[calc(100%-80px)] bg-[#c1b9b4] h-[34px] rounded-bl-[20px] ">
            {props?.budget == 0 && props?.income == 0 ? (
              <>
                {part < 11 ? (
                  <>
                    <div
                      className="h-[29px] aspect-square rounded-full bg-[#fff5ee] ml-[5px] mb-[5px] flex justify-center items-center text-[15px] px-[10px] cursor-pointer "
                      onClick={() => {
                        if (props?.budget == 0 && props?.income == 0) {
                          setPart(11);
                          props?.setSegment(4);
                        } else {
                          setPart(10);
                          props?.setSegment(4);
                        }
                      }}
                    >
                      {/* <HiOutlinePlus className="rotate-45" /> */}
                      Skip <BsSkipEndFill className=" text-[18px] ml-[3px]" />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {part < 10 ? (
                  <>
                    <div
                      className="h-[29px] aspect-square rounded-full bg-[#fff5ee] ml-[5px] mb-[5px] flex justify-center items-center text-[15px] px-[10px] cursor-pointer "
                      onClick={() => {
                        if (props?.budget == 0 && props?.income == 0) {
                          setPart(11);
                          props?.setSegment(4);
                        } else {
                          setPart(10);
                          props?.setSegment(4);
                        }
                      }}
                    >
                      {/* <HiOutlinePlus className="rotate-45" /> */}
                      Skip <BsSkipEndFill className=" text-[18px] ml-[3px]" />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className=" w-full p-[20px] h-auto bg-[#FFF5EE] flex flex-col justify-start items-center rounded-b-[20px] rounded-tr-[20px]">
        {/* <span>
          This shows total expense you have done in the month (left) and total
          budget remaining this month (right).
        </span> */}
        <span className="text-[22px] mb-[10px] w-full flex justify-start items-center">
          {Info[part]?.section == "Almost Done" ? (
            <>{Info[part].section}</>
          ) : (
            <>Section : {Info[part].section}</>
          )}
        </span>
        {part == 11 ? (
          <div className="w-full flex flex-col justify-start items-start">
            <span className="w-full text-black font-[google] font-normal text-[15px] flex justify-start items-center mt-[-8px] ">
              We need some information about you to move forward
            </span>
            <div className="flex w-full justify-start items-center mt-[20px]">
              <div className="flex justify-center items-center w-[30px] h-full mr-[-30px]">
                <BiRupee className="" />
              </div>
              <input
                className="outline-none w-full h-[40px] bg-transparent pl-[25px] rounded-md border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px]"
                placeholder="Enter Income"
                value={newIncome}
                onChange={(e) => {
                  if (isNumeric(e.target.value) === true) {
                    setNewIncome(e.target.value);
                  }
                }}
              ></input>
            </div>
            <div className="flex w-full justify-start items-center mt-[10px]">
              <div className="flex justify-center items-center w-[30px] h-full mr-[-30px]">
                <BiRupee className="" />
              </div>
              <input
                className="outline-none w-full h-[40px] bg-transparent pl-[25px] rounded-md border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px]"
                placeholder="Enter Budget"
                value={newBudget}
                onChange={(e) => {
                  if (isNumeric(e.target.value) === true) {
                    setNewBudget(e.target.value);
                  }
                }}
              ></input>
            </div>
            {error.length == 0 ? (
              <></>
            ) : (
              <>
                <span className="w-full flex justify-start items-center text-[14px] text-[#c43b31] mt-[4px]">
                  {error}
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <span>{Info[part].info}</span>
          </>
        )}
        <div className="w-full flex justify-end items-center mt-[15px]">
          <div
            className={
              " cursor-pointer" + (part == 0 ? " text-[#a5a5a5]" : " ")
            }
            onClick={() => {
              if (part == 5) {
                props?.setSegment(1);
              }
              if (part == 7) {
                props?.setSegment(2);
              }
              if (part == 9) {
                props?.setSegment(3);
              }

              if (part > 0) {
                setPart(part - 1);
              }
            }}
          >
            Previous
          </div>
          {part >= 10 ? (
            <div
              className="ml-[25px] cursor-pointer"
              onClick={() => {
                if (props?.budget == 0 && props?.income == 0 && part == 10) {
                  setPart(part + 1);
                } else {
                  if (part == 10) {
                    props?.setSegment(1);
                    doneTutorial();
                  } else {
                    if (
                      newIncome.length > 0 &&
                      newBudget.length > 0 &&
                      parseInt(newBudget) < Number(newIncome)
                    ) {
                      props?.setSegment(1);
                      doneTutorial();
                      update();
                    }
                  }
                }
              }}
            >
              Done
            </div>
          ) : (
            <div
              className="ml-[25px] cursor-pointer"
              onClick={() => {
                if (part == 4) {
                  props?.setSegment(2);
                }
                if (part == 6) {
                  props?.setSegment(3);
                }
                if (part == 8) {
                  props?.setSegment(4);
                }

                setPart(part + 1);
              }}
            >
              Next
            </div>
          )}
        </div>
      </div>
      {part == 0 ? (
        <div
          className="w-[calc((100%-40px)/2)] fixed h-[35px] left-[10px] top-[101px] border-[2px] border-[#ffffff] bg-[#fff5ee] pl-[8px] rounded-[10px] flex justify-start items-center"
          style={{ transition: ".3s" }}
        >
          <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
            <span className=" flex justify-start items-center text-[#000000]">
              <BiRupee className="ml-[-3px] " /> 890.00
            </span>

            <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#00bb00] ">
              <FaLongArrowAltDown className="mb-[4px] mr-[5px] text-[15px]" />{" "}
              <BiRupee className="ml-[-3px] mb-[3px]" />
              9110
            </span>
          </span>
        </div>
      ) : part == 1 ? (
        <div
          className="w-[calc((100%-0px)/2)] fixed h-[35px] left-[10px] top-[132px] border-[2px] border-[#ffffff] bg-[#fff5ee] pl-[10px] flex justify-start items-center pt-0 rounded-[10px]"
          style={{ transition: ".3s" }}
        >
          <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center ">
            <Line
              percent={25}
              strokeWidth={6}
              trailColor="#b7b7b7"
              trailWidth={2}
              strokeColor={"" + (25 < 75 ? " #00bb00" : " #c43b31")}
              className="h-[4px]"
            />{" "}
            <span className="whitespace-nowrap flex justify-center items-center ml-[10px] cursor-pointer">
              <BiRupee className="ml-[-3px] " /> 10,000{" "}
              <span className="text-[#828282] ml-[4px] font-normal">
                [ Budget ]{" "}
              </span>
            </span>
          </span>
        </div>
      ) : part == 2 ? (
        <div
          className="w-[calc((100%-40px)/2)] fixed h-[40px] right-[10px] top-[129px] border-[2px] border-[#ffffff] bg-[#fff5ee] rounded-[10px] flex justify-end items-center pr-[9px]"
          style={{ transition: ".3s" }}
        >
          <span
            className="font-[google] font-normal text-[13px] text-[#828282] flex justify-end items-center cursor-pointer "
            // style={{ transitionDelay: ".4s" }}
          >
            Curr. Income{" "}
            <span className="text-[black] flex justify-end items-center ml-[6px]">
              <BiRupee className=" " />
              {"50,000"}
            </span>
          </span>
        </div>
      ) : part == 3 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[148px] right-[10px] top-[192px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          <span className="text-[#828282] font-[google] font-normal text-[14px] w-full  flex justify-between h-[30px] items-start ">
            <div className="flex justify-start items-center">
              Transaction History,{" "}
              <span className=" ml-[4px] text-[black] cursor-pointer flex justify-start items-center">
                {"June"} - {2024}{" "}
                <MdKeyboardArrowDown className="text-[21px]" />
              </span>
            </div>
            <div className="w-[30px] h-full flex justify-end items-center text-black text-[14px]">
              <FaFilter />
            </div>
          </span>
          <span className=" w-full h-[100px] rounded-3xl border-[1px] border-[#ffe6d7] bg-[#ffe6d7]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black]">
            No Transactions done this Month
          </span>
        </div>
      ) : part == 4 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[80px] left-[10px] top-[332px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] "
          style={{ transition: ".3s" }}
        >
          <div className="w-full h-[60px]  px-[10px] font-[google] font-normal text-[15px] bg-[#ffeadc] rounded-3xl border-[1px] border-[#ffe6d7]  text-[#000000] cursor-pointer flex justify-center items-center">
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
        </div>
      ) : part == 5 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[250px] right-[10px] top-[10px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          <div className="w-full h-[270px] ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  activeIndex={0}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#de8544"
                  dataKey="amount"
                  //   onMouseEnter={this.onPieEnter}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : part == 6 ? (
        <div
          className="w-[calc((100%-20px)/2)] bg-[#fff5ee]  fixed h-[240px] right-[10px] top-[260px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden py-[10px]"
          style={{ transition: ".3s" }}
        >
          <div className="w-full h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
            <div className="w-full h-[30px] flex justify-between items-center">
              <span>Shopping</span>
              <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#95241d] flex justify-center items-center">
                x{2}
              </div>
            </div>
            <div className="w-[160px] h-[calc(100%-60px)] mb-[-120px] flex justify-center items-center p-[50px] ">
              <div className="text-[20px] text-[#de8544]">
                <FaShopify />
              </div>
            </div>
            <div className="w-[160px] h-[calc(100%-60px)] flex justify-center items-center p-[50px] ">
              <CircularProgressbar
                value={599}
                maxValue={1500}
                strokeWidth={5}
                styles={buildStyles({
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 2,
                  transition: "stroke-dashoffset 0.5s ease 0s",

                  // Can specify path transition in more detail, or remove it entirely
                  // pathTransition: 'none',

                  // Colors

                  pathColor: "#de8544",
                  textColor: "#f88",
                  trailColor: "#ffffff",
                  backgroundColor: "#de8544",
                })}
                //   text={`${value * 100}%`}
              />
            </div>
            <div className="w-full h-[30px] flex justify-center items-center">
              <span>
                {599} <span className="ml-[3px] text-[#828282]">/ {1500}</span>
              </span>
            </div>
          </div>
        </div>
      ) : part == 7 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[155px] right-[10px] top-[70px] border-[2px] border-[#ffffff] rounded-[10px] flex  justify-start items-center p-[8px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          {" "}
          <div className="w-full h-[135px] flex  justify-between items-center p-[20px] bg-[#ffeadc] rounded-3xl border-[1px] border-[#ffe6d7] ">
            <div className="w-full  flex flex-col justify-center items-start font-[google] font-normal text-[22px] text-white ">
              <span className="text-[#6c6c6c] text-[14px]">
                Total Due till June
              </span>
              <span className="flex justify-start items-center text-[#c43b31] mt-[-5px]">
                <BiRupee className="ml-[-3px]" /> {"2,345.53"}
              </span>
              <span className="text-[#6c6c6c] text-[14px]">
                Total Upcoming in June
              </span>
              <span className="flex justify-start items-center text-[#c43b31] mt-[-5px]">
                <BiRupee className="ml-[-3px]" /> {"4,353.00"}
              </span>
            </div>
            <div className="w-auto h-full flex flex-col justify-center items-center font-[google] font-normal text-black">
              {/* <span className="text-[14px] whitespace-nowrap">New Reminder</span> */}
              <div className="w-[40px] h-[40px] rounded-2xl bg-[#ffcba5] flex justify-center items-center">
                <FiPlus className="text-black text-[20px]" />
              </div>
            </div>
          </div>
        </div>
      ) : part == 8 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[149px] right-[10px] top-[226px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          <span className="text-[#828282] font-[google] font-normal text-[14px] w-full  flex justify-between h-[30px] items-start ">
            <div className="flex justify-start items-center">
              Reminders,{" "}
              <span className=" ml-[4px] text-[black] cursor-pointer flex justify-start items-center">
                {"June"} - {2024}{" "}
                <MdKeyboardArrowDown className="text-[21px]" />
              </span>
            </div>
            <div className="w-[30px] h-full flex justify-end items-center text-black text-[14px]">
              <FaFilter />
            </div>
          </span>
          <span className=" w-full h-[100px] rounded-3xl border-[1px] border-[#ffe6d7] bg-[#ffe6d7]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black]">
            No Reminders remaining this Month
          </span>
        </div>
      ) : part == 9 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[95px] right-[10px] top-[72px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          {" "}
          <div className="w-full h-full flex justify-between items-center font-[google] font-normal ">
            <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
              <span className=" flex justify-center items-center text-[14px] text-[#000000]">
                {/* <IoCalendarSharp className="text-[12px] mr-[8px]" /> */}
                Total you will get
              </span>
              <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
                <span className=" flex justify-start items-center text-[#00bb00]">
                  <BiRupee className="ml-[-4px] " /> {"4,590.50"}
                </span>
              </span>
              <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center mt-[5px]">
                <span className="whitespace-nowrap flex justify-center items-center ml-[1px]">
                  {3}
                  <span className="text-[#828282] ml-[4px] font-normal">
                    Transactions{" "}
                  </span>
                </span>
              </span>
            </div>
            <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
              <span className=" flex justify-center items-center text-[14px] text-[#000000] ">
                Total you to pay
              </span>
              <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
                <span className=" flex justify-start items-center text-[#c43b31]">
                  <BiRupee className="ml-[-3px] " /> {"2,890.00"}
                </span>
              </span>
              <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center mt-[5px]">
                <span className="whitespace-nowrap flex justify-center items-center ">
                  {2}
                  <span className="text-[#828282] ml-[4px] font-normal">
                    Transactions
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : part == 10 ? (
        <div
          className="w-[calc((100%-20px))] bg-[#fff5ee] fixed h-[148px] right-[10px] top-[192px] border-[2px] border-[#ffffff] rounded-[10px] flex flex-col justify-center items-start px-[8px] pr-[10px] overflow-hidden"
          style={{ transition: ".3s" }}
        >
          <span className="text-[#828282] font-[google] font-normal text-[14px] w-full  flex justify-between h-[30px] items-start ">
            <div className="flex justify-start items-center">
              Split Transaction History,{" "}
              <span className=" ml-[4px] text-[black] cursor-pointer flex justify-start items-center">
                {"June"} - {2024}{" "}
                <MdKeyboardArrowDown className="text-[21px]" />
              </span>
            </div>
            <div className="w-[30px] h-full flex justify-end items-center text-black text-[14px]">
              <FaFilter />
            </div>
          </span>
          <span className=" w-full h-[100px] rounded-3xl border-[1px] border-[#ffe6d7] bg-[#ffe6d7]  flex justify-center items-center font-[google] font-normal text-[15px] text-[black]">
            No Transactions have been splitted this Month
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Tutorial;
