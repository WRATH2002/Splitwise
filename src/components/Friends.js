import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";

export const Profile = (props) => {
  function remove() {
    if (props?.addedMember.includes(props?.data)) {
      props?.setAddedMember(
        props?.addedMember?.filter((data) => data != props?.data)
      );
    } else {
      props?.setAddedMember((prevMembers) => [
        ...prevMembers,
        props?.data?.UserID,
      ]);
    }
  }
  return (
    <>
      <div
        className="min-w-[45px] aspect-square rounded-full bg-[#ffddc5] mr-[15px] cursor-pointer"
        onClick={() => {
          remove();
        }}
      ></div>
    </>
  );
};

export const ProfileTwo = (props) => {
  return (
    <>
      <div className="min-w-[40px] mb-[10px] aspect-square rounded-full bg-[#ffddc5] mr-[10px]"></div>
    </>
  );
};

const Friends = (props) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    updateIncome();
  }, []);

  function updateIncome() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(props?.data?.UserID);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setName(snapshot?.data()?.Name);
      setNumber(snapshot?.data()?.Phone);
    });
  }

  function addOrRemoveElement() {
    if (props?.addedMember.includes(props?.data?.UserID)) {
      props?.setAddedMember(
        props?.addedMember?.filter((data) => data != props?.data?.UserID)
      );
      // (props?.data?.UserID);
    } else {
      props?.setAddedMember((prevMembers) => [
        ...prevMembers,
        props?.data?.UserID,
      ]);
    }
  }

  return (
    <div
      className="w-full h-[60px] flex  justify-start items-center font-[google] font-normal text-[17px] border-b-[.7px] border-[#ffede2] cursor-pointer"
      onClick={() => {
        addOrRemoveElement();
      }}
    >
      <div className="w-[45px] aspect-square rounded-full bg-[#ffddc5]"></div>
      <div className="ml-[15px] flex flex-col justify-center items-start">
        <span>{name}</span>
        <span className="text-[13px] mt-[0px] text-[#828282]">8100524419</span>
      </div>
    </div>
  );
};

export default Friends;
