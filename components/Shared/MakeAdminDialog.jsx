"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function MakeAdminDialog() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useUsers(1);
  const [loadingId, setLoadingId] = useState(null);

  const makeAdmin = async (userId) => {
    setLoadingId(userId);
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}/admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User promoted to admin.");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to promote user.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4 bg-neon-gold text-white hover:bg-gold">
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a User to Make Admin</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4">Loading users...</div>
        ) : isError || !data ? (
          <div className="p-4 text-red-500">Failed to load users.</div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {data.users.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center border rounded p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  className={
                    user.role === "user"
                      ? "px-4 py-2 bg-neon-gold text-white rounded hover:bg-gold transition-colors"
                      : "hidden"
                  }
                  disabled={loadingId === user._id}
                  onClick={() => makeAdmin(user._id)}
                >
                  {loadingId === user._id ? "Processing..." : "Make Admin"}
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
