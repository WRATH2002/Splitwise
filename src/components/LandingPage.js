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
        <div className="w-full h-full bg-[#ffffff] flex flex-col justify-center items-center p-[30px] py-[30px]">
          {mode === 1 ? (
            <Login change={setMode} />
          ) : (
            <Signup change={setMode} />
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-[#ffffff] flex flex-col justify-between items-start p-[30px] py-[70px] text-black">
          {/* <img src={bg} className="w-full "></img> */}
          {/* SPLITWISE */}

          <span
            className={
              " text-[80px] w-full flex h-[900px] flex-col justify-center items-center text-[#181F32] tracking-wide" +
              (fontChange ? " font-[gaia]" : " font-[google]")
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
            splitwise
            <span className="text-[16px] font-[500] bg-gradient-to-r  from-[#4E83EF] to-[#D36779] bg-clip-text  text-transparent font-[google] tracking-normal ml-[12px] mt-[-38px] flex items-center">
              powered by AI{" "}
              <div className="ml-[3px] text-[#D36779]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-sparkles"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                </svg>
              </div>
            </span>
            <span className="text-[53px] font-[500] bg-gradient-to-b mt-[0px]  from-[#181F32] from-[70%] to-[#181f326b] bg-clip-text  text-transparent tracking-normal font-[dolla]">
              Split, Track, Relax
            </span>
          </span>

          <div className="flex flex-col w-full ">
            <div className="w-[90%]">
              {subPageNo === 1 ? (
                <>
                  <span className="font-[google] font-normal text-[30px]  leading-[30px]  bg-gradient-to-r from-[#4E83EF] to-[#D36779]  bg-clip-text text-transparent">
                    <span className="text-black">welcome</span> to your world of
                    financial growth
                  </span>
                </>
              ) : subPageNo === 2 ? (
                <>
                  <span className="font-[google] font-normal text-[30px]  leading-[30px]  bg-gradient-to-r from-[#4E83EF] to-[#D36779] bg-clip-text text-transparent">
                    <span className="text-black">easy</span> money management
                  </span>
                </>
              ) : (
                <>
                  <span className="font-[google] font-normal text-[30px]  leading-[30px] flex flex-col  ">
                    <span className="text-black blackspace-nowrap">
                      set{" "}
                      <span className="bg-gradient-to-r from-[#4E83EF] to-[#D36779] bg-clip-text text-transparent ml-[3px]">
                        reminders
                      </span>
                    </span>
                    <span className="bg-gradient-to-r from-[#4E83EF] to-[#D36779] bg-clip-text text-transparent ml-[3px]">
                      & pay later
                    </span>
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-between w-full h-[40px] items-center mt-[35px]">
              <div className="flex justify-start items-center ">
                {subPageNo === 1 ? (
                  <>
                    <div className="font-[google] font-normal text-[30px] bg-[#181F32] w-[35px] h-[10px] rounded-full "></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(2);
                      }}
                    ></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(3);
                      }}
                    ></div>
                  </>
                ) : subPageNo === 2 ? (
                  <>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full "
                      onClick={() => {
                        setSubPageNo(1);
                      }}
                    ></div>
                    <div className="font-[google] font-normal text-[30px] bg-[#181F32] w-[35px] h-[10px] rounded-full ml-[8px]"></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(3);
                      }}
                    ></div>
                  </>
                ) : (
                  <>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full "
                      onClick={() => {
                        setSubPageNo(1);
                      }}
                    ></div>
                    <div
                      className="font-[google] font-normal text-[30px] border-[1.5px] border-[#181F32] w-[10px] h-[10px] rounded-full ml-[8px]"
                      onClick={() => {
                        setSubPageNo(2);
                      }}
                    ></div>
                    <div className="font-[google] font-normal text-[30px] bg-[#181F32] w-[35px] h-[10px] rounded-full ml-[8px]"></div>
                  </>
                )}
              </div>

              {subPageNo === 3 ? (
                <div
                  className="w-[35px] h-[35px] rounded-full bg-[#181F32] cursor-pointer flex justify-center items-center  text-[15px] text-[white] font-[google] font-normal  "
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
                  className="w-[35px] h-[35px] rounded-full bg-[#181F32] cursor-pointer flex justify-center items-center  text-[18px] text-[black] font-[google] font-normal  "
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
