import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import { useState } from "react";
import BottomNavbar from "./components/BottomNavbar";
import SplitExpense from "./components/SplitExpense";
import UsageGraph from "./components/UsageGraph";
import AuthDetails from "./components/AuthDetails";

function App() {
  return (
    <div className="w-full h-[100svh]">
      {/* <div className="w-full h-[calc(100%-60px)] flex flex-col justify-center items-center ">
         <LandingPage /> 

        {segment === 1 ? (
          <HomePage />
        ) : segment === 2 ? (
          <>
            <UsageGraph />
          </>
        ) : segment === 3 ? (
          <></>
        ) : (
          <SplitExpense />
        )}
      </div>
      <BottomNavbar segment={segment} setSegment={setSegment} /> */}
      <AuthDetails />
    </div>
  );
}

export default App;
