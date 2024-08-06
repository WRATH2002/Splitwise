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
import { mirage } from "ldrs";
import UpdateModal, { LogoutModal, SavingsModal } from "./UpdateModal";
import { ring } from "ldrs";

ring.register();

// Default values shown

mirage.register();

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
  const [savings, setSavings] = useState("");

  const [income, setIncome] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [feature, setFeature] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [price, setPrice] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [monthDrop, setMonthDrop] = useState(false);
  const [month, setMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(false);
  const [topic, setTopic] = useState("");
  const [savingsLoading, setSavingsLoading] = useState(false);
  const [savingsModal, setSavingsModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [startDate, setStartDate] = useState("");

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
      setBtn1(snapshot?.data()?.DueReminder);
      setBtn2(snapshot?.data()?.MonthlyReminder);
      setBtn3(snapshot?.data()?.NotePreviewBlur);
      setStartDate(snapshot?.data()?.StartDate);
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

  function sortObjectsByDateAsc(data) {
    return data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.Date.split("/").map(Number);

      // Create date objects for comparison
      const dateA = new Date(yearA, monthA - 1, dayA); // monthA - 1 because months are zero-based
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA - dateB;
    });
  }

  const downloadPDF = (data) => {
    const doc = new jsPDF();
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

    // Set custom font (replace with your font details)
    const customFont = doc.addFont(
      "your-google-font.ttf",
      "your-google-font",
      true
    );

    doc.setFontSize(14);
    doc.text(`Transactions History for Month ${monthNames[month - 1]}`, 14, 14);

    const columns = [
      "Date",
      "Lable",
      "Category",
      "Trn. Type",
      "Trn. Mode",
      "Credited",
      "Debited",
    ];
    const rows = sortObjectsByDateAsc(data)?.map((tx) => [
      format(tx.Date),
      tx.Lable,
      tx.Category,
      tx.TransactionType,
      tx.Mode,
      tx.MoneyIsAdded ? formatAmountWithCommas(tx.Amount) : "",
      !tx.MoneyIsAdded ? formatAmountWithCommas(tx.Amount) : "",
    ]);

    const totalExpense = data?.reduce(
      (acc, tx) =>
        tx.MoneyIsAdded
          ? acc - parseFloat(tx.Amount)
          : acc + parseFloat(tx.Amount),
      0
    );
    const splitCount = data?.reduce(
      (acc, tx) => (tx.TransactionType === "Split" ? acc + 1 : acc),
      0
    );
    const splitExpense = data?.reduce(
      (acc, tx) =>
        tx.TransactionType === "Split"
          ? tx.MoneyIsAdded
            ? acc - parseFloat(tx.Amount)
            : acc + parseFloat(tx.Amount)
          : acc,
      0
    );
    const normCount = data?.reduce(
      (acc, tx) => (tx.TransactionType === "Single" ? acc + 1 : acc),
      0
    );
    const normExpense = data?.reduce(
      (acc, tx) =>
        tx.TransactionType === "Single" ? acc + parseFloat(tx.Amount) : acc,
      0
    );

    const currentDate = new Date();

    const currentMonth = monthNames[currentDate.getMonth()];

    doc.autoTable({
      startY: 20,
      head: [columns],
      body: rows,
      theme: "plain",
      headStyles: {
        fillColor: [25, 26, 44],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      columnStyles: {
        0: { halign: "left" },
        5: { halign: "right" },
        6: { halign: "right" },
        2: { cellWidth: "wrap" }, // Wrap text for Category
        4: { cellWidth: "wrap" },
      },
    });

    doc.setFontSize(10);

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.text(`Transaction Info :`, 15, finalY);
    doc.text(`Month : ${monthNames[month - 1]}`, 15, finalY + 9);

    doc.text(
      `Normal Expense ( x${normCount} ) : ${normExpense}`,
      15,
      finalY + 15
    );
    doc.text(
      `Split Expense ( x${splitCount} ) : ${splitExpense}`,
      15,
      finalY + 21
    );
    doc.text(`Total Expense : ${totalExpense}`, 15, finalY + 27);

    doc.save("transactions.pdf");
  };

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  function filterByMonth() {
    return transactionHistory?.filter((data) => {
      if (parseInt(data.Date.split("/")[1]) == month) {
        return data;
      }
    });
  }

  // function getTotalSavings() {
  //   let sum = 0;
  //   let monthCount = 0;
  //   let monthIndex = 0;
  //   let yearIndex = 0;
  //   // let startMonth = parseInt(
  //   //   sortObjectsByDateAsc(transactionHistory)[0]?.Date?.split("/")[1]
  //   // );
  //   // let endMonth = parseInt(
  //   //   sortObjectsByDateAsc(transactionHistory)[
  //   //     sortObjectsByDateAsc(transactionHistory).length - 1
  //   //   ]?.Date?.split("/")[1]
  //   // );
  //   let currMonth = parseInt(new Date().getMonth()) + 1;
  //   let currYear = parseInt(new Date().getFullYear());
  //   sortObjectsByDateAsc(transactionHistory)?.forEach((data) => {
  //     // if (parseInt(data?.Date?.split("/")[2]) == currYear) {
  //     //   if (parseInt(data?.Date?.split("/")[1]) <= currMonth) {
  //     // if(year)
  //     if (parseInt(data?.Date?.split("/")[1]) == monthIndex) {
  //     } else {
  //       monthCount = monthCount + 1;
  //       monthIndex = parseInt(data?.Date?.split("/")[1]);
  //     }

  //     if (data?.MoneyIsAdded == true) {
  //       sum = sum - parseInt(data?.Amount);
  //     } else {
  //       sum = sum + parseInt(data?.Amount);
  //     }
  //     //   }
  //     // }
  //   });
  //   console.log("savings");
  //   console.log(sum);
  //   console.log(budget * monthCount - sum);
  //   console.log(monthCount);
  //   return formatAmountWithCommas(budget * monthCount - sum);
  // }

  function monthWiseSavings() {
    let savingsArray = [];
    let sum = 0;
    let TranCount = 0;
    let currMonth = parseInt(new Date().getMonth()) + 1;
    let currYear = parseInt(new Date().getFullYear());
    let monthIndex = 0;

    if (transactionHistory.length != 0) {
      if (
        parseInt(
          sortObjectsByDateAsc(transactionHistory)[0]?.Date?.split("/")[2]
        ) < currYear
      ) {
        monthIndex = 1;
      } else {
        if (parseInt(startDate.split("/")[2]) == currYear) {
          monthIndex = parseInt(startDate?.split("/")[1]);
        } else {
          monthIndex = 1;
        }
      }
    }
    console.log("month index");
    console.log(monthIndex);

    console.log("sortObjectsByDateAsc(transactionHistory)");
    console.log(sortObjectsByDateAsc(transactionHistory));
    sortObjectsByDateAsc(transactionHistory)?.forEach((data) => {
      if (parseInt(data?.Date?.split("/")[2]) == currYear) {
        if (parseInt(data?.Date?.split("/")[1]) == monthIndex) {
          if (data?.MoneyIsAdded == true) {
            sum = sum - parseInt(data?.Amount);
            TranCount = TranCount + 1;
          } else {
            sum = sum + parseInt(data?.Amount);
            TranCount = TranCount + 1;
          }
        } else if (parseInt(data?.Date?.split("/")[1]) > monthIndex) {
          savingsArray.push({
            Month: monthIndex,
            Savings: parseInt(budget) - sum,
            TransactionCount: TranCount,
          });
          sum = 0;
          TranCount = 0;
          if (parseInt(data?.Date?.split("/")[1]) == monthIndex + 1) {
            monthIndex = monthIndex + 1;
            if (data?.MoneyIsAdded == true) {
              sum = sum - parseInt(data?.Amount);
              TranCount = TranCount + 1;
            } else {
              sum = sum + parseInt(data?.Amount);
              TranCount = TranCount + 1;
            }
          } else {
            Array(parseInt(data?.Date?.split("/")[1]) - monthIndex - 1)
              .fill("")
              .map((data, index) => {
                savingsArray.push({
                  Month: monthIndex + index + 1,
                  Savings: parseInt(budget),
                  TransactionCount: TranCount,
                });
              });
            monthIndex = parseInt(data?.Date?.split("/")[1]);
            if (data?.MoneyIsAdded == true) {
              sum = sum - parseInt(data?.Amount);
              TranCount = TranCount + 1;
            } else {
              sum = sum + parseInt(data?.Amount);
              TranCount = TranCount + 1;
            }
          }
          // currMonth = parseInt(data?.Date?.split("/")[1]);
        }
        // if (data?.MoneyIsAdded == true) {
        //   sum = sum - parseInt(data?.Amount);
        // } else {
        //   sum = sum + parseInt(data?.Amount);
        // }
      }
    });
    savingsArray.push({
      Month: currMonth,
      Savings: budget - sum,
      TransactionCount: TranCount,
    });

    console.log("Savings Array");
    console.log(savingsArray);

    return savingsArray;

    // return formatAmountWithCommas(budget * (endMonth - startMonth + 1) - sum);
  }

  useEffect(() => {
    setSavingsLoading(true);
    setTimeout(() => {
      setSavingsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // if (transactionHistory.length != 0) {
    setSavings(getTotalSavings());
    // }
  }, [transactionHistory]);

  function DueReminderShowFirebaseUpdate() {
    const user = firebase.auth().currentUser;
    if (btn1) {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        DueReminder: false,
      });
    } else {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        DueReminder: true,
      });
    }
  }

  function MonthlyReminderFirebaseUpdate() {
    const user = firebase.auth().currentUser;
    if (btn2) {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        MonthlyReminder: false,
      });
    } else {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        MonthlyReminder: true,
      });
    }
  }
  function NotePreviewBlurFirebaseUpdate() {
    const user = firebase.auth().currentUser;
    if (btn3) {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        NotePreviewBlur: false,
      });
    } else {
      const userRef = db.collection("Expense").doc(user?.uid).update({
        NotePreviewBlur: true,
      });
    }
  }

  function calculateTotalMonths(startMonth, startYear, endMonth, endYear) {
    const totalMonths =
      (endYear - startYear) * 12 + (endMonth - startMonth + 1);

    return totalMonths;
  }

  function getTotalSavings() {
    console.log("INside total savings function");
    let startMonth = 0;
    let endMonth = 0;
    let startYear = 0;
    let endYear = 0;
    let total = 0;

    // if (transactionHistory.length != 0) {
    startMonth = parseInt(startDate.split("/")[1]);
    startYear = parseInt(startDate.split("/")[2]);
    endMonth = parseInt(new Date().getMonth()) + 1;
    endYear = parseInt(new Date().getFullYear());

    transactionHistory?.forEach((data) => {
      if (data?.MoneyIsAdded) {
        total = total - parseInt(data?.Amount);
      } else {
        total = total + parseInt(data?.Amount);
      }
    });
    // }

    console.log(
      "total Months : " +
        calculateTotalMonths(startMonth, startYear, endMonth, endYear)
    );

    let totalSavings =
      calculateTotalMonths(startMonth, startYear, endMonth, endYear) *
        parseInt(budget) -
      total;

    console.log(totalSavings);

    return totalSavings;
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

      {reportModal ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-30 font-[google] font-normal">
            <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              {loading ? (
                <>
                  <div className="w-full h-full flex justify-center items-center">
                    <l-mirage size="60" speed="2.5" color="#191A2C"></l-mirage>
                  </div>
                </>
              ) : subLoading ? (
                <>
                  <div className="w-full h-full flex justify-center items-center text-[18px]">
                    {error ? (
                      <div className="text-[#e61d0f]">
                        No Transactions Found
                      </div>
                    ) : (
                      <>PDF Download Initiated</>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[22px] ">Monthly Report</span>
                  <span className="text-[14.5px] mt-[5px] text-[#000000a9]">
                    Select a month to generate the monthly report and
                    transaction details as a PDF.
                  </span>
                  {monthDrop ? (
                    <>
                      <div className="mt-[10px] h-0 w-full flex justify-center items-end overflow-visible mb-[5px] text-[16px]">
                        <div className="w-full h-[90px] bg-[#F4F5F7] rounded-xl p-[15px] overflow-y-scroll py-[12px]">
                          {monthNames?.map((data, index) => {
                            return (
                              <div
                                className="w-full h-[30px] flex justify-start items-center"
                                onClick={() => {
                                  setMonth(index + 1);
                                  setMonthDrop(false);
                                }}
                              >
                                {data}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-[10px] h-0 w-full flex justify-center items-end overflow-visible mb-[5px]"></div>
                    </>
                  )}
                  <div className="w-full h-auto flex justify-start items-center mb-[10px] ">
                    <div
                      className="w-full h-[45px] rounded-xl bg-[#F4F5F7] px-[15px] flex justify-start items-center text-[16px]"
                      onClick={() => {
                        setMonthDrop(!monthDrop);
                      }}
                    >
                      {month == 0 ? (
                        <div className="text-[#00000085]">Select Month</div>
                      ) : (
                        <>{monthNames[month - 1]}</>
                      )}
                    </div>
                    <div
                      className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]"
                      onClick={() => {
                        setMonthDrop(!monthDrop);
                      }}
                    >
                      {!monthDrop ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-chevron-up"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                    <div
                      className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#F4F5F7]"
                      onClick={() => {
                        setReportModal(false);
                        setMonth(0);
                        setMonthDrop(false);
                      }}
                    >
                      Close
                    </div>
                    <div
                      className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                          if (filterByMonth().length > 0) {
                            downloadPDF(filterByMonth());
                          } else {
                            setError(true);
                            setTimeout(() => {
                              setError(false);
                            }, 6000);
                          }
                          setLoading(false);
                          setSubLoading(true);
                          setTimeout(() => {
                            setSubLoading(false);
                            setReportModal(false);
                            setMonth(0);
                            setMonthDrop(false);
                          }, 1000);
                        }, 2000);
                      }}
                    >
                      Download
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <UpdateModal
        modal={modal}
        setModal={setModal}
        topic={topic}
        setTopic={setTopic}
        income={income}
      />
      <SavingsModal
        transactionHistory={transactionHistory}
        data={monthWiseSavings()}
        savingsModal={savingsModal}
        setSavingsModal={setSavingsModal}
      />
      <LogoutModal logoutModal={logoutModal} setLogoutModal={setLogoutModal} />

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
        <div className="w-full h-[140px]  flex flex-col bg-[#191A2C] p-[20px] justify-center items-center">
          {/* <div className="w-[90px] aspect-square rounded-full object-cover bg-[#F5F6FA] text-black flex justify-center items-center text-[37px]">
            {name.charAt(0)?.toUpperCase()}
            {name.split(" ")[1]?.charAt(0)?.toUpperCase()}
          </div> */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-bolt"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <circle cx="12" cy="12" r="4" />
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-user"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div className="text-[25px] mt-[10px] text-white ">{name}</div>
          <div className="text-[17px] text-[#a7a7a7] mt-[-4px]">{email}</div>
        </div>
        {/* <div className="w-full border-[.7px] border-[#f2f2f7] my-[20px]"></div> */}
        <div className="w-full h-[calc(100%-140px)] flex flex-col justify-start items-start overflow-y-scroll px-[20px]">
          <span className="mt-[15px] ">General</span>
          <div className="w-full flex flex-col justify-start items-start px-[20px] bg-[#F5F6FA] py-[10px]  p-[20px] rounded-2xl mt-[5px]">
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setModal(true);
                setTopic("Name");
              }}
            >
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
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setModal(true);
                setTopic("Budget");
              }}
            >
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
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setModal(true);
                setTopic("Income");
              }}
            >
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
            {/* <div className="w-full h-[40px] flex justify-start items-center">
              <div className="w-[24px] h-full flex justify-start items-center mr-[9px]"></div>
            </div> */}
            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                // monthWiseSavings();
                setSavingsModal(true);
              }}
            >
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
                    class="lucide lucide-piggy-bank"
                  >
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
                    <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                    <path d="M16 11h.01" />
                  </svg>
                </div>
                Total Savings
              </div>
              <div className="w-auto flex justify-end h-full items-center text-[#191A2C]">
                {savingsLoading ? (
                  <>
                    <l-ring
                      size="18"
                      stroke="2.3"
                      bg-opacity="0"
                      speed="2"
                      color="#191A2C"
                    ></l-ring>
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-[3px]"
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
                    {formatAmountWithCommas(savings)}
                  </>
                )}
              </div>
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
                  className="ml-[4px] mr-[-2px]"
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
              </div>
            </div>

            <div
              className="w-full h-[40px] flex justify-between items-center"
              onClick={() => {
                setReportModal(true);
              }}
            >
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
              <div className="w-auto flex justify-end items-center text-[#6f6f6f]">
                .pdf
              </div>
            </div>

            {/* <div
              className="w-full h-[40px] flex justify-start items-center "
              // onClick={downloadPDF}
              onClick={() => {
                setReportModal(true);
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
            </div> */}
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
                    // setBtn1(!btn1);
                    DueReminderShowFirebaseUpdate();
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
                  If this option is enabled in Reminder Page all the Reminders
                  including Due and Upcoming will be showed.
                </div>
                <div
                  className={
                    "w-[33px] h-[22px] rounded-full  flex justify-start items-center px-[2px]" +
                    (btn2 ? " bg-[#00bb0034]" : " bg-white")
                  }
                  style={{ transition: ".3s" }}
                  onClick={() => {
                    // setBtn2(!btn2);
                    MonthlyReminderFirebaseUpdate();
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
              className={
                "w-full flex flex-col justify-start items-start" +
                (feature == 3 ? " h-auto" : " h-[40px]")
              }
              onClick={() => {
                setFeature(3);
              }}
            >
              <div className="w-full h-[40px] flex justify-between items-center">
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
                className={
                  "w-full flex justify-between items-start overflow-hidden" +
                  (feature == 3 ? " h-auto " : " h-0")
                }
              >
                <div className="w-[calc(100%-82px)] h-auto flex justify-start items-start text-[14px] text-[#6f6f6f] ml-[33px]">
                  Enabling this option will blur the note preview for privacy.
                </div>
                <div
                  className={
                    "w-[33px] h-[22px] rounded-full  flex justify-start items-center px-[2px]" +
                    (btn3 ? " bg-[#00bb0034]" : " bg-white")
                  }
                  style={{ transition: ".3s" }}
                  onClick={() => {
                    // setBtn2(!btn2);
                    NotePreviewBlurFirebaseUpdate();
                  }}
                >
                  <div
                    className={
                      "w-[18px] aspect-square rounded-full " +
                      (btn3 ? " ml-[11px] bg-[#00bb00]" : " ml-0 bg-[#ebebf5]")
                    }
                    style={{ transition: ".3s" }}
                  ></div>
                </div>
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

              <div className="w-auto h-full flex justify-end items-center text-[#00000085]">
                {/* {feature == 4 ? (
                  <>
                    <Down />
                  </>
                ) : (
                  <>
                    <Up />
                  </>
                )} */}
                Coming Soon
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
              className="w-full h-[40px] flex justify-start items-center text-[#e61d0f]"
              onClick={() => {
                setLogoutModal(true);
                // userSignOut();
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
      </div>
    </>
  );
};

export default Settings;
