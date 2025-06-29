'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useSubCategory } from '@/hooks/useSubCategory';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '@/components/ui/table';
import Loading from '@/components/Shared/Loading/Loading';
import { toast } from 'react-hot-toast';
import { Pencil, Trash } from "lucide-react";
export default function SubCategoryPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useSubCategory(slug);

  if (isError) {
    toast.error('Failed to load subcategories');
  }

  return (
    <Card className="mx-auto mt-10 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">SubCategories</CardTitle>
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
                <TableHead>Parent Category</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.subcategories?.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.description || 'No description'}</TableCell>
                  <TableCell>{sub.category?.name}</TableCell>
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
