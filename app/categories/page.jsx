'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Shared/Loading/Loading';
import { useCategory } from '@/hooks/useCategory';
import { Pencil, Trash, Eye } from "lucide-react";
export default function CategoryPage() {
  const { data, isLoading, isError } = useCategory();

  if (isError) {
    toast.error('Failed to load categories');
  }

  return (
    <Card className=" mx-auto mt-10 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Categories</CardTitle>
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
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || 'No description'}</TableCell>
                  <TableCell>
                    <button className="text-blue-500 hover:underline">
                      <Pencil className="h-5 w-5" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button className="text-red-500 hover:underline">
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
  );
}