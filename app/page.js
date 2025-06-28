"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  LayoutList,
  ShoppingCart,
  Users,
  Plus,
  UserPlus,
  User,
} from "lucide-react";
import OrderInsightsChart from "@/components/Shared/OrderInsightsChart";

const iconMap = {
  products: <Boxes className="h-6 w-6 text-yellow-600" />,
  categories: <LayoutList className="h-6 w-6 text-blue-600" />,
  orders: <ShoppingCart className="h-6 w-6 text-green-600" />,
  users: <Users className="h-6 w-6 text-red-600" />,
};

export default function Home() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/system`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      });
  }, []);

  const quickActions = [
    {
      label: "Add Product",
      icon: <Plus className="h-5 w-5 mr-2" />,
      href: "/products/add",
    },
    {
      label: "Add Category",
      icon: <LayoutList className="h-5 w-5 mr-2" />,
      href: "/categories/add",
    },
    {
      label: "Add Subcategory",
      icon: <LayoutList className="h-5 w-5 mr-2" />,
      href: "/subcategories/add",
    },
    {
      label: "Browse Users",
      icon: <User className="h-5 w-5 mr-2" />,
      href: "/users",
    },
    {
      label: "Add Admin",
      icon: <UserPlus className="h-5 w-5 mr-2" />,
      href: "/users/add",
    },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <Card
            key={key}
            className="shadow-lg border rounded-xl hover:shadow-xl transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg capitalize">{key}</CardTitle>
              {iconMap[key]}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-gray-400">Loading...</div>
              ) : (
                <div className="text-3xl font-bold">{value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex items-center cursor-pointer px-5 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition"
              variant="default"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <OrderInsightsChart />
      </div>
    </div>
  );
}
