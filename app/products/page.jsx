"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/useproducts";
import ProductsTable from "@/components/Shared/products-table";
import Link from "next/link";
import Loading from "@/components/Shared/Loading/Loading";

export default function ProductsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useProducts(page);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (error) return <div className="text-red-500">Error loading products</div>;

  const { products, pages } = data;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <Link
          href={"/products/addproduct"}
          className="bg-neon-gold text-white p-2 rounded-lg"
        >
          Add Product
        </Link>
      </div>
      <ProductsTable
        products={products}
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </div>
  );
}
