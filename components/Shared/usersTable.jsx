'use client';

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const UserTable = ({ users }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    const toastId = toast.loading("Deleting user...");
    setLoadingId(selectedUserId);

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      toast.success("User deleted successfully", { id: toastId });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete user", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Blocked</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.isBlocked ? 'Yes' : 'No'}</TableCell>
              <TableCell>{user.addresses?.[0]?.city || '-'}</TableCell>
              <TableCell>{user.addresses?.[0]?.street || '-'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  {open && selectedUserId === user._id && (
                    <DialogContent onInteractOutside={() => setOpen(false)}>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                      </DialogHeader>
                      <div className="py-2">
                        <p>This action cannot be undone.</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={loadingId === user._id}
                        >
                          {loadingId === user._id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserTable;
