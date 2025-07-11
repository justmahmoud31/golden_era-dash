"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Pencil, Trash, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Shared/Loading/Loading";
import { useCategory } from "@/hooks/useCategory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";

export default function CategoryPage() {
  const { data, isLoading, isError, refetch } = useCategory();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  if (isError) {
    toast.error("Failed to load categories");
  }

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setEditedName(category.name);
    setEditedDescription(category.description || "");
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;

    setEditLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${selectedCategory._id}`,
        { name: editedName, description: editedDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category updated successfully");
      setEditDialogOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setDeleteLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${selectedCategory._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Card className="mx-auto mt-10 shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Categories</h2>
            <Link
              href={"/categories/addcategory"}
              className="bg-neon-gold rounded-md text-white p-2"
            >
              Add Category
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>SubCategory</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/categories/subcategory/${category._id}`}
                        className="cursor-pointer"
                      >
                        view subcategories{" "}
                        <Eye className="h-5 w-5 inline-block ml-2" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openEditDialog(category)}
                        className="text-blue-500 hover:underline"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openDeleteDialog(category)}
                        className="text-red-500 hover:underline"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <Textarea
              placeholder="Category description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedCategory?.name}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
