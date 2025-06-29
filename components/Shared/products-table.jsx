"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function ProductsTable({
  products = [],
  page,
  pages,
  onPageChange,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleDelete = async () => {
    if (!productToDelete?._id) return;

    try {
      const token = Cookies.get("token");
      await axios.delete(`${baseUrl}/api/product/${productToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted successfully");
      setShowDeleteDialog(false);
      setProductToDelete(null);
      onPageChange(page); // refetch current page
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="w-full border rounded-md overflow-x-auto">
      <Table className="[&>tbody>tr:hover]:bg-transparent">
        <TableHeader>
          <TableRow className="bg-neon-gold text-white">
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Karat</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Subcategory</TableHead>
            <TableHead>View</TableHead>
            {/* <TableHead>Update</TableHead> */}
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                {product.cover_images?.[0] ? (
                  <img
                    src={`${baseUrl}/${product.cover_images[0]}`}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {product.description}
              </TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.karat}</TableCell>
              <TableCell>{product.size}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.rate}</TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>{product.subCategory?.name}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Eye
                      className="h-4 w-4 text-blue-500 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    />
                  </DialogTrigger>
                  <DialogContent className="my-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border-0">
                    {selectedProduct && (
                      <div className="flex flex-col gap-8 p-6">
                        {/* IMAGES: Cover + Additional */}
                        <div className="flex flex-col gap-6">
                          {/* Cover Images */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                              Cover Image
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                              {(selectedProduct.cover_images || []).map(
                                (img, idx) => (
                                  <img
                                    key={`cover-${idx}`}
                                    src={`${baseUrl}/${img}`}
                                    alt={`cover ${idx}`}
                                    className="w-32 h-32 rounded-lg object-cover border shadow"
                                  />
                                )
                              )}
                              {selectedProduct.cover_images?.length === 0 && (
                                <span className="text-sm text-gray-500 italic">
                                  No cover image
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Additional Images */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                              Additional Images
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                              {(selectedProduct.images || []).map(
                                (img, idx) => (
                                  <img
                                    key={`img-${idx}`}
                                    src={`${baseUrl}/${img}`}
                                    alt={`image ${idx}`}
                                    className="w-28 h-28 rounded-md object-cover border"
                                  />
                                )
                              )}
                              {selectedProduct.images?.length === 0 && (
                                <span className="text-sm text-gray-500 italic">
                                  No extra images
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="flex flex-col gap-4 text-sm text-gray-700">
                          <h2 className="text-2xl font-bold text-gray-800 text-center">
                            {selectedProduct.name}
                          </h2>
                          <div className="space-y-2">
                            <p>
                              <span className="font-semibold text-gray-900">
                                Description:
                              </span>{" "}
                              {selectedProduct.description}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Price:
                              </span>{" "}
                              ${selectedProduct.price}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Stock:
                              </span>{" "}
                              {selectedProduct.stock}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Karat:
                              </span>{" "}
                              {selectedProduct.karat}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Size:
                              </span>{" "}
                              {selectedProduct.size}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Type:
                              </span>{" "}
                              {selectedProduct.type}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Rate:
                              </span>{" "}
                              {selectedProduct.rate}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Category:
                              </span>{" "}
                              {selectedProduct.category?.name}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">
                                Subcategory:
                              </span>{" "}
                              {selectedProduct.subCategory?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
              {/* <TableCell>
                <Pencil className="h-4 w-4 text-green-500 cursor-pointer" />
              </TableCell> */}
              <TableCell>
                <Trash
                  className="h-4 w-4 text-red-500 cursor-pointer"
                  onClick={() => {
                    setProductToDelete(product);
                    setShowDeleteDialog(true);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Deletion
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
