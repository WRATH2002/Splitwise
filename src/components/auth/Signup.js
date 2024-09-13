import React from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { toggleStateMode } from "../../utils/chatSlice";
// import toast, { Toaster } from "react-hot-toast";

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { db } from "../firebase";
// import firebase from "../../firebase";

const Signup = (props) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("false");
  const [error, setError] = useState("");
  // const dispatch = useDispatch();

  //   function createFirestoreAccount() {
  //     const user = firebase.auth().currentUser;

  //     if (chatMessage.length != 0) {
  //       const user = firebase.auth().currentUser;
  //       if (user) {
  //         const userDoc = db
  //           .collection("users")
  //           .doc(user.uid)
  //           .collection("Chat Segment")
  //           .doc(toggleCreateNewChatInput);

  //         console.log("userDoc");
  //         console.log(userDoc);
  //         userDoc.get().then((doc) => {
  //           if (doc.exists) {
  //             console.log("Document available");
  //           } else {
  //             // db.collection("users")
  //             //   .doc(user.uid)
  //             //   .collection("Chat Segment")
  //             //   .doc("test 1")
  //             //   .set({
  //             //     uid: [{ user: "Question", assistant: "Answer", id: 1 }],
  //             //   });
  //             // doc.data() will be undefined in this case
  //             console.log("No such document");
  //           }
  //         });

  //         userDoc.update({
  //           uid: firebase.firestore.FieldValue.arrayUnion({
  //             user: chatMessage[chatMessage.length - 1].user,
  //             assistant: chatMessage[chatMessage.length - 1].assistant,
  //             id: chatMessage[chatMessage.length - 1].id,
  //           }),
  //         });
  //       }
  //     }
  //   }

  function CamalCaseName() {
    let words = name.split(" ");

    // Iterate through each word in the array
    for (let i = 0; i < words.length; i++) {
      // Capitalize the first character of the word and make the rest lowercase
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Join the words back together into a single string
    // return words.join(" ");
    // searchUserFriend(words.join(" "));
    // updateUserName(words.join(" "));
    return words.join(" ");
  }

  function getMonth() {
    const date = new Date();
    return date.getMonth();
  }

  function createUserCollection(user) {
    db.collection("Expense")
      .doc(user.uid)
      .set({
        Name: CamalCaseName(),
        Email: email,
        Phone: number,
        // Info: "Hi folks! I am new to infinity.",
        Photo: "nophoto",
        TotalIncome: 0,
        Budget: 0,
        MonthlyExpense: 0,
        CurrentExpenseMonth: getMonth(),
        NormalTransaction: [],
        SplitTransaction: [],
        Reminders: [],
        CategoryBudget: [],
        MonthlyData: [],
        Tutorial: true,
        MonthlyReminder: false,
        DueReminder: false,
        NotePreviewBlur: false,
        Theme: "#f6f6f6",
        SecondaryTheme: "#484848",
        StartDate:
          new Date().getDate() +
          "/" +
          (parseInt(new Date().getMonth()) + 1) +
          "/" +
          new Date().getFullYear(),
        TripPlan: [],
      });
    console.log("done");
  }
  const signUp = (e) => {
    const letterPattern = /[a-zA-Z]/;
    e.preventDefault();
    if (name.length === 0) {
      setError("Name can't be empty");
    } else if (letterPattern.test(number)) {
      setError("Number must contain only digits");
    } else if (number.length < 10 || number.length > 10) {
      setError("Number must be 10 digits");
    } else if (email.length === 0 || !email.includes("@gmail.com")) {
      setError("Email must contain '@gmail.com'");
    } else if (password.length < 8) {
      setError("Password should be atleast 8 characters");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential.user.uid);
          console.log(userCredential.user.email);
          console.log(userCredential);
          createUserCollection(userCredential.user);
          // db.collection("Chat Record")
          //   .doc(userCredential.user.uid)
          //   .collection("Chats");
        })
        .catch((error) => {
          console.log(error.message);
          setError("Oops! Email already in use");
        });
    }
  };
  // function changeModeTwo() {
  //   dispatch(toggleStateMode(1));
  // }

  return (
    <>
      <div className="w-full lg:w-[350px] md:w-[350px] p-[20px] rounded-none md:rounded-xl lg:rounded-xl h-[100svh] md:h-[70%] lg:h-[70%]  flex flex-col justify-center items-center">
        <div className="w-full flex flex-col">
          <span className="text-[50px] tracking-wide text-[black] font-[gaia] font-bold  b2">
            Signup{" "}
          </span>
          <span className="text-[16px] mt-[-10px] font-normal text-[#000000] font-[geist] ">
            already a user ?
            <span
              className="text-[#5C80E2] hover:text-[#5C80E2] cursor-pointer  font-normal"
              style={{ transition: ".3s" }}
              // onClick={() => changeModeTwo()}
              onClick={() => props?.change(1)}
            >
              {" "}
              login here
            </span>
          </span>
        </div>
        {/* <div>Signup</div> */}
        <input
          className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px] mb-[10px] rounded-xl px-[15px] font-normal mt-[20px] text-[black] bg-transparent z-0"
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]   rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0 mt-[10px]"
          placeholder="Phone Number"
          type="tel"
          value={number}
          onKeyDown={(e) => {
            console.log(e);
            if (e.key == "Backspace") {
              if (number.length == 10) {
                setNumber(number.slice(0, -1));
              }
            }
          }}
          onChange={(e) => {
            if (number.length <= 9) {
              setNumber(e.target.value);
            } else {
            }
          }}
        ></input>
        <input
          className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]   rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0 mt-[20px]"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        {show === true ? (
          <div className="w-full flex justify-center items-center mt-[20px]">
            <input
              className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]   rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0 "
              placeholder="Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div
              className="w-[50px] h-[45px] ml-[-50px] flex justify-center items-center cursor-pointer z-20"
              onClick={() => {
                setShow(!show);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-eye-off"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center mt-[20px]">
            <input
              className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]   rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0 "
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div
              className="w-[50px] h-[45px] ml-[-50px] flex justify-center items-center cursor-pointer z-20"
              onClick={() => {
                setShow(!show);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-eye"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        )}

        <div className="w-full flex justify-end items-center font-[geist] font-normal mt-[4px] text-[14px] text-[#fc4506]">
          {error}
        </div>

        <div className="w-full flex justify-end">
          <button
            className="px-[20px] h-[45px] text-[16px] text-[#000000] font-[geist] font-medium outline-none flex justify-center items-center bg-[#efefef] hover:bg-[#e1e1e1]  rounded-xl mt-[40px]"
            style={{ transition: ".3s" }}
            type="submit"
            onClick={signUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
