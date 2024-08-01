// import { Datepicker } from "flowbite-datepicker";
import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import {
  FaAngleRight,
  FaCloudUploadAlt,
  FaPlus,
  FaShopify,
} from "react-icons/fa";
import { CgMathPlus } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";
import { GoChevronRight } from "react-icons/go";
import { IoCalendar, IoCalendarClear, IoFastFood } from "react-icons/io5";
// import Datepicker from "tailwind-datepicker-react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/colors/teal.css";
import Button from "react-multi-date-picker/components/button";
import { IoMdCloudUpload } from "react-icons/io";
import { Label } from "recharts";
import { HiReceiptRefund, HiShoppingBag } from "react-icons/hi2";
import { FaTruckMedical } from "react-icons/fa6";
import { GiAutoRepair, GiPartyPopper } from "react-icons/gi";
import {
  MdElectricBolt,
  MdOutlineAirplanemodeActive,
  MdOutlineInsertPhoto,
  MdOutlinePets,
  MdSchool,
} from "react-icons/md";
import { BsFillFuelPumpFill, BsTaxiFrontFill } from "react-icons/bs";
import { PiSealQuestionFill } from "react-icons/pi";
import { HiOutlinePlus } from "react-icons/hi";
import { storage } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import loadImage from "blueimp-load-image";
import { jelly } from "ldrs";
import { squircle } from "ldrs";
import { SmallSizeIcon } from "./NornmalSizeIcon";
squircle.register();
jelly.register();

const options = {
  title: "Demo Title",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-gray-700 dark:bg-gray-800",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "bg-red-500",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
  disabledDates: [],
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const categoryName = [
  "Car Maintanance",
  "Education",
  "Electricity Bill",
  "Entertainment",
  "Food & Drinks",
  "Grocery",
  "Medical",
  "Others",
  "Pet Care",
  "Petrol / Diesel",
  "Shopping",
  "Taxi Fare",
  "Travel",
];

const paymentName = ["Online UPI", "Credit/Debit Card", "Cash"];

const AddIndependentTransaction = () => {
  const [addNewTransaction, setAddNewTransaction] = useState(false);
  const [subSection, setSubSection] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [member, setMember] = useState("");
  const [preDate, setPreDate] = useState(0);
  const [mode, setMode] = useState("");
  const [bill, setBill] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [paymentDropdown, setCPaymentDropdown] = useState(false);

  // --------------------------------------

  const [image, setImage] = useState();
  const [imageError, setImageError] = useState(false);
  const [textArray, setTextArray] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  function Image(e) {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    // setImageLength(e.target.files.length);
  }

  const uploadImageGetUrl = async (fileRef) => {
    var geturl = await uploadBytes(fileRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("Uploade Image URL");
        console.log(url);
        setBill(url);
      });
    });
    return geturl;
  };

  const uploadImage = async () => {
    const user = firebase.auth().currentUser;
    let date = new Date();
    let today =
      date.getDate() + (parseInt(date.getMonth()) + 1) + date.getFullYear();
    const fileRef = ref(storage, `image/${today}/${image.name}`);
    const myPromise = uploadImageGetUrl(fileRef);
    if (myPromise) {
      console.log("Uploading");
    } else {
      console.log("Not Uploaded");
    }
    // toast.promise(
    //   myPromise,
    //   {
    //     loading: "Sending Image",
    //     success: "Image Sent",
    //     error: "Error",
    //   },
    //   {
    //     style: {
    //       backgroundColor: "#333333",
    //       color: "#fff",
    //       font: "work",
    //       fontWeight: "400",
    //     },
    //   }
    // );
  };

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(image);
    });
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: image.type,
      },
    };
  }

  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `process image: return data as:
Label,date(DD/MM/YYYY),price,category(Shopping,Grocery,Food & Drinks,Medical,Entertainment,Electricity Bill,Petrol / Diesel,Travel,Taxi Fare,Car Maintanance,Education,Pet Care,Others),payment mode(Online UPI,Credit/Debit Card,Cash),bill id
if data not found for field:NotFound
if no data for any field:isReciept:false
no spaces,quotations,brackets
only return data containing 6 fields if no data is found then only one field`;

    const fileInputEl = document.querySelector("input[type=file]");
    const imageParts = await Promise.all(
      [...fileInputEl.files].map(fileToGenerativePart)
    );

    const resultt = await model.generateContent([prompt, ...imageParts]);
    const response = await resultt.response;
    const textt = response.text();
    console.log(textt);
    if (textt.includes("isReciept:false")) {
      // setTextArray(textt?.split(":"));
      setTextArray(["false"]);
    } else {
      setTextArray(textt?.split(","));
    }
  }

  // useEffect(() => {
  //   const currentDate = new Date();
  //   setPreDate(currentDate.getDate());
  //   console.log(value?.day + "/" + value?.month?.number + "/" + value?.year);
  // }, []);

  const [value, setValue] = useState(
    new Date().getDate() +
      "/" +
      parseInt(parseInt(new Date().getMonth()) + 1) +
      "/" +
      new Date().getFullYear()
  );

  function addToFirebase() {
    const user = firebase.auth().currentUser;
    if (value.length == undefined) {
      db.collection("Expense")
        .doc(user.uid)
        .update({
          NormalTransaction: arrayUnion({
            Lable: label,
            Date: value?.day + "/" + value?.month?.number + "/" + value?.year,
            Amount: price,
            TransactionType: "Single",
            Members: "0",
            Category: category,
            Mode: mode,
            BillUrl: bill,
          }),
        });
    } else {
      db.collection("Expense")
        .doc(user.uid)
        .update({
          NormalTransaction: arrayUnion({
            Lable: label,
            Date: value,
            Amount: price,
            TransactionType: "Single",
            Members: "0",
            Category: category,
            Mode: mode,
            BillUrl: bill,
          }),
        });
    }

    setLabel("");
    setPrice("");
    setCategory("");
    setMode("");
    setBill("");
  }

  // const [show, setShow] = useState < boolean > false;
  // const handleChange = () => {
  //   console.log(selectedDate);
  // };
  // const handleClose = () => {
  //   setShow(!state);
  // };
  // let [value, setValue] = useState(new Date());

  useEffect(() => {
    console.log(value);
    console.log(value.length);
  }, [value]);

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    if (str === "") return true;
    return /^[0-9]+(\.[0-9]*)?$/.test(str);
  }

  // const apiKey = "K84132563288957"; // Replace with your OCR.space API key

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // const resizeImage = (file) => {
  //   return new Promise((resolve, reject) => {
  //     loadImage(
  //       file,
  //       (canvas) => {
  //         let quality = 0.9; // Start with high quality
  //         const checkSize = () => {
  //           canvas.toBlob(
  //             (blob) => {
  //               if (blob.size < 1048576 || quality <= 0.1) {
  //                 // Create a new File object from the blob
  //                 const resizedFile = new File([blob], file.name, {
  //                   type: "image/jpeg",
  //                 });
  //                 resolve(resizedFile);
  //               } else {
  //                 quality -= 0.1; // Reduce quality
  //                 checkSize();
  //               }
  //             },
  //             "image/jpeg",
  //             quality
  //           );
  //         };
  //         checkSize();
  //       },
  //       { maxWidth: 1024, maxHeight: 1024, canvas: true }
  //     );
  //   });
  // };

  // const handleOCR = async () => {
  //   if (!image) return;
  //   setLoading(true);

  //   let imageToProcess = image;

  //   if (image.size >= 1048576) {
  //     // 1 MB in bytes
  //     try {
  //       imageToProcess = await resizeImage(image);
  //     } catch (error) {
  //       console.error("Error resizing image:", error);
  //       setText("Error: Unable to resize the image.");
  //       setLoading(false);
  //       return;
  //     }
  //   }

  //   const formData = new FormData();
  //   formData.append("apikey", apiKey);
  //   formData.append("language", "eng"); // You can change the language if needed
  //   formData.append("isOverlayRequired", false);
  //   formData.append("file", imageToProcess);
  //   formData.append("detectOrientation", true);
  //   formData.append("scale", true);
  //   formData.append("isTable", true);

  //   try {
  //     const response = await fetch("https://api.ocr.space/parse/image", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     if (result.IsErroredOnProcessing) {
  //       setText("Error: " + result.ErrorMessage[0]);
  //     } else {
  //       setText(result.ParsedResults[0].ParsedText);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setText("Error: Unable to process the image.");
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (text.length > 0) {
  //     setSubLoading(true);
  //     getImageTextFromGemini();
  //   }
  // }, [text]);

  // useEffect(() => {
  //   setSubLoading(false);
  //   setLoading(false);
  // }, [result]);

  useEffect(() => {
    if (textArray.length > 0) {
      setSubLoading(false);
      setLoading(false);
      setSubSection("manual");

      if (textArray[0] == "false") {
        setImageError(true);
      } else {
        setLabel(textArray[0]);
        setValue(textArray[1]);
        setPrice(textArray[2]);
        setCategory(textArray[3]);
        setMode(textArray[4]);
        //  setBill(textArray[0].split(":")[1]);
        setImage();
      }
    }
  }, [textArray]);

  return (
    <>
      {addNewTransaction === true ? (
        <>
          {subSection.length == 0 ? (
            <>
              <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-center p-[20px] z-30 font-[google] font-normal">
                <div className="w-full h-[230px] flex flex-col justify-center items-start p-[30px] bg-[white] rounded-3xl drop-shadow-sm">
                  {!loading ? (
                    <>
                      <label
                        className="w-full flex items-center h-[140px] border-dashed rounded-3xl opacity-100   cursor-pointer"
                        // style={{ transition: "2s", transitionDelay: ".4s" }}
                        // for="image-file-input"
                      >
                        <div
                          className={
                            "w-full h-full px-[10px] flex flex-col text-[15px] items-center justify-center  border-transparent hover: rounded-md"
                          }
                        >
                          {/* <input
                            id="image-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          ></input> */}
                          {/* <FaCloudUploadAlt className="text-[55px] text-[#cabefb] mr-[8px]" /> */}
                          {/* <img src={phot} className="w-[25px] mr-[8px]"></img> */}
                          {/* <FcImageFile className="text-[24px] mr-[8px]" /> */}
                          <div
                            className="px-[15px] py-[9px] rounded-2xl bg-[#181F32] text-[#ffffff] flex justify-center items-center"
                            onClick={() => {
                              setSubSection("manual");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="white"
                              stroke="#ffffff"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-between-horizontal-start"
                            >
                              <rect width="13" height="7" x="8" y="3" rx="1" />
                              <path d="m2 9 3 3-3 3" />
                              <rect width="13" height="7" x="8" y="14" rx="1" />
                            </svg>
                            <span className=" ml-[8px]">Enter Manually</span>
                          </div>
                          <div className="w-[200px] border-[.7px] border-[#f1f1f1] h-0 flex justify-center items-center my-[18px]">
                            <div className="px-[5px] py-[5px] flex justify-center items-center bg-white">
                              or
                            </div>
                          </div>

                          <div
                            className="px-[15px] py-[9px] rounded-2xl bg-[#181F32] text-[#ffffff] flex justify-center items-center"
                            onClick={() => {
                              setSubSection("image");
                            }}
                          >
                            <FaCloudUploadAlt className="text-[25px] text-[#ffffff] mr-[8px]" />
                            Upload Image
                          </div>
                        </div>
                      </label>
                      {/* <span className="mt-[10px] text-[15px] text-[#787878]">
                    * Image must be clear (not blurry)
                  </span>
                  <span className="text-[15px] text-[#787878]">
                    * Image must be properly visible
                  </span> */}
                      {/* <h1>OCR.space Image to Text</h1> */}
                      {/* <input /> */}
                      {/* <div className="flex justify-end items-end w-full h-[30px]  text-[15px]">
                    <button
                      className="w-auto h-auto rounded-2xl whitespace-nowrap"
                      onClick={() => {
                        setImage();
                        setTextArray([]);
                      }}
                      // onClick={handleOCR}
                      // disabled={loading || !image}
                    >
                      Close
                    </button>
                    <button
                      className="w-auto h-auto ml-[25px] rounded-2xl whitespace-nowrap"
                      onClick={() => {
                        if (image) {
                          setLoading(true);
                          setTimeout(() => {
                            setSubLoading(true);
                          }, 1500);
                          run();
                        } else {
                        }
                      }}
                      disabled={loading || !image}
                    >
                      Continue
                    </button>
                  </div> */}
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        {/* <span class="loader"></span> */}

                        <l-jelly
                          size="40"
                          speed="0.9"
                          color="#191A2C"
                        ></l-jelly>
                        <span className="text-[17px] mt-[7px]">
                          {subLoading ? (
                            <>Extracting Data</>
                          ) : (
                            <>Processing Image</>
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  {/* {result != undefined ? ( */}

                  <div className="flex flex-col">
                    {/* <span>
                  {textArray[0].replaceAll('"', "").replaceAll("'", "")}
                </span>
                <span>
                  {
                    textArray[1]
                      .replaceAll('"', "")
                      .replaceAll("'", "")
                      .split(",")[0]
                      .split(":")[1]
                  }
                </span>
                <span>
                  {
                    textArray[2]
                      .replaceAll('"', "")
                      .replaceAll("'", "")
                      .split(",")[0]
                      .split(":")[1]
                  }
                </span> */}

                    {/* <div>
                    isReciept : {parseStringToObject(result)?.isReciept}
                  </div>
                  <div>Label : {parseStringToObject(result)?.Label}</div>
                  <div>Date : {parseStringToObject(result)?.Date}</div>
                  <div>Amount : {parseStringToObject(result)?.Amount}</div>
                  <div>Category {parseStringToObject(result)?.Category}</div>
                  <div>
                    TransactionMode :{" "}
                    {parseStringToObject(result)?.TransactionMode}
                  </div>
                  <div>BillId : {parseStringToObject(result)?.BillId}</div> */}
                    {/* <div>{result}</div>
                  <div>{text}</div> */}
                  </div>
                </div>
              </div>
            </>
          ) : subSection == "image" ? (
            <>
              <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-center p-[20px] z-30 font-[google] font-normal">
                <div className="w-full h-[230px] flex flex-col justify-center items-start p-[30px] bg-[white] rounded-3xl drop-shadow-sm">
                  {!loading ? (
                    <>
                      <label
                        className="w-full flex items-center h-[140px] border-dashed rounded-3xl opacity-100   cursor-pointer"
                        // style={{ transition: "2s", transitionDelay: ".4s" }}
                        for="image-file-input"
                      >
                        <div
                          className={
                            "w-full h-full px-[10px] flex flex-col text-[15px] items-center justify-center  border-transparent hover: rounded-md"
                          }
                        >
                          <input
                            id="image-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          ></input>
                          {/* <FaCloudUploadAlt className="text-[55px] text-[#cabefb] mr-[8px]" /> */}
                          {/* <img src={phot} className="w-[25px] mr-[8px]"></img> */}
                          {/* <FcImageFile className="text-[24px] mr-[8px]" /> */}
                          <div className="w-full h-full flex justify-center items-center">
                            <l-squircle
                              size="48"
                              stroke="5"
                              stroke-length="0.15"
                              bg-opacity="0.1"
                              speed="0.9"
                              color="#191A2C"
                            ></l-squircle>
                          </div>
                          <div className="w-full h-full mt-[-140px] flex justify-center items-center">
                            {image == undefined ? (
                              <>
                                <CgMathPlus className="text-[28px] text-[#181F32]" />{" "}
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#181F32"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-image-up"
                                >
                                  <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
                                  <path d="m14 19.5 3-3 3 3" />
                                  <path d="M17 22v-5.5" />
                                  <circle cx="9" cy="9" r="2" />
                                </svg>
                              </>
                            )}
                          </div>
                        </div>
                      </label>
                      {/* <span className="mt-[10px] text-[15px] text-[#787878]">
                    * Image must be clear (not blurry)
                  </span>
                  <span className="text-[15px] text-[#787878]">
                    * Image must be properly visible
                  </span> */}
                      {/* <h1>OCR.space Image to Text</h1> */}
                      {/* <input /> */}
                      <div className="flex justify-end items-end w-full h-[30px]  text-[15px]">
                        <button
                          className="w-auto h-auto rounded-2xl whitespace-nowrap"
                          onClick={() => {
                            setImage();
                            setTextArray([]);
                            setSubSection("");
                            setAddNewTransaction(false);
                          }}
                          // onClick={handleOCR}
                          // disabled={loading || !image}
                        >
                          Close
                        </button>
                        <button
                          className="w-auto h-auto ml-[25px] rounded-2xl whitespace-nowrap"
                          onClick={() => {
                            if (image) {
                              uploadImage();
                              setLoading(true);
                              setTimeout(() => {
                                setSubLoading(true);
                              }, 1500);
                              run();
                            } else {
                            }
                          }}
                          disabled={loading || !image}
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        {/* <span class="loader"></span> */}

                        <l-jelly
                          size="40"
                          speed="0.9"
                          color="#5f5f99"
                        ></l-jelly>
                        <span className="text-[17px] mt-[7px]">
                          {subLoading ? (
                            <>Extracting Data</>
                          ) : (
                            <>Processing Image</>
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  {/* {result != undefined ? ( */}

                  <div className="flex flex-col">
                    {/* <span>
                  {textArray[0].replaceAll('"', "").replaceAll("'", "")}
                </span>
                <span>
                  {
                    textArray[1]
                      .replaceAll('"', "")
                      .replaceAll("'", "")
                      .split(",")[0]
                      .split(":")[1]
                  }
                </span>
                <span>
                  {
                    textArray[2]
                      .replaceAll('"', "")
                      .replaceAll("'", "")
                      .split(",")[0]
                      .split(":")[1]
                  }
                </span> */}

                    {/* <div>
                    isReciept : {parseStringToObject(result)?.isReciept}
                  </div>
                  <div>Label : {parseStringToObject(result)?.Label}</div>
                  <div>Date : {parseStringToObject(result)?.Date}</div>
                  <div>Amount : {parseStringToObject(result)?.Amount}</div>
                  <div>Category {parseStringToObject(result)?.Category}</div>
                  <div>
                    TransactionMode :{" "}
                    {parseStringToObject(result)?.TransactionMode}
                  </div>
                  <div>BillId : {parseStringToObject(result)?.BillId}</div> */}
                    {/* <div>{result}</div>
                  <div>{text}</div> */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-[100svh] fixed z-30 bg-[#70708628] backdrop-blur-md top-0 left-0 flex flex-col justify-center items-start p-[20px] ">
                {/* <div className="w-full flex flex-col justify-end items-start h-[40px]">
                  <div className="w-[calc(100%-40px)] h-[20px] bg-[#ffffff] fixed z-20"></div>
                  <div className="w-full h-auto flex justify-start items-center z-30">
                    <div className=" w-auto text-[22px] whitespace-nowrap font-[google] font-normal  p-[20px] py-[9px] h-[40px] bg-[#ffffff] flex  justify-start items-center rounded-t-[22px]">
                     
                      <span className="mt-[10px]">Transaction Info</span>
                    </div>
                    <div className="w-[calc(100%-80px)] bg-[#bcb6b3] h-[40px] rounded-bl-[22px] ">
                      <div
                        className="h-[35px] aspect-square rounded-full bg-[#ffffff] ml-[5px] mb-[5px] flex justify-center items-center text-[20px] "
                        onClick={() => {
                          setAddNewTransaction(false);
                          setLabel("");
                          setPrice("");
                          setCategory("");
                          setMode("");
                          setBill("");
                          setSubSection("");
                        }}
                      >
                        <HiOutlinePlus className="rotate-45" />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="w-full h-auto py-[20px] bg-[#ffffff]   rounded-3xl flex flex-col justify-center items-start z-40">
                  <div className="w-full h-auto px-[20px] bg-transparent overflow-y-scroll flex flex-col justify-start items-start z-40">
                    {/* <span className="mb-[15px] text-[22px] font-[google]">
                      Transaction Details
                    </span> */}
                    <div className="flex flex-col w-full justify-between items-start ">
                      {/* <span className="text-[#000000] font-[google] font-normal text-[15px] mb-[10px]">
                        About Transaction{" "}
                        <span className="text-[#ff6c00] h-auto pt-[3px]">
                          *
                        </span>
                      </span> */}
                      <div
                        className=" w-auto  rounded-md flex text-[#0000003c] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                        style={{ transition: ".4s" }}
                      >
                        {/* Label */}
                      </div>
                      <div
                        className={
                          "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal    mb-[-60px] px-[15px] rounded-xl" +
                          (label.length > 0
                            ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                            : " items-center pt-[0px] text-[16px] text-[#00000061]")
                        }
                      >
                        Label
                      </div>
                      <input
                        className={
                          "outline-none rounded-xl w-full h-[60px] bg-transparent border  px-[15px]  text-black font-[google] font-normal text-[16px] z-40" +
                          (label == "NotFound" || label.length == 0
                            ? " pt-[0px]"
                            : " pt-[18px]") +
                          (label == "NotFound"
                            ? " border-[#d02d2d] "
                            : " border-[#F5F6FA] ")
                        }
                        // placeholder="Label"
                        value={label == "NotFound" ? "" : label}
                        onChange={(e) => {
                          setLabel(e.target.value);
                        }}
                      ></input>
                    </div>
                    {/* <div className="flex w-full justify-between h-[50px] items-center mt-[10px]"></div> */}

                    <div className="flex w-full justify-between items-center mt-[5px]">
                      <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)]">
                        <div
                          className=" w-full  rounded-md flex text-[#0000005d] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                          style={{ transition: ".4s" }}
                        >
                          {/* Date */}
                        </div>
                        <div
                          className={
                            "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal    mb-[-60px] px-[15px] rounded-xl" +
                            (value.length > 0
                              ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                              : " items-center pt-[0px] text-[16px] text-[#00000061]")
                          }
                        >
                          Date
                        </div>
                        <DatePicker
                          // inputClass="custom-input"
                          // style={{
                          //   width: "320px",
                          // }}
                          arrow={false}
                          className="bg-[#212121] teal h-full w-full flex justify-center mt-[10px] rounded-xl items-center font-[google] font-normal  bg-transparent border-[1px] border-[#535353] text-[14px]"
                          disableYearPicker
                          disableMonthPicker
                          weekDays={weekDays}
                          months={months}
                          // minDate={new Date().setDate(0)}
                          // maxDate={new Date().setDate(preDate)}
                          // render={<InputIcon />}
                          buttons={false}
                          value={value}
                          onChange={setValue}
                          format="DD/MM/YYYY"
                          shadow={false}
                          render={(value, openCalendar) => {
                            return (
                              <button
                                className={
                                  "border-[1px]  flex justify-start items-center bg-transparent px-[15px] font-[google] text-[16px] w-full h-[60px] rounded-xl text-black z-40" +
                                  (value == "NotFound" || value.length == 0
                                    ? " pt-[0px]"
                                    : " pt-[18px]") +
                                  (value == "NotFound"
                                    ? " border-[#d02d2d] "
                                    : " border-[#F5F6FA] ")
                                }
                                onClick={openCalendar}
                              >
                                {value == "NotFound" ? <></> : <>{value}</>}
                                {/* {value} */}
                              </button>
                            );
                          }}

                          // render={<InputIcon />}
                        />
                      </div>

                      <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] ">
                        <div
                          className=" w-auto  rounded-md flex text-[#0000005d] mb-[2px] justify-start items-center bg-transparent text-[14px] font-[google] font-normal "
                          style={{ transition: ".4s" }}
                        >
                          {/* Amount */}
                        </div>
                        <div
                          className={
                            "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                            (price.length > 0
                              ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                              : " items-center pt-[0px] pl-[35px] text-[16px] text-[#00000061]")
                          }
                          // style={{ transition: ".3s" }}
                        >
                          Amount
                        </div>
                        {/* <BiRupee /> */}
                        <div className="w-full h-[60px] flex justify-start items-center">
                          <div
                            className={
                              "w-[30px] h-[50px] flex justify-end  items-center mr-[-30px] text-black z-50" +
                              (price == "NotFound" || price.length == 0
                                ? " pt-[0px]"
                                : " pt-[18px]")
                            }
                          >
                            <BiRupee className="text-[17px]" />
                          </div>
                          <input
                            className={
                              "outline-none w-full h-[45px] rounded-xl pl-[35px] bg-transparent border px-[20px] text-black font-[google] font-normal text-[16px] z-40" +
                              (price == "NotFound" || price.length == 0
                                ? " pt-[0px]"
                                : " pt-[18px]") +
                              (price == "NotFound"
                                ? " border-[#d02d2d] "
                                : " border-[#F5F6FA] ")
                            }
                            // placeholder="Amount"
                            value={price == "NotFound" ? "" : price}
                            onChange={(e) => {
                              console.log(isNumeric(e.target.value));
                              if (isNumeric(e.target.value) === true) {
                                setPrice(e.target.value);
                              }
                            }}
                          ></input>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex w-full justify-between items-center mt-[10px]">
                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px] bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Transaction Type"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                ></input>

                <input
                  className="outline-none w-[calc((100%-10px)/2)] h-[50px]  bg-transparent border border-[#535353] px-[10px] text-white font-[google] font-normal text-[14px]"
                  placeholder="Members"
                  onChange={(e) => {
                    setMember(e.target.value);
                  }}
                ></input>
              </div> */}
                    <div className="flex w-full  justify-between h-auto items-start  font-[google] font-normal text-black text-[15px]">
                      {/* <span className="text-[#000000]">
                        Select Category{" "}
                        <span className="text-[#ff6c00] h-auto pt-[3px]">
                          *
                        </span>
                      </span> */}

                      <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-auto">
                        <div
                          className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                          style={{ transition: ".4s" }}
                        >
                          {/* Category */}
                        </div>
                        <div
                          className={
                            "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                            (category.length > 0
                              ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                              : " items-center pt-[0px] text-[16px] text-[#00000061]")
                          }
                          // style={{ transition: ".3s" }}
                        >
                          Category
                        </div>
                        <div
                          className="w-full h-auto flex justify-start items-center z-50"
                          onClick={() => {
                            setCategoryDropdown(!categoryDropdown);
                            setCPaymentDropdown(false);
                          }}
                        >
                          <div
                            className={
                              "outline-none w-full h-[60px] rounded-xl bg-transparent border px-[15px] text-black font-[google] font-normal text-[16px] z-40 flex justify-start items-center whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1" +
                              (category == "NotFound" || category.length == 0
                                ? " pt-[0px]"
                                : " pt-[18px]") +
                              (category == "NotFound"
                                ? " border-[#d02d2d] "
                                : " border-[#F5F6FA] ")
                            }
                            // placeholder="Price"
                            // value={price}
                          >
                            {category == "NotFound" ? <></> : <>{category}</>}
                            {/* {category} */}
                          </div>
                          <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]">
                            {categoryDropdown ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-chevron-up"
                              >
                                <path d="m18 15-6-6-6 6" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-chevron-down"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-start  w-[calc((100%-10px)/2)] h-auto ">
                        <div
                          className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                          style={{ transition: ".4s" }}
                        >
                          {/* Payment Mode */}
                        </div>
                        <div
                          className={
                            "w-full h-[60px] bg-[#F5F6FA] flex justify-start font-[google] font-normal   mb-[-60px] px-[15px] rounded-xl" +
                            (mode.length > 0
                              ? " items-start pt-[11px] text-[13px] text-[#00000061]"
                              : " items-center pt-[0px] text-[16px] text-[#00000061]")
                          }
                          // style={{ transition: ".3s" }}
                        >
                          Payment Mode
                        </div>
                        <div
                          className="w-full h-auto flex justify-start items-center z-50"
                          onClick={() => {
                            setCPaymentDropdown(!paymentDropdown);
                            setCategoryDropdown(false);
                          }}
                        >
                          <div
                            className={
                              "outline-none w-full h-[60px] rounded-xl bg-transparent border px-[15px] text-black font-[google] font-normal text-[16px] z-40 flex justify-start items-center  whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1" +
                              (mode == "NotFound" || mode.length == 0
                                ? " pt-[0px]"
                                : " pt-[18px]") +
                              (mode == "NotFound"
                                ? " border-[#d02d2d] "
                                : " border-[#F5F6FA] ")
                            }
                            // placeholder="Price"
                            // value={price}
                          >
                            {mode == "NotFound" ? <></> : <>{mode}</>}
                          </div>
                          <div className="w-[30px] h-[45px] flex justify-start items-center ml-[-30px]">
                            {paymentDropdown ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-chevron-up"
                              >
                                <path d="m18 15-6-6-6 6" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-chevron-down"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose"> */}
                        {/* <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Online UPI"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Online UPI");
                            }}
                          >
                            Online UPI
                          </span>
                          <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Credit/Debit Card"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Credit/Debit Card");
                            }}
                          >
                            Credit/Debit Card
                          </span>
                          <span
                            className={
                              "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                              (mode == "Cash"
                                ? " bg-[#acebff] text-[black]"
                                : " text-[#535353]")
                            }
                            onClick={() => {
                              setMode("Cash");
                            }}
                          >
                            Cash
                          </span> */}
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="w-full h-[0px] flex justify-between items-center">
                      <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                        <div
                          className={
                            "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[145px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px]" +
                            (categoryDropdown ? " flex" : " hidden")
                          }
                        >
                          {/* <div className="w-full py-[6px] flex justify-start items-center">
                            Select Category
                          </div>
                          <div className="w-full my-[6px] flex justify-start items-center border border-[#beb0f4]"></div> */}
                          {categoryName.map((data, index) => {
                            return (
                              <div
                                className="w-full py-[6px] flex justify-start items-center z-50"
                                onClick={() => {
                                  setCategory(data);
                                  setCategoryDropdown(false);
                                }}
                              >
                                <SmallSizeIcon Category={data} />
                                <div className="ml-[15px]" key={index}>
                                  {data}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start  w-[calc((100%-10px)/2)] h-0 ">
                        <div
                          className={
                            "w-[calc(100%-80px)] rounded-xl mt-[10px] h-[145px] font-[google] font-normal text-[16px] overflow-y-scroll fixed flex-col flex justify-start items-start   bg-[#F5F6FA] p-[15px] py-[9px] left-[40px]" +
                            (paymentDropdown ? " flex" : " hidden")
                          }
                        >
                          {/* <div className="w-full py-[6px] flex justify-start items-center">
                            Select Category
                          </div>
                          <div className="w-full my-[6px] flex justify-start items-center border border-[#beb0f4]"></div> */}
                          {paymentName.map((data, index) => {
                            return (
                              <div
                                className="w-full py-[6px] flex justify-start items-center z-50"
                                onClick={() => {
                                  setMode(data);
                                  setCPaymentDropdown(false);
                                }}
                              >
                                {/* <SmallSizeIcon Category={data} /> */}
                                <div className="" key={index}>
                                  {data}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex flex-col w-full justify-center items-start mt-[15px] font-[google] font-normal text-black text-[15px]">
                      <span className="text-[#000000]">
                        Select Mode of Transaction{" "}
                        <span className="text-[#ff6c00] h-auto pt-[3px]">
                          *
                        </span>
                      </span>
                      <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose mt-[10px]">
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Online UPI"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Online UPI");
                          }}
                        >
                          Online UPI
                        </span>
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Credit/Debit Card"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Credit/Debit Card");
                          }}
                        >
                          Credit/Debit Card
                        </span>
                        <span
                          className={
                            "cursor-pointer p-[10px] flex-grow mb-[5px] ml-[5px] rounded-md h-[40px] border border-[#acebff] flex justify-center items-center" +
                            (mode == "Cash"
                              ? " bg-[#acebff] text-[black]"
                              : " text-[#535353]")
                          }
                          onClick={() => {
                            setMode("Cash");
                          }}
                        >
                          Cash
                        </span>
                      </div>
                    </div> */}
                    <div className="flex flex-col w-full justify-center items-start font-[google] font-normal text-black text-[15px]">
                      <div
                        className=" w-auto  rounded-md flex mb-[2px]  text-[#0000005d] justify-start items-center bg-transparent mt-[7px] text-[14px] font-[google] font-normal "
                        style={{ transition: ".4s" }}
                      >
                        {/* Reciept / Bill */}
                      </div>
                      <div className="w-full flex justify-start items-center flex-wrap text-[#535353] choose ">
                        <span
                          className={
                            "p-[10px] flex-grow mb-[5px] ml-[5px] bg-[#F5F6FA] rounded-xl w-[80px] h-[80px] border  flex justify-center items-center text-[#000000] text-[16px]" +
                            (imageError
                              ? " border-[#d02d2d] text-[#d02d2d]"
                              : " border-[#F5F6FA] text-[#000000]")
                          }
                        >
                          {/* <span className="ml-[10px]"> */}
                          {imageError ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-image"
                              >
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="3"
                                  rx="2"
                                  ry="2"
                                />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                              <span className="ml-[10px]">
                                Not a Valid Reciept
                              </span>
                            </>
                          ) : (
                            <>
                              {" "}
                              {bill.length == 0 ? (
                                <>
                                  <IoMdCloudUpload className="text-[25px]" />
                                  <span className="ml-[10px] ">
                                    Upload Photo
                                  </span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-image"
                                  >
                                    <rect
                                      width="18"
                                      height="18"
                                      x="3"
                                      y="3"
                                      rx="2"
                                      ry="2"
                                    />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                  </svg>
                                  <span className="ml-[10px]">Uploaded</span>
                                </>
                              )}
                            </>
                          )}
                          {/* </span> */}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex mt-[15px] justify-center items-end font-[google] font-normal text-[16px] text-black ">
                      <div
                        className=" mr-[15px] px-[15px] py-[10px] rounded-3xl bg-[#F5F6FA] text-[black] flex justify-center items-center cursor-pointer  "
                        onClick={() => {
                          setAddNewTransaction(false);
                          setLabel("");
                          setPrice("");
                          setCategory("");
                          setMode("");
                          setBill("");
                          setSubSection("");
                        }}
                      >
                        Cancel
                      </div>
                      {label?.length != 0 &&
                      value?.length != 0 &&
                      price?.length != 0 &&
                      category?.length != 0 &&
                      mode?.length != 0 &&
                      label != "NotFound" &&
                      price != "NotFound" &&
                      value != "NotFound" &&
                      category != "NotFound" &&
                      mode != "NotFound" ? (
                        <>
                          <div
                            className=" flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#181F32] text-[white] items-center cursor-pointer "
                            onClick={() => {
                              // if (
                              //   label?.length != 0 &&
                              //   value?.length != 0 &&
                              //   price?.length != 0 &&
                              //   category?.length != 0 &&
                              //   mode?.length != 0
                              //   // bill?.length != 0
                              // ) {
                              setSubSection("");
                              addToFirebase();
                              setAddNewTransaction(false);
                              // }
                            }}
                          >
                            Update
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className=" flex justify-center  px-[15px] py-[10px] rounded-3xl bg-[#181f3223] items-center text-[#0000006c]  "
                            onClick={() => {
                              // if (
                              //   label?.length != 0 &&
                              //   value?.length != 0 &&
                              //   price?.length != 0 &&
                              //   category?.length != 0 &&
                              //   mode?.length != 0
                              //   // bill?.length != 0
                              // ) {
                              //   addToFirebase();
                              //   setAddNewTransaction(false);
                              // }
                            }}
                          >
                            Update
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <div
        className="w-[calc(100%-40px)] h-[65px]  px-[20px] font-[google] font-normal text-[15px] bg-[#181F32] rounded-2xl text-[#ffffff] cursor-pointer flex justify-start items-center"
        onClick={() => {
          setAddNewTransaction(true);
        }}
      >
        <div className="w-[30px]  flex justify-start items-center text-[23px]  ">
          <FiPlus />
        </div>
        <div className="w-auto ml-[10px] text-[16px] ">Add New Transaction</div>
      </div>
    </>
  );
};

export default AddIndependentTransaction;
