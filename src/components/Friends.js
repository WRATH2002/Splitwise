import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
// rgS

export const Profile = (props) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    updateIncome();
  }, []);

  function updateIncome() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(props?.data);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setName(snapshot?.data()?.Name);
      setNumber(snapshot?.data()?.Phone);
      setPhoto(snapshot?.data()?.Photo);
    });
  }

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
      {firebase.auth().currentUser?.uid == props?.data ? (
        <></>
      ) : (
        <>
          <div
            className="min-w-[45px] flex justify-center items-center aspect-square rounded-full bg-[#8088a8] text-[white] mr-[15px] cursor-pointer"
            onClick={() => {
              remove();
            }}
          >
            <span className="font-bold">
              {name?.split(" ")[0]?.charAt(0)}
              {name?.split(" ")[1]?.charAt(0)}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export const ProfileTwo = (props) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    updateIncome();
  }, []);

  function updateIncome() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(props?.data);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      setName(snapshot?.data()?.Name);
      setNumber(snapshot?.data()?.Phone);
      setPhoto(snapshot?.data()?.Photo);
    });
  }
  return (
    <>
      {firebase.auth().currentUser?.uid == props?.data ? (
        <></>
      ) : (
        <>
          <div className="min-w-[45px] flex justify-center items-center mb-[10px] aspect-square rounded-full bg-[#8088a8] text-[white] mr-[10px]">
            <span className="font-bold">
              {name?.split(" ")[0]?.charAt(0)}
              {name?.split(" ")[1]?.charAt(0)}
            </span>
          </div>
        </>
      )}
    </>
  );
};

const Friends = (props) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [photo, setPhoto] = useState("");

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
      setPhoto(snapshot?.data()?.Photo);
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
      className={
        "w-full h-[60px] flex  justify-start items-center font-[google] font-normal text-[17px]  cursor-pointer" +
        (props?.index == props?.count - 1
          ? " border-b-[.7px] border-[#ffede200]"
          : " border-b-[.7px] border-[#F5F6FA]")
      }
      onClick={() => {
        addOrRemoveElement();
      }}
    >
      <div className="w-[45px] aspect-square rounded-full bg-[#F5F6FA] flex justify-center items-center">
        <span className="font-bold">
          {name?.split(" ")[0]?.charAt(0)}
          {name?.split(" ")[1]?.charAt(0)}
        </span>
      </div>
      <div className="ml-[15px] flex flex-col justify-center items-start">
        <span>{name}</span>
        <span className="text-[13px] mt-[0px] text-[#999999]">{number}</span>
      </div>
    </div>
  );
};

export default Friends;
