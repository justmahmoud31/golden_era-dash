"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function page() {
  const { slug } = useParams();
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/subcategory`,
        { name, description, category: slug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("SubCategory added successfully");
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
      <h2 className="text-xl font-semibold mb-4">Add New SubCategory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="SubCategory name"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="SubCategory description"
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

export default page;
