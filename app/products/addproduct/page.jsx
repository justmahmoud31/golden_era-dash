"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategory } from "@/hooks/useCategory";
import { useSubCategory } from "@/hooks/useSubCategory";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    type: "Gold",
    category: "",
    subCategory: "",
    stock: "",
    karat: "",
    description: "",
    isFeatured: false,
    hasName: false,
    defaultPrice: "",
  });

  const [coverImages, setCoverImages] = useState([]);
  const [images, setImages] = useState([]);

  const { data: categoryData } = useCategory();
  const { data: subCategoryData } = useSubCategory(formData.category);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e, isCover = false) => {
    const files = Array.from(e.target.files);
    if (isCover) setCoverImages(files);
    else setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if ((key === "karat" || key === "size") && formData.type !== "Gold")
        return;
      if (key === "defaultPrice" && formData.type === "Gold") return;

      if (value !== "") {
        form.append(key, value);
      }
    });

    coverImages.forEach((file) => form.append("cover_images", file));
    images.forEach((file) => form.append("images", file));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product added successfully!");
      router.push("/products");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg shadow-md bg-[#eee] space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

  

        {/* type */}
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            {["Gold", "Silver", "other"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* karat (Gold only) */}
        {/* karat (Gold only) */}
        {formData.type === "Gold" && (
          <div>
            <Label htmlFor="karat">Karat</Label>
            <select
              id="karat"
              name="karat"
              value={formData.karat}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Karat</option>
              {[18, 21, 24].map((k) => (
                <option key={k} value={k}>
                  {k}k
                </option>
              ))}
            </select>
          </div>
        )}

        {/* size (Gold only) */}
        {formData.type === "Gold" && (
          <div>
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* defaultPrice (Silver or other only) */}
        {formData.type !== "Gold" && (
          <div>
            <Label htmlFor="defaultPrice">Default Price</Label>
            <Input
              id="defaultPrice"
              name="defaultPrice"
              value={formData.defaultPrice}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* hasName checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasName"
            name="hasName"
            checked={formData.hasName}
            onChange={handleInputChange}
          />
          <Label htmlFor="hasName">Has Name Engraving?</Label>
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
                subCategory: "",
              })
            }
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {categoryData?.categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* subCategory */}
        {formData.category && (
          <div>
            <Label htmlFor="subCategory">SubCategory</Label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select SubCategory</option>
              {subCategoryData?.subcategories?.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        {/* isFeatured */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
          />
          <Label htmlFor="isFeatured">Is Featured?</Label>
        </div>

        {/* Cover Images */}
        <div>
          <Label>Cover Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, true)}
          />
          <div className="flex gap-3 mt-2 flex-wrap">
            {coverImages.map((file, idx) => (
              <Image
                key={idx}
                src={URL.createObjectURL(file)}
                alt="cover"
                width={100}
                height={100}
                className="rounded border object-cover"
              />
            ))}
          </div>
        </div>

        {/* Additional Images */}
        <div>
          <Label>Additional Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, false)}
          />
          <div className="flex gap-3 mt-2 flex-wrap">
            {images.map((file, idx) => (
              <Image
                key={idx}
                src={URL.createObjectURL(file)}
                alt="additional"
                width={100}
                height={100}
                className="rounded border object-cover"
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
