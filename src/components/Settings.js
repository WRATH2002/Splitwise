import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import {
  IoDocumentTextOutline,
  IoFingerPrintOutline,
  IoGitNetworkOutline,
  IoLogOut,
} from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { FaGooglePlay } from "react-icons/fa";
import OutsideClickHandler from "react-outside-click-handler";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import { TbLogout } from "react-icons/tb";
// import { BadgeIndianRupee } from "lucide-react";

const Down = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-chevron-up"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </>
  );
};
const Up = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-chevron-down"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </>
  );
};
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
const Settings = (props) => {
  const [pop, setPop] = useState(false);
  const [permission, setPermission] = useState(false);
  const [btn1, setBtn1] = useState(false);
  const [btn2, setBtn2] = useState(false);
  const [btn3, setBtn3] = useState(false);
  const [btn4, setBtn4] = useState(false);
  const [income, setIncome] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [feature, setFeature] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [price, setPrice] = useState("");
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };

  function doneTutorial() {
    props?.setSegment(1);
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user.uid).update({
      Tutorial: true,
    });
  }

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
      setName(snapshot?.data()?.Name);
      setEmail(snapshot?.data()?.Email);
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

  useEffect(() => {
    if (transactionHistory !== undefined) {
      fetchMonthWiseData();
    }
  }, [transactionHistory]);

  function fetchMonthWiseData() {
    console.log("MonthWise Data function");
    let arr = [];

    transactionHistory?.map((data, index) => {
      let dateArr = data?.Date?.split("/");
      if (dateArr[2] == new Date().getFullYear()) {
        if (arr[parseInt(parseInt(dateArr[1]) - 1)] === undefined) {
          if (data?.MoneyIsAdded === true) {
            arr[parseInt(parseInt(dateArr[1]) - 1)] = {
              Budget: parseFloat(budget),
              Expense: -parseFloat(data?.Amount),
              TransactionCount: 1,
            };
          } else {
            arr[parseInt(parseInt(dateArr[1]) - 1)] = {
              Budget: parseFloat(budget),
              Expense: parseFloat(data?.Amount),
              TransactionCount: 1,
            };
          }
        } else {
          if (data?.MoneyIsAdded === true) {
            arr[parseInt(parseInt(dateArr[1]) - 1)].Expense =
              arr[parseInt(parseInt(dateArr[1]) - 1)].Expense -
              parseFloat(data?.Amount);
            arr[parseInt(parseInt(dateArr[1]) - 1)].TransactionCount =
              arr[parseInt(parseInt(dateArr[1]) - 1)].TransactionCount + 1;
          } else {
            arr[parseInt(parseInt(dateArr[1]) - 1)].Expense =
              arr[parseInt(parseInt(dateArr[1]) - 1)].Expense +
              parseFloat(data?.Amount);
            arr[parseInt(parseInt(dateArr[1]) - 1)].TransactionCount =
              arr[parseInt(parseInt(dateArr[1]) - 1)].TransactionCount + 1;
          }
        }
      }
    });

    console.log(arr);
    setMonthWiseData(arr);
    arr.map((data, index) => {
      console.log(index);
    });
  }

  function format(data) {
    let arr = data?.split("/");
    let str = "";
    if (arr[0] < 10) {
      str = str + "0" + arr[0] + "/";
    } else {
      str = str + arr[0] + "/";
    }
    if (arr[1] < 10) {
      str = str + "0" + arr[1] + "/";
    } else {
      str = str + arr[1] + "/";
    }
    str = str + arr[2];

    return str;
  }

  function sortObjectsByDateAsc() {
    return transactionHistory.sort((a, b) => {
      const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.Date.split("/").map(Number);

      // Create date objects for comparison
      const dateA = new Date(yearA, monthA - 1, dayA); // monthA - 1 because months are zero-based
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA - dateB;
    });
  }

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Transactions History", 14, 14);

    // Define the columns and rows for the table
    const columns = [
      "Date",
      "Lable",
      "Category",
      "Trn. Type",
      "Trn. Mode",
      "Credited",
      "Debited",
    ];
    const rows = sortObjectsByDateAsc().map((tx) => [
      format(tx.Date),
      tx.Lable,
      tx.Category,
      tx.TransactionType,
      tx.Mode,
      tx.MoneyIsAdded ? formatAmountWithCommas(tx.Amount) : "",
      !tx.MoneyIsAdded ? formatAmountWithCommas(tx.Amount) : "",
    ]);

    const totalExpense = transactionHistory.reduce((acc, tx) => {
      return tx.MoneyIsAdded
        ? acc - parseFloat(tx.Amount)
        : acc + parseFloat(tx.Amount);
    }, 0);
    let splitCount = transactionHistory.reduce((acc, tx) => {
      if (tx.TransactionType == "Split") {
        acc = acc + 1;
      }
      return acc;
    }, 0);
    let splitExpense = transactionHistory.reduce((acc, tx) => {
      if (tx.TransactionType == "Split") {
        if (tx.MoneyIsAdded) {
          acc = acc - parseFloat(tx.Amount);
        } else {
          acc = acc + parseFloat(tx.Amount);
        }
      }
      return acc;
    }, 0);
    let normCount = transactionHistory.reduce((acc, tx) => {
      if (tx.TransactionType == "Single") {
        acc = acc + 1;
      }
      return acc;
    }, 0);
    let normExpense = transactionHistory.reduce((acc, tx) => {
      if (tx.TransactionType == "Single") {
        acc = acc + parseFloat(tx.Amount);
      }
      return acc;
    }, 0);

    // Get the current month
    const currentDate = new Date();
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
    const currentMonth = monthNames[currentDate.getMonth()];

    // Add table to the PDF
    doc.autoTable({
      // theme: "grid",
      startY: 20,
      head: [columns],
      body: rows,
      headStyles: { fillColor: [107, 183, 255], textColor: [0, 0, 0] },
      columnStyles: {
        0: { halign: "left" },
        5: { halign: "right" },
        6: { halign: "right" },
      }, // Cells in first column centered and green
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Transaction Info :`, 14, finalY);
    doc.setFontSize(10);
    doc.text(`Month : ${currentMonth}`, 14, finalY + 9);

    doc.text(
      `Normal Expense ( x${normCount} ) : ${normExpense}`,
      14,
      finalY + 15
    );
    doc.text(
      `Split Expense ( x${splitCount} ) :  ${splitExpense}`,
      14,
      finalY + 21
    );
    doc.text(`Total Expense : ${totalExpense}`, 14, finalY + 27);

    // Save the PDF
    doc.save("transactions.pdf");
  };

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
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
                    {/* <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Income
                    </th> */}
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Budget
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Expense
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Savings
                    </th>
                    <th className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91]">
                      Transactions
                    </th>
                  </tr>
                  {monthWiseData?.map((data, index) => {
                    return (
                      <>
                        <tr className="w-full h-[35px] ">
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {/* {data?.Date} */}
                            {monthNames[index]}
                          </td>

                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {formatAmountWithCommas(data?.Budget)}
                          </td>
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center">
                            {formatAmountWithCommas(data?.Expense)}
                          </td>
                          <td
                            className={
                              "h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center" +
                              (data?.Budget - data?.Expense >= 0
                                ? " text-[#00bb00]"
                                : " text-[#c43b31]")
                            }
                          >
                            {data?.Budget - data?.Expense >= 0 ? (
                              <>
                                {formatAmountWithCommas(
                                  data?.Budget - data?.Expense
                                )}
                              </>
                            ) : (
                              <>
                                {formatAmountWithCommas(
                                  Math.abs(data?.Budget - data?.Expense)
                                )}
                              </>
                            )}
                          </td>
                          <td className="h-full w-[calc(100%/5)] px-[5px] border-l-[1px] border-[#ffbb91] text-center ">
                            {/* {formatAmountWithCommas(income)} */}
                            {data?.TransactionCount}
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
      {/* <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-center p-[20px] z-50 font-[google] font-normal">
        <div className="w-full flex flex-col justify-center items-start p-[30px] bg-[white] rounded-3xl drop-shadow-sm">
          <div className="text-[22px]">Update Budget</div>
          <div className="text-[14px] text-[#00000057]">
            Your budget will be updated with the new amount, and transactions
            will be processed accordingly.
          </div>
          <div className="w-[35px] h-[45px] flex justify-center items-center mb-[-45px] mt-[20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-indian-rupee"
            >
              <path d="M6 3h12" />
              <path d="M6 8h12" />
              <path d="m6 13 8.5 8" />
              <path d="M6 13h3" />
              <path d="M9 13c6.667 0 6.667-10 0-10" />
            </svg>
          </div>
          <input
            className="outline-none rounded-xl w-full h-[45px] bg-transparent border pl-[35px] px-[10px] text-black font-[google] font-normal  border-[#beb0f4] text-[16px]"
            placeholder="Enter New Budget"
            value={price}
            onChange={(e) => {
              console.log(isNumeric(e.target.value));
              if (isNumeric(e.target.value) === true) {
                setPrice(e.target.value);
              }
            }}
          ></input>
          <div className="w-full flex mt-[25px] justify-center items-end font-[google] font-normal text-[16px] text-black ">
            <div
              className=" mr-[15px] px-[15px] py-[10px] rounded-3xl bg-[#efefef] text-[black] flex justify-center items-center cursor-pointer  "
              onClick={() => {
                // setAddNewTransaction(false);
                // setLabel("");
                // setPrice("");
                // setCategory("");
                // setMode("");
                // setBill("");
                // setSubSection("");
              }}
            >
              Cancel
            </div>
            {price?.length != 0 ? (
              <>
                <div
                  className=" flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#beb0f4] text-[black] items-center cursor-pointer "
                  onClick={() => {
                    // setSubSection("");
                    // addToFirebase();
                    // setAddNewTransaction(false);
                  }}
                >
                  Update
                </div>
              </>
            ) : (
              <>
                <div className=" flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#e8e3fd] items-center text-[#0000006c]  ">
                  Update
                </div>
              </>
            )}
          </div>
        </div>
      </div> */}
      <div className="w-full h-full bg-[#ffffff]  text-black font-[google] font-normal flex flex-col justify-start items-start ">
        <div className="w-full h-[230px]  flex flex-col bg-[#181F32] p-[20px] justify-center items-center">
          <div className="w-[90px] aspect-square rounded-full object-cover bg-[#F5F6FA] text-black flex justify-center items-center text-[37px]">
            {name.charAt(0)?.toUpperCase()}
            {name.split(" ")[1]?.charAt(0)?.toUpperCase()}
          </div>
          <div className="text-[25px] mt-[15px] text-white ">{name}</div>
          <div className="text-[17px] text-[#a7a7a7] mt-[-4px]">{email}</div>
        </div>
        {/* <div className="w-full border-[.7px] border-[#f2f2f7] my-[20px]"></div> */}
        <div className="w-full h-[calc(100%-255px)] flex flex-col justify-start items-start overflow-y-scroll px-[20px]">
          <span className="mt-[25px] ">General</span>
          <div className="w-full flex flex-col justify-start items-start px-[20px] bg-[#F5F6FA] py-[10px]  p-[20px] rounded-2xl mt-[5px]">
            <div className="w-full h-[40px] flex justify-between items-center">
              <div className="flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  {" "}
                  <svg
                    // className="mr-[5px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                Change Name
              </div>
              <div className="flex justify-end items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
            <div className="w-full h-[40px] flex justify-between items-center">
              {" "}
              <div className="flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
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
                </div>
                Update Budget
              </div>
              <div className="flex justify-end items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
            <div className="w-full h-[40px] flex justify-between items-center">
              {" "}
              <div className="flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
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
                </div>
                Update Income
              </div>
              <div className="flex justify-end items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
          <span className="mt-[14px] ">About Transaction</span>
          <div className="w-full flex flex-col justify-start items-start px-[20px] bg-[#F5F6FA] py-[10px]  p-[20px] rounded-2xl mt-[5px]">
            <div className="w-full h-[40px] flex justify-start items-center">
              <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-piggy-bank"
                >
                  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
                  <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                  <path d="M16 11h.01" />
                </svg>
              </div>
              Total Savings
            </div>
            <div className="w-full h-[40px] flex justify-between items-center">
              <div className="w-auto flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-banknote"
                  >
                    <rect width="20" height="12" x="2" y="6" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                </div>
                Default Currency
              </div>
              <div className="w-auto flex justify-end items-center text-[#6f6f6f]">
                INR
                <svg
                  className="ml-[3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                <svg
                  className="text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
            <div
              className="w-full h-[40px] flex justify-start items-center "
              onClick={downloadPDF}
            >
              <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-file-bar-chart-2"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M8 18v-1" />
                  <path d="M12 18v-6" />
                  <path d="M16 18v-3" />
                </svg>
              </div>
              Monthly Report
            </div>
          </div>

          <span className="mt-[14px] ">Features</span>
          <div className="w-full flex flex-col justify-start items-start px-[20px] bg-[#F5F6FA] py-[10px]  p-[20px] rounded-2xl mt-[5px]">
            <div
              className={
                "w-full  flex flex-col justify-start items-start" +
                (feature == 1 ? " h-auto" : " h-[40px]")
              }
              onClick={() => {
                setFeature(1);
              }}
            >
              <div className="w-full h-[40px] flex justify-between items-center">
                <div className="w-auto h-[40px] flex justify-start items-center">
                  <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-siren"
                    >
                      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
                      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
                      <path d="M21 12h1" />
                      <path d="M18.5 4.5 18 5" />
                      <path d="M2 12h1" />
                      <path d="M12 2v1" />
                      <path d="m4.929 4.929.707.707" />
                      <path d="M12 12v6" />
                    </svg>
                  </div>
                  Show Due Reminders
                </div>
                <div className="w-auto h-full flex justify-end items-center">
                  {feature == 1 ? (
                    <>
                      <Down />
                    </>
                  ) : (
                    <>
                      <Up />
                    </>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full flex justify-between items-start overflow-hidden" +
                  (feature == 1 ? " h-auto " : " h-0")
                }
              >
                <div className="w-[calc(100%-82px)] h-auto flex justify-start items-start text-[14px] text-[#6f6f6f] ml-[33px]">
                  If this option is enabled, all the due and upcoming reminders
                  in this month will be showed under the Transaction History
                  section in home page.
                </div>
                <div
                  className={
                    "w-[33px] h-[22px] rounded-full  flex justify-start items-center px-[2px]" +
                    (btn1 ? " bg-[#00bb0034]" : " bg-white")
                  }
                  style={{ transition: ".3s" }}
                  onClick={() => {
                    setBtn1(!btn1);
                  }}
                >
                  <div
                    className={
                      "w-[18px] aspect-square rounded-full " +
                      (btn1 ? " ml-[11px] bg-[#00bb00]" : " ml-0 bg-[#ebebf5]")
                    }
                    style={{ transition: ".3s" }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              className={
                "w-full flex flex-col justify-start items-start" +
                (feature == 2 ? " h-auto" : " h-[40px]")
              }
              onClick={() => {
                setFeature(2);
              }}
            >
              <div className="w-full h-[40px] flex justify-between items-center">
                <div className="w-auto h-[40px] flex justify-start items-center">
                  <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-bell-dot"
                    >
                      <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      <circle cx="18" cy="8" r="3" />
                    </svg>
                  </div>
                  Show Monthly Reminders
                </div>
                <div className="w-auto h-full flex justify-end items-center">
                  {feature == 2 ? (
                    <>
                      <Down />
                    </>
                  ) : (
                    <>
                      <Up />
                    </>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full flex justify-between items-start overflow-hidden" +
                  (feature == 2 ? " h-auto " : " h-0")
                }
              >
                <div className="w-[calc(100%-82px)] h-auto flex justify-start items-start text-[14px] text-[#6f6f6f] ml-[33px]">
                  If this option is enabled in Reminfer Page only the due &
                  upcoming reminders for current month will be visible only.
                </div>
                <div
                  className={
                    "w-[33px] h-[22px] rounded-full  flex justify-start items-center px-[2px]" +
                    (btn2 ? " bg-[#00bb0034]" : " bg-white")
                  }
                  style={{ transition: ".3s" }}
                  onClick={() => {
                    setBtn2(!btn2);
                  }}
                >
                  <div
                    className={
                      "w-[18px] aspect-square rounded-full " +
                      (btn2 ? " ml-[11px] bg-[#00bb00]" : " ml-0 bg-[#ebebf5]")
                    }
                    style={{ transition: ".3s" }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setFeature(3);
              }}
            >
              <div className="w-auto h-full flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-notepad-text"
                  >
                    <path d="M8 2v4" />
                    <path d="M12 2v4" />
                    <path d="M16 2v4" />
                    <rect width="16" height="18" x="4" y="4" rx="2" />
                    <path d="M8 10h6" />
                    <path d="M8 14h8" />
                    <path d="M8 18h5" />
                  </svg>
                </div>
                Blur Notes Preview
              </div>

              <div className="w-auto h-full flex justify-end items-center">
                {feature == 3 ? (
                  <>
                    <Down />
                  </>
                ) : (
                  <>
                    <Up />
                  </>
                )}
              </div>
            </div>
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setFeature(4);
              }}
            >
              <div className="w-auto h-full flex justify-start items-center">
                <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                  <IoGitNetworkOutline className="text-[20px]" />
                </div>
                Delete Split Transaction
              </div>

              <div className="w-auto h-full flex justify-end items-center">
                {feature == 4 ? (
                  <>
                    <Down />
                  </>
                ) : (
                  <>
                    <Up />
                  </>
                )}
              </div>
            </div>
          </div>

          <span className="mt-[14px] ">Others</span>
          <div className="w-full flex flex-col justify-start items-start px-[20px] bg-[#F5F6FA] py-[10px]  p-[20px] rounded-2xl mt-[5px]">
            <div
              className="w-full h-[40px] flex justify-start items-center"
              onClick={() => {
                doneTutorial();
              }}
            >
              <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-replace-all"
                >
                  <path d="M14 4c0-1.1.9-2 2-2" />
                  <path d="M20 2c1.1 0 2 .9 2 2" />
                  <path d="M22 8c0 1.1-.9 2-2 2" />
                  <path d="M16 10c-1.1 0-2-.9-2-2" />
                  <path d="m3 7 3 3 3-3" />
                  <path d="M6 10V5c0-1.7 1.3-3 3-3h1" />
                  <rect width="8" height="8" x="2" y="14" rx="2" />
                  <path d="M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
                  <path d="M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
                </svg>
              </div>
              Tutorial
            </div>
            {/* <div className=""></div> */}
            <div
              className="w-full h-[40px] flex justify-start items-center"
              onClick={() => {
                userSignOut();
              }}
            >
              <div className="w-[24px] h-full flex justify-start items-center mr-[9px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-log-out"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </div>
              Log Out
            </div>
          </div>
        </div>

        {/* <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={() => {
            setPermission(true);
          }}
        >
          {" "}
          Total Savings
        </div> */}

        {/* <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={() => {
            doneTutorial();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-shapes"
          >
            <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <circle cx="17.5" cy="17.5" r="3.5" />
          </svg>
          Tutorial
        </div> */}
        {/* <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={downloadPDF}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-file-text"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          Get Report
        </div> */}

        {/* <div
          className="w-auto flex justify-start items-center my-[7px]"
          onClick={() => {
            userSignOut();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Log Out
        </div> */}

        {/* <div
          className="w-[calc(100%-40px)] fixed h-[100px] bottom-[60px] left-[20px] font-[google] font-normal text-black rounded-3xl flex flex-col justify-center items-center bg-[#e4f2ff] text-[14px]"
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
        </div> */}
      </div>
    </>
  );
};

export default Settings;
