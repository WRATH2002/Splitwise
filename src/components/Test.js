import React, { useState } from "react";

const Test = () => {
  const [expand, setExpand] = useState(false);
  return (
    <div className="w-full h-[100svh] flex justify-center items-end bg-gray-200 font-[geist] px-[20px] pb-[20px]">
      <button
        className="fixed top-0 bg-black text-white p-[10px] rounded-lg"
        onClick={() => {
          setExpand(!expand);
        }}
      >
        toggle
      </button>

      <div
        className={
          "  rounded-3xl bg-[#ffffff] flex justify-center items-center p-[30px]" +
          (expand
            ? " mt-[0px] opacity-100 rubberAnimate"
            : " mt-[200px] w-[150px] h-[50px] opacity-0")
        }
        style={{ transition: ".3s" }}
      >
        <div
          className={
            " rounded-3xl flex flex-col justify-center items-start " +
            (expand ? " opacity-100 rubberAnimate2" : " opacity-0")
          }
          //   style={{ transitionDelay: " .2s" }}
        >
          <span className="text-[18px]">Hello There</span>
          <span>HOw are you, nice to meet you ?</span>
        </div>
      </div>
    </div>
  );
};

export default Test;
