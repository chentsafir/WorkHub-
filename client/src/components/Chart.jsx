import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart component
 * Renders a responsive bar chart with given data.
 *
 * @param {Object[]} data - Array of data objects to display in the chart
 */
export const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width={"100%"} height={500}>
      <BarChart width={150} height={40} data={data}>
        <XAxis dataKey='name' /> {/* X axis based on "name" key */}
        <YAxis /> {/* Y axis with default settings */}
        <Tooltip
          cursor={false} // Disable cursor highlight on hover
          contentStyle={{ textTransform: "capitalize" }} // Capitalize tooltip text
        />
        <CartesianGrid strokeDasharray='3 3' /> {/* Grid with dashed lines */}
        <Bar dataKey='total' fill='#8884d8' /> {/* Bars show "total" value */}
      </BarChart>
    </ResponsiveContainer>
  );
};
