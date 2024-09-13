import React from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { useState } from "react";
// --------------------Icons----------------
import { BiLogoFacebook } from "react-icons/bi";
import { BiLogoTwitter } from "react-icons/bi";
import { BiLogoInstagram } from "react-icons/bi";
import { BiLogoGoogle } from "react-icons/bi";
// import { useDispatch } from "react-redux";
// import { toggleStateMode } from "../../utils/chatSlice";
// import toast, { Toaster } from "react-hot-toast";

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("false");
  const [error, setError] = useState("");

  // const dispatch = useDispatch();

  const signIn = (e) => {
    e.preventDefault();
    if (!email.includes("@gmail.com")) {
      setError("Email must contain '@gmail.com'");
    } else if (password.length < 8) {
      setError("Password should be atleast 8 characters");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          // toast.error("Invalid Login Credentials");
          console.log(error);
          setError("Oops! Invalid Login Credentials");
          // toast.error(error.message);
          // console.log(error);
          // console.log(error.message);
        });
    }
  };
  // function changeMode() {
  //   dispatch(toggleStateMode(2));
  // }
  return (
    <>
      <div className="w-full lg:w-[350px] md:w-[350px] p-[20px] rounded-none md:rounded-xl lg:rounded-xl h-[100svh] md:h-[70%] lg:h-[70%]  flex flex-col justify-center items-start">
        {/* <span className="in  font-bold text-[40px] mb-[30px]">INFINITY</span> */}
        <div className="w-full flex flex-col ">
          <span className="text-[50px] tracking-wide text-[black] font-[gaia] font-bold b2 ">
            Login{" "}
          </span>
          <span className="text-[16px] mt-[-10px] font-normal text-[#000000] font-[geist] ">
            new user ?
            <span
              className="text-[#5C80E2] hover:text-[#5C80E2] cursor-pointer  font-normal"
              style={{ transition: ".3s" }}
              onClick={() => props?.change(2)}
            >
              {" "}
              signup here
            </span>
          </span>
        </div>

        <input
          className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px] mb-[10px] rounded-xl px-[15px] font-normal mt-[20px] text-[black] bg-transparent z-0"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        ></input>

        {show === true ? (
          <div className="w-full flex mt-[10px] justify-center items-start">
            <div className="w-full h-[45px] flex justify-start items-center">
              <input
                className=" outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]   rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0"
                placeholder="Password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              ></input>
              <div
                className="w-[50px] h-[45px] ml-[-50px] flex justify-center items-center cursor-pointer z-20"
                onClick={() => {
                  setShow(!show);
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
                  class="lucide lucide-eye-off"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex mt-[10px] justify-center items-start">
            <input
              className="outline-none outline-0 select-none font-[geist] border border-[#efefef]  text-[16px] w-full h-[45px]  rounded-xl px-[15px] font-normal  text-[black] bg-transparent z-0"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            ></input>
            <div
              className="w-[50px] h-[45px] ml-[-50px] flex justify-center items-center cursor-pointer z-20"
              onClick={() => {
                setShow(!show);
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
                class="lucide lucide-eye"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        )}

        <div className="w-full flex justify-end items-center font-[geist] font-normal mt-[4px] text-[14px] text-[#fc4506]">
          {error}
        </div>
        <div className="w-full flex justify-end">
          <button
            className="px-[20px] h-[45px] text-[16px] text-[#000000] font-[geist] font-medium outline-none flex justify-center items-center bg-[#efefef] hover:bg-[#e1e1e1]  rounded-xl mt-[40px]"
            style={{ transition: ".3s" }}
            type="submit"
            onClick={signIn}
          >
            Log In
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
