import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// import { chartData } from "../assets/data";
import { apiGet } from "../utils/https";

export const Chart = () => {

  const [chartData, setChartData] = useState([]);
  const [chartHeight, setChartHeight] = useState(300); // Default height
  const [totalTasks, setTotalTasks] = useState(0); // Total task count

  const fetchTasks = async () => {
    try {
      const res = await apiGet("/api/task");
      console.log("API Response:", res);

      if (res.tasks && res.tasks.length > 0) {
        setTotalTasks(res.tasks.length);
        const newChartData = processChartData(res.tasks);
        setChartData(newChartData);
        adjustChartHeight(res.tasks.length);
      } else {
        setChartData([]);
        setTotalTasks(0);
        setChartHeight(300); // Reset height if no tasks
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const processChartData = (tasks) => {
    const priorityCounts = { high: 0, medium: 0, low: 0 };

    tasks.forEach((task) => {
      const priority = task.priority?.toLowerCase(); // Ensure case-insensitivity
      if (priority in priorityCounts) {
        priorityCounts[priority]++;
      }
    });

    return [
      { name: "High", total: priorityCounts.high },
      { name: "Medium", total: priorityCounts.medium },
      { name: "Low", total: priorityCounts.low },
    ];
  };

  const adjustChartHeight = (taskCount) => {
    const newHeight = Math.min(600, 300 + taskCount * 10); // Max 600px
    setChartHeight(newHeight);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log("Updated chartData:", chartData);
  }, [chartData]); // Logs when chartData updates

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey='name' />
        <YAxis domain={[0, Math.max(totalTasks, 0)]} />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey='total' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  );
};
