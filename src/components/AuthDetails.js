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

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
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
          {/* <div className="w-full h-[100svh]"> */}
          <div className="w-full h-[calc(100svh-60px)] flex flex-col justify-center items-center ">
            {/* <LandingPage /> */}

            {segment === 1 ? (
              <HomePage />
            ) : segment === 2 ? (
              <>
                <UsageGraph />
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
                <Settings />
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
          </div>
          {/* <BottomNavbar segment={segment} setSegment={setSegment} /> */}
        </>
      )}
    </div>
  );
};

export default AuthDetails;
