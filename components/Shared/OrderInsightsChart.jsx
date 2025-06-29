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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        const monthlyData = res.data?.insights?.monthlyData || [];

        const labels = monthlyData.map((item) => item._id);
        const orderCounts = monthlyData.map((item) => item.totalOrders);
        const revenueSums = monthlyData.map((item) => item.totalRevenue);

        setData({
          labels,
          orders: orderCounts,
          revenues: revenueSums,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order insights:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-500">Loading insights...</div>;

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Total Orders",
        data: data?.orders || [],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderRadius: 6,
      },
      {
        label: "Total Revenue ($)",
        data: data?.revenues || [],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
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
      <p className="text-gray-600 mb-4">
        This chart shows the number of orders placed each month, helping you
        track trends and seasonal patterns.
      </p>
      <h3 className="mb-2 font-medium text-gray-700">
        Latest Month Revenue: $
        {data?.revenues?.[data.revenues.length - 1]?.toFixed(2) || 0}
      </h3>
      <h3 className="mb-2 font-medium text-gray-700">
        The paid Orders Count of the last month {data?.orders?.[data.orders.length - 1] || 0} orders.
      </h3>
      <div className="bg-white rounded-xl shadow p-4">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
