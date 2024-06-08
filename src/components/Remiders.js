import React, { useState } from "react";
import { BiRupee } from "react-icons/bi";
import { GoAlertFill } from "react-icons/go";
import { HiCheck } from "react-icons/hi";

const RemiderCard = (props) => {
  const [aprroveModal, setApproveModal] = useState(false);
  return (
    <>
      {aprroveModal ? (
        <div className="w-full h-[100svh] fixed z-50 bg-[#68686871] top-0 left-0 flex justify-center items-center backdrop-blur-md">
          <div className="w-[320px] h-auto p-[30px] py-[23px] bg-[#fff5ee] rounded-3xl flex flex-col justify-center items-start">
            <span className="w-full text-[22px] text-black font-[google] font-normal flex justify-start items-center ">
              Confirm{" "}
              <span className="text-[#de8544] ml-[10px]">Transaction</span>
            </span>

            <span className="w-full text-[14px] text-[#000000] font-[google] font-normal flex justify-center items-start whitespace-pre-wrap mt-[5px]  ">
              Have you done this transaction already. If you dismiss this
              reminder, you will not be notified later. Do you really want to
              dismiss this reminder ?
            </span>

            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center mt-[10px]">
              <span className="mr-[5px] text-[#000000]">Label :</span>{" "}
              {props?.label}
            </span>
            <span className="w-full text-[14px] text-[#434343b5] font-[google] font-normal flex justify-start items-center ">
              <span className="mr-[5px] text-[#000000]">Amount :</span>{" "}
              <BiRupee /> {props?.amount}
            </span>

            <div className="w-full flex justify-end items-end font-[google] font-normal text-[15px] text-black h-[20px] mt-[20px]">
              <div
                className="h-full mr-[20px] flex justify-center items-center cursor-pointer  "
                onClick={() => {
                  setApproveModal(false);
                  // setNewIncome("");
                  // setError("");
                }}
              >
                Cancel
              </div>
              <div
                className="h-full  flex justify-center items-center text-[#de8544] cursor-pointer "
                onClick={() => {
                  // updateIncome();
                  setApproveModal(false);
                }}
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-[250px] h-full bg-[#ffddc5] rounded-2xl flex font-[google] justify-center items-center font-normal ml-[10px]">
        <div className="w-[50px] h-full flex flex-col justify-center items-center">
          <div className="text-[12px] text-[#000000]">{props?.month}</div>
          <div className="text-black text-[20px] ">{props?.date}</div>
        </div>
        <div className="w-[150px] h-full bg-[#ffeadc] flex flex-col justify-center items-start px-[10px] ">
          <div className="text-[14px] leading-[19px] text-[#6a6a6a] line-clamp-2 w-full overflow-hidden text-ellipsis">
            {props?.label}
          </div>
          <div className="text-black text-[17px] w-full flex justify-start items-center ">
            <BiRupee className="ml-[-3px]" /> {props?.amount}
          </div>
        </div>
        <div className="w-[50px] h-full bg-[#ffeadc] flex flex-col justify-center items-center rounded-r-2xl">
          <div className="text-[13px] text-[#000000]">2 days</div>
          <div
            className="text-white w-[30px] h-[30px] bg-[#de8544] mt-[5px] rounded-full text-[20px] flex justify-center items-center cursor-pointer"
            onClick={() => {
              setApproveModal(true);
            }}
          >
            <HiCheck />
          </div>
        </div>
      </div>
    </>
  );
};

const Remiders = () => {
  return (
    <>
      {/* <div className="w-full h-[130px] "> */}
      <div className="w-full h-[110px] flex overflow-x-scroll items-center pt-[10px]  px-[10px] pr-[20px]">
        <RemiderCard
          date={"19"}
          month={"Apr"}
          amount={"2000.00"}
          label={"To pay, Himadri Purkait (Lent)"}
        />
        <RemiderCard
          date={"24"}
          month={"May"}
          amount={"24200.00"}
          label={"Home Loan"}
        />
        <RemiderCard
          date={"09"}
          month={"June"}
          amount={"279.00"}
          label={"Home Rent & Maintanance Fee, Mom Dad Money Transfer"}
        />
      </div>
      {/* </div> */}
    </>
  );
};

export default Remiders;
