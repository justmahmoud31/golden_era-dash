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
    size: "",
    type: "Gold",
    category: "",
    subCategory: "",
    stock: "",
    rate: "",
    karat: "",
    description: "",
    isFeatured: false,
  });

  const [coverImages, setCoverImages] = useState([]);
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
const { data: categoryData, isLoading: loadingCategories } = useCategory();
const { data: subCategoryData, isLoading: loadingSubCategories } = useSubCategory(formData.category);
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
      form.append(key, value);
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
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg shadow-md bg-[#eee]  space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text fields */}
        {["name", "size", "stock", "rate", "karat"].map((field) => (
          <div key={field}>
            <Label htmlFor={field} className="capitalize">
              {field}
            </Label>
            <Input
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}
        {/* Category Dropdown */}
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value,
                subCategory: "",
              });
            }}
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

        {/* SubCategory Dropdown */}
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

        {/* Description */}
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

        {/* Cover Images Upload */}
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

        {/* Additional Images Upload */}
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
