import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { IoCalendarSharp } from "react-icons/io5";
import { MdOutlineBarChart } from "react-icons/md";
import { RiDonutChartFill } from "react-icons/ri";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { Line, Circle } from "rc-progress";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import ExpenseBarGraph from "./ExpenseBarGraph";
import OutsideClickHandler from "react-outside-click-handler";
import { HiOutlinePlus } from "react-icons/hi";
import { PiGraph } from "react-icons/pi";

const monthNames = [
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

const QuickInfo = (props) => {
  const [month, setMonth] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [percent, setPersent] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [budgetModal, setBudgetModal] = useState(false);
  const [incomeModal, setIncomeModal] = useState(false);
  const [categoryBudgetIndicator, setCategoryBudgetIndicator] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [newIncome, setNewIncome] = useState("");
  const [error, setError] = useState("");
  const [subError, setSubError] = useState("");

  const [shopping, setShopping] = useState("");
  const [medical, setMedical] = useState("");
  const [grocery, setGrocery] = useState("");
  const [travel, setTravel] = useState("");
  const [entertainment, setEntertainment] = useState("");
  const [food, setFood] = useState("");
  const [other, setOther] = useState("");
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    fetchMonth();
    fetchUserData();
  }, []);

  function add() {
    let sum = 0;
    if (shopping !== "") {
      sum = sum + parseFloat(shopping);
    }
    if (medical !== "") {
      sum = sum + parseFloat(medical);
    }
    if (other !== "") {
      sum = sum + parseFloat(other);
    }
    if (grocery !== "") {
      sum = sum + parseFloat(grocery);
    }
    if (travel !== "") {
      sum = sum + parseFloat(travel);
    }
    if (entertainment !== "") {
      sum = sum + parseFloat(entertainment);
    }
    if (food !== "") {
      sum = sum + parseFloat(food);
    }

    return sum;
  }

  useEffect(() => {
    let tempBudget = add();

    console.log(tempBudget);
    if (parseFloat(tempBudget) === parseFloat(newBudget)) {
      setSubError("");
    } else {
      setSubError("Total should be equal to the Budget");
    }
  }, [shopping, medical, grocery, travel, entertainment, food, other]);

  function fetchUserData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setTransactionHistory(snapshot?.data()?.NormalTransaction);
      setMonthlyExpense(snapshot?.data()?.MonthlyExpense);
      setIncome(snapshot?.data()?.TotalIncome);
      setBudget(snapshot?.data()?.Budget);
      // console.log(snapshot?.data()?.Online);
    });
  }

  useEffect(() => {
    setPersent((parseFloat(monthlyExpense) * 100) / parseFloat(budget));
  }, [budget, monthlyExpense]);

  useEffect(() => {
    sumAmountsByCurrentMonth();
  }, [transactionHistory, props?.month, props?.year]);

  function sumAmountsByCurrentMonth() {
    if (transactionHistory) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-11 for January-December
      const currentYear = currentDate.getFullYear();

      setMonthlyExpense(
        transactionHistory
          .filter((obj) => {
            // const [day, month, year] = obj.Date.split("/").map(Number);
            const dateArr = obj.Date.split("/").map(Number);
            return dateArr[1] === props?.month && dateArr[2] === props?.year;
            // return month - 1 === currentMonth && year === currentYear;
          })
          .reduce((sum, obj) => {
            if (obj?.MoneyIsAdded) {
              sum = sum - parseFloat(obj.Amount);
            } else {
              sum = sum + parseFloat(obj.Amount);
            }

            return sum;
          }, 0)
      ); // Convert amount to number before summing
    }
  }

  function fetchMonth() {
    var date = new Date();
    const currMonth = date.getMonth() + 1;
    setMonth(currMonth);
  }

  function updateBudget() {
    const user = firebase.auth().currentUser;
    db.collection("Expense").doc(user.uid).update({ Budget: newBudget });
    db.collection("Expense")
      .doc(user.uid)
      .update({
        CategoryBudget: {
          Shopping: shopping,
          Medical: medical,
          Grocery: grocery,
          Travel: travel,
          Entertainment: entertainment,
          Food: food,
          Other: other,
        },
      });
    setNewBudget("");
    setShopping("");
    setMedical("");
    setGrocery("");
    setTravel("");
    setEntertainment("");
    setFood("");
    setOther("");
  }

  function updateIncome() {
    const user = firebase.auth().currentUser;
    db.collection("Expense").doc(user.uid).update({ TotalIncome: newIncome });
    setNewIncome("");
  }

  useEffect(() => {
    if (parseFloat(newBudget) >= parseFloat(income)) {
      setError("Budget should be less than Income");
    } else {
      setError("");
    }
  }, [newBudget]);

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+$/.test(str);
  }

  function formatAmountWithCommas(amountStr) {
    // Convert the string to a number
    const amount = parseFloat(amountStr);

    // Check if the conversion was successful
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }

    // Format the number with commas
    return amount.toLocaleString();
  }

  return (
    <>
      {showGraph ? (
        <ExpenseBarGraph
          data={props?.data}
          setShowGraph={setShowGraph}
          UIColor={props?.UIColor}
        />
      ) : (
        <></>
      )}
      {budgetModal === true ? (
        <>
          <div className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40">
            <div className="min-w-[100%] z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black rounded-3xl font-[google] font-normal flex flex-col justify-center items-start p-[30px]">
              <span className="text-[22px] ">Update Budget</span>

              <div className="flex w-full justify-start items-center mt-[15px]">
                <div className="w-[40px] h-full flex justify-center items-center mr-[-40px]">
                  <BiRupee className="text-black text-[18px]" />
                </div>
                <input
                  className="outline-none w-full pl-[36px] rounded-xl h-[45px] bg-transparent border border-[#efefef] px-[10px] text-black font-[google] font-normal text-[16px]"
                  placeholder="Enter Budget"
                  value={newBudget}
                  onChange={(e) => {
                    if (isNumeric(e.target.value) === true) {
                      setNewBudget(e.target.value);
                    }
                  }}
                ></input>
              </div>
              {error.length > 0 ? (
                <>
                  <div
                    className="flex w-full justify-between items-center mt-[6px] text-[#e61d0f] text-[13px]"
                    // style={{ transition: ".3s" }}
                  >
                    * {error}
                  </div>
                </>
              ) : (
                <></>
              )}

              {subError.length > 0 ? (
                <>
                  {categoryBudgetIndicator && newBudget.length != 0 ? (
                    <>
                      <div className="flex w-full justify-between items-center mt-[6px] text-[#e61d0f] text-[13px]">
                        * {subError}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              <div className="w-full h-auto mt-[30px] flex justify-end items-end">
                <div
                  className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
                  onClick={() => {
                    setBudgetModal(false);
                    setNewBudget("");
                    setError("");
                  }}
                  style={{ backgroundColor: `${props?.UIColor} ` }}
                >
                  Close
                </div>
                {newBudget.length > 0 &&
                parseInt(newBudget) <= parseInt(income) ? (
                  <>
                    <div
                      className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                      onClick={() => {
                        updateBudget();
                        setBudgetModal(false);
                      }}
                    >
                      Confirm
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191a2c1d] text-[#00000080] ml-[10px]  "
                      onClick={() => {}}
                    >
                      Confirm
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {incomeModal === true ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
          >
            <div className="w-full h-auto flex flex-col justify-end items-start ">
              <div
                className="min-w-[100%] z-50 h-auto bg-[#ffffff] drop-shadow-sm   text-black  rounded-3xl  font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[30px]"
                style={{ zIndex: 100 }}
              >
                <span className="text-[22px] ">Update Income</span>
                <div className="flex w-full justify-start items-center mt-[15px] ">
                  <div className="flex justify-center items-center w-[40px] h-full mr-[-40px]">
                    <BiRupee className="text-[18px]" />
                  </div>
                  <input
                    className="outline-none w-full h-[45px] bg-transparent pl-[36px] rounded-xl  border border-[#efefef] px-[10px] text-black font-[google] font-normal text-[16px]"
                    placeholder="Enter Income"
                    value={newIncome}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setNewIncome(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                {error.length > 0 ? <></> : <></>}

                <div className="w-full h-auto mt-[30px] flex justify-end items-end">
                  <div
                    className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
                    onClick={() => {
                      setIncomeModal(false);
                      setNewIncome("");
                      setError("");
                    }}
                    style={{ backgroundColor: `${props?.UIColor} ` }}
                  >
                    Close
                  </div>
                  {newIncome.length == 0 ? (
                    <>
                      <div
                        className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191a2c1d] text-[#00000080]  ml-[10px] "
                        onClick={() => {}}
                      >
                        Confirm
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white] "
                        onClick={() => {
                          updateIncome();
                          setIncomeModal(false);
                        }}
                      >
                        Confirm
                      </div>
                    </>
                  )}
                </div>

                {/* <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                  <div
                    className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                    onClick={() => {
                      setIncomeModal(false);
                      setNewIncome("");
                      setError("");
                    }}
                  >
                    Cancel
                  </div>
                  {newIncome.length == 0 ? (
                    <>
                      <div
                        className="h-full  flex justify-center items-center text-[#c2e1ff] cursor-pointer "
                        onClick={() => {}}
                      >
                        Update
                      </div>
                    </>
                  ) : (
                    <div
                      className="h-full  flex justify-center items-center text-[#6bb7ff] cursor-pointer "
                      onClick={() => {
                        updateIncome();
                        setIncomeModal(false);
                      }}
                    >
                      Update
                    </div>
                  )}
                </div> */}
              </div>
            </div>
            {/* </OutsideClickHandler> */}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full  h-[140px] flex justify-between items-start font-[google] font-normal bg-[#ffffff] text-[#000000] pt-[30px] px-[20px]">
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
          <span className=" flex justify-center items-center text-[14px] text-[#000000]">
            <span className=" flex justify-start items-center ml-[-3px] font-normal tracking-wide">
              {/* <IoCalendarSharp className="text-[12px] mr-[8px]" /> */}
              <svg
                // className="mr-[6px] "
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-calendar"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              &nbsp;&nbsp;
              {monthNames[props?.month - 1]},
            </span>{" "}
            &nbsp;&nbsp;Total Expense
          </span>
          <span className=" font-[google] font-normal text-[25px]  flex justify-start items-center">
            {parseFloat(monthlyExpense) <= budget ? (
              <>
                <span className=" flex justify-start items-center ">
                  <BiRupee className="ml-[-6px]" />{" "}
                  {monthlyExpense.length != 0 ? (
                    <>{formatAmountWithCommas(monthlyExpense)}</>
                  ) : (
                    <></>
                  )}{" "}
                </span>

                <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#00bb00] ">
                  <FaLongArrowAltDown className="mb-[4px] mr-[5px] text-[15px]" />{" "}
                  <BiRupee className="ml-[-3px] mb-[3px]" />
                  {formatAmountWithCommas(budget - monthlyExpense)}
                </span>
              </>
            ) : (
              <>
                <span className=" flex justify-start items-center ">
                  <BiRupee className="ml-[-6px]" />{" "}
                  {monthlyExpense.length != 0 ? (
                    <>{formatAmountWithCommas(monthlyExpense)}</>
                  ) : (
                    <></>
                  )}{" "}
                </span>

                <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#c43b31] ">
                  <FaLongArrowAltUp className="mb-[4px] mr-[5px] text-[15px]" />{" "}
                  <BiRupee className="ml-[-3px] mb-[3px]" />
                  {formatAmountWithCommas(monthlyExpense - budget)}
                </span>
              </>
            )}
          </span>
          <span className="font-[google]  text-[13px]    flex justify-start items-center mt-[5px]">
            <Line
              percent={percent}
              strokeWidth={6}
              trailColor="#f4f4f4"
              trailWidth={2}
              strokeColor={"" + (percent < 75 ? " #00bb00" : " #e61d0f")}
              className="h-[4px]"
            />{" "}
            <span
              className="whitespace-nowrap flex justify-center items-center ml-[10px] cursor-pointer"
              onClick={() => {
                setBudgetModal(true);
              }}
            >
              {budget == 0 ? (
                <>Set Budget</>
              ) : (
                <>
                  <BiRupee className="ml-[-3px] text-[14px] " />{" "}
                  {formatAmountWithCommas(budget)}{" "}
                  <span className=" ml-[6px] font-normal">
                    {/* [ Budget ]{" "} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-hand-coins"
                    >
                      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                      <path d="m2 16 6 6" />
                      <circle cx="16" cy="9" r="2.9" />
                      <circle cx="6" cy="5" r="3" />
                    </svg>
                  </span>
                </>
              )}
            </span>
          </span>
        </div>
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
          <span className=" flex justify-center items-center text-[13px] text-[#000000] opacity-0 ">
            Lifetime Savings{" "}
            <span className=" flex justify-end items-center ml-[6px]">
              <BiRupee className=" " />
              {formatAmountWithCommas(income)}
            </span>
          </span>
          <span className=" font-[google] font-normal text-[25px]  flex justify-start items-center">
            <span className="opacity-0">{transactionHistory.length}</span>
            {/* <RiDonutChartFill className="mr-[9px]" />{" "} */}
            {/* <PiGraph /> */}
            {/* <MdOutlineBarChart
              onClick={() => {
                setShowGraph(true);
              }}
            /> */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bell"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg> */}
            <svg
              onClick={() => {
                setShowGraph(true);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bar-chart-2"
            >
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
          </span>
          {income == 0 ? (
            <span
              className="font-[google] font-normal text-[13px] text-[#83b933] flex justify-end items-center cursor-pointer mt-[5px]"
              onClick={() => {
                setIncomeModal(true);
              }}
            >
              Set Income
            </span>
          ) : (
            <span
              className="font-[google] font-normal text-[13px] text-[#000000] flex justify-end items-center cursor-pointer mt-[5px]"
              onClick={() => {
                setIncomeModal(true);
              }}
            >
              {/* Curr. Income{" "} */}
              <span className=" flex justify-end items-center ml-[6px]">
                <svg
                  className="mr-[6px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-wallet"
                >
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
                <BiRupee className="text-[14px] " />
                {formatAmountWithCommas(income)}
              </span>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default QuickInfo;
