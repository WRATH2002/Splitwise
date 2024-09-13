import React, { useRef, useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";
import { MdDone } from "react-icons/md";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HiArrowLeft } from "react-icons/hi";
import { LuCornerUpLeft, LuCornerUpRight } from "react-icons/lu";

const monthsShort = [
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

const prom1 = [
  "Summarize the above text. Only provide the summary and no additional information.",
  "Extract and present the key points from the following text as well-formatted bullet points. Only provide the key points in bullet format. dont give any '*'s or '#'s or '`'s instead for bullets please return this '•'.there should not have any extra spaces before '•' but should have '  ' this much space after '•' in between two key points there should be one line gap and '•' and sentence should be in same line",
  "Rewrite the above text in well-structured paragraphs without altering the meaning . Ensure the text is divided into multiple clear and coherent paragraphs.",
];

const prom2 = [
  "Check the above text for spelling, grammar, and punctuation errors without changing the sentences or altering the original structure",
  "Rewrite the above text using well-structured sentences and improved vocabulary, while maintaining the original meaning.",
  "Rewrite the above text in a formal and professional tone, ensuring clarity and precision while maintaining the original meaning",
];

const Editor = (props) => {
  const [text, setText] = useState(props?.body);
  const [title, setTitle] = useState(props?.title);
  const [tempData, setTempData] = useState(props?.tempData);
  const [bold, setBold] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [AIModal, setAIModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedText, setFormattedText] = useState("");
  const [index, setIndex] = useState(0);
  const divRef = useRef(null);
  const textareaRef = useRef(null);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
  const [prompt, setPrompt] = useState("");

  const handleDivClick = () => {
    // Focus the textarea when the div is clicked
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // Find the starting index of the selected text within the div
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(divRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;

      if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);
        setFormattedText(selectedText);
        setIndex(start);
        console.log("Starting index:", start);
      } else {
        console.log("Selected text: None");
      }
    }
  };

  useEffect(() => {
    let tindex = countBoldTagsUpToIndex();
    setIndex(tindex);
  }, [index]);

  useEffect(() => {
    if (bold === true) {
      splitTextAtWordOccurrence(index);
    }
  }, [bold]);

  function splitTextAtWordOccurrence(tindex) {
    console.log(text.slice(0, tindex));
    console.log(text.slice(tindex + formattedText.length));

    setText(
      text.slice(0, tindex) +
        "<b>" +
        formattedText +
        "</b>" +
        text.slice(tindex + formattedText.length)
    );
  }

  function countBoldTagsUpToIndex() {
    let tempIndex = index;
    for (let i = 0; i <= tempIndex; i++) {
      if (text[i] == "<") {
        if (text[i + 1] == "b" && text[i + 2] == ">") {
          tempIndex = tempIndex + 3;
          i = i + 2;
        } else if (
          text[i + 1] == "/" &&
          text[i + 2] == "b" &&
          text[i + 3] == ">"
        ) {
          tempIndex = tempIndex + 4;
          i = i + 3;
        }
      }
    }

    return tempIndex;

    // if (index < 0 || index > text.length) {
    //   throw new Error("Index out of range.");
    // }

    // const textUpToIndex = text.substring(0, index);
    // const openingTag = "<b>";
    // const closingTag = "</b>";

    // let openingTagCount = 0;
    // let closingTagCount = 0;
    // let position = 0;

    // while ((position = textUpToIndex.indexOf(openingTag, position)) !== -1) {
    //   openingTagCount++;
    //   position += openingTag.length;
    // }

    // position = 0;
    // while ((position = textUpToIndex.indexOf(closingTag, position)) !== -1) {
    //   closingTagCount++;
    //   position += closingTag.length;
    // }

    // return { openingTagCount, closingTagCount };
  }

  function updateNotes() {
    // deleteNoteFromFirebase();
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user?.uid)
      .update({
        Notes: arrayRemove(tempData),
      });

    let month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    // const user = firebase.auth().currentUser;
    const userRef = db
      .collection("Expense")
      .doc(user?.uid)
      .update({
        Notes: arrayUnion({
          Title: title,
          Body: text,
          Time:
            (new Date().getHours() > 12
              ? new Date().getHours() - 12
              : new Date().getHours()) +
            ":" +
            new Date().getMinutes() +
            " " +
            (new Date().getHours() > 12 ? "PM" : "AM"),
          Date: new Date().getDate() + " " + month[new Date().getMonth()],
        }),
      });

    setTempData({
      Title: title,
      Body: text,
      Time:
        (new Date().getHours() > 12
          ? new Date().getHours() - 12
          : new Date().getHours()) +
        ":" +
        new Date().getMinutes() +
        " " +
        (new Date().getHours() > 12 ? "PM" : "AM"),
      Date: new Date().getDate() + " " + month[new Date().getMonth()],
    });
  }

  //   ----------------------------------------------------------------

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    response_mime_type: "application/json",
  };

  async function run() {
    console.log("generating plan");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    const result = await chatSession.sendMessage(
      `${text} 
        ${prompt}

        give the result json format. just give the json data only and nothing more and the json format should be like below 

        {"result" : "result Text ..."}

        
      `
    );
    console.log(result.response);
    console.log(
      JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text)
    );
    setText(
      JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text).result
    );
    setPrompt("");
    setLoading(false);
    // setPlanData(
    //   JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text)
    // );
  }

  useEffect(() => {
    if (prompt.length != 0) {
      run();
    }
  }, [prompt]);

  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  function formatText(text) {
    text = text.replace(/```(.*?)```/gs, (match, p1) => {
      if (p1.trim() === "") {
        return "";
      }

      const lines = p1.trim().split("\n");
      const language = lines[0].trim().toLowerCase(); // Lowercase for consistency
      const codeLines = lines.slice(1);

      // Determine minimum indentation
      const minIndentation = Math.min(
        ...codeLines
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const match = line.match(/^\s*/);
            return match ? match[0].length : 0;
          })
      );

      // Remove minimum indentation
      const code = codeLines
        .map((line) => line.slice(minIndentation))
        .join("\n");

      return `
      <div style="width: 100%; height: auto; white-space: pre-wrap; background-color: #1e1e1e; color: white; border-radius: 16px; display: flex; flex-direction: column; justify-content: start; align-items: start;    padding: 0px 0px 15px 0px;">
        <div style="width: 100%; height: 40px; background-color: #000000; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0px 15px; border-radius: 16px 16px 0px 0px">
          <span style="color: #acacac">${language}</span>
          <button style="width: auto; height: auto; white-space: nowrap; color: white;">copy</button>
        </div>
        <pre style="padding: 15px; width: 100%; overflow-x: scroll"><code class="language-${language}">${escapeHtml(
        code
      )}</code></pre>
      </div>
    `;
    });

    // Inline code formatting
    text = text.replace(
      /`([^`]+)`/g,
      (match, p1) => `<code>${escapeHtml(p1)}</code>`
    );

    // Bold text formatting
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Bullet point replacement
    text = text.replace(/\*(?!\*|$)/g, "•");

    // Header formatting
    text = text.replace(/##(.*?)(?=\n|$)/g, "<b>$1</b>");

    // URL formatting
    text = text.replace(
      /(https:\/\/[^\s]+)/g,
      '<a href="$1" class="bold" target="_blank">$1</a>'
    );

    return text;
  }

  return (
    <>
      {confirmModal ? (
        <>
          <div
            className="fixed w-full h-[100svh] flex justify-center items-end p-[20px] top-0 left-0  bg-[#70708628] backdrop-blur-md  "
            style={{ zIndex: "60" }}
          >
            <div className="w-full h-auto p-[30px] flex justify-start items-start font-[google] font-normal bg-white flex-col rounded-3xl">
              <span className="text-[22px]  mb-[10px]">Confirm Update</span>
              <span className="text-[14.5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                Previous note data will be erased and current data will be
                updated. Do you want to continue ?
              </span>
              <div className="w-full h-auto mt-[20px] flex justify-end items-end">
                <div
                  className={`w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[${props?.UIColor}]`}
                  onClick={() => {
                    setConfirmModal(false);
                  }}
                  style={{ backgroundColor: `${props?.UIColor} ` }}
                >
                  Cancel
                </div>
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    setConfirmModal(false);
                    updateNotes();
                    props?.setNoteEditor(false);
                    props?.setTempData({});
                    props?.setBody("");
                    props?.setTitle("");
                  }}
                >
                  Update
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <div
          className="w-full h-[100svh]  flex flex-col justify-end items-center bg-[#70708628] backdrop-blur-md p-[20px] fixed top-0 left-0  z-40"
          style={{ zIndex: 70 }}
        >
          <div
            className={
              "min-w-full z-50 h-auto bg-[#ffffff]   text-black  rounded-3xl font-[google] font-normal text-[14px] flex justify-center items-center py-[25px]  px-[30px]"
            }
            style={{ zIndex: 100 }}
            onClick={() => {}}
          >
            Loading
          </div>
        </div>
      ) : (
        <></>
      )}
      {AIModal || loading ? (
        <></>
      ) : (
        <div
          className="fixed bottom-[20px] right-[20px] w-[45px] h-[45px] rounded-xl conicG z-[60] flex justify-center items-center"
          style={{ zIndex: "60" }}
          onClick={() => {
            setAIModal(true);
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
            class="lucide lucide-pen-tool"
          >
            <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
            <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
            <path d="m2.3 2.3 7.286 7.286" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </div>
      )}
      {/* <div
        className="fixed w-full h-[100svh] flex justify-center items-end p-[20px] top-0 left-0   "
        style={{ zIndex: "60" }}
      > */}
      {AIModal ? (
        <>
          <div
            className="w-[calc(100%-40px)] fixed left-[20px] bottom-[20px] h-auto sha rounded-3xl  flex flex-col justify-start items-start bg-white "
            style={{ zIndex: "70" }}
          >
            <div
              className="w-full h-auto min-h-[300px] rounded-3xl  flex flex-col justify-start items-start conicG p-[30px]"
              style={{ zIndex: "80" }}
            >
              <div className="w-full flex justify-between items-center mb-[20px]">
                <div className="font-[google] text-[22px]">AI Text Tools</div>
                <div
                  className="w-[35px] aspect-square rounded-full bg-[white] flex justify-center items-center"
                  onClick={() => {
                    setPrompt("");
                    setAIModal(false);
                    setLoading(false);
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
                    class="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>
              </div>
              <div className="w-full h-auto flex justify-between items-center">
                {Array(3)
                  .fill("")
                  .map((data, index) => {
                    return (
                      <div
                        className="min-w-[calc((100%-30px)/3)] h-[120px] rounded-[17px] bg-white flex flex-col justify-start items-start font-[google] text-[13px] p-[13px] border-[2px] border-transparent hover:border-[black]"
                        onClick={() => {
                          setPrompt(prom1[index]);
                          setAIModal(false);
                          setLoading(true);
                        }}
                      >
                        <div className="text-[13px] w-full flex justify-center items-center mb-[10px]">
                          {index == 0 ? (
                            <>Summary</>
                          ) : index == 1 ? (
                            <>Key Points</>
                          ) : index == 2 ? (
                            <>Paragraph</>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="w-full border border-[#aaaaaa] rounded-full"></div>
                        <div className="w-full border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                        <div className="w-full border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                        <div className="w-[80%] border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                        <div className="my-[5px] flex justify-center items-center w-full ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#aaaaaa"
                            stroke="#aaaaaa"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-big-down"
                          >
                            <path d="M15 6v6h4l-7 7-7-7h4V6h6z" />
                          </svg>
                        </div>
                        {index == 0 ? (
                          <>
                            <div className="w-full border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                            <div className="w-[80%] border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                          </>
                        ) : index == 1 ? (
                          <>
                            <div className="w-full flex justify-between items-center mt-[1px]">
                              <div className="w-[3px] h-[3px] rounded-full mr-[3px] bg-[#aaaaaa]"></div>
                              <div className="w-[calc(100%-6px)] border border-[#aaaaaa] rounded-full "></div>
                            </div>
                            <div className="w-[80%] flex justify-between items-center mt-[1px]">
                              <div className="w-[3px] h-[3px] rounded-full mr-[3px] bg-[#aaaaaa]"></div>
                              <div className="w-[calc(100%-6px)]  border border-[#aaaaaa] rounded-full "></div>
                            </div>{" "}
                            <div className="w-[50%] flex justify-between items-center mt-[1px]">
                              <div className="w-[3px] h-[3px] rounded-full mr-[3px] bg-[#aaaaaa]"></div>
                              <div className="w-[calc(100%-6px)]  border border-[#aaaaaa] rounded-full "></div>
                            </div>
                          </>
                        ) : index == 2 ? (
                          <>
                            <div className="w-full border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                            <div className="w-[80%] border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                            <div className="w-full border border-[#aaaaaa] rounded-full mt-[4px]"></div>
                            <div className="w-full border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                            <div className="w-[30%] border border-[#aaaaaa] rounded-full mt-[2px]"></div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="w-full h-auto flex justify-between items-center">
                {Array(3)
                  .fill("")
                  .map((data, index) => {
                    return (
                      <div
                        className="min-w-[calc((100%-30px)/3)] break-words h-[70px] mt-[20px] rounded-[17px] bg-[white] flex flex-col  justify-center items-center font-[google] text-[13px] py-[10px] border-[2px] border-transparent hover:border-[black]"
                        onClick={() => {
                          setPrompt(prom2[index]);
                          setAIModal(false);
                          setLoading(true);
                        }}
                      >
                        <div className="w-full flex justify-center items-center mb-[5px]">
                          {index == 0 ? (
                            <>
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
                                class="lucide lucide-text-search"
                              >
                                <path d="M21 6H3" />
                                <path d="M10 12H3" />
                                <path d="M10 18H3" />
                                <circle cx="17" cy="15" r="3" />
                                <path d="m21 19-1.9-1.9" />
                              </svg>
                            </>
                          ) : index == 1 ? (
                            <>
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
                                class="lucide lucide-rotate-cw"
                              >
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                              </svg>
                            </>
                          ) : index == 2 ? (
                            <>
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
                                class="lucide lucide-briefcase-business"
                              >
                                <path d="M12 12h.01" />
                                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                <rect
                                  width="20"
                                  height="14"
                                  x="2"
                                  y="6"
                                  rx="2"
                                />
                              </svg>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        {index == 0 ? (
                          <>Proof Read</>
                        ) : index == 1 ? (
                          <>Rewrite</>
                        ) : index == 2 ? (
                          <>Professional</>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
              </div>
              {/* <input
                className="w-full h-[45px] mt-[15px] px-[15px] rounded-xl bg-white"
                placeholder="custom prompt ..."
              ></input> */}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* </div> */}
      <div className="fixed w-full h-[100svh] top-0 left-0 bg-[white] flex flex-col justify-start items-start p-[20px] pt-[10px] font-[google] font-normal z-50">
        <div className="w-full px-[11px] text-[22px] h-[50px] flex justify-start items-center ">
          <div className="w-[30%] h-full flex justify-start items-center">
            <HiArrowLeft
              className="text-[25px]  cursor-pointer"
              onClick={() => {
                props?.setNoteEditor(false);
                props?.setBody("");
                props?.setTitle("");
                props?.setTempData({});
              }}
            />
          </div>
          <div className="w-[70%] h-full flex justify-end items-center">
            <div
              className={
                "w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center" +
                (text.length != 0 ? " text-[#000000]" : " text-[#b8b8b8]")
              }
              onClick={() => {
                if (text.length != 0) {
                  setFormattedText(text);
                  setText("");
                }
              }}
            >
              <LuCornerUpLeft className="text-[25px] " />
            </div>
            <div
              className={
                "w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center" +
                (formattedText.length != 0
                  ? " text-[#000000]"
                  : " text-[#b8b8b8]")
              }
              onClick={() => {
                if (formattedText.length != 0) {
                  setText(formattedText);
                  setFormattedText("");
                }
              }}
            >
              <LuCornerUpRight className="text-[25px] " />
            </div>
            <div
              className="w-[40px] h-[40px] cursor-pointer hover:bg-[#ecf5ff] rounded-xl flex justify-center items-center"
              onClick={() => {
                console.log(tempData);
                if (title == props?.title && text == props?.body) {
                } else {
                  if (tempData.Title || tempData.Body) {
                    setConfirmModal(true);
                  } else {
                    updateNotes();
                    props?.setNoteEditor(false);
                    props?.setTempData({});
                    props?.setBody("");
                    props?.setTitle("");
                  }
                }
              }}
            >
              <MdDone
                className={
                  "text-[25px] " +
                  (title == props?.title && text == props?.body
                    ? " text-[#b8b8b8]"
                    : " text-[#000000]")
                }
              />
            </div>
          </div>
        </div>
        <textarea
          placeholder="Title"
          value={title}
          // style={{ whiteSpace: "pre-wrap" }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="placeholder:text-[#b8b8b8] w-full   h-[90px]  text-[30px] outline-none resize-none leading-10 border-none  "
        ></textarea>
        <div className="w-full h-[35px] px-[11px] text-[14px] text-[#929292] flex justify-start items-start">
          {new Date().getDate()} {monthsShort[new Date().getMonth()]}{" "}
          {(new Date().getHours() > 12
            ? new Date().getHours() - 12
            : new Date().getHours()) +
            ":" +
            new Date().getMinutes() +
            " " +
            (new Date().getHours() > 12 ? "PM" : "AM")}{" "}
          <span className="text-[8px] mx-[6px] text-[#b8b8b8] h-full pt-[5px]">
            |
          </span>{" "}
          {text.length} characters
        </div>
        {/* <textarea className="input w-[calc(100%-135px)] ml-[10px]  resize-none px-[20px] pr-[50px] pt-[10px]  outline-none text-[15px] font-[work] font-medium tracking-[.4px] rounded-2xl   h-[45px]   pl-[20px] bg-[#ffffff] text-[black]"></textarea> */}
        <textarea
          id="text-container"
          value={text}
          style={{ whiteSpace: "pre-wrap" }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          // ref={textareaRef}
          placeholder="Start Typing..."
          className="placeholder:text-[#b8b8b8] pt-[0px] w-full  h-[calc(100svh-205px)] overflow-y-scroll   text-[16px] outline-0 resize-none leading-8 border-0 "
        >
          <div
            className="w-full h-full bg-slate-300"
            dangerouslySetInnerHTML={formatText(text)}
          ></div>
        </textarea>
        {/* <div
          onClick={handleDivClick}
          className=" select-text w-[calc(100%-40px)] fixed bg-transparent h-[calc(100%-230px)] top-[170px] px-[11px] pt-[13px]"
          ref={divRef}
          onMouseUp={handleMouseUp}
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        ></div> */}
      </div>
    </>
  );
};

export default Editor;
