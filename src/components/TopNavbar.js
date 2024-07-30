import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";

const TopNavbar = () => {
  const [userName, setUserName] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  function getFirstName(name) {
    if (!name) return ""; // Return an empty string if the input is null, undefined, or empty
    return name.split(" ")[0]; // Split the string by spaces and return the first element
  }

  function fetchUser() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setUserName(getFirstName(snapshot?.data()?.Name));
      setPhoto(snapshot?.data()?.Photo);
      // console.log(snapshot?.data()?.Online);
    });
  }

  return (
    <div className="w-full h-[40px] flex justify-between items-center px-[20px]">
      <div className="flex justify-start items-center">
        <div className="w-[40px] aspect-square  rounded-full flex justify-center items-center text-[22px] text-[#000000] bg-[#ebebf5] font-[google]  ">
          {photo === "nophoto" ? <>{userName.trim().charAt(0)}</> : <></>}
        </div>{" "}
        <span className=" ml-[10px] font-[google] font-normal text-[22px] text-[#6f6f6f]">
          Hi !{" "}
        </span>{" "}
        <span className="font-[google] font-normal text-[22px] text-black ml-[8px]">
          {userName}
        </span>{" "}
      </div>
    </div>
  );
};

export default TopNavbar;
