import React, { useEffect, useState } from "react";

import "react-circular-progressbar/dist/styles.css";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import SubCategory from "./SubCategory";
import { HiOutlinePlus } from "react-icons/hi2";
import { BiRupee } from "react-icons/bi";
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
  const [expand, setExpand] = useState("");
  // const [tempTransactionHistory, setTempTransactionHistory] = useState([]);
  const [month, setMonth] = useState(0);
  const [countt, setCountt] = useState(0);
  const [newBudgetModal, setNewBudgetModal] = useState(false);
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
    cat.map((data) => {
      // console.log(Number(subBudget[data]));
    });
  }

  useEffect(() => {
    getSubCategoryBudget();
    console.log("subBudget ==========================");
    console.log(subBudget["Shopping"]);
  }, [subBudget]);

  function nonBudget() {
    console.log("jgcukviyh");
    // console.log(
    let arr = [];
    cat.map((data) => {
      if (!Number(subBudget[data]) > 0) {
        console.log(data);
        arr.push(data);
      }
    });
    console.log(arr);
    return arr;
    // );
  }

  return (
    <>
      {newBudgetModal === true ? (
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
                    // setUpdateModal(false);
                    // setNewBudget("");
                    setNewBudgetModal(false);
                  }}
                >
                  <HiOutlinePlus className="rotate-45" />
                </div>
              </div>
            </div>
            <div className="min-w-[100%]  max-h-[calc(100%-80px)]  bg-[#ffffff] drop-shadow-sm   text-black  rounded-b-3xl rounded-tr-3xl font-[google] font-normal text-[14px] flex flex-col justify-start items-start p-[20px]">
              <div className="w-full h-auto overflow-y-scroll flex flex-col justify-start items-start">
                {nonBudget().map((data) => {
                  return (
                    <>
                      {/* {!Number(subBudget[data]) > 0 ? (
                        <> */}
                      <SubCategory
                        data={data}
                        transactionHistory={transactionHistory}
                        subBudget={subBudget}
                        expand={expand}
                        setExpand={setExpand}
                        isNeeded={false}
                      />
                      {/* </>
                      ) : (
                        <></>
                      )} */}
                    </>
                  );
                })}
                <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[10px] ">
                  <div
                    className="h-full  flex justify-center items-center text-[#6bb7ff] cursor-pointer "
                    onClick={() => {}}
                  >
                    Done
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-[calc(100%-320px)] flex justify-start items-center px-[20px] flex-col font-[google] font-normal text-[black] z-50">
        {/* <div className="w-full min-h-[220px] rounded-2xl flex justify-between items-center"> */}
        <div className="w-full h-[45px] flex justify-end items-center py-[10px]">
          <div
            className="w-auto h-[35px] rounded-3xl bg-[#181F32] text-[#ffffff] px-[15px] flex justify-center items-center text-[14px] cursor-pointer"
            onClick={() => {
              nonBudget();
              setNewBudgetModal(true);
            }}
          >
            New Budget
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
                    expand={expand}
                    setExpand={setExpand}
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
    </>
  );
};

export default SubGraph;
