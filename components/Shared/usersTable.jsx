import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const UserTable = ({ users }) => {
  return (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
