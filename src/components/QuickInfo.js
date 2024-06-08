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
import { FaLongArrowAltUp } from "react-icons/fa";

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

const QuickInfo = () => {
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
  }, [transactionHistory]);

  function sumAmountsByCurrentMonth() {
    if (transactionHistory) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-11 for January-December
      const currentYear = currentDate.getFullYear();

      setMonthlyExpense(
        transactionHistory
          .filter((obj) => {
            const [day, month, year] = obj.Date.split("/").map(Number);
            return month - 1 === currentMonth && year === currentYear;
          })
          .reduce((sum, obj) => sum + parseFloat(obj.Amount), 0)
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
      {budgetModal === true ? (
        <>
          <div className="w-full h-[100svh] fixed z-50 bg-[#68686871] top-0 left-0 text-white font-[google] font-normal flex justify-center items-center backdrop-blur-md">
            <div className="w-[320px] h-auto p-[30px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start">
              <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
                Set New <span className="text-[#de8544] ml-[10px]">Budget</span>
              </span>
              <div className="flex w-full justify-start items-center mt-[10px]">
                <div className="w-[30px] h-full flex justify-center items-center mr-[-30px]">
                  <BiRupee className="text-black" />
                </div>
                <input
                  className="outline-none w-full pl-[26px] rounded-md h-[40px] bg-transparent border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px]"
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
                  <div className="flex w-full justify-between items-center mt-[6px] text-[#ff6c00] text-[13px]">
                    * {error}
                  </div>
                </>
              ) : (
                <></>
              )}
              <span
                className={
                  "text-[15px] mt-[10px] mb-[7px] flex justify-start items-center" +
                  (parseFloat(newBudget) >= 0
                    ? " text-black"
                    : " text-[#a8a8a8]")
                }
              >
                Enable Category Budget{" "}
                {parseFloat(newBudget) >= 0 ? (
                  <>
                    <div
                      className={
                        "w-[27px] h-[19px]  rounded-full flex justify-start items-center border  ml-[9px]" +
                        (categoryBudgetIndicator
                          ? " pl-[9.8px] border-[#de8544]"
                          : " pl-[1.5px] border-[#ffffff]")
                      }
                      onClick={() => {
                        setCategoryBudgetIndicator(!categoryBudgetIndicator);
                      }}
                      style={{ transition: ".3s" }}
                    >
                      <div
                        className={
                          "w-[14px] h-[14px] rounded-full " +
                          (categoryBudgetIndicator
                            ? " bg-[#de8544]"
                            : " bg-[#ffffff]")
                        }
                        style={{ transition: ".3s" }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </span>
              <div
                className={
                  "w-full flex flex-col justify-start items-start mt-[7px] overflow-hidden" +
                  (categoryBudgetIndicator && newBudget.length != 0
                    ? " h-auto"
                    : " h-0")
                }
              >
                <div className="w-full h-[40px] flex justify-start items-center">
                  <div className=" w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Shopping
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    // onFocus={}
                    value={shopping}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setShopping(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Medical
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={medical}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setMedical(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Grocery
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={grocery}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setGrocery(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Travel
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={travel}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setTravel(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Entertainment
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={entertainment}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setEntertainment(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Food & Drinks
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={food}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setFood(e.target.value);
                      }
                    }}
                  ></input>
                </div>
                <div className="w-full h-[40px] flex justify-start items-center mt-[7px]">
                  <div className="w-[145px] rounded-l-md h-[40px] flex justify-start items-center bg-transparent border border-r-0 border-[#ffd8be] px-[10px] text-[#de8544] font-[google] font-normal text-[14px] ">
                    Other
                  </div>
                  <div className="w-[30px] mr-[-30px] h-full flex justify-start items-center ">
                    <BiRupee className="text-[20px] mt-[-2px] text-[#000000]" />{" "}
                  </div>
                  <input
                    className="outline-none w-[115px] rounded-r-md h-[40px] bg-transparent border border-l-0 border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] pl-[25px]"
                    placeholder="Amount"
                    value={other}
                    onChange={(e) => {
                      if (isNumeric(e.target.value) === true) {
                        setOther(e.target.value);
                      }
                    }}
                  ></input>
                </div>
              </div>

              {subError.length > 0 ? (
                <>
                  {categoryBudgetIndicator && newBudget.length != 0 ? (
                    <>
                      <div className="flex w-full justify-between items-center mt-[6px] text-[#ff6c00] text-[13px]">
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
              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                <div
                  className="h-full mr-[20px] flex justify-center items-center  cursor-pointer "
                  onClick={() => {
                    setBudgetModal(false);
                    setNewBudget("");
                    setError("");
                  }}
                >
                  Cancel
                </div>
                <div
                  className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                  onClick={() => {
                    updateBudget();
                    setBudgetModal(false);
                  }}
                >
                  Update
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {incomeModal === true ? (
        <>
          <div className="w-full h-[100svh] fixed z-50 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
            <div className="w-[320px] h-auto p-[30px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start">
              <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
                Set New <span className="text-[#de8544] ml-[10px]">Income</span>
              </span>
              <div className="flex w-full justify-start items-center mt-[10px]">
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
              {error.length > 0 ? (
                <>
                  {/* <div className="flex w-full justify-between items-center mt-[6px] text-[#ff6c00] text-[13px]">
                    * {error}
                  </div> */}
                </>
              ) : (
                <></>
              )}

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
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
                <div
                  className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                  onClick={() => {
                    updateIncome();
                    setIncomeModal(false);
                  }}
                >
                  Update
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-[120px] flex justify-between items-center font-[google] font-normal px-[20px]">
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
          <span className=" flex justify-center items-center text-[14px] text-[#828282]">
            <IoCalendarSharp className="text-[12px] mr-[8px]" />
            {monthNames[month - 1]}, Total Expense
          </span>
          <span className=" font-[google] font-normal text-[22px] text-[#000000] flex justify-start items-center">
            {parseFloat(monthlyExpense) <= budget ? (
              <>
                <BiRupee className="ml-[-3px] " />{" "}
                {monthlyExpense.length != 0 ? (
                  <>{formatAmountWithCommas(monthlyExpense)}</>
                ) : (
                  <></>
                )}{" "}
                {/* <span className="text-[#828282] text-[12px]">Under Budget</span> */}
              </>
            ) : (
              <>
                <span className=" flex justify-start items-center text-[#000000]">
                  <BiRupee className="ml-[-3px] " />{" "}
                  {monthlyExpense.length != 0 ? (
                    <>{formatAmountWithCommas(monthlyExpense)}</>
                  ) : (
                    <></>
                  )}{" "}
                </span>

                <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#ff6c00]">
                  <FaLongArrowAltUp className="mb-[4px] mr-[5px] text-[15px]" />{" "}
                  <BiRupee className="ml-[-3px] mb-[3px]" />
                  {formatAmountWithCommas(monthlyExpense - budget)}
                </span>
              </>
            )}
          </span>
          <span className="font-[google]  text-[13px] text-[#83b933] font-semibold flex justify-start items-center mt-[5px]">
            <Line
              percent={percent}
              strokeWidth={6}
              trailColor="#b7b7b7"
              trailWidth={2}
              strokeColor={"" + (percent < 75 ? " #83b933" : " #ff6c00")}
              className="h-[4px]"
            />{" "}
            <span
              className="whitespace-nowrap flex justify-center items-center ml-[10px] cursor-pointer"
              onClick={() => {
                setBudgetModal(true);
              }}
            >
              {budget === 0 ? (
                <>Set Budget</>
              ) : (
                <>
                  <BiRupee className="ml-[-3px] " />{" "}
                  {formatAmountWithCommas(budget)}{" "}
                  <span className="text-[#828282] ml-[4px] font-normal">
                    [ Budget ]{" "}
                  </span>
                </>
              )}
            </span>
          </span>
        </div>
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
          <span className=" flex justify-center items-center text-[13px] text-[#828282] opacity-0 ">
            Lifetime Savings{" "}
            <span className="text-white flex justify-end items-center ml-[6px]">
              <BiRupee className=" " />
              {formatAmountWithCommas(income)}
            </span>
          </span>
          <span className=" font-[google] font-normal text-[22px] text-[#828282] flex justify-start items-center">
            <span className="opacity-0">{transactionHistory.length}</span>
            <RiDonutChartFill className="mr-[9px]" /> <MdOutlineBarChart />
          </span>
          {income === 0 ? (
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
              className="font-[google] font-normal text-[13px] text-[#828282] flex justify-end items-center cursor-pointer mt-[5px]"
              onClick={() => {
                setIncomeModal(true);
              }}
            >
              Curr. Income{" "}
              <span className="text-[black] flex justify-end items-center ml-[6px]">
                <BiRupee className=" " />
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