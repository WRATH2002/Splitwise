import React, { useState } from "react";

const Day = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const Calenderr = (props) => {
  const [calYear, setCalYear] = useState(parseInt(props?.value.split("/")[2]));
  const [calMonth, setCalMonth] = useState(
    parseInt(props?.value.split("/")[1])
  );

  function getCalendarDetails(calMonth, calYear) {
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay();

    const totalDays = new Date(calYear, calMonth, 0).getDate();

    return {
      start: firstDay,
      days: totalDays,
    };
  }

  return (
    <div
      className="w-full h-auto flex justify-start mt-[26px] items-center font-[google] text-[14px] z-[80]"
      style={{ zIndex: "200" }}
    >
      <div
        className={
          "flex flex-wrap justify-start items-start max-w-[253px] p-[11px] rounded-2xl drop-shadow-sm pt-[18px] "
        }
        style={{ backgroundColor: `${props?.UIColor}`, zIndex: "100" }}
      >
        <div className="w-[231px] flex justify-between items-center mb-[6px]">
          <div
            className="w-[27px] h-[27px]  m-[3px] rounded-[11px]  flex justify-center items-center hover:bg-[#ffffff] cursor-pointer"
            onClick={() => {
              if (calMonth - 1 > 0) {
                setCalMonth(calMonth - 1);
              }
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
              class="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <div className="px-[13px] border border-[#efefef] py-[4px] rounded-2xl bg-white">
            {months[calMonth - 1]}
            {/* , {new Date().getFullYear()} */}
          </div>
          <div
            className="w-[27px] h-[27px]  m-[3px] rounded-[11px]  flex justify-center items-center hover:bg-[#ffffff] cursor-pointer"
            onClick={() => {
              console.log("Clicking");
              console.log(calMonth);

              if (calMonth + 1 < 13) {
                console.log("INside clicking should increase");
                console.log(calMonth);

                setCalMonth(calMonth + 1);
              }
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
              class="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
        {Day?.map((data, index) => {
          return (
            <div
              className="w-[27px] h-[27px] flex justify-center items-center font-[google] m-[3px]  "
              key={index}
            >
              {data}
            </div>
          );
        })}
        {Array(getCalendarDetails(calMonth, calYear)?.start)
          .fill("")
          .map((data) => {
            return (
              <>
                <div
                  className={"w-[27px] h-[27px]  m-[3px] rounded-full"}
                ></div>
              </>
            );
          })}

        {Array(getCalendarDetails(calMonth, calYear)?.days)
          .fill("")
          .map((data, index) => {
            return (
              <>
                <div
                  className={
                    "w-[27px] h-[27px]  m-[3px] rounded-[11px]  flex justify-center items-center hover:bg-[#ffffff] cursor-pointer" +
                    (index + 1 == props?.value.split("/")[0] &&
                    calMonth == props?.value.split("/")[1]
                      ? " text-white"
                      : " text-black")
                  }
                  style={{
                    backgroundColor:
                      index + 1 == props?.value.split("/")[0] &&
                      calMonth == props?.value.split("/")[1]
                        ? `${props?.UIIndex}`
                        : ``,
                    zIndex: "100",
                    // transition: ".1s",
                  }}
                  onClick={() => {
                    props?.setValue(
                      parseInt(index + 1) + "/" + calMonth + "/" + calYear
                    );
                    props?.setDateModal(false);
                  }}

                  // style={{  }}
                >
                  {index + 1}
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Calenderr;
