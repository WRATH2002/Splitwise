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
      <div className="w-full lg:w-[350px] md:w-[350px] p-[40px] rounded-none md:rounded-xl lg:rounded-xl h-[100svh] md:h-[70%] lg:h-[70%]  flex flex-col justify-center items-start">
        {/* <span className="in  font-bold text-[40px] mb-[30px]">INFINITY</span> */}
        <div className="w-full flex flex-col ">
          <span className="text-[40px] text-[#de8544] font-[google] font-bold tracking-wider b2">
            Login{" "}
          </span>
          <span className="text-[15px] font-normal text-[#000000] font-[google] ">
            new user ?
            <span
              className="text-[#de8544] hover:text-[#de8544] cursor-pointer  font-normal"
              style={{ transition: ".3s" }}
              onClick={() => props?.change(2)}
            >
              {" "}
              signup here
            </span>
          </span>
        </div>
        {/* <div>Signup</div> */}
        {/* <input
          className="outline-none  mt-[40px]  w-full h-[40px] my-[6px] rounded-md px-[15px] font-normal text-[14px] text-black bg-[#cdd8dd]"
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input> */}
        {/* <input
          className="outline-none    w-full h-[40px] my-[6px] rounded-md px-[15px] font-normal text-[14px] text-black bg-[#cdd8dd]"
          placeholder="Phone Number"
          type="tel"
          value={number}
          onChange={(e) => {
            if (number.length <= 10) {
              setNumber(e.target.value);
            } else {
            }
          }}
        ></input> */}
        <div
          className={
            " w-auto px-[5px] ml-[10px]  rounded-md flex justify-start items-center bg-transparent    font-[google] font-normal  mt-[40px] " +
            (email?.length === 0
              ? " h-[45px] mb-[-45px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
              : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
          }
          style={{ transition: ".4s" }}
        >
          Email
        </div>
        <input
          className="outline-none outline-0 select-none font-[google] border border-[#ffd8be]  text-[16px] w-full h-[45px] mb-[10px] rounded-md px-[15px] font-normal  text-[black] bg-transparent z-40"
          // placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        ></input>

        {show === true ? (
          <div className="w-full flex flex-col justify-center items-start">
            <div
              className={
                " w-auto px-[5px] ml-[10px]  rounded-md flex justify-start items-center bg-transparent    font-[google] font-normal  mt-[40px] " +
                (password?.length === 0
                  ? " h-[45px] mb-[-45px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                  : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
              }
              style={{ transition: ".4s" }}
            >
              Password
            </div>
            <div className="w-full h-[45px] flex justify-start items-center">
              <input
                className=" outline-none outline-0 select-none font-[google] border border-[#ffd8be]  text-[16px] w-full h-[45px] mb-[10px] rounded-md px-[15px] font-normal  text-[black] bg-transparent z-40"
                // placeholder="Password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              ></input>
              <div
                className="w-[50px] h-[50px] ml-[-50px] flex justify-center items-center"
                onClick={() => {
                  setShow(!show);
                }}
              >
                <IoEyeOff className="text-[#000000] text-[20px]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-start">
            <div
              className={
                " w-auto px-[5px] ml-[10px]  rounded-md flex justify-start items-center bg-transparent    font-[google] font-normal  mt-[40px] " +
                (password?.length === 0
                  ? " h-[45px] mb-[-45px] z-30 border border-transparent text-[#8b8b8b] text-[15px]"
                  : " h-[1px] mb-[-1px] z-50 border border-[#fff5ee] text-[#de8544] text-[14px]")
              }
              style={{ transition: ".4s" }}
            >
              Password
            </div>
            <input
              className="outline-none outline-0 select-none font-[google] border border-[#ffd8be]  text-[16px] w-full h-[45px] mb-[10px] rounded-md px-[15px] font-normal  text-[black] bg-transparent z-40"
              // placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            ></input>
            <div
              className="w-[50px] h-[50px] ml-[-50px] flex justify-center items-center"
              onClick={() => {
                setShow(!show);
              }}
            >
              <IoEye className="text-[#000000] text-[20px]" />
            </div>
          </div>
        )}
        {/* <div className=" font-[google] mt-[5px] bg  text-[15px] w-full h-[10px] my-[10px] flex justify-end items-center rounded-xl  font-normal  text-[#ffffff] ">
          forgot password ?
        </div> */}
        {/* <button
          type="submit"
          onClick={signUp}
          className="bg-slate-600 text-white w-[100px]"
        >
          Signup
        </button> */}
        {/* <div className=" font-[google] mt-[20px] bg  text-[15px] w-full h-[10px]  flex justify-start items-center rounded-xl  font-normal  text-[#ff483f] ">
          * forgot password ?
        </div> */}
        <div className="w-full flex justify-end items-center font-[google] font-normal mt-0 text-[15px] text-[#fc4506]">
          {error}
        </div>
        <button
          className="w-full h-[50px] text-[17px] text-[#000000] font-[google] font-medium outline-none flex justify-center items-center bg-[#96df73]  rounded-2xl mt-[15px]"
          style={{ transition: ".3s" }}
          type="submit"
          onClick={signIn}
        >
          Log In
        </button>
      </div>
      {/* <div className="w-full h-[100vh] flex justify-center items-center bg-[#f1f3f6]">
        <div className="neo w-full lg:w-[350px] md:w-[350px] h-[100vh] lg:h-[600px] md:h-[600px] flex flex-col justify-center items-center rounded-xl px-[30px]">
          <div className="w-full h-[100px] flex justify-center items-center ">
            <span className="font-semibold text-[26px] mt-[70px]">
              INFINITY
            </span>
          </div>
          <div className="w-full h-[350px] flex justify-center items-center flex-col">
            <input
              className="neo w-full h-[50px] rounded-lg my-[10px] px-[15px] outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              className="neo w-full h-[50px] rounded-lg my-[10px] px-[15px] outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <span className="w-full h-[20px] mb-[10px] px-[15px] text-[13px] flex justify-end items-center ">
              Forgot password
            </span>
            <button className="neoout w-full h-[50px] rounded-lg my-[10px] px-[15px] bg-[#5193f2] text-white">
              LOGIN
            </button>
          </div>
          <div className="w-full h-[150px]  flex justify-center items-center flex-col pb-[80px]">
            <span>Login With</span>
            <div className="flex justify-center items-center ">
              <div>
                <BiLogoFacebook />
              </div>
              <div>
                <BiLogoTwitter />
              </div>
              <div>
                <BiLogoInstagram />
              </div>
              <div>
                <BiLogoGoogle />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Login;
