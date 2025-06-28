"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OrderInsightsChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/system/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order insights:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-500">Loading insights...</div>;

  const chartData = {
    labels: data?.months || [],
    datasets: [
      {
        label: "Orders per Month",
        data: data?.counts || [],
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Orders Overview",
      },
    },
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Insights</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
