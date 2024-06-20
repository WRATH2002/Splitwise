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
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import Friends, { Profile, ProfileTwo } from "./Friends";
import { RiSearchLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";

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

const SplitExpense = () => {
  const [splitModal, setSplitModal] = useState(false);
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

  const [value, setValue] = useState();

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

  return (
    <>
      {addModal ? (
        <div className="w-[calc(100%-40px)] h-[calc(100svh-40px)] rounded-3xl fixed  bg-[#fff5ee] top-[20px] left-[20px] flex flex-col justify-start items-start py-[30px] text-black z-50">
          {/* <div className=" w-[320px] h-auto p-[30px]   bg-[#212121] rounded-3xl flex flex-col justify-start items-start "> */}
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
                <div className="w-full h-[60px] flex flex-col  justify-center text-[15px] items-center font-[google] font-normal text-[#de8544]">
                  {/* <span>No Users Found</span>
                  <span>Try searching with Full Name</span> */}
                </div>
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
            {/* <div
              className="h-full flex justify-center items-center cursor-pointer  mr-[30px]"
              onClick={() => {
                // setPersonName("");
                // setAddModal(false);
              }}
            >
              Cancel
            </div> */}
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
          {/* </div> */}
        </div>
      ) : (
        <></>
      )}
      {splitModal === true ? (
        <div className="w-full h-[100svh] fixed z-30 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
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
              {/* <div className="flex w-full justify-between h-[50px] items-center mt-[10px]"></div> */}

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
                  {/* <BiRupee /> */}
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
                {/* <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                  <span className="p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md w-[80px] h-[80px] border border-[#ffd8be] bg-[#ffddc5] flex justify-center items-center text-[#535353]">
                    <IoMdCloudUpload className="text-[25px]" />{" "}
                    <span className="ml-[10px]">Upload Photo</span>
                  </span>
                </div> */}
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
        </div>
      ) : (
        <></>
      )}
      <div className="pt-[20px] w-full h-[60px] flex justify-center items-center bg-[#ffffff] border-none">
        <TopNavbar />
      </div>
      <div className="h-[calc(100%-60px)] w-full bg-[#ffffff] flex justify-start items-center flex-col  text-white pb-[20px] border-none">
        <QuickSplitInfo
          willGet={formatAmountWithCommas(amountToGet()?.amount)}
          count={amountToGet()?.count}
          willPay={formatAmountWithCommas(getAmountToPay()?.amount)}
          payCount={getAmountToPay()?.count}
        />
        <div className="w-[calc(100%-40px)] border-[.7px] border-[#eff7ff]"></div>
        <span className="text-[#828282] font-[google] font-normal text-[14px] w-full mt-[20px] flex justify-between h-[30px] items-start px-[20px] ">
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
        </span>

        <div className="w-full flex flex-col justify-start items-center">
          {finalTransaction?.map((data) => {
            return (
              <>
                <SplitTransaction data={data} />
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
      <div
        className="w-[40px] h-[40px] rounded-full bg-[#98d832] fixed right-[20px] bottom-[70px] flex justify-center items-center"
        onClick={() => {
          setSplitModal(true);
        }}
      >
        <FiPlus className="text-black text-[23px]" />
      </div>
    </>
  );
};

export default SplitExpense;
