import React, { useEffect, useState } from "react";
import { FaHandHoldingMedical, FaShopify } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";
// import "react-circular-progressbar/dist/styles.css";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";

const SubGraph = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [subBudget, setSubBudget] = useState({});
  // const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);
  const [countt, setCountt] = useState(0);
  // const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    fetchMonth();
    fetchTransactionData();
  }, []);
  function fetchMonth() {
    var date = new Date();
    const currMonth = date.getMonth() + 1;
    setMonth(currMonth);
  }

  function fetchTransactionData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setTransactionHistory(snapshot?.data()?.NormalTransaction);
      setSubBudget(snapshot?.data()?.CategoryBudget);
      // setTempTransactionHistory(snapshot?.data()?.NormalTransaction);
      // setIncome(snapshot?.data()?.TotalIncome);
      // console.log(snapshot?.data()?.Online);
    });
  }

  function getCount(category) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let totalAmount = 0;
    let count = 0;

    transactionHistory?.forEach((item) => {
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

    transactionHistory?.forEach((item) => {
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
  return (
    <div className="w-full h-[calc(100%-320px)] flex justify-start items-center px-[20px] flex-col font-[google] font-normal text-[black]">
      <div className="w-full min-h-[220px] rounded-2xl flex justify-between items-center">
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Shopping</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x{getCount("Shopping")}
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] mb-[-120px] flex justify-center items-center p-[50px] ">
            <div className="text-[20px] text-[#de8544]">
              <FaShopify />
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] flex justify-center items-center p-[50px] ">
            <CircularProgressbar
              value={getTotalAmountForCurrentMonthAndCategory("Shopping")}
              maxValue={subBudget?.Shopping}
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
              {parseFloat(getTotalAmountForCurrentMonthAndCategory("Shopping"))}{" "}
              <span className="ml-[3px] text-[#828282]">
                / {subBudget?.Shopping}
              </span>
            </span>
          </div>
        </div>
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px]  flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Grocery</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x{getCount("Grocery")}
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] mb-[-120px]  flex justify-center items-center p-[50px] ">
            <div className=" text-[20px] text-[#de8544]">
              <MdShoppingCart />
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] flex justify-center items-center p-[50px] ">
            <CircularProgressbar
              value={getTotalAmountForCurrentMonthAndCategory("Grocery")}
              maxValue={subBudget?.Grocery}
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
              {parseFloat(getTotalAmountForCurrentMonthAndCategory("Grocery"))}{" "}
              <span className="ml-[3px] text-[#828282]">
                / {subBudget?.Grocery}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[220px] rounded-2xl flex justify-between items-center mt-[20px]">
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Food</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x{getCount("Food & Drinks")}
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] mb-[-120px]  flex justify-center items-center p-[50px] ">
            <div className=" text-[20px] text-[#de8544]">
              <IoFastFood />
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] flex justify-center items-center p-[50px] ">
            <CircularProgressbar
              value={getTotalAmountForCurrentMonthAndCategory("Food & Drinks")}
              maxValue={subBudget?.Food}
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
              {parseFloat(
                getTotalAmountForCurrentMonthAndCategory("Food & Drinks")
              )}{" "}
              <span className="ml-[3px] text-[#828282]">
                / {subBudget?.Food}
              </span>
            </span>
          </div>
        </div>
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Medical</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x5
            </div>
          </div>

          <div className="w-[160px] h-[calc(100%-60px)] mb-[-120px]  flex justify-center items-center p-[50px] ">
            <div className=" text-[20px] text-[#de8544]">
              <FaHandHoldingMedical />
            </div>
          </div>
          <div className="w-[160px] h-[calc(100%-60px)] flex justify-center items-center p-[50px] ">
            <CircularProgressbar
              value={800}
              maxValue={1000}
              strokeWidth={5}
              styles={buildStyles({
                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 5,
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
              2000 <span className="ml-[3px] text-[#828282]">/ 40000</span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[220px] rounded-2xl flex justify-between items-center mt-[20px]">
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Shopping</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x5
            </div>
          </div>
          <div className="w-full h-[160px] flex justify-between items-center"></div>
          <div className="w-full h-[30px] flex justify-center items-center">
            <span>
              2000 <span className="ml-[3px] text-[#828282]">/ 40000</span>
            </span>
          </div>
        </div>
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#ffeadc] rounded-2xl p-[20px] flex flex-col justify-center items-center">
          <div className="w-full h-[30px] flex justify-between items-center">
            <span>Shopping</span>
            <div className="w-[30px] h-[30px] rounded-full bg-[#ffceab] text-[#de8544] flex justify-center items-center">
              x5
            </div>
          </div>
          <div className="w-full h-[160px] flex justify-between items-center"></div>
          <div className="w-full h-[30px] flex justify-center items-center">
            <span>
              2000 <span className="ml-[3px] text-[#828282]">/ 40000</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubGraph;
