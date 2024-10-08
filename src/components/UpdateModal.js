import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
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
const UpdateModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(false);
  const [subError, setSubError] = useState(false);
  const [data, setData] = useState("");
  const [pass, setPass] = useState("");
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [PINRequired, setPINRequired] = useState(false);
  const [PINCode, setPINCode] = useState(false);
  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  function updateName() {
    const user = firebase.auth().currentUser;
    db.collection("Expense").doc(user.uid).update({
      Name: data,
    });
    setData("");
    setActive(false);
    setPass("");
    if (props?.PINRequired) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }
  function updateBudget() {
    const user = firebase.auth().currentUser;
    db.collection("Expense").doc(user.uid).update({
      Budget: data,
    });
    setData("");
    setActive(false);
    setPass("");
    if (props?.PINRequired) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }
  function updateIncome() {
    const user = firebase.auth().currentUser;
    db.collection("Expense").doc(user.uid).update({
      TotalIncome: data,
    });
    setData("");
    setActive(false);
    setPass("");
    if (props?.PINRequired) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }

  function fetchTheme() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setPINRequired(snapshot?.data()?.PINRequired);
      setPINCode(snapshot?.data()?.PIN);
    });
  }

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    if (props?.PINRequired) {
      if (pass.length == 4) {
        if (pass == props?.PINCode) {
          setToggle(true);
        } else {
          setToggle(false);
          setActive(true);
        }
      }
    }
  }, [pass]);

  useEffect(() => {
    console.log("props?.PINRequired");
    console.log(props?.PINRequired);
    if (props?.PINRequired == false) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [props?.PINRequired]);

  return (
    <>
      {props?.modal ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-40 font-[google] font-normal">
            <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              {subLoading ? (
                <>
                  <div className="w-full h-full flex justify-center items-center text-[18px]">
                    <div className="mr-[10px] w-[25px] h-[25px] text-white rounded-full bg-[#191A2C] flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    {props?.topic === "Name" ? (
                      <>Name Updated</>
                    ) : props?.topic === "Budget" ? (
                      <>Budget Updated</>
                    ) : props?.topic === "Income" ? (
                      <>Income Updated</>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[22px] ">
                    {props?.topic === "Name" ? (
                      <>Update Name</>
                    ) : props?.topic === "Budget" ? (
                      <>Update Budget</>
                    ) : props?.topic === "Income" ? (
                      <>Update Income</>
                    ) : (
                      <></>
                    )}
                  </span>
                  <span className="text-[14.5px] mt-[5px] text-[#000000a9]">
                    {props?.topic === "Name" ? (
                      <>
                        This name will be visible to your friends and searchable
                        by others. Please choose wisely.
                      </>
                    ) : props?.topic === "Budget" ? (
                      <>
                        Enter your new Budget. The new Budget should be{" "}
                        <span className="text-black">
                          greater than 0 and less than your Income
                        </span>
                        .
                      </>
                    ) : props?.topic === "Income" ? (
                      <>Enter your current Income below.</>
                    ) : (
                      <></>
                    )}
                  </span>

                  {/* ----------------------------------------------------- */}
                  {toggle == false ? (
                    <>
                      <div className="w-full flex justify-center items-center my-[20px] h-auto text-[18px] mb-[-70px] z-50 ">
                        <input
                          className="bg-transparent text-transparent caret-transparent outline-none border-none h-[50px] rounded-2xl w-[200px] px-[15px]"
                          value={pass}
                          onChange={(e) => {
                            // console.log(e.target.value);
                            // console.log(e);
                            if (
                              e.nativeEvent.inputType == "deleteContentBackward"
                            ) {
                              setPass(e.target.value);
                            } else if (pass.length < 4) {
                              setPass(e.target.value);
                            }
                            setActive(false);
                          }}
                        ></input>
                      </div>
                      <div className="w-full flex justify-center items-center my-[20px] h-auto text-[20px]">
                        {" "}
                        <div
                          className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
                          style={{
                            backgroundColor: `${props?.UIColor} `,
                            border: active
                              ? " 2px solid #bc0000"
                              : pass.length == 0
                              ? `2px solid ${props?.UIIndex}`
                              : "2px solid transparent",
                          }}
                        >
                          {pass[0]}
                        </div>
                        <div
                          className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
                          style={{
                            backgroundColor: `${props?.UIColor} `,
                            border: active
                              ? " 2px solid #bc0000"
                              : pass.length == 1
                              ? `2px solid ${props?.UIIndex}`
                              : "2px solid transparent",
                          }}
                        >
                          {pass[1]}
                        </div>
                        <div
                          className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
                          style={{
                            backgroundColor: `${props?.UIColor} `,
                            border: active
                              ? " 2px solid #bc0000"
                              : pass.length == 2
                              ? `2px solid ${props?.UIIndex}`
                              : "2px solid transparent",
                          }}
                        >
                          {pass[2]}
                        </div>
                        <div
                          className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
                          style={{
                            backgroundColor: `${props?.UIColor} `,
                            border: active
                              ? " 2px solid #bc0000"
                              : pass.length == 3
                              ? `2px solid ${props?.UIIndex}`
                              : "2px solid transparent",
                          }}
                        >
                          {pass[3]}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-auto flex justify-start items-center mt-[20px] mb-[20px] ">
                        <input
                          className={
                            "w-full h-[50px] rounded-xl  px-[15px] flex justify-start items-center text-[16px] outline-none" +
                            (subError
                              ? " border border-[#e61d0f] bg-[#e61d0f17]"
                              : ` bg-[${props?.UIColor}] border-none`)
                          }
                          style={{ backgroundColor: `${props?.UIColor} ` }}
                          placeholder={
                            props?.topic === "Name"
                              ? "Enter Name"
                              : props?.topic === "Budget"
                              ? "Enter Budget"
                              : props?.topic === "Income"
                              ? "Enter Income"
                              : ""
                          }
                          value={data}
                          onChange={(e) => {
                            if (
                              props?.topic === "Budget" ||
                              props?.topic === "Income"
                            ) {
                              if (isNumeric(e.target.value) === true) {
                                if (props?.topic === "Budget") {
                                  if (
                                    Number(e.target.value) <
                                    parseInt(props?.income)
                                  ) {
                                    setSubError(false);
                                    setData(e.target.value);
                                  } else {
                                    setSubError(true);
                                  }
                                } else {
                                  setData(e.target.value);
                                }
                              }
                            } else {
                              setData(e.target.value);
                            }
                          }}
                        ></input>
                      </div>
                    </>
                  )}

                  {/* ----------------------------------------------------- */}

                  <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                    <div
                      className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] z bg-[${props?.UIColor}]`}
                      style={{ backgroundColor: `${props?.UIColor} ` }}
                      onClick={() => {
                        props?.setModal(false);
                        props?.setTopic("");
                        setData("");
                        setSubError(false);
                        setActive(false);
                        setPass("");
                        if (props?.PINRequired) {
                          setToggle(false);
                        } else {
                          setToggle(true);
                        }
                      }}
                    >
                      Close
                    </div>
                    <div
                      className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                      onClick={() => {
                        if (props?.topic == "Budget") {
                          if (Number(data) == 0) {
                            setSubError(true);
                          } else {
                            setSubLoading(true);

                            setTimeout(() => {
                              updateBudget();

                              setSubLoading(false);
                              props?.setModal(false);
                              props?.setTopic("");

                              setSubError(false);
                            }, 1200);
                          }
                        } else if (data.length > 0) {
                          setSubLoading(true);

                          setTimeout(() => {
                            if (props?.topic == "Name") {
                              updateName();
                            } else if (props?.topic == "Budget") {
                              updateBudget();
                            } else if (props?.topic == "Income") {
                              updateIncome();
                            }

                            setSubLoading(false);
                            props?.setModal(false);
                            props?.setTopic("");

                            setSubError(false);
                          }, 1200);
                        }
                      }}
                    >
                      Update
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
    </>
  );
};

export const SavingsModal = (props) => {
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

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  return (
    <>
      {props?.savingsModal ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-40 font-[google] font-normal">
            <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              {props?.data?.length == 0 ? (
                <>
                  <span className="text-[22px]">No Transactions Done Yet</span>
                  <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                    Make some transactions to Track your Savings
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[22px] ">
                    Monthly Savings for {new Date().getFullYear()}
                  </span>
                  <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                    {props?.data?.map((data, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="w-full h-[30px] flex justify-between items-center"
                          >
                            <span>
                              {monthNames[data?.Month - 1]} (x
                              {data?.TransactionCount})
                            </span>
                            <span className="flex justify-end items-center">
                              <div className="mr-[2px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="13"
                                  height="13"
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
                              {formatAmountWithCommas(data?.Savings)}
                            </span>
                          </div>
                        </>
                      );
                    })}
                  </span>
                  <div className="w-full h-0 border-[.8px] border-[#0000004d] border-dashed rounded-full my-[10px]"></div>
                  <div className="w-full text-[14.5px] h-[30px] flex justify-between items-center">
                    <span>Total Savings</span>
                    <span className="flex justify-end items-center">
                      <div className="mr-[2px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
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
                      {formatAmountWithCommas(
                        props?.data?.reduce((acc, data) => {
                          acc = acc + parseInt(data?.Savings);
                          return acc;
                        }, 0)
                      )}
                    </span>
                  </div>
                </>
              )}

              <div className="w-full h-auto flex justify-start items-center mt-[10px] mb-[10px] "></div>
              <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] text-white"
                  onClick={() => {
                    props?.setSavingsModal(false);
                  }}
                >
                  Close
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export const LogoutModal = (props) => {
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };
  return (
    <>
      {props?.logoutModal ? (
        <>
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-40 font-[google] font-normal">
            <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              <span className="text-[22px] ">Log Out</span>
              <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                Are you sure you want to log out ?
              </span>

              <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                <div
                  className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
                  onClick={() => {
                    props?.setLogoutModal(false);
                  }}
                  style={{ backgroundColor: `${props?.UIColor} ` }}
                >
                  Close
                </div>
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    props?.setLogoutModal(false);
                    userSignOut();
                  }}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export const SetPIN = (props) => {
  const [pass, setPass] = useState("");
  const [active, setActive] = useState(false);
  function updatePIN() {
    const user = firebase.auth().currentUser;
    if (props?.PINRequired) {
      if (pass == props?.PINCode) {
        db.collection("Expense").doc(user.uid).update({
          PINRequired: false,
          PIN: "",
        });
        props?.setBtn5(false);
      } else {
        setActive(true);
      }
    } else {
      db.collection("Expense").doc(user.uid).update({
        PINRequired: true,
        PIN: pass,
      });
      props?.setBtn5(false);
    }
    // setData("");
  }
  return (
    <>
      <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-end p-[20px] z-40 font-[google] font-normal">
        <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
          <span className="text-[22px] ">
            {props?.PINRequired ? <>Remove PIN</> : <>Set PIN</>}{" "}
          </span>
          <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
            This PIN will be required to do any updates.
          </span>
          <div className="w-full flex justify-center items-center my-[20px] h-auto text-[18px] mb-[-70px] z-50 ">
            <input
              className="bg-transparent text-transparent caret-transparent outline-none border-none h-[50px] rounded-2xl w-[200px] px-[15px]"
              value={pass}
              onChange={(e) => {
                // console.log(e.target.value);
                // console.log(e);
                if (e.nativeEvent.inputType == "deleteContentBackward") {
                  setPass(e.target.value);
                } else if (pass.length < 4) {
                  setPass(e.target.value);
                }
                setActive(false);
              }}
            ></input>
          </div>
          <div className="w-full flex justify-center items-center my-[20px] h-auto text-[20px]">
            {" "}
            <div
              className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
              style={{
                backgroundColor: `${props?.UIColor} `,
                border: active
                  ? " 2px solid #bc0000"
                  : pass.length == 0
                  ? `2px solid ${props?.UIIndex}`
                  : "2px solid transparent",
              }}
            >
              {pass[0]}
            </div>
            <div
              className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
              style={{
                backgroundColor: `${props?.UIColor} `,
                border: active
                  ? " 2px solid #bc0000"
                  : pass.length == 1
                  ? `2px solid ${props?.UIIndex}`
                  : "2px solid transparent",
              }}
            >
              {pass[1]}
            </div>
            <div
              className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
              style={{
                backgroundColor: `${props?.UIColor} `,
                border: active
                  ? " 2px solid #bc0000"
                  : pass.length == 2
                  ? `2px solid ${props?.UIIndex}`
                  : "2px solid transparent",
              }}
            >
              {pass[2]}
            </div>
            <div
              className="mx-[5px] h-[50px] rounded-2xl w-[40px] px-[15px] flex justify-center items-center"
              style={{
                backgroundColor: `${props?.UIColor} `,
                border: active
                  ? " 2px solid #bc0000"
                  : pass.length == 3
                  ? `2px solid ${props?.UIIndex}`
                  : "2px solid transparent",
              }}
            >
              {pass[3]}
            </div>
          </div>

          <div className="w-full h-auto mt-[10px] flex justify-end items-end">
            <div
              className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
              onClick={() => {
                props?.setBtn5(false);
              }}
              style={{ backgroundColor: `${props?.UIColor} ` }}
            >
              Close
            </div>
            <div
              className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
              onClick={() => {
                if (pass.length == 4) {
                  updatePIN();
                }
              }}
            >
              Update
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateModal;
