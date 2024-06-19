import React, { useEffect, useState } from "react";

import "react-circular-progressbar/dist/styles.css";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import SubCategory from "./SubCategory";
// import { useEffect } from "react";

const cat = [
  "Shopping",
  "Grocery",
  "Food & Drinks",
  " Medical",
  "Entertainment",
  " Electricity Bill",
  "Petrol / Diesel",
  "Travel",
  "Taxi Fare",
  "Car Maintanance",
  "Education",
  "Pet Care",
  "Others",
];

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

  function getSubCategoryBudget() {
    // s;
    cat.map((data) => {
      console.log(Number(subBudget[data]));
    });
  }

  useEffect(() => {
    getSubCategoryBudget();
    console.log("subBudget ==========================");
    console.log(subBudget["Shopping"]);
  }, [subBudget]);
  return (
    <div className="w-full h-[calc(100%-320px)] flex justify-start items-center px-[20px] flex-col font-[google] font-normal text-[black] z-50">
      {/* <div className="w-full min-h-[220px] rounded-2xl flex justify-between items-center"> */}
      <div className="w-full h-[60px] flex justify-end items-center py-[10px]">
        <div className="w-auto h-[40px] rounded-3xl bg-[#c3e2ff] px-[15px] flex justify-center items-center text-[14px]">
          Add new Budget
        </div>
      </div>
      {cat.map((data) => {
        return (
          <>
            {Number(subBudget[data]) > 0 ? (
              <>
                <SubCategory
                  data={data}
                  transactionHistory={transactionHistory}
                  subBudget={subBudget}
                />
              </>
            ) : (
              <></>
            )}
          </>
        );
      })}

      {/* </div> */}
    </div>
  );
};

export default SubGraph;
