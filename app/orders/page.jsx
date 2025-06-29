import OrdersTable from '@/components/Shared/orders-table';
import React from 'react';


export default function OrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
      <OrdersTable />
    </div>
  );
}
