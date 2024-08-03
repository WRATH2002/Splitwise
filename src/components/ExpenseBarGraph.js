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
import TopNavbar from "./TopNavbar";
import QuickInfo from "./QuickInfo";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { BiRupee } from "react-icons/bi";
import GraphInfo from "./GraphInfo";
import { Radar } from "lucide";

const data = [
  {
    name: "June",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "July",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "August",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

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

const ExpenseBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [budget, setBudget] = useState("");
  const [per, setPer] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [opacity, setOpacity] = React.useState({
    Budget: 1,
    Income: 1,
    Savings: 1,
    TotalExpense: 1,
  });

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
        if (data?.MoneyIsAdded) {
          arr.push({ Out: data?.Amount, In: data?.Amount });
        } else {
          arr.push({ Out: data?.Amount, In: 0 });
        }
      });
      calculateCategoryTotals(transactionHistory);
      setPer(calculateSavingsPercentageChange(transactionHistory, budget));
    }
    setMonthlyData(arr);
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

  return (
    <div className="w-full h-[100svh] fixed top-0 left-0 flex flex-col justify-start items-center bg-[#ffffff] z-40">
      {/* <TopNavbar /> */}
      <GraphInfo total={getTotalSavings()} count={monthCount()} />

      <div className="w-full h-[200px] flex justify-between items-center px-[20px] mt-[20px] font-[google] font-normal">
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#F5F6FA] rounded-2xl p-[20px] flex flex-col justify-start items-start">
          <span className="w-[50px] h-[50px] rounded-full bg-[#191a2c84] flex justify-center items-center text-white">
            <span className="w-[40px] h-[40px] rounded-full bg-[#191A2C] flex justify-center items-center text-white">
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
            </span>
          </span>
          <span className="w-full text-[15px] mt-[20px]">Savings Growth</span>
          <span className="w-full text-[25px]">{per} %</span>
        </div>
        <div className="w-[calc((100%-20px)/2)] h-full bg-[#F5F6FA] rounded-2xl flex flex-col justify-start items-start p-[20px]">
          <span className="w-[50px] h-[50px] rounded-full bg-[#191a2c84] flex justify-center items-center text-white">
            <span className="w-[40px] h-[40px] rounded-full bg-[#191A2C] flex justify-center items-center text-white">
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
            </span>
          </span>
          <span className="w-full text-[15px] mt-[20px]">Total Spent</span>
          <span className="w-full text-[25px]">24613</span>
          <span className="w-full text-[15px] text-[#00000085]">
            {average()} (Avg)
          </span>
        </div>
      </div>
      <div className="w-[calc(100%-40px)] h-[187px] rounded-2xl bg-[#F5F6FA] ml-[20px] mr-[20px] mt-[20px] p-[20px]">
        <div className="w-full flex justify-start items-center">
          <div className="px-[12px] py-[4px] text-[12.5px] bg-[#191A2C] text-[white] rounded-xl">
            August
          </div>
        </div>
        <div className="w-full h-[calc(100%-30px)] flex flex-col justify-end items-center ">
          <div className="w-full h-[100px] mb-[-100px] bg-slate-400 z-20 chartBg"></div>
          <div className="w-full h-[100px] ">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={730}
                height={250}
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
                  domain={[1000, "dataMax"]}
                  style={{ fontSize: "10px" }}
                /> */}
                {/* <XAxis style={{ fontSize: "10px" }} dataKey="date"/>
                            <YAxis  style={{ fontSize: "10px" }}/> */}
                {/* <Tooltip content={<CustomTooltip />} /> */}

                <Area
                  type="natural"
                  dataKey="Out"
                  stroke="#e61d0f"
                  fillOpacity={1}
                  fill="transparent"
                />
                <Area
                  type="natural"
                  dataKey="In"
                  stroke="#00bb00"
                  fillOpacity={1}
                  fill="transparent"
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
    </div>
  );
};

export default ExpenseBarGraph;
