import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import IndependentTransaction from "./IndependentTransaction";
import AddIndependentTransaction from "./AddIndependentTransaction";
import HomePage from "./HomePage";
import bg from "../assets/img/bg1.png";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { Typewriter } from "react-simple-typewriter";

const LandingPage = () => {
  const [subPageNo, setSubPageNo] = useState(1);
  const [mode, setMode] = useState(1);
  const [changePage, setChangePage] = useState(false);
  const [fontChange, setFontChange] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setFontChange(!fontChange);
  //   }, 2700);
  // }, [fontChange]);
  return (
    <>
      {changePage ? (
        <div className="w-full h-full bg-[#fff5ee] flex flex-col justify-between items-center p-[30px] py-[30px]">
          {mode === 1 ? (
            <Login change={setMode} />
          ) : (
            <Signup change={setMode} />
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-[#fff5ee] flex flex-col justify-between items-start p-[30px] py-[70px] text-black">
          {/* <img src={bg} className="w-full "></img> */}
          {/* SPLITWISE */}

          <span
            className={
              " text-[50px] w-full flex h-[900px] justify-center items-center text-[#de8544]" +
              (fontChange ? " font-[wakanda]" : " font-[google]")
            }
          >
            {/* <Typewriter
              words={["SPLITWISE", "splitwise"]}
              loop={40}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={100}
              delaySpeed={1000}
            /> */}
            SPLITWISE
          </span>
          <div className="flex flex-col w-full ">
            <div className="w-[90%]">
              {subPageNo === 1 ? (
                <>
                  <span className="font-[google] font-normal text-[30px] text-[#de8544] leading-[30px]">
                    <span className="text-black">welcome</span> to your world of
                    financial growth
                  </span>
                </>
              ) : subPageNo === 2 ? (
                <>
                  <span className="font-[google] font-normal text-[30px] text-[#de8544] leading-[30px]">
                    <span className="text-black">easy</span> money management
                  </span>
                </>
              ) : (
                <>
                  <span className="font-[google] font-normal text-[30px] text-[#de8544] leading-[30px] flex flex-col">
                    <span className="text-black blackspace-nowrap">
                      set reminders
                    </span>
                    <span className="">& pay later</span>
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-between w-full h-[40px] items-center mt-[35px]">
              <div className="flex justify-start items-center ">
                {subPageNo === 1 ? (
                  <>
                    <div className="font-[google] font-normal text-[30px] bg-[#de8544] w-[35px] h-[10px] rounded-full "></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(2);
                      }}
                    ></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(3);
                      }}
                    ></div>
                  </>
                ) : subPageNo === 2 ? (
                  <>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full "
                      onClick={() => {
                        setSubPageNo(1);
                      }}
                    ></div>
                    <div className="font-[google] font-normal text-[30px] bg-[#de8544] w-[35px] h-[10px] rounded-full ml-[8px]"></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(3);
                      }}
                    ></div>
                  </>
                ) : (
                  <>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full "
                      onClick={() => {
                        setSubPageNo(1);
                      }}
                    ></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#de8544] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(2);
                      }}
                    ></div>
                    <div className="font-[google] font-normal text-[30px] bg-[#de8544] w-[35px] h-[10px] rounded-full ml-[8px]"></div>
                  </>
                )}
              </div>

              {subPageNo === 3 ? (
                <div
                  className="w-[35px] h-[35px] rounded-full bg-[#de8544] flex justify-center items-center  text-[15px] text-[white] font-[google] font-normal  "
                  onClick={() => {
                    // if (subPageNo < 3) {
                    setChangePage(true);
                    // }
                  }}
                >
                  Go
                </div>
              ) : (
                <div
                  className="w-[35px] h-[35px] rounded-full bg-[#de8544] flex justify-center items-center  text-[18px] text-[black] font-[google] font-normal  "
                  onClick={() => {
                    if (subPageNo < 3) {
                      setSubPageNo(subPageNo + 1);
                    }
                  }}
                >
                  <FiArrowRight className="text-[24px] text-white" />
                </div>
              )}
            </div>
          </div>
          {/* <HomePage /> */}
        </div>
      )}
    </>
  );
};

export default LandingPage;
