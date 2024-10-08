import React, { useEffect, useState } from "react";
const months = [
  { Month: "Jan", Days: 31 },
  { Month: "Feb", Days: 28 }, // 29 days in a leap year
  { Month: "Mar", Days: 31 },
  { Month: "Apr", Days: 30 },
  { Month: "May", Days: 31 },
  { Month: "June", Days: 30 },
  { Month: "July", Days: 31 },
  { Month: "Aug", Days: 31 },
  { Month: "Sep", Days: 30 },
  { Month: "Oct", Days: 31 },
  { Month: "Nov", Days: 30 },
  { Month: "Dec", Days: 31 },
];
const RedminderDate = (props) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    console.log("props?.tempTransactionHistory from reminder date component");
    console.log(props?.tempTransactionHistory);
  }, [props?.tempTransactionHistory]);

  function isReminderOnDate(day, month) {
    let flag = 0;
    props?.tempTransactionHistory?.map((data) => {
      if (
        data?.Date?.split("/")[0] == day &&
        data?.Date?.split("/")[1] == month
      ) {
        flag = flag + 1;
      }
    });

    return flag;
  }

  function isReminderInCurrMonth(cardDate) {
    let flag = 0;
    props?.tempTransactionHistory?.map((data) => {
      if (
        data?.Date?.split("/")[0] == cardDate &&
        data?.Date?.split("/")[1] == parseInt(new Date().getMonth()) + 1
      ) {
        flag = flag + 1;
      }
    });
    return flag;
  }

  return (
    <div className="w-full h-[85px] flex justify-start items-center font-[google] font-normal px-[20px]">
      {/* {months[parseInt(tempTransactionHistory[0].Date.split("/")[1]) - 1].Day} */}
      <div className="w-full h-full flex justify-start items-center overflow-x-scroll overflow-y-hidden">
        {Array(
          // months[
          //   parseInt(
          //     props?.tempTransactionHistory[0]?.Date?.split("/")[1]
          //   ) - 1
          // ]?.Days -
          //   parseInt(
          //     props?.tempTransactionHistory[0]?.Date?.split("/")[0]
          //   ) +
          //   1
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).getDate() -
            new Date().getDate() +
            1
        )
          ?.fill(
            // parseInt(props?.tempTransactionHistory[0]?.Date?.split("/")[0])
            new Date().getDate()
          )
          ?.map((data, index) => {
            return (
              <div
                className={
                  " h-full rounded-2xl flex justify-start items-center border border-[#efefef] bg-[#f9f9f9] " +
                  (index > 0 ? " ml-[10px]" : " ml-[0px]") +
                  (activeIndex == data + index
                    ? " min-w-[100px]"
                    : " min-w-[60px]")
                }
                style={{
                  // backgroundColor: `${props?.UIColor}`,
                  transition: ".3s",
                }}
                // style={{ transition: ".3s" }}
                onClick={() => {
                  if (activeIndex == data + index) {
                    setActiveIndex(-1);
                  } else {
                    setActiveIndex(data + index);
                  }
                }}
              >
                <div className="min-w-[60px] h-full flex justify-center items-center flex-col">
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <span className="text-[12px] text-[#000000c3] ">
                      {months[parseInt(new Date().getMonth())].Month}
                    </span>
                    <span className="text-[20px] text-[#000000] mt-[-3px]">
                      {data + index}
                    </span>
                  </div>
                  <div className="w-full h-full mt-[-85px] flex  justify-center items-end  text-[#00e1ff]">
                    {isReminderInCurrMonth(data + index) > 0 ? (
                      <>
                        {data + index < parseInt(new Date().getDate()) ? (
                          <>
                            {Array(isReminderInCurrMonth(data + index))
                              ?.fill("")
                              ?.map((data) => {
                                return (
                                  <span class="relative flex h-[7px] w-[7px] mx-[2px] mb-[6px]">
                                    <span
                                      class={
                                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#fd5b2a]"
                                      }
                                    ></span>
                                    <span
                                      class={
                                        "relative inline-flex rounded-full h-[7px] w-[7px] bg-[#fd5b2a]"
                                      }
                                    ></span>
                                  </span>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {Array(isReminderInCurrMonth(data + index))
                              ?.fill("")
                              ?.map((data) => {
                                return (
                                  <span class="relative flex h-[7px] w-[7px] mx-[2px] mb-[6px]">
                                    <span
                                      class={
                                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#83d91b]"
                                      }
                                    ></span>
                                    <span
                                      class={
                                        "relative inline-flex rounded-full h-[7px] w-[7px] bg-[#83d91b]"
                                      }
                                    ></span>
                                  </span>
                                );
                              })}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                {activeIndex == data + index ? (
                  <>
                    <div
                      className="w-[40px] h-full flex justify-start items-center opacity-100"
                      style={{ transition: ".2s", transitionDelay: ".2s" }}
                    >
                      <div
                        className="w-[25px] h-[25px] rounded-[10px] flex justify-center items-center text-white "
                        style={{ backgroundColor: `#191A2C` }}
                        onClick={() => {
                          props?.setReminderDate(
                            (data + index).toString() +
                              "/" +
                              (new Date().getMonth() + 1).toString() +
                              "/" +
                              new Date().getFullYear().toString()
                          );
                          props?.setAddModal(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-plus"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[40px] h-full flex justify-start items-center opacity-0 text-white">
                      <div
                        className="w-[25px] h-[25px] rounded-[10px] flex justify-center items-center "
                        style={{ backgroundColor: `#191A2C` }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-plus"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>

      {/* <div className="w-[55px] h-full rounded-[20px] flex flex-col justify-center items-center bg-[#191A2C] ml-[10px]">
        <span className="text-[12px] text-[white] ">July</span>
        <span className="text-[20px] text-[white] ">13</span>
      </div>
      <div className="w-[55px] h-full rounded-[20px] flex flex-col justify-center items-center bg-[#191A2C] ml-[10px]">
        <span className="text-[12px] text-[white] ">July</span>
        <span className="text-[20px] text-[white] ">14</span>
      </div>
      <div className="w-[55px] h-full rounded-[20px] flex flex-col justify-center items-center bg-[#191A2C] ml-[10px]">
        <span className="text-[12px] text-[white] ">July</span>
        <span className="text-[20px] text-[white] ">15</span>
      </div>
      <div className="w-[55px] h-full rounded-[20px] flex flex-col justify-center items-center bg-[#191A2C] ml-[10px]">
        <span className="text-[12px] text-[white] ">July</span>
        <span className="text-[20px] text-[white] ">16</span>
      </div> */}
    </div>
  );
};
export default RedminderDate;
