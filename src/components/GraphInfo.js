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

const GraphInfo = (props) => {
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
    // if (isNaN(amount)) {
    //   throw new Error("Invalid input: not a number");
    // }

    // Format the number with commas
    if (amount.toLocaleString().includes(".")) {
      return amount.toLocaleString();
    } else {
      return amount.toLocaleString() + ".00";
    }
  }

  return (
    <>
      <div className="w-full h-[120px] flex justify-between items-center font-[google] font-normal px-[20px]">
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-start ">
          <span className=" flex justify-center items-center text-[14px] text-[#828282]">
            <IoCalendarSharp className="text-[12px] mr-[8px]" />
            Lifetime Savings, {props?.count} months
          </span>
          <span className=" font-[google] font-normal text-[22px] text-[#00bb00] flex justify-start items-center">
            <span className=" flex justify-start items-center text-[#00bb00]">
              <BiRupee className="ml-[-5px] " />{" "}
              {props?.total?.length != 0 ? (
                <>{formatAmountWithCommas(parseFloat(props?.total))}</>
              ) : (
                <></>
              )}{" "}
            </span>

            {/* <span className=" text-[13px] ml-[6px] h-[25px] flex justify-start items-end text-[#de8544] ">
                  <FaLongArrowAltUp className="mb-[4px] mr-[5px] text-[15px]" />{" "}
                  <BiRupee className="ml-[-3px] mb-[3px]" />
                  {formatAmountWithCommas(monthlyExpense - budget)}
                </span> */}
          </span>
          <span className="font-[google]  text-[13px] text-[#000000]   flex justify-start items-center mt-[5px]">
            {/* <Line
              percent={percent}
              strokeWidth={6}
              trailColor="#b7b7b7"
              trailWidth={2}
              strokeColor={"" + (percent < 75 ? " #83b933" : " #de8544")}
              className="h-[4px]"
            />{" "} */}
            <span
              className="whitespace-nowrap flex justify-center items-center cursor-pointer"
              onClick={() => {
                setBudgetModal(true);
              }}
            >
              <span className="text-[#828282] mr-[2px] font-normal">
                Average Saving
              </span>
              <BiRupee className="ml-[2px] " />{" "}
              {formatAmountWithCommas(
                parseFloat(props?.total) / parseFloat(props?.count)
              )}{" "}
            </span>
          </span>
        </div>
        <div className="w-[calc(100%/2)] flex flex-col justify-center items-end font-[google] font-normal">
          <span className=" flex justify-center items-center text-[13px] text-[#828282] opacity-0 ">
            Lifetime Savings{" "}
            <span className="text-white flex justify-end items-center ml-[6px]">
              <BiRupee className=" " />
              {formatAmountWithCommas(parseFloat(income))}
            </span>
          </span>
          <span className=" font-[google] font-normal text-[22px] text-[#828282] flex justify-start items-center">
            <span className="opacity-0">{transactionHistory.length}</span>
            <RiDonutChartFill className="mr-[9px]" />{" "}
            <MdOutlineBarChart
              onClick={() => {
                setShowGraph(true);
              }}
            />
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
                {formatAmountWithCommas(parseFloat(income))}
              </span>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphInfo;
