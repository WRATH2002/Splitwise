import React, { useEffect, useState } from "react";
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
} from "recharts";
import TopNavbar from "./TopNavbar";
import QuickInfo from "./QuickInfo";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { BiRupee } from "react-icons/bi";
import GraphInfo from "./GraphInfo";

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

const ExpenseBarGraph = () => {
  const [monthlyData, setMonthlyData] = useState([]);
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

  function fetchUserData() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      setMonthlyData(snapshot?.data()?.MonthlyData);
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
  return (
    <div className="w-full h-[100svh] fixed top-0 left-0 flex flex-col justify-start items-center py-[20px] bg-[#fff5ee] z-40">
      <TopNavbar />
      <GraphInfo total={getTotalSavings()} count={monthCount()} />
      <div className="w-full h-[300px] px-[20px] mt-[20px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={300}
            data={monthlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="2 2 " />
            <XAxis dataKey="Month" fontSize={12} />
            {/* <YAxis /> */}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              margin={20}
              fontSize={3}
            />
            <Area
              type="bump"
              dataKey="Income"
              fill="#ffbc8f"
              stroke="#8884d8"
            />
            <Bar
              dataKey="Income"
              fill="#b63525"
              // activeBar={<Rectangle fill="gold" stroke="purple" />}
              fillOpacity={opacity.Income}
            />
            <Bar
              dataKey="Budget"
              fill="#d74e25"
              // activeBar={<Rectangle fill="gold" stroke="purple" />}
              fillOpacity={opacity.Budget}
            />
            <Bar
              dataKey="TotalExpense"
              fill="#ea682a "
              // activeBar={<Rectangle fill="pink" stroke="blue" />}
              fillOpacity={opacity.TotalExpense}
            />
            <Bar
              dataKey="Savings"
              fill="#ee8a56"
              // activeBar={<Rectangle fill="gold" stroke="purple" />}
              fillOpacity={opacity.Savings}
            />
          </ComposedChart>
          {/* <ComposedChart
            width={500}
            height={400}
            data={monthlyData}
            margin={
              {
                //   top: 20,
                //   right: 80,
                //   bottom: 20,
                //   left: 20,
              }
            }
          >
             <CartesianGrid stroke="#f5f5f5" /> 
             <XAxis
              dataKey="Month"
              label={{
                value: "Pages",
                position: "insideBottomRight",
                offset: 0,
              }}
              scale="band"
              fontSize={12}
            />
            <YAxis
              label={{ angle: -90, position: "insideRigth" }}
              fontSize={12}
            /> 
            <Tooltip />
            <Legend />
            <Area
              type="bump"
              dataKey="Income"
              fill="#ffbc8f"
              stroke="#8884d8"
            />
            <Bar dataKey="TotalExpense" barSize={20} fill="#de8544" />
            <Line type="monotone" dataKey="Budget" stroke="#21afff" />
          </ComposedChart> */}
        </ResponsiveContainer>
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
