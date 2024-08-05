import React, { PureComponent, useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  Rectangle,
  AreaChart,
  PolarRadiusAxis,
  PolarAngleAxis,
  PolarGrid,
  RadarChart,
} from "recharts";
import { ContributionCalendar } from "react-contribution-calendar";
import TopNavbar from "./TopNavbar";
import QuickInfo from "./QuickInfo";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { BiRupee } from "react-icons/bi";
import GraphInfo from "./GraphInfo";
import { squircle } from "ldrs";
import { Radar, Split } from "lucide";
squircle.register();

const monthNames = [
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

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const transactions = [
  {
    Category: "Travel",
    CatTotal: -1594.5,
    Total: 3146.5, // Total of all transactions adjusted by MoneyIsAdded
  },
  {
    Category: "Food & Drinks",
    CatTotal: 4752.0,
    Total: 3146.5,
  },
  {
    Category: "Entertainment",
    CatTotal: -200.0,
    Total: 3146.5,
  },
  {
    Category: "Health",
    CatTotal: -400.0,
    Total: 3146.5,
  },
  {
    Category: "Education",
    CatTotal: -1200.0,
    Total: 3146.5,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-[#ffdfc8] rounded-2xl p-[20px] w-auto font-[google] font-normal text-[14px]">
        {/* <p className="label">{`${label}`}</p> */}
        <p className="intro flex justify-start items-center">
          <span className="font-semibold tracking-wider">Income : </span>
          <BiRupee className="ml-[5px]" /> {`${payload[0].value}`}
        </p>
        <p className="intro flex justify-start items-center">
          <span className="font-semibold tracking-wider">Budget : </span>
          <BiRupee className="ml-[5px]" /> {`${payload[1].value}`}
        </p>
        <p className="intro flex justify-start items-center">
          <span className="font-semibold tracking-wider">Expense : </span>
          <BiRupee className="ml-[5px]" /> {`${payload[2].value}`}
        </p>
        <p className="intro flex justify-start items-center">
          <span className="font-semibold tracking-wider">Savings : </span>
          <BiRupee className="ml-[5px]" /> {`${payload[3].value}`}
        </p>
        {/* <p className="desc"></p> */}
      </div>
    );
  }

  return null;
};

// class RadarComp extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/simple-radar-chart-2p5sxm';

//   render() {
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis />
//           <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//         </RadarChart>
//       </ResponsiveContainer>
//     );
//   }
// }

const data = [
  {
    name: "Travel",
    uv: 1194,
    fill: "#8884d8",
  },
  {
    name: "Food & Drinks",
    uv: 1500,
    fill: "#83a6ed",
  },
  {
    name: "Health",
    uv: 400,
    fill: "#8dd1e1",
  },
  {
    name: "Entertainment",
    uv: 0,
    fill: "#82ca9d",
  },
  {
    name: "Education",
    uv: 0,
    fill: "#a4de6c",
  },
  {
    name: "Education rger",
    uv: 1800,
    fill: "#a4de6c",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const ExpenseBarGraph = (props) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [budget, setBudget] = useState("");
  const [per, setPer] = useState("");
  const [ave, setAve] = useState(0);
  const [normalT, setNormalT] = useState(0);
  const [normalC, setNormalC] = useState(0);
  const [splitT, setSplitT] = useState(0);
  const [splitC, setSplitC] = useState(0);
  const [currMonthSpent, setCurrMonthSpent] = useState("");
  const [monthIndex, setMonthIndex] = useState(parseInt(new Date().getMonth()));
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [drop, setDrop] = useState(false);
  const [monthLevel, setMonthLevel] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [opacity, setOpacity] = React.useState({
    Budget: 1,
    Income: 1,
    Savings: 1,
    TotalExpense: 1,
  });

  const colors = [
    "#022b30",
    "#004144",
    "#005d5d",
    "#007d79",
    "#009d9a",
    "#08bdba",
    "#3ddbd9",
    "#9ef0f0",
    "#d9fbfb",
    // "#e5e5e8",
  ];

  const handleMouseEnter = (o) => {
    const { dataKey } = o;

    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;

    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let arr = [];
    if (transactionHistory.length != 0) {
      // getStackedData()
      transactionHistory?.map((data) => {
        // if (data?.Date?.split("/")[1] == monthIndex + 1) {
        if (data?.MoneyIsAdded) {
          arr.push({ Out: "0", In: data?.Amount });
        } else {
          arr.push({ Out: data?.Amount, In: "0" });
        }
        // }
      });
      calculateCategoryTotals(transactionHistory);
      setPer(calculateSavingsPercentageChange(transactionHistory, budget));
    }
    console.log("MOnthly arr");
    console.log(arr);
    setMonthlyData(arr);
  }, [transactionHistory]);

  useEffect(() => {
    let sum = 0;
    if (transactionHistory.length != 0) {
      // getStackedData()
      transactionHistory?.map((data) => {
        if (data?.Date?.split("/")[1] == parseInt(new Date().getMonth()) + 1) {
          if (data?.MoneyIsAdded) {
            sum = sum - parseInt(data?.Amount);
          } else {
            sum = sum + parseInt(data?.Amount);
          }
        }
      });
    }
    console.log("Sum");
    console.log(sum);
    setCurrMonthSpent(sum);
    setAve(calculateAverageMonthlyExpense(transactionHistory));
    calculateDailyLevels(transactionHistory);
    let nt = 0;
    let nc = 0;
    let st = 0;
    let sc = 0;

    if (transactionHistory.length != 0) {
      calculateTotalExpenses(transactionHistory);
      // getStackedData()
      transactionHistory?.map((data) => {
        if (data?.Date?.split("/")[1] == parseInt(new Date().getMonth()) + 1) {
          if (data?.TransactionType == "Split") {
            if (data?.MoneyIsAdded) {
              st = st - parseInt(data?.Amount);
              sc = sc + 1;
            } else {
              st = st + parseInt(data?.Amount);
              sc = sc + 1;
            }
          } else if (data?.TransactionType == "Single") {
            if (data?.MoneyIsAdded) {
              nt = nt - parseInt(data?.Amount);
              nc = nc + 1;
            } else {
              nt = nt + parseInt(data?.Amount);
              nc = nc + 1;
            }
          }
        }
      });

      setNormalT(nt);
      setNormalC(nc);
      setSplitT(st);
      setSplitC(sc);
    }
  }, [transactionHistory]);

  function fetchUserData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonthlyData(snapshot?.data()?.MonthlyData);
      setBudget(snapshot?.data()?.Budget);
      setTransactionHistory(snapshot?.data()?.NormalTransaction);
    });
  }

  function formatAmountWithCommas(amountStr) {
    // Convert the string to a number
    const amount = parseFloat(amountStr);

    // Check if the conversion was successful
    if (isNaN(amount)) {
      throw new Error("Invalid input: not a number");
    }

    // Format the number with commas and ensure two decimal places
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  //   useEffect(() => {
  // getTotalSavings();
  //   },[])

  function getTotalSavings() {
    let total = monthlyData.reduce((acc, curr) => {
      acc = acc + parseFloat(curr?.Savings);
      return acc;
    }, 0);

    return total;
  }
  function monthCount() {
    let total = monthlyData.reduce((acc, curr) => {
      acc = acc + 1;
      return acc;
    }, 0);

    return total;
  }
  function average() {
    let count = 0;
    let sum = 0;
    transactionHistory?.map((data) => {
      if (data?.MoneyIsAdded) {
        //  arr.push({ Out: data?.Amount, In: data?.Amount });
        sum = sum - parseInt(data?.Amount);
        // count = count + 1
      } else {
        //  arr.push({ Out: data?.Amount, In: 0 });
        sum = sum + parseInt(data?.Amount);
        count = count + 1;
      }
    });

    return (sum / count).toFixed(2);
  }

  function calculateCategoryTotals(transactions) {
    const categoryTotals = {};
    let allTotal = 0;

    transactions.forEach((transaction) => {
      const category = transaction.Category;
      const amount = parseFloat(transaction.Amount);

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      // Subtract amount if MoneyIsAdded is true, otherwise add it
      if (transaction.MoneyIsAdded) {
        categoryTotals[category] -= amount;
        allTotal -= amount;
      } else {
        categoryTotals[category] += amount;
        allTotal += amount;
      }
    });

    // Convert category totals into array of objects
    const result = Object.keys(categoryTotals).map((category) => ({
      Category: category,
      CatTotal: categoryTotals[category],
      Total: allTotal,
    }));

    setCatData(result);
    console.log(result);

    // return result;
  }

  const calculateSavingsPercentageChange = (transactions, budget) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    const calculateTotalSpent = (transactions, monthOffset) => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      return transactions.reduce((total, transaction) => {
        const transactionDate = parseDate(transaction.Date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

        if (
          transactionYear === currentYear - monthOffset &&
          transactionMonth === currentMonth
        ) {
          const amount = parseFloat(transaction.Amount);
          return total + (transaction.MoneyIsAdded ? -amount : amount);
        }

        return total;
      }, 0);
    };

    const currentMonthSpent = calculateTotalSpent(transactions, 0);
    const lastMonthSpent = calculateTotalSpent(transactions, 1);

    const currentMonthSavings = budget - currentMonthSpent;
    const lastMonthSavings = budget - lastMonthSpent;

    const percentageChange =
      ((currentMonthSavings - lastMonthSavings) / lastMonthSavings) * 100;
    const sign = percentageChange >= 0 ? "+" : "-";

    return `${sign}${Math.abs(percentageChange).toFixed(2)}`;
  };

  const calculateAverageMonthlyExpense = (transactions) => {
    const monthlyExpenses = {};

    transactions.forEach((transaction) => {
      const [day, month, year] = transaction.Date.split("/").map(Number);
      const amount = parseFloat(transaction.Amount);

      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = 0;
      }

      if (transaction.MoneyIsAdded) {
        monthlyExpenses[month] -= amount;
      } else {
        monthlyExpenses[month] += amount;
      }
    });

    const totalExpense = Object.values(monthlyExpenses).reduce(
      (sum, expense) => sum + expense,
      0
    );
    const averageExpense = totalExpense / Object.keys(monthlyExpenses).length;

    return averageExpense;
  };

  const calculateMonthlyExpenses = (transactions) => {
    const monthlyExpenses = {};

    transactions.forEach((transaction) => {
      const [day, month, year] = transaction.Date.split("/").map(Number);
      const amount = parseFloat(transaction.Amount);

      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = { month, total: 0 };
      }

      if (transaction.MoneyIsAdded) {
        monthlyExpenses[month].total -= amount;
      } else {
        monthlyExpenses[month].total += amount;
      }
    });

    return Object.values(monthlyExpenses);
  };

  const countUniqueDays = (transactions) => {
    // Create a Set to store unique dates
    const uniqueDates = new Set();

    // Iterate over the transactions
    transactions.forEach((transaction) => {
      // Extract the date from each transaction
      const [day, month, year] = transaction.Date.split("/").map(Number);
      // Format the date as YYYY-MM-DD for consistency
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      // Add the formatted date to the Set
      uniqueDates.add(formattedDate);
    });

    // Return the count of unique dates
    return uniqueDates.size;
  };
  const calculateDailyLevels = (transactions) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = transactions.filter((transaction) => {
      const [day, month, year] = transaction.Date.split("/").map(Number);
      return month === currentMonth && year === currentYear;
    });

    if (monthlyTransactions.length === 0) return [];

    let totalAmount = 0;
    const dailyTotals = {};

    monthlyTransactions.forEach((transaction) => {
      const amount = parseFloat(transaction.Amount);
      const [day, month, year] = transaction.Date.split("/").map(Number);
      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const transactionAmount = transaction.MoneyIsAdded ? -amount : amount;

      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = 0;
      }
      dailyTotals[dateKey] += transactionAmount;
      totalAmount += transactionAmount;
    });

    const averageAmountPerDay = totalAmount / Object.keys(dailyTotals).length;

    const levels = [];
    for (let i = 1; i <= 4; i++) {
      levels.push((averageAmountPerDay * i) / 4);
    }

    const result = [];
    Object.keys(dailyTotals).forEach((dateKey) => {
      const total = dailyTotals[dateKey];
      let level = 4;
      for (let i = 0; i < levels.length; i++) {
        if (total <= levels[i]) {
          level = i + 1; // Adjusting level to start from 1
          break;
        }
      }
      const date = parseInt(dateKey.split("-")[2], 10); // Extracting day part
      result.push({ date, level });
    });
    console.log(result.sort((a, b) => a.date - b.date));
    setMonthLevel(result.sort((a, b) => a.date - b.date));
  };

  function getDayAndMonthInfo(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const dayIndex = date.getDay();
    const dayName = days[dayIndex];
    function getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }
    const totalDaysInMonth = getDaysInMonth(month, year);
    const dayPosition = dayIndex;

    return [dayName, totalDaysInMonth, dayPosition];
  }

  function isThere(index) {
    let level = 0;
    monthLevel?.map((data) => {
      if (data?.date == index - getDayAndMonthInfo("01/08/2024")[2]) {
        level = data?.level;
      }
    });

    return level;
  }

  const calculateTotalExpenses = (transactions) => {
    const currentDate = new Date();
    const currentMonth = parseInt(currentDate.getMonth()) + 1;
    const currentYear = currentDate.getFullYear();

    // Filter transactions for the current month and year
    const currentMonthTransactions = transactions.filter((transaction) => {
      const [day, month, year] = transaction.Date.split("/").map(Number);
      return month === currentMonth && year === currentYear;
    });

    if (currentMonthTransactions.length === 0) return [];

    // Calculate total expenses for each category
    const categoryExpenses = {};
    let totalExpenses = 0;

    currentMonthTransactions.forEach((transaction) => {
      const amount = parseFloat(transaction.Amount);
      const transactionAmount = transaction.MoneyIsAdded ? -amount : amount;

      if (!categoryExpenses[transaction.Category]) {
        categoryExpenses[transaction.Category] = 0;
      }
      categoryExpenses[transaction.Category] += transactionAmount;
      totalExpenses += transactionAmount;
    });

    // Prepare the result array
    const result = Object.keys(categoryExpenses).map((category, index) => {
      let uv = Math.round(categoryExpenses[category]); // Total expense on the category as an integer
      uv = uv < 0 ? 0 : uv; // Set uv to 0 if it is negative
      return {
        name: category,
        uv,
        pv: Math.round(totalExpenses), // Total expense in the month (same for every object)
        fill: colors[index % colors.length], // Colors assigned in order
      };
    });

    // result.push({
    //   name: "Temp Data",
    //   uv: Math.round(totalExpenses),
    //   pv: Math.round(totalExpenses),
    //   fill: "#F5F6FA",
    // });

    console.log(result);

    setCategoryData(result);
  };

  const h = 90;
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (budget.length != 0 && currMonthSpent.length != 0) {
      if (Number(currMonthSpent) >= Number(budget)) {
        setHeight(90);
      } else {
        setHeight(90 * (Number(currMonthSpent) / Number(budget)).toFixed(2));
      }
    }
  }, [budget, currMonthSpent]);

  return (
    <div className="w-full h-[100svh] fixed top-0 left-0 flex flex-col justify-start items-center bg-[#ffffff] z-40 overflow-y-scroll">
      {/* <TopNavbar /> */}
      {/* <GraphInfo total={getTotalSavings()} count={monthCount()} /> */}

      <div className="w-full h-[200px] flex justify-between items-center px-[20px] mt-[20px] font-[google] font-normal">
        <div className="w-[90px] h-full rounded-2xl bg-[#F5F6FA] flex flex-col justify-start items-start p-[20px]">
          <l-squircle
            size="50"
            stroke="3"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="#191A2C"
          ></l-squircle>
          <div
            className="h-[50px] mt-[-50px] w-full rounded-2xl bg-[#191a2c00] text-[#191A2C] flex justify-center items-center"
            onClick={() => {
              props?.setShowGraph(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </div>
          <div className="w-full h-[90px] rounded-2xl bg-[#ffffff] border border-[#e8e8e8] mt-[20px] flex justify-center items-end">
            <div
              className={`w-full h-[${height}px] bg-[#191A2C] rounded-b-2xl `}
            ></div>
          </div>
          {/* <div className="w-full h-[50px] rounded-[20px] bg-[white] mt-[5px] flex justify-center items-center"></div>
          <div className="w-full h-[50px] rounded-[20px] bg-[white] mt-[5px] flex justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bolt"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div> */}
        </div>

        <div className="h-full w-[calc(100%-100px)] ml-[10px] flex flex-col justify-start items-start">
          <div className="w-full h-[calc((100%-10px)/2)] bg-[#F5F6FA] rounded-2xl p-[20px] flex flex-col justify-start items-start">
            {/* <span className="w-[50px] h-[50px] rounded-full bg-[#191a2c84] flex justify-center items-center text-white"> */}
            {/* <span className="w-[45px] h-[45px] rounded-full bg-[#191A2C] flex justify-center items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </span> */}
            {/* </span> */}
            {/* <span className="w-full text-[15px] mt-[20px]">Savings Growth</span> */}
            <span className="w-full text-[14px] text-[#00000085] ">
              Savings in {monthNames[parseInt(new Date().getMonth())]}
            </span>
            <span className="w-full text-[25px] flex justify-between items-center ">
              <div className="flex justify-start items-center">
                {" "}
                <svg
                  className="ml-[-3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                {formatAmountWithCommas(
                  Number(budget) - Number(currMonthSpent)
                )}
              </div>

              <span className="w-auto text-[13px] mb-[-6px]">
                {per?.includes("-") ? (
                  <div className=" text-[#e61d0f] flex justify-start items-center whitespace-nowrap">
                    <div className=" text-[#e61d0f] mr-[6px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-trending-down"
                      >
                        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                        <polyline points="16 17 22 17 22 11" />
                      </svg>
                    </div>
                    {per?.split("-")[1]} %
                  </div>
                ) : (
                  <div className="text-[#00bb00] flex justify-start items-center whitespace-nowrap ">
                    <div className="text-[#00bb00]  mr-[6px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-trending-up"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    {per?.split("+")[1]} %
                  </div>
                )}
              </span>
            </span>
          </div>
          <div className="w-full h-[calc((100%-10px)/2)] mt-[10px] bg-[#F5F6FA] rounded-2xl flex flex-col justify-start items-start p-[20px]">
            {/* <span className="w-[50px] h-[50px] rounded-full bg-[#191a2c84] flex justify-center items-center text-white"> */}
            {/* <span className="w-[45px] h-[45px] rounded-full bg-[#191A2C] flex justify-center items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-wallet"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
            </span> */}
            {/* </span> */}
            <span className="w-full text-[14px]  whitespace-nowrap flex justify-start items-center text-[#00000085]">
              Expenses in {monthNames[parseInt(new Date().getMonth())]}
            </span>
            <span className="w-full text-[25px] whitespace-nowrap flex justify-between items-center">
              <div className="flex justify-start items-center">
                <svg
                  className="ml-[-3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                {formatAmountWithCommas(Number(currMonthSpent))}
              </div>

              <span className="w-auto text-[13px] mb-[-6px] text-[#00000085] flex justify-start items-center">
                {parseInt(ave) - parseInt(currMonthSpent) < 0 ? (
                  <div className=" text-[#e61d0f] flex justify-start items-center whitespace-nowrap">
                    <div className=" text-[#e61d0f] mr-[6px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-trending-up"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    {(
                      ((parseInt(currMonthSpent) - parseInt(ave)) /
                        parseInt(ave)) *
                      100
                    ).toFixed(2)}{" "}
                    %
                  </div>
                ) : (
                  <div className="text-[#00bb00]  flex justify-start items-center whitespace-nowrap">
                    <div className="text-[#00bb00]  mr-[6px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-trending-down"
                      >
                        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                        <polyline points="16 17 22 17 22 11" />
                      </svg>
                    </div>
                    {(
                      ((parseInt(ave) - parseInt(currMonthSpent)) /
                        parseInt(ave)) *
                      100
                    ).toFixed(2)}{" "}
                    %
                  </div>
                )}
                {/* {ave} (Avg) */}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-40px)] h-[207px] rounded-2xl bg-[#F5F6FA] ml-[20px] mr-[20px] mt-[10px] p-[20px] font-[google] font-normal">
        {drop ? (
          <>
            <div className="fixed left-[40px] mt-[40px] bg-[#191A2C] text-white text-[12.5px] min-w-[100px] h-[129px] overflow-y-scroll rounded-xl z-40 w-auto p-[12px] py-[9px] flex flex-col justify-start items-start">
              {monthNames?.map((data, index) => {
                return (
                  <>
                    <div
                      className="h-[25px] flex justify-start items-center mb-[7px]"
                      onClick={() => {
                        setMonthIndex(index);
                        setDrop(!drop);
                      }}
                    >
                      {data}
                    </div>
                  </>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* <div className="fixed left-[40px] mt-[35px] w-auto p-[12px] flex flex-col justify-start items-start"></div> */}
          </>
        )}
        <div className="w-full flex justify-between items-center">
          <div className="flex justify-start items-center">
            <div className="px-[12px] py-[4px] h-[30px] text-[12.5px] bg-[#191A2C] flex justify-center items-center text-[white] rounded-xl">
              {/* {monthNames[monthIndex]} */}
              2024
            </div>
            {/* <div
              className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#191A2C] text-[white] ml-[10px]"
              onClick={() => {
                setDrop(!drop);
              }}
            >
              {drop ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-up"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </>
              )}
            </div> */}
          </div>
          <div className="flex flex-col justify-center items-end text-[12.5px]">
            <div className="flex justify-end items-center">
              <div>Credited</div>
              <div className="w-[10px] rounded-full border-[1.2px] border-[#00bb00] ml-[4px]"></div>
            </div>
            <div className="flex justify-end items-center mt-[-3px]">
              <div>Debited</div>
              <div className="w-[10px] rounded-full border-[1.2px] border-[#e61d0f] ml-[4px]"></div>
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100%-30px)] flex flex-col justify-end items-center ">
          <div className="w-full min-h-[120px] mb-[-120px] bg-slate-400 z-20 chartBg flex justify-center items-center">
            {monthlyData?.length == 0 ? (
              <span className="mt-[-40px] text-[20px]">
                No Transactions Done Yet
              </span>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full min-h-[120px] ">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                // width={730}
                // height={250}
                data={monthlyData}
                // fontSize="16"
              >
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    {/* <stop offset="30%" stopColor="#191A2C" stopOpacity={1} />
                    <stop offset="80%" stopColor="#191A2C" stopOpacity={0} /> */}
                  </linearGradient>
                </defs>
                {/* <YAxis
                  domain={[1000, 100000]}
                  // style={{ fontSize: "10px" }}
                /> */}
                {/* <XAxis style={{ fontSize: "10px" }} dataKey="date"/>
                            <YAxis  style={{ fontSize: "10px" }}/> */}
                {/* <Tooltip content={<CustomTooltip />} /> */}

                <Area
                  type="natural"
                  dataKey="Out"
                  stroke="#e61d0f"
                  fillOpacity={0.25}
                  fill="#e61d0f85"
                />
                <Area
                  type="natural"
                  dataKey="In"
                  stroke="#00bb00"
                  fillOpacity={0.25}
                  fill="#00bb0085"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* <div className="w-full h-[300px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={monthlyData}
          >
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff" }}
              background
              clockWise
              dataKey="TotalExpense"
              fontSize={6}
              fill="#de8544"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={style}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div> */}
      <div className="w-full p-[20px] py-[10px] pb-[20px] h-auto flex flex-col justify-start items-start font-[google] font-normal">
        <div className="w-full h-[190px] flex justify-between items-start">
          <div className="w-[calc((100%-10px)/2)] h-full flex flex-col justify-start items-start">
            <div className="w-full h-[90px] rounded-2xl bg-[#F5F6FA] flex flex-col justify-center items-start p-[20px]">
              <span className="w-full text-[14px] text-[#00000085] ">
                Normal Trns. (x{normalC})
              </span>
              <span className="w-full text-[25px] flex justify-start items-center ">
                <svg
                  className="ml-[-3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                {formatAmountWithCommas(normalT)}
              </span>
            </div>
            <div className="w-full h-[90px] rounded-2xl bg-[#F5F6FA] mt-[10px] flex flex-col justify-center items-start p-[20px]">
              <span className="w-full text-[14px] text-[#00000085] ">
                Split Trns. (x{splitC})
              </span>
              <span className="w-full text-[25px] flex justify-start items-center ">
                <svg
                  className="ml-[-3px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
                {formatAmountWithCommas(splitT)}
              </span>
            </div>
          </div>
          <div className="w-[calc((100%-10px)/2)] rounded-2xl bg-[#F5F6FA] h-[190px] p-[20px]">
            <div className="w-full h-full flex justify-center items-center bg-[#F5F6FA] ">
              {categoryData.length == 0 ? (
                <span className="text-[20px]">No Data</span>
              ) : (
                <>
                  {" "}
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="100%"
                      barSize={3}
                      data={categoryData}
                    >
                      <RadialBar
                        minAngle={15}
                        // label={{ position: '', fill: '#fff' }}
                        background
                        clockWise
                        dataKey="uv"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[160px] mt-[10px] flex justify-start items-start">
          <div className="w-[calc(100%-120px)] h-full bg-[#F5F6FA] rounded-2xl p-[20px] flex justify-center items-center">
            <div className="w-auto h-[20px] flex justify-center items-center -rotate-90 ml-[-13px]">
              {monthNames[parseInt(new Date().getMonth())]}
            </div>
            <div className="w-[154px] h-auto flex flex-wrap justify-start items-start">
              {Array(
                getDayAndMonthInfo("01/08/2024")[1] +
                  getDayAndMonthInfo("01/08/2024")[2]
              )
                .fill("")
                .map((data, index) => {
                  return (
                    <>
                      <div
                        className={
                          "w-[17px] h-[17px] min-hw[14px] min-h-[14px] rounded-md  m-[2px] border  flex justify-center items-center" +
                          (index < getDayAndMonthInfo("01/08/2024")[2]
                            ? " bg-transparent border-[#e8e8e800]"
                            : isThere(index) == 1
                            ? " bg-[#191a2c18] border-[#e8e8e8]"
                            : isThere(index) == 2
                            ? " bg-[#191a2c3e] border-[#e8e8e8]"
                            : isThere(index) == 3
                            ? " bg-[#191a2c78] border-[#e8e8e8]"
                            : isThere(index) == 4
                            ? " bg-[#191a2cb7] border-[#e8e8e8]"
                            : " bg-[#ffffff] border-[#e8e8e8]")
                        }
                      >
                        {/* {isThere(index) == 0 ? (
                          <div className="text-[red]">•</div>
                        ) : (
                          <></>
                        )} */}
                      </div>
                    </>
                  );
                })}
            </div>
            {/* <div className="w-[18px] h-[18px] rounded-md bg-[white] m-[3px]"></div>
            <div className="w-[18px] h-[18px] rounded-md bg-[white] m-[3px]"></div> */}
          </div>
          <div className="h-full bg-[#F5F6FA] rounded-2xl w-[110px] ml-[10px] p-[20px]">
            <div className=" h-full rounded-2xl flex justify-start items-center bg-[#ffffff00] w-full">
              <div className="w-full h-full flex justify-center items-center flex-col">
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <span className="text-[14px] text-[#3d3d3db1] ">
                    {/* {months[parseInt(new Date().getMonth())].Month} */}
                    {
                      monthsShort[
                        parseInt(props?.data?.Date?.split("/")[1]) - 1
                      ]
                    }
                  </span>
                  <span className="text-[28px] text-[#000000] mt-[-3px]">
                    {/* {data + index} */}
                    {parseInt(props?.data?.Date?.split("/")[0])}
                  </span>
                </div>
                <div className="w-full h-full mt-[-85px] flex  justify-center items-end  text-[#00e1ff]">
                  <span class="relative flex h-[7px] w-[7px] mx-[2px] mb-[17px]">
                    <span
                      class={
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#99ff1d]"
                      }
                    ></span>
                    <span
                      class={
                        "relative inline-flex rounded-full h-[7px] w-[7px] bg-[#99ff1d]"
                      }
                    ></span>
                  </span>
                </div>
              </div>
            </div>
            {/* {props?.data?.Date} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBarGraph;
