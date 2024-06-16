import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import { IoFingerPrintOutline, IoLogOut } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { FaGooglePlay } from "react-icons/fa";
import OutsideClickHandler from "react-outside-click-handler";

import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";

const Settings = () => {
  const [pop, setPop] = useState(false);
  const [permission, setPermission] = useState(false);
  const [income, setIncome] = useState("");
  const [budget, setBudget] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  function fetchTransactionData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setTransactionHistory(snapshot?.data()?.NormalTransaction);
      setIncome(snapshot?.data()?.TotalIncome);
      setBudget(snapshot?.data()?.Budget);
      // setTempTransactionHistory(snapshot?.data()?.NormalTransaction);
      // setIncome(snapshot?.data()?.TotalIncome);
      // console.log(snapshot?.data()?.Online);
    });
  }

  function formatAmountWithCommas(amountStr) {
    // Convert the string to a number
    const amount = parseFloat(amountStr);

    // Check if the conversion was successful
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }

    // Format the number with commas and ensure two decimal places
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return (
    <>
      {pop ? (
        <div
          className="w-full h-[100svh]  flex justify-center items-end bg-[#0000003e] p-[20px] fixed top-0 left-0  z-40"
          style={{ zIndex: 70 }}
          // onClick={() => {
          //   setNotificationModal(false);
          // }}
        >
          <OutsideClickHandler
            onOutsideClick={() => {
              setPop(false);
            }}
          >
            <div
              className="w-full z-50 h-auto bg-[#fff5ee] drop-shadow-sm   text-black  rounded-[20px] font-[google] font-normal text-[14px] flex flex-col justify-center items-start p-[30px]"
              style={{ zIndex: 100 }}
              onClick={() => {
                // setNotificationModal(true);
              }}
            >
              <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
                Information about our App
              </span>

              <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[5px]  ">
                Our app is almost ready for launch! While we're putting the
                final touches on it before releasing it on Google Play, we
                invite you to explore our website in the meantime. If you
                encounter any bugs or issues, please let us know.
              </span>
              <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-start items-start whitespace-pre-wrap mt-[5px]  ">
                Thank you for your patience and support! Stay tuned for exciting
                updates!
              </span>

              <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                <div
                  className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                  onClick={() => {
                    setPop(false);
                  }}
                >
                  Ok
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      ) : (
        <></>
      )}

      {permission ? (
        <>
          <div
            className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#fff5ee] fixed top-0 left-0  z-40"
            style={{ zIndex: 70 }}
            onClick={() => {
              // setChooseMonth(false);
            }}
          >
            {/* <OutsideClickHandler
              onOutsideClick={() => {
                setShowFilterModal(false);
              }}
            > */}
            <>
              {/* <div
                className="w-full h-[calc(100svh-155px)]"
                onClick={() => {
                  setPermission(false);
                }}
              ></div> */}
              <div
                className="w-full aspect-square bg-[#fff5ee] fixed  text-black  rounded-[20px] font-[google] font-normal text-[14px] flex-col flex  justify-start items-center h-[100svh] overflow-y-scroll pt-[20px]"
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <span
                  className="text-[19px] mb-[10px] w-full flex justify-start items-center px-[20px]"
                  onClick={() => {
                    setPermission(false);
                  }}
                >
                  Account Statement :
                </span>
                <table className="w-full">
                  <tr className="w-full h-[35px] bg-[#ffe6d7]">
                    {/* <th className="h-full w-[calc(100%/6)] px-[5px] ">Year</th> */}
                    <th className="h-full w-[calc(100%/5)] px-[5px] ">Date</th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Income
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Budget
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Expense
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Savings
                    </th>
                  </tr>
                  {transactionHistory?.map((data) => {
                    return (
                      <>
                        <tr className="w-full h-[35px] ">
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {data?.Date}
                          </td>
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center ">
                            {formatAmountWithCommas(income)}
                          </td>
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {formatAmountWithCommas(budget)}
                          </td>
                          <td
                            className={
                              "h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center" +
                              (data?.TransactionType == "Split"
                                ? " text-[#c43b31]"
                                : " text-[#00bb00]")
                            }
                          >
                            {formatAmountWithCommas(data?.Amount)}
                          </td>
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {formatAmountWithCommas(
                              parseFloat(income) - parseFloat(data?.Amount)
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}

                  {/* <tr className="w-full h-[35px] ">
                    
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      November
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      60000
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      20340
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      18000
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      42000
                    </td>
                  </tr>
                  <tr className="w-full h-[35px] ">
                   
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      October
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      62600
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      20230
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      34460
                    </td>
                    <td className="h-full w-[calc(100%/6)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                      42000
                    </td>
                  </tr> */}
                </table>
                {/* <IoFingerPrintOutline className="text-[35px]" /> */}
              </div>

              {/* <div
                className="w-[70px] aspect-square bg-[#fff5ee] drop-shadow-sm   text-black  rounded-[20px] font-[google] font-normal text-[14px] flex  justify-center items-center "
                style={{ zIndex: 100 }}
                onClick={() => {}}
              >
                <IoFingerPrintOutline className="text-[35px]" />
              </div> */}
            </>
            {/* </OutsideClickHandler> */}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-full bg-[#fff5ee] p-[20px] text-black font-[google] font-normal flex flex-col justify-start items-start">
        <div className="w-full ">
          <div className="w-[90px] aspect-square rounded-full object-cover bg-[#ffeadc]"></div>
          <div></div>
        </div>
        <div className="w-full border-[.7px] border-[#fee6d7] my-[20px]"></div>
        <div className="w-auto flex justify-start items-center my-[7px]"></div>
        <div className="w-auto flex justify-start items-center my-[7px]">
          Set / Change Budget
        </div>
        <div className="w-auto flex justify-start items-center my-[7px]">
          <IoIosWallet className="mr-[10px] text-[20px] text-[#de8544]" /> Set /
          Change Income
        </div>
        <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={() => {
            setPermission(true);
          }}
        >
          <MdSavings className="mr-[10px] text-[20px] text-[#de8544]" /> Total
          Savings
        </div>
        <div className="w-auto flex justify-start items-center my-[7px]">
          <BiSolidReport className="mr-[10px] text-[20px] text-[#de8544]" /> Get
          Report
        </div>
        <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={() => {
            userSignOut();
          }}
        >
          <IoLogOut className="mr-[10px] text-[20px] text-[#de8544]" /> Log Out
        </div>

        <div
          className="w-[calc(100%-40px)] fixed h-[100px] bottom-[60px] left-[20px] font-[google] font-normal text-black rounded-3xl flex flex-col justify-center items-center bg-[#ffe6d7] text-[14px]"
          onClick={() => {
            setPop(!pop);
            // setNewIncome("");
            // setError("");
          }}
        >
          <span className="text-[#6d6d6d]">Coming Soon to</span>
          <span className="flex justify-center items-center text-[19px] font-semibold tracking-wide">
            <FaGooglePlay className="text-[25px] mr-[10px]" /> Google Pay
          </span>
        </div>
      </div>
    </>
  );
};

export default Settings;
