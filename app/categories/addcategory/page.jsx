"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function Page() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setdescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    setLoading(true);

    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category added successfully");
      setName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Category description"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neon-gold text-white py-2 rounded hover:bg-neon-gold disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

export default Page;
