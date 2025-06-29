"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQueryClient } from '@tanstack/react-query';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function OrdersTable() {
  const { data, isLoading, isError } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();
  if (isLoading) return <div className="text-gray-500">Loading orders...</div>;
  if (isError) return <div className="text-red-500">Failed to load orders</div>;

  const orders = data?.orders || [];

  return (
    <div className="mt-10 overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                {order.user.firstName} {order.user.lastName}
              </TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.shippingAddress.city}</TableCell>
              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
      ${
        order.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : order.status === "Processing"
          ? "bg-blue-100 text-blue-700"
          : order.status === "Shipped"
          ? "bg-purple-100 text-purple-700"
          : order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : order.status === "Cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
                >
                  {order.status}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={
                    order.isPaid
                      ? "bg-green-400 text-white p-1 rounded-xl"
                      : "bg-red-400 text-white p-1 rounded-xl"
                  }
                >
                  {order.isPaid ? "Yes" : "No"}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Eye
                      className="h-5 w-5 text-blue-500 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    {selectedOrder && (
                      <div className="p-4 space-y-4">
                        <h2 className="text-lg font-bold">Order Details</h2>
                        <p>
                          <strong>Customer:</strong>{" "}
                          {selectedOrder.user.firstName}{" "}
                          {selectedOrder.user.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedOrder.user.email}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {selectedOrder.shippingAddress.street},{" "}
                          {selectedOrder.shippingAddress.city}
                        </p>
                        <p>
                          <strong>Total:</strong> $
                          {selectedOrder.totalPrice.toFixed(2)}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedOrder.status}
                        </p>
                        <p>
                          <strong>Paid:</strong>{" "}
                          {selectedOrder.isPaid
                            ? `Yes (at ${new Date(
                                selectedOrder.paidAt
                              ).toLocaleString()})`
                            : "No"}
                        </p>

                        <h3 className="font-semibold mt-4 mb-2">Items</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedOrder.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-4 border p-2 rounded-md"
                            >
                              <img
                                src={`${baseUrl}/${item.cover_image}`}
                                alt={item.name}
                                className="w-16 h-16 rounded object-cover border"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Pencil
                      className="h-5 w-5 text-blue-500 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    {selectedOrder && (
                      <div className="space-y-2">
                        <label htmlFor="status" className="block font-medium">
                          Update Status
                        </label>
                        <select
                          id="status"
                          className="w-full border rounded-md px-2 py-1"
                          value={selectedOrder.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const token = Cookies.get("token");

                            try {
                              await axios.patch(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/${selectedOrder._id}`,
                                { status: newStatus },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              toast.success("Order status updated");
                              queryClient.invalidateQueries(['orders']);
                              // Update local state (you could also refetch if needed)
                              setSelectedOrder((prev) => ({
                                ...prev,
                                status: newStatus,
                              }));
                            } catch (error) {
                              toast.error("Failed to update status");
                              console.error(error);
                            }
                          }}
                        >
                          {[
                            "Pending",
                            "Processing",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                          ].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
