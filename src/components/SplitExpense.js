import React, { useEffect, useState } from "react";
import SplitTransaction from "./SplitTransaction";
import QuickSplitInfo from "./QuickSplitInfo";
import { FiPlus } from "react-icons/fi";
import TopNavbar from "./TopNavbar";
import { BiRupee } from "react-icons/bi";

import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/colors/teal.css";
import Button from "react-multi-date-picker/components/button";
import { IoMdCloudUpload } from "react-icons/io";
import { MdKeyboardArrowDown, MdOutlineAddCircleOutline } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";
import Friends, { Profile, ProfileTwo } from "./Friends";
import { RiSearchLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { mirage } from "ldrs";
import { storage } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import loadImage from "blueimp-load-image";
import { jelly } from "ldrs";
import { squircle } from "ldrs";
import { SmallSizeIcon } from "./NornmalSizeIcon";
squircle.register();
jelly.register();
mirage.register();

// Default values shown

const options = {
  title: "Demo Title",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-gray-700 dark:bg-gray-800",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "bg-red-500",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
  disabledDates: [],
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
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

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const categoryName = [
  "Car Maintanance",
  "Education",
  "Electricity Bill",
  "Entertainment",
  "Food & Drinks",
  "Grocery",
  "Medical",
  "Others",
  "Pet Care",
  "Petrol / Diesel",
  "Shopping",
  "Taxi Fare",
  "Travel",
];

const paymentName = ["Online UPI", "Credit/Debit Card", "Cash"];

const SplitExpense = () => {
  const [splitModal, setSplitModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [inCount, setInCount] = useState(0);
  const [outCount, setOutCount] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");
  const [addedMember, setAddedMember] = useState([
    firebase.auth().currentUser.uid,
  ]);
  const [userList, setUserList] = useState([]);
  const [splitTransaction, setSplitTransaction] = useState([]);
  const [normalTransaction, setNormalTransaction] = useState([]);
  const [finalTransaction, setFinalTransaction] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [selectedTran, setSelectedTran] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [deleteInProcess, setDeleteInProcess] = useState(false);
  const [delSuccess, setDelSuccess] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [paymentDropdown, setCPaymentDropdown] = useState(false);
  const [subSection, setSubSection] = useState("");
  const [imageError, setImageError] = useState(false);
  const [addNewTransaction, setAddNewTransaction] = useState(false);
  const [UIColor, setUIColor] = useState("");
  const [UIIndex, setUIIndex] = useState("");

  useEffect(() => {
    // const user = firebase.auth().currentUser;
    // if (addedMember.length === 0) {
    //   setAddedMember((prevMembers) => [...prevMembers, user.uid]);
    //   // setAddedMember(user.uid);
    // }
    const currentDate = new Date();
    setPreDate(currentDate.getDate());
    fetchSplitTransaction();
  }, []);

  function fetchSplitTransaction() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setSplitTransaction(snapshot?.data()?.SplitTransaction);
      setNormalTransaction(snapshot?.data()?.NormalTransaction);
      setUIColor(snapshot?.data()?.Theme);
      setUIIndex(snapshot?.data()?.SecondaryTheme);
    });
  }

  function addTransactionToFirebase(userid) {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(userid)
      .update({
        SplitTransaction: arrayUnion({
          Lable: label,
          Date: value?.day + "/" + value?.month?.number + "/" + value?.year,
          Amount: price,
          TransactionType: "Split",
          Members: addedMember,
          Category: category,
          Mode: mode,
          BillUrl: bill,
          Owner: user.uid,
          MemberCount: addedMember.length,
        }),
      });
  }

  function addTransactionToTransaction(userid) {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(userid)
      .update({
        NormalTransaction: arrayUnion({
          Lable: "Split : " + label,
          Date: value?.day + "/" + value?.month?.number + "/" + value?.year,
          Amount: price,
          TransactionType: "Split",
          Members: addedMember,
          Category: category,
          Mode: mode,
          BillUrl: bill,
          Owner: user.uid,
          MemberCount: addedMember.length,
        }),
      });
  }

  function mapOverAll() {
    const user = firebase.auth().currentUser;
    addTransactionToFirebase(user.uid);
    addTransactionToTransaction(user.uid);
    addedMember.map((data) => {
      addTransactionToFirebase(data);
    });
  }

  const [value, setValue] = useState("");

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  function searchUserFriendChangeWord() {
    let words = searchName.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    searchUserFriend(words.join(" "));
  }

  function searchUserFriend(nameString) {
    setUserList([]);
    const UserRef = db.collection("Expense");
    const queryRef = UserRef.where("Name", "==", nameString);
    queryRef
      .get()
      .then((data) => {
        data.docs.forEach((userId) => {
          console.log(userId.id);
          setUserList((prevMembers) => [
            ...prevMembers,
            { UserID: userId?.id },
          ]);
        });
      })
      .catch((error) => {
        console.log(error);
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

  // useEffect(() => {
  //   console.log(userList);
  //   console.log(addedMember);
  // }, [userList, addedMember]);

  function amountToGet() {
    let count = 0;
    const user = firebase.auth().currentUser;
    console.log(splitTransaction);
    console.log(normalTransaction);

    let TotalAmount = splitTransaction.reduce((acc, curr) => {
      let newArr = [];
      if (curr?.Owner == user.uid) {
        // console.log("Same Same");
        newArr = normalTransaction?.filter((data) => {
          if (
            data?.TotalAmount == curr?.Amount &&
            data?.BillUrl == curr?.BillUrl &&
            data?.Category == curr?.Category &&
            data?.SplitDate == curr?.Date &&
            (data?.Lable).slice(12) == curr?.Lable &&
            data?.MemberCount == curr?.MemberCount &&
            data?.Owner == curr?.Owner &&
            data?.TransactionType == curr?.TransactionType
          ) {
            return data;
          }
        });

        console.log(newArr);

        if (newArr.length === 0) {
          acc =
            acc +
            parseFloat(curr?.Amount) -
            (parseFloat(curr?.Amount) / curr?.MemberCount).toFixed(2);

          count++;
        } else {
          acc =
            acc +
            parseFloat(curr?.Amount) -
            (newArr?.length + 1) * parseFloat(newArr[0]?.Amount);

          if (
            parseFloat(curr?.Amount) -
              (newArr?.length + 1) * parseFloat(newArr[0]?.Amount) !==
            0
          ) {
            count++;
          }
        }
        console.log("acc");
        console.log(acc);
      }

      return acc;
    }, 0);

    console.log(TotalAmount);

    return { amount: TotalAmount, count: count };
  }

  function getAmountToPay() {
    let count = 0;
    const user = firebase.auth().currentUser;
    console.log(splitTransaction);
    console.log(normalTransaction);

    let TotalAmount = splitTransaction.reduce((acc, curr) => {
      let newArr = [];
      if (curr?.Owner !== user.uid) {
        console.log("Rounddddddddddddddddddddddddddddddddddddddddd");
        newArr = normalTransaction?.filter((data) => {
          if (
            data?.TotalAmount == curr?.Amount &&
            data?.BillUrl == curr?.BillUrl &&
            data?.Category == curr?.Category &&
            data?.SplitDate == curr?.Date &&
            (data?.Lable).slice(13) == curr?.Lable &&
            data?.MemberCount == curr?.MemberCount &&
            data?.Owner == curr?.Owner &&
            data?.TransactionType == curr?.TransactionType
          ) {
            return data;
          }
        });

        console.log(newArr);

        if (newArr.length === 0) {
          console.log(curr?.Amount);
          console.log(curr?.MemberCount);
          acc =
            acc +
            parseFloat(
              parseFloat(
                parseFloat(curr?.Amount) / parseInt(curr?.MemberCount)
              ).toFixed(2)
            );

          count++;
        } else {
        }
        console.log("acc");
        console.log(acc);
      }

      return acc;
    }, 0);

    console.log(TotalAmount);

    return { amount: TotalAmount, count: count };
  }

  useEffect(() => {
    // amountToGet();
    processSplitTransactions();
    getAmountToPay();
  }, [splitTransaction]);

  function processSplitTransactions() {
    const user = firebase.auth().currentUser;
    let DoneArray = [];
    let LiveArray = [];
    let DonetransactionCount = 0;
    let LivetransactionCount = 0;
    console.log(
      "Going Inside Function to get date wise split data =----------------------"
    );
    splitTransaction?.map((data) => {
      normalTransaction?.map((data2) => {
        if (data?.Owner === user.uid) {
          if (
            data2?.TotalAmount == data?.Amount &&
            data2?.BillUrl == data?.BillUrl &&
            data2?.Category == data?.Category &&
            data2?.SplitDate == data?.Date &&
            (data2?.Lable).slice(12) == data?.Lable &&
            data2?.MemberCount == data?.MemberCount &&
            data2?.Owner == data?.Owner &&
            data2?.TransactionType == data?.TransactionType
          ) {
            DonetransactionCount++;
            // console.log(data2, data?.MemberCount);
          }
        } else {
          if (
            data2?.TotalAmount == data?.Amount &&
            data2?.BillUrl == data?.BillUrl &&
            data2?.Category == data?.Category &&
            data2?.SplitDate == data?.Date &&
            (data2?.Lable).slice(13) == data?.Lable &&
            data2?.MemberCount == data?.MemberCount &&
            data2?.Owner == data?.Owner &&
            data2?.TransactionType == data?.TransactionType
          ) {
            LivetransactionCount++;
            // console.log(data2);
          }
        }
      });

      if (data?.Owner === user?.uid) {
        if (data?.MemberCount == DonetransactionCount + 1) {
          DoneArray.push(data);
        } else {
          LiveArray.push(data);
        }
      } else {
        if (LivetransactionCount >= 1) {
          DoneArray.push(data);
        } else {
          LiveArray.push(data);
        }
      }
      DonetransactionCount = 0;
      LivetransactionCount = 0;
    });

    // console.log("Resulttttt-----------------------");

    // console.log(DoneArray);
    // console.log(LiveArray);
    // console.log("Resulttttt-----------------------");
    // console.log(
    //   sortTransactions(LiveArray).concat(sortTransactions(DoneArray))
    // );

    setFinalTransaction(
      sortTransactions(LiveArray).concat(sortTransactions(DoneArray))
    );
  }

  function sortTransactions(transactions) {
    return transactions.sort((a, b) => {
      const dateA = new Date(a.Date.split("/").reverse().join("-"));
      const dateB = new Date(b.Date.split("/").reverse().join("-"));
      return dateB - dateA;
    });
  }

  function deleteSplitTransaction() {
    const user = firebase.auth().currentUser;
    selectedTran?.forEach((data) => {
      db.collection("Expense")
        .doc(user?.uid)
        .update({
          SplitTransaction: arrayRemove(data),
        });
    });
    setSelectedTran([]);
  }

  function addToFirebase() {
    const user = firebase.auth().currentUser;
    if (value.length == undefined) {
      db.collection("Expense")
        .doc(user.uid)
        .update({
          NormalTransaction: arrayUnion({
            Lable: label,
            Date: value?.day + "/" + value?.month?.number + "/" + value?.year,
            Amount: price,
            TransactionType: "Single",
            Members: "0",
            Category: category,
            Mode: mode,
            BillUrl: bill,
          }),
        });
    } else {
      db.collection("Expense")
        .doc(user.uid)
        .update({
          NormalTransaction: arrayUnion({
            Lable: label,
            Date: value,
            Amount: price,
            TransactionType: "Single",
            Members: "0",
            Category: category,
            Mode: mode,
            BillUrl: bill,
          }),
        });
    }

    setLabel("");
    setPrice("");
    setCategory("");
    setMode("");
    setBill("");
  }

  return (
    <>
      {addModal ? (
        <div className="w-[calc(100%-40px)] h-[calc(100svh-40px)] rounded-3xl fixed  bg-[#fff5ee] top-[20px] left-[20px] flex flex-col justify-start items-start py-[30px] text-black z-50">
          <span className="px-[30px] w-full text-[25px] text-black font-[google] font-normal flex justify-start items-center mb-[10px] mt-[-10px]">
            Add <span className="text-[#de8544] ml-[10px]">Member</span>
          </span>
          <div
            className={
              "px-[35px] pr-[5px]  w-auto  rounded-md flex justify-start items-center bg-transparent ml-[5px]   font-[google] font-normal mt-[15px]" +
              (searchName?.length === 0
                ? " h-[45px] mb-[-45px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
            }
            style={{ transition: ".4s" }}
          >
            Friend's Name
          </div>
          <div className="px-[30px] w-full h-[45px] flex justify-start items-center ">
            <input
              className="outline-none rounded-md w-full h-[45px] bg-transparent border border-[#ffd8be] px-[10px]  font-[google] font-normal text-[16px] z-40"
              // placeholder="Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            {searchName !== "" ? (
              <>
                <div
                  className="w-[45px] h-full flex justify-center items-center ml-[-45px] text-[18px] cursor-pointer z-50 hover:text-[#de8544]"
                  onClick={() => {
                    // addToFirebase();
                    // addPerson();
                    // setAddModal(false);
                    searchUserFriendChangeWord();
                  }}
                >
                  <RiSearchLine className="cursor-pointer" />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            className={
              "px-[30px] w-full mt-[10px]  overflow-y-scroll " +
              (addedMember?.length === 0
                ? " h-[calc(100%-128px)]"
                : " h-[calc(100%-218px)]")
            }
          >
            {userList.length === 0 ? (
              <>
                <div className="w-full h-[60px] flex flex-col  justify-center text-[15px] items-center font-[google] font-normal text-[#de8544]"></div>
              </>
            ) : (
              <>
                {userList?.map((data) => {
                  return (
                    <>
                      <Friends
                        data={data}
                        addedMember={addedMember}
                        setAddedMember={setAddedMember}
                      />
                    </>
                  );
                })}
                <Friends
                  data={{ UserID: "50QaJrpno3SIKLnfQxqbzHOSXpy1" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "fbYMWUIviJWlu6ro4qGXkxelw2i1" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpBF8erfzb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpBwrF8ezb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpBrgaqeF8ezb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpsvqaervBwefF8ezb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpBF8avezb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <Friends
                  data={{ UserID: "kqctxvgivIcDULNNpBF8ezervvb5zI42" }}
                  addedMember={addedMember}
                  setAddedMember={setAddedMember}
                />
                <div></div>
              </>
            )}
          </div>
          <div
            className={
              "w-[calc(100%-40px)] flex flex-col justify-center px-[30px] items-start font-[google] font-normal text-[15px] fixed bottom-[70px] left-[20px]   bg-[#fff5ee] z-50 overflow-hidden" +
              (addedMember?.length === 0 ? " h-0" : " h-[90px]")
            }
            style={{ transition: ".2s" }}
          >
            <div>Members Selected</div>
            <div className="w-full flex justify-start items-center mt-[8px] ">
              {addedMember.map((data) => {
                return (
                  <Profile
                    data={data}
                    addedMember={addedMember}
                    setAddedMember={setAddedMember}
                  />
                );
              })}
            </div>
          </div>
          <div className="w-[calc(100%-40px)] flex justify-center items-end font-[google] font-normal text-[17px] fixed bottom-[20px] left-[20px] rounded-b-3xl  h-[50px] px-[20px]  bg-[#fff5ee] z-50 ">
            <div
              className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
              onClick={() => {
                // addToFirebase();
                // addPerson();
                // setAddModal(false);
                setAddModal(false);
              }}
            >
              Done
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {splitModal === true ? (
        <>
          <div className="w-full h-[100svh] fixed z-30 bg-[#70708628] backdrop-blur-md top-0 left-0 flex flex-col justify-end items-start p-[20px] ">
            <div className="w-full h-auto py-[20px] bg-[#ffffff]   rounded-3xl flex flex-col justify-center items-start z-40">
              <div className="w-full h-auto px-[20px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
                <div className="flex flex-col w-full justify-between items-start ">
                  <div
                    className=" w-auto  rounded-md flex text-[#0000003c] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                    style={{ transition: ".4s" }}
                  ></div>
                  <div
                    className={
                      "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal    mb-[-60px] px-[15px] rounded-xl" +
                      (label?.length > 0
                        ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                        : " items-center pt-[0px] text-[16px] text-[#00000061]")
                    }
                  >
                    Label
                  </div>
                  <input
                    className={
                      "outline-none rounded-xl w-full h-[60px] bg-transparent border  px-[15px]  text-black font-[google] font-normal text-[16px] z-40" +
                      (label == "NotFound" || label?.length == 0
                        ? " pt-[0px]"
                        : " pt-[18px]") +
                      (label == "NotFound"
                        ? " border-[#d02d2d] "
                        : " border-[#F5F6FA] ")
                    }
                    // placeholder="Label"
                    value={label == "NotFound" ? "" : label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  ></input>
                </div>
                {/* <div className="flex w-full justify-between h-[50px] items-center mt-[10px]"></div> */}

                <div className="flex w-full justify-between items-center mt-[5px]">
                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)]">
                    <div
                      className=" w-full  rounded-md flex text-[#0000005d] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                      style={{ transition: ".4s" }}
                    >
                      {/* Date */}
                    </div>
                    <div
                      className={
                        "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal    mb-[-60px] px-[15px] rounded-xl" +
                        (value.length > 0
                          ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                          : " items-center pt-[0px] text-[16px] text-[#00000061]")
                      }
                    >
                      Date
                    </div>
                    <DatePicker
                      // inputClass="custom-input"
                      // style={{
                      //   width: "320px",
                      // }}
                      arrow={false}
                      className="bg-[#212121] teal h-full w-full flex justify-center mt-[10px] rounded-xl items-center font-[google] font-normal  bg-transparent border-[1px] border-[#535353] text-[14px]"
                      disableYearPicker
                      disableMonthPicker
                      weekDays={weekDays}
                      months={months}
                      // minDate={new Date().setDate(0)}
                      // maxDate={new Date().setDate(preDate)}
                      // render={<InputIcon />}
                      buttons={false}
                      value={value}
                      onChange={(e) => {
                        setValue(
                          e?.day + "/" + e?.month?.number + "/" + e?.year
                        );
                      }}
                      format="DD/MM/YYYY"
                      shadow={false}
                      render={(value, openCalendar) => {
                        return (
                          <button
                            className={
                              "border-[1px]  flex justify-start items-center bg-transparent px-[15px] font-[google] text-[16px] w-full h-[60px] rounded-xl text-black z-40" +
                              (value == "NotFound" || value.length == 0
                                ? " pt-[0px]"
                                : " pt-[18px]") +
                              (value == "NotFound"
                                ? " border-[#d02d2d] "
                                : " border-[#F5F6FA] ")
                            }
                            onClick={openCalendar}
                          >
                            {value == "NotFound" ? <></> : <>{value}</>}
                            {/* {value} */}
                          </button>
                        );
                      }}

                      // render={<InputIcon />}
                    />
                  </div>

                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] ">
                    <div
                      className=" w-auto  rounded-md flex text-[#0000005d] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                      style={{ transition: ".4s" }}
                    >
                      {/* Amount */}
                    </div>
                    <div
                      className={
                        "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                        (price.length > 0
                          ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                          : " items-center pt-[0px] pl-[35px] text-[16px] text-[#00000061]")
                      }
                      // style={{ transition: ".3s" }}
                    >
                      Amount
                    </div>
                    {/* <BiRupee /> */}
                    <div className="w-full h-[60px] flex justify-start items-center">
                      <div
                        className={
                          "w-[30px] h-[50px] flex justify-end  items-center mr-[-30px] text-black z-50" +
                          (price == "NotFound" || price.length == 0
                            ? " pt-[0px]"
                            : " pt-[18px]")
                        }
                      >
                        <BiRupee className="text-[17px]" />
                      </div>
                      <input
                        className={
                          "outline-none w-full h-[45px] rounded-xl pl-[35px] bg-transparent border px-[20px] text-black font-[google] font-normal text-[16px] z-40" +
                          (price == "NotFound" || price.length == 0
                            ? " pt-[0px]"
                            : " pt-[18px]") +
                          (price == "NotFound"
                            ? " border-[#d02d2d] "
                            : " border-[#F5F6FA] ")
                        }
                        // placeholder="Amount"
                        value={price == "NotFound" ? "" : price}
                        onChange={(e) => {
                          console.log(isNumeric(e.target.value));
                          if (isNumeric(e.target.value) === true) {
                            setPrice(e.target.value);
                          }
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
                {/* <div className="flex w-full justify-between items-center mt-[10px]">
                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Transaction Type"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                ></input>

                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px]  bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Members"
                  onChange={(e) => {
                    setMember(e.target.value);
                  }}
                ></input>
              </div> */}
                <div className="flex w-full  justify-between h-auto items-start  font-[google] font-normal text-black text-[15px]">
                  {/* <span className="text-[#000000]">
                        Select Category{" "}
                        <span className="text-[#ff6c00] h-auto pt-[3px]">
                          *
                        </span>
                      </span> */}

                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-auto">
                    <div
                      className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                      style={{ transition: ".4s" }}
                    >
                      {/* Category */}
                    </div>
                    <div
                      className={
                        "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                        (category.length > 0
                          ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                          : " items-center pt-[0px] text-[16px] text-[#00000061]")
                      }
                      // style={{ transition: ".3s" }}
                    >
                      Category
                    </div>
                    <div
                      className="w-full h-auto flex justify-start items-center z-50"
                      onClick={() => {
                        setCategoryDropdown(!categoryDropdown);
                        setCPaymentDropdown(false);
                      }}
                    >
                      <div
                        className={
                          "outline-none w-full h-[60px] rounded-xl bg-transparent border px-[15px] text-black font-[google] font-normal text-[16px] z-40 flex justify-start items-center whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1" +
                          (category == "NotFound" || category.length == 0
                            ? " pt-[0px]"
                            : " pt-[18px]") +
                          (category == "NotFound"
                            ? " border-[#d02d2d] "
                            : " border-[#F5F6FA] ")
                        }
                        // placeholder="Price"
                        // value={price}
                      >
                        {category == "NotFound" ? <></> : <>{category}</>}
                        {/* {category} */}
                      </div>
                      <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]">
                        {categoryDropdown ? (
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
                  </div>

                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-auto ">
                    <div
                      className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                      style={{ transition: ".4s" }}
                    >
                      {/* Payment Mode */}
                    </div>
                    <div
                      className={
                        "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                        (mode.length > 0
                          ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                          : " items-center pt-[0px] text-[16px] text-[#00000061]")
                      }
                      // style={{ transition: ".3s" }}
                    >
                      Payment Mode
                    </div>
                    <div
                      className="w-full h-auto flex justify-start items-center z-50"
                      onClick={() => {
                        setCPaymentDropdown(!paymentDropdown);
                        setCategoryDropdown(false);
                      }}
                    >
                      <div
                        className={
                          "outline-none w-full h-[60px] rounded-xl bg-transparent border px-[15px] text-black font-[google] font-normal text-[16px] z-40 flex justify-start items-center  whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1" +
                          (mode == "NotFound" || mode.length == 0
                            ? " pt-[0px]"
                            : " pt-[18px]") +
                          (mode == "NotFound"
                            ? " border-[#d02d2d] "
                            : " border-[#F5F6FA] ")
                        }
                        // placeholder="Price"
                        // value={price}
                      >
                        {mode == "NotFound" ? <></> : <>{mode}</>}
                      </div>
                      <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]">
                        {paymentDropdown ? (
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

                    {/* <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose"> */}
                    {/* <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Online UPI"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Online UPI");
                            }}
                          >
                            Online UPI
                          </span>
                          <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Credit/Debit Card"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Credit/Debit Card");
                            }}
                          >
                            Credit/Debit Card
                          </span>
                          <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Cash"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Cash");
                            }}
                          >
                            Cash
                          </span> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className="w-full h-[0px] flex justify-between items-center">
                  <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                    <div
                      className={
                        "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[132px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px]" +
                        (categoryDropdown ? " flex" : " hidden")
                      }
                    >
                      {/* <div className="w-full py-[6px] flex justify-start items-center">
                            Select Category
                          </div>
                          <div className="w-full my-[6px] flex justify-start items-center border border-[#beb0f4]"></div> */}
                      {categoryName.map((data, index) => {
                        return (
                          <div
                            className="w-full min-h-[30px] my-[5px] text-[16px] flex justify-start items-center z-50"
                            onClick={() => {
                              setCategory(data);
                              setCategoryDropdown(false);
                            }}
                          >
                            <SmallSizeIcon Category={data} />
                            <div className="ml-[15px]" key={index}>
                              {data}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                    <div
                      className={
                        "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[132px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px] left-[40px]" +
                        (paymentDropdown ? " flex" : " hidden")
                      }
                    >
                      {/* <div className="w-full py-[6px] flex justify-start items-center">
                            Select Category
                          </div>
                          <div className="w-full my-[6px] flex justify-start items-center border border-[#beb0f4]"></div> */}
                      {paymentName.map((data, index) => {
                        return (
                          <div
                            className="w-full h-[30px] my-[5px] text-[16px] flex justify-start items-center z-50"
                            onClick={() => {
                              setMode(data);
                              setCPaymentDropdown(false);
                            }}
                          >
                            {/* <SmallSizeIcon Category={data} /> */}
                            <div className="" key={index}>
                              {data}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                      <span className="text-[#000000]">
                        Select Mode of Transaction{" "}
                        <span className="text-[#ff6c00] h-auto pt-[3px]">
                          *
                        </span>
                      </span>
                      <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Online UPI"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Online UPI");
                          }}
                        >
                          Online UPI
                        </span>
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Credit/Debit Card"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Credit/Debit Card");
                          }}
                        >
                          Credit/Debit Card
                        </span>
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Cash"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Cash");
                          }}
                        >
                          Cash
                        </span>
                      </div>
                    </div> */}
                <div className="flex flex-col w-full justify-center items-start font-[google] font-normal text-black text-[15px]">
                  <div
                    className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                    style={{ transition: ".4s" }}
                  >
                    {/* Reciept / Bill */}
                  </div>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose ">
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] bg-[#F5F6FA] rounded-xl w-[80px] h-[80px] border  flex justify-center items-center text-[#000000] text-[16px]" +
                        (imageError
                          ? " border-[#d02d2d] text-[#d02d2d]"
                          : " border-[#F5F6FA] text-[#000000]")
                      }
                    >
                      {/* <span className="ml-[10px]"> */}
                      {imageError ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-image"
                          >
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <span className="ml-[10px]">Not a Valid Reciept</span>
                        </>
                      ) : (
                        <>
                          {" "}
                          {bill.length == 0 ? (
                            <>
                              <IoMdCloudUpload className="text-[25px]" />
                              <span className="ml-[10px] ">Upload Photo</span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-image"
                              >
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="3"
                                  rx="2"
                                  ry="2"
                                />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                              <span className="ml-[10px]">Uploaded</span>
                            </>
                          )}
                        </>
                      )}
                      {/* </span> */}
                    </span>
                  </div>
                </div>

                <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                  <div
                    className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#F4F5F7]"
                    onClick={() => {
                      setSplitModal(false);
                      setLabel("");
                      setPrice("");
                      setCategory("");
                      setMode("");
                      setBill("");
                      setSubSection("");
                    }}
                  >
                    Cancel
                  </div>
                  {label?.length != 0 &&
                  value?.length != 0 &&
                  price?.length != 0 &&
                  category?.length != 0 &&
                  mode?.length != 0 &&
                  label != "NotFound" &&
                  price != "NotFound" &&
                  value != "NotFound" &&
                  category != "NotFound" &&
                  mode != "NotFound" ? (
                    <>
                      <div
                        className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                        onClick={() => {
                          // if (
                          //   label?.length != 0 &&
                          //   value?.length != 0 &&
                          //   price?.length != 0 &&
                          //   category?.length != 0 &&
                          //   mode?.length != 0
                          //   // bill?.length != 0
                          // ) {
                          setSubSection("");
                          addToFirebase();
                          setAddNewTransaction(false);
                          // }
                        }}
                      >
                        Update
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#181f3223] ml-[10px] text-[#0000006c]"
                        onClick={() => {
                          // if (
                          //   label?.length != 0 &&
                          //   value?.length != 0 &&
                          //   price?.length != 0 &&
                          //   category?.length != 0 &&
                          //   mode?.length != 0
                          //   // bill?.length != 0
                          // ) {
                          //   addToFirebase();
                          //   setAddNewTransaction(false);
                          // }
                        }}
                      >
                        Update
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-full h-[100svh] fixed z-30 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
            <div className="w-[320px] max-h-[400px] py-[27px] bg-[#ffffff] rounded-3xl flex flex-col justify-center items-start z-40">
              <div className="w-full h-auto px-[30px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
                <span className="w-full text-[25px] text-black font-[google] font-normal flex justify-start items-center ">
                  Transaction{" "}
                  <span className="text-[#de8544] ml-[10px]">Info</span>
                </span>

                <div className="flex flex-col w-full justify-between items-start mt-[20px]">
                  <span className="text-[#000000] font-[google] font-normal text-[15px] mb-[10px]">
                    About Transaction{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div
                    className={
                      " w-auto  rounded-md flex justify-start items-center bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                      (label?.length === 0
                        ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                        : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
                    }
                    style={{ transition: ".4s" }}
                  >
                    Label
                  </div>
                  <input
                    className="outline-none rounded-md w-full h-[40px] bg-transparent border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[15px] z-40"
                    // placeholder="Label"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  ></input>
                </div>

                <div className="flex w-full justify-between items-center mt-[10px]">
                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[40px]">
                    <div
                      className={
                        " w-auto  flex justify-start items-center bg-transparent ml-[5px] px-[5px]   font-[google] font-normal " +
                        (value?.length === 0
                          ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                          : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
                      }
                      style={{ transition: ".4s" }}
                    >
                      Date
                    </div>
                    <DatePicker
                      // inputClass="custom-input"
                      style={{
                        width: "320px",
                      }}
                      arrow={false}
                      className="bg-[#212121] teal h-full min-w-[260px] flex justify-center items-center font-[google] font-normal  bg-transparent border-[1px] border-[#535353]"
                      disableYearPicker
                      disableMonthPicker
                      weekDays={weekDays}
                      months={months}
                      minDate={new Date().setDate(0)}
                      maxDate={new Date().setDate(preDate)}
                      // render={<InputIcon />}
                      buttons={false}
                      value={value}
                      onChange={setValue}
                      format="DD/MM/YYYY"
                      shadow={false}
                      render={(value, openCalendar) => {
                        return (
                          <button
                            className="border-[1px] border-[#ffd8be] flex justify-start items-center px-[10px] font-[google] text-[15px] w-[125px] h-[40px] rounded-md text-black z-40"
                            onClick={openCalendar}
                          >
                            {value}
                          </button>
                        );
                      }}

                      // render={<InputIcon />}
                    />
                  </div>

                  <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-[40px] ">
                    <div
                      className={
                        " w-auto  flex justify-start items-center rounded-md bg-transparent ml-[5px]    font-[google] font-normal " +
                        (price?.length === 0
                          ? " h-[40px] mb-[-40px] z-30 border border-transparent text-[#8b8b8b] text-[15px] ml-[20px] px-[19px]"
                          : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px] ml-[5px] px-[5px]")
                      }
                      style={{ transition: ".4s" }}
                    >
                      Amount
                    </div>
                    <div className="w-full h-[40px] flex justify-start items-center">
                      <div className="w-[30px] h-[50px] flex justify-center items-center mr-[-30px] text-black ">
                        <BiRupee className="text-[17px]" />
                      </div>
                      <input
                        className="outline-none w-full h-[40px] rounded-md pl-[25px] bg-transparent border border-[#ffd8be] px-[10px] text-black font-[google] font-normal text-[14px] z-40"
                        // placeholder="Price"
                        value={price}
                        onChange={(e) => {
                          console.log(isNumeric(e.target.value));
                          if (isNumeric(e.target.value) === true) {
                            setPrice(e.target.value);
                          }
                        }}
                      ></input>
                    </div>
                  </div>
                </div> 
                <div className="flex flex-col w-full justify-center items-start mt-[20px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">
                    Select Category{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Shopping"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Shopping");
                      }}
                    >
                      Shopping
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Medical"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Medical");
                      }}
                    >
                      Medical
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Grocery"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Grocery");
                      }}
                    >
                      Grocery
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Travel"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Travel");
                      }}
                    >
                      Travel
                    </span>

                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Entertainment"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Entertainment");
                      }}
                    >
                      Entertainment
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Food & Drinks"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Food & Drinks");
                      }}
                    >
                      Food & Drinks
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (category == "Other"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setCategory("Other");
                      }}
                    >
                      Other
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">
                    Select Mode of Transaction{" "}
                    <span className="text-[#ff6c00] h-auto pt-[3px]">*</span>
                  </span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (mode == "Online UPI"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setMode("Online UPI");
                      }}
                    >
                      Online UPI
                    </span>
                    <span
                      className={
                        "p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#ffd8be] flex justify-center items-center" +
                        (mode == "Offline Cash"
                          ? " bg-[#ffddc5] text-[black]"
                          : " text-[#535353]")
                      }
                      onClick={() => {
                        setMode("Offline Cash");
                      }}
                    >
                      Offline Cash
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">Upload Reciept / Bill</span>
                  <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                    <span className="p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md w-[80px] h-[80px] border border-[#ffd8be] bg-[#ffddc5] flex justify-center items-center text-[#535353]">
                      <IoMdCloudUpload className="text-[25px]" />{" "}
                      <span className="ml-[10px]">Upload Photo</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                  <span className="text-[#000000]">Add Members</span>
                  
                  <div className="w-full h-auto mt-[10px] flex justify-start items-center flex-wrap">
                    {addedMember.map((data) => {
                      return (
                        <>
                          <ProfileTwo data={data} />{" "}
                        </>
                      );
                    })}
                    <div
                      className="w-[40px] h-[40px] mb-[10px] rounded-full bg-[#ffddc5] flex justify-center items-center "
                      onClick={() => {
                        setAddModal(true);
                      }}
                    >
                      <FiPlus className="text-[#535353] text-[20px]" />
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
                  <div
                    className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                    onClick={() => {
                      setSplitModal(false);
                      setLabel("");
                      setPrice("");
                      setCategory("");
                      setMode("");
                      setBill("");
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                    onClick={() => {
                      // addToFirebase();
                      mapOverAll();
                      setSplitModal(false);
                    }}
                  >
                    Add
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <></>
      )}
      {/* <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#ffffff] border-none">
        <TopNavbar />
      </div> */}
      <QuickSplitInfo
        willGet={formatAmountWithCommas(amountToGet()?.amount)}
        count={amountToGet()?.count}
        willPay={formatAmountWithCommas(getAmountToPay()?.amount)}
        payCount={getAmountToPay()?.count}
        UIColor={UIColor}
        UIIndex={UIIndex}
      />
      <div className="h-[calc(100%-140px)] w-full bg-[#ffffff] flex justify-start items-center flex-col  text-white pb-[20px] border-none overflow-y-scroll">
        {/* <div className="w-[calc(100%-40px)] border-[.7px] border-[#eff7ff]"></div> */}
        {/* <span className="text-[#828282] font-[google] font-normal text-[14px] w-full mt-[20px] flex justify-between h-[30px] items-start px-[20px] ">
          <div className="flex justify-start items-center">
            Split Transaction History,{" "}
            <span className=" ml-[4px]">
              {monthNames[new Date().getMonth()]} - {new Date().getFullYear()}
            </span>
          </div>
          <div
            className="w-[30px] h-full flex justify-end items-center text-black text-[14px]"
            onClick={() => {
              // setShowFilterModal(!showFilterModal);
            }}
          >
            <FaFilter />
          </div>
        </span> */}
        <span className="text-[#00000057] font-[google]  font-normal text-[14px] w-full  flex justify-between h-[50px] items-center px-[20px] ">
          <div className="flex justify-start items-center">
            {/* Transaction History,{" "} */}
            <span
              className={`ml-[0px] text-[14px] text-[black] cursor-pointer flex justify-start items-center px-[11px]  h-full rounded-xl  py-[7px] pl-[11px] bg-[${UIColor}]`}
              style={{ backgroundColor: `${UIColor}` }}
              onClick={() => {
                // setChooseMonth(true);
              }}
            >
              Split History
              {/* <MdKeyboardArrowDown className="text-[21px]" /> */}
            </span>
          </div>

          <div
            className="w-[30px] h-full flex justify-end items-center text-black text-[14px] -rotate-90"
            onClick={() => {
              // setShowFilterModal(!showFilterModal);
            }}
          >
            {/* <FaFilter /> */}
            <svg
              className=""
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bar-chart-2"
            >
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
          </div>
        </span>

        <div className="w-full flex flex-col justify-start items-center">
          {finalTransaction?.map((data, index) => {
            return (
              <>
                <SplitTransaction
                  setPopUp={setPopUp}
                  data={data}
                  index={index}
                  setEdit={setEdit}
                  edit={edit}
                  setSelectedTran={setSelectedTran}
                  selectedTran={selectedTran}
                  UIColor={UIColor}
                  UIIndex={UIIndex}
                />
              </>
            );
          })}
        </div>

        {/* <SplitTransaction
          name={"Aminia - Chicken Roll Party"}
          amount={2345}
          date={"23 May, 2024"}
          member={14}
          return={false}
          status={true}
        />
        <SplitTransaction
          name={"Trip to Ladakh"}
          amount={2345}
          date={"23 May, 2024"}
          member={14}
          return={false}
          status={true}
        />
        <SplitTransaction
          name={"Taxi Fare to Jay Bangla"}
          amount={2345}
          date={"23 May, 2024"}
          member={14}
          return={false}
          status={true}
        /> */}
      </div>
      <div className="w-full h-[140px]  fixed right-[0px] top-[0px] flex justify-center items-center">
        <div
          className={
            "w-[40px] h-[40px] rounded-2xl bg-[#F4F5F7] flex justify-center items-center" +
            (edit ? " text-[#e61d0f]" : " text-[black]")
          }
          onClick={() => {
            if (edit) {
              setDeleteConfirmModal(true);
            } else {
              setSplitModal(true);
            }
          }}
        >
          {/* <FiPlus className="text-black text-[20px]" /> */}
          {edit ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-plus"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </>
          )}
        </div>
      </div>
      {popUp ? (
        <>
          <div
            className="fixed w-full h-[60px] z-40 bottom-[10px] font-[google] font-normal flex justify-center items-center text-white "
            style={{ transition: ".4s" }}
          >
            <div
              className="bg-[#191A2C] rounded-2xl h-[50px] flex justify-center items-center px-[20px] w-[140px] whitespace-nowrap"
              style={{ transition: ".4s" }}
            >
              {edit ? (
                <span style={{ transition: ".2s", transitionDelay: ".2s" }}>
                  Edit Mode ON
                </span>
              ) : (
                <span style={{ transition: ".2s", transitionDelay: ".2s" }}>
                  Edit Mode OF
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="fixed  h-[60px] z-40 bottom-[10px] mb-[-80px] w-[30px] font-[google] font-normal flex justify-center items-center text-white  "
            style={{ transition: ".4s" }}
          >
            <div
              className="bg-[#191A2C] rounded-2xl h-[0px]  flex justify-center items-center px-[20px] w-[0px]"
              style={{ transition: ".4s" }}
            >
              {/* {edit ? <>Edit Mode ON</> : <>Edit Mode OF</>} */}
            </div>
          </div>
        </>
      )}
      {deleteConfirmModal ? (
        <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-30 font-[google] font-normal">
          <div
            className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm"
            // style={{ transition: ".3s" }}
          >
            {deleteInProcess ? (
              <div className="w-full h-full flex justify-center items-center">
                <l-mirage size="60" speed="2.5" color="#191A2C"></l-mirage>
              </div>
            ) : delSuccess ? (
              <div className="w-full h-full flex justify-center items-center text-[18px]">
                Delete Successful
              </div>
            ) : (
              <>
                <span className="text-[22px] ">Delete Transaction History</span>
                <span className="text-[14.5px] mt-[5px] text-[#000000a9]">
                  All selected split transaction history and associated media
                  files will be permanently deleted and cannot be recovered. Are
                  you sure you want to proceed ?
                </span>
                <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                  <div
                    className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#F4F5F7]"
                    onClick={() => {
                      setDeleteConfirmModal(false);
                    }}
                  >
                    Close
                  </div>
                  <div
                    className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                    onClick={() => {
                      setDeleteInProcess(true);
                      deleteSplitTransaction();
                      setTimeout(() => {
                        setDeleteInProcess(false);
                        setDelSuccess(true);
                        setTimeout(() => {
                          setDelSuccess(false);
                          setDeleteConfirmModal(false);
                        }, 1000);
                      }, 1500);
                    }}
                  >
                    Delete
                  </div>
                </div>
              </>
            )}
          </div>

          {/* </div> */}
        </div>
      ) : (
        <></>
      )}

      {edit ? (
        <div
          className="w-[50px] h-[40px] whitespace-nowrap rounded-2xl left-[20px] bottom-[60px] fixed flex justify-center items-center bg-[#191A2C] text-[white] font-[google] font-normal text-[16px] "
          style={{ transition: ".4s" }}
          onClick={() => {
            setSelectedTran([]);
            setEdit(false);
            setPopUp(true);
            setTimeout(() => {
              setPopUp(false);
            }, 1500);
          }}
        >
          <span
            className="opacity-100"
            style={{ transition: ".2s", transitionDelay: ".2s" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-door-open"
            >
              <path d="M13 4h3a2 2 0 0 1 2 2v14" />
              <path d="M2 20h3" />
              <path d="M13 20h9" />
              <path d="M10 12v.01" />
              <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
            </svg>
          </span>
        </div>
      ) : (
        <div
          className="w-0 h-0 rounded-2xl left-[20px] bottom-[80px] fixed flex justify-center items-center bg-[#191A2C] text-[white] font-[google] font-normal text-[16px] ml-[-100px] "
          style={{ transition: ".4s" }}
        >
          <span
            className="opacity-0"
            style={{ transition: ".2s", transitionDelay: ".2s" }}
          >
            {/* Exit Edit Mode */}
          </span>
        </div>
      )}
    </>
  );
};

export default SplitExpense;
