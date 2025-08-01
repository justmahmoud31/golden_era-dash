'use client';

import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import UserTable from '@/components/Shared/usersTable';
import MakeAdminDialog from '@/components/Shared/MakeAdminDialog';


function Page() {
  const { data, isLoading, isError } = useUsers(1);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError || !data) return <div className="p-4 text-red-500">Failed to load users.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <MakeAdminDialog />
      </div>
      <UserTable users={data.users} />
    </div>
  );
}

export default Page;
