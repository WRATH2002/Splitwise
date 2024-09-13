import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
// import { db } from "../firebase";
import { db } from "../firebase";
// import firebase from "../firebase";
import { WiStars } from "react-icons/wi";
import { onSnapshot } from "firebase/firestore";
import firebase from "../firebase";
import HomePage from "./HomePage";
import UsageGraph from "./UsageGraph";
import SplitExpense from "./SplitExpense";
import LandingPage from "./LandingPage";
import BottomNavbar from "./BottomNavbar";
import Settings from "./Settings";
import TopNavbar from "./TopNavbar";
import ReminderPage from "./ReminderPage";
import Tutorial from "./Tutorial";
import AiTripPlanner from "./AiTripPlanner";
import Test from "./Test";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const [tutorialMode, setTutorialMode] = useState("");
  const [budget, setBudget] = useState(0);
  const [newBudget, setNewBudget] = useState(0);
  const [income, setIncome] = useState(0);
  useEffect(() => {}, []);

  function fetchSplitTransaction() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setTutorialMode(snapshot?.data()?.Tutorial);
      setBudget(snapshot?.data()?.Budget);
      setIncome(snapshot?.data()?.TotalIncome);
    });
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        fetchSplitTransaction();
      } else setAuthUser(null);
    });
    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };

  const [segment, setSegment] = useState(1);

  return (
    <div className="w-full h-[100svh] flex-col flex select-none">
      {authUser ? (
        <>
          {tutorialMode ? (
            <Tutorial
              setSegment={setSegment}
              segment={segment}
              budget={budget}
              income={income}
            />
          ) : (
            <>{/* <Tutorial setSegment={setSegment} segment={segment} /> */}</>
          )}

          {/* <div className="w-full h-[100svh]"> */}
          <div className="w-full h-[calc(100svh-60px)] flex flex-col justify-center items-center ">
            {/* <LandingPage /> */}

            {segment === 1 ? (
              <HomePage />
            ) : segment === 2 ? (
              <>
                {/* <UsageGraph /> */}
                <AiTripPlanner />
              </>
            ) : segment === 3 ? (
              <>
                <ReminderPage />
              </>
            ) : segment === 4 ? (
              <>
                {/* <TopNavbar /> */}
                <SplitExpense />
              </>
            ) : (
              <>
                <Settings setSegment={setSegment} segment={segment} />
              </>
            )}
          </div>
          <BottomNavbar segment={segment} setSegment={setSegment} />
          {/* </div> */}
        </>
      ) : (
        <>
          <div className="w-full h-[100%] flex flex-col justify-center items-center ">
            <LandingPage />
            {/* <Test /> */}
          </div>
          {/* <BottomNavbar segment={segment} setSegment={setSegment} /> */}
        </>
      )}
    </div>
  );
};

export default AuthDetails;
