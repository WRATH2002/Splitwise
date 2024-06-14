import React, { PureComponent, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaHandHoldingMedical, FaShopify } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";
import SubGraph from "./SubGraph";

const data = [
  { label: "Shopping", amount: 400 },
  { label: "Entertainment", amount: 300 },
  { label: "Food & Drinks", amount: 300 },
  { label: "Group D", amount: 200 },
  { label: "Group sfd", amount: 200 },
  { label: "Group g", amount: 200 },
];

const COLORS = [
  "#95241d",
  "#b63525",
  "#d74e25",
  "#ea682a",
  "#ee8a56",
  "#f2a87f",
];
// const [dataa, setDataa] = useState([]);

// const ChangeData = () => {
//   function filterAndConvertAmounts(objects) {
//     return objects.map((obj) => ({
//       Category: obj.Category,
//       Amount: parseFloat(obj.Amount),
//     }));
//   }
//   return <></>;
// };

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 7}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#000000"
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        fontSize={14}
        textAnchor={textAnchor}
        fill="#000000"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

export default class UsageGraph extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si";

  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <div className="w-full h-full bg-[#fff5ee] flex flex-col justify-start items-center overflow-y-scroll">
        <div className="w-full h-[270px] ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#de8544"
                dataKey="amount"
                onMouseEnter={this.onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full h-[calc(100%-320px)] flex flex-col">
          <SubGraph />
        </div>
      </div>
    );
  }
}
