"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa'
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  createAt: string;
};

type EditState = {
  name: string;
  category: string;
  price: string;
  quantity: string;
  image: File | null;
};

const Fetch_data = ({ open }: { open: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/inventory");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditOpen = (product: Product) => {
    setEditingId(product.id);
    setEditState({
      name: product.name,
      category: product.category,
      price: String(product.price),
      quantity: String(product.quantity),
      image: null,
    });
    setOpenActionId(null);
  };

  const handleEditSave = async (id: number) => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", editState.name);
      formData.append("category", editState.category);
      formData.append("price", editState.price);
      formData.append("quantity", editState.quantity);
      if (editState.image) {
        formData.append("image", editState.image);
      }

      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      const updated: Product = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 w-full h-[100vh]">Loading products...</p>;
  }

  return (
    <div className="flex-1 transition-all duration-300 h-[100vh] sm:m-4 m-1 [&::-webkit-scrollbar]:hidden overflow-auto">
      <div
        style={{ boxShadow: "20px 20px 60px #526044,-20px -20px 60px #70825c" }}
        className=" mb-6 rounded-b-4xl h-3 bg-[#e7f5dd]"
      >
        

      </div>

      {products.length === 0 ? (
        <div className="bg-white text-black p-10 rounded-xl text-center shadow">
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid sm-gap-6 gap-2 sm:grid-cols-2 grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white relative rounded-2xl shadow-md overflow-hidden"
            >
              {/* Action toggle — per card */}
              <button
                onClick={() =>
                  setOpenActionId(
                    openActionId === product.id ? null : product.id
                  )
                }
                className="absolute right-4 bg-[#0a0a0a] text-sm px-4 rounded-b-2xl cursor-pointer"
              >
                Action
              </button>

          
              {openActionId === product.id && (
                <div className="absolute top-2.5 bg-[#dcf3c3] rounded-[2px] px-5  right-1.5 flex  gap-3  z-10">
                  <button
                    onClick={() => handleEditOpen(product)}
                    className="flex-1  text-black py-2 rounded-lg cursor-pointer"
                  >
                    <FaEdit/>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="flex-1  text-white py-2 rounded-lg disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === product.id ? "..." : <FaTrash className="text-red-500"/>}
                  </button>
                </div>
              )}

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 space-y-2 relative">
                <h3 className="absolute -top-[50px] text-xl font-bold text-[#cdf4af] backdrop-blur-2xl px-5 rounded-b-2xl">
                  {product.category}
                </h3>
                <p className="text-gray-500">{product.name}</p>
                <div className="flex justify-between text-[var(--dark)] items-center">
                  <p className="font-semibold">${product.price}</p>
                  <p
                    className="text-sm px-3 py-1 text-white rounded-[2px]"
                    style={{
                      background: "linear-gradient(145deg, #adcd94, #cdf4af)",
                    }}
                  >
                    Qty: {product.quantity}
                  </p>
                </div>
                <p className="text-[12px] text-gray-400">
                  {new Date(product.createAt).toLocaleString()}
                </p>
              </div>



              {editingId === product.id && (
                <div className="p-4 border-t text-black space-y-2 bg-gray-200">
                  <input
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Name"
                    value={editState.name}
                    onChange={(e) =>
                      setEditState((s) => ({ ...s, name: e.target.value }))
                    }
                  />

                  <input
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Category"
                    value={editState.category}
                    onChange={(e) =>
                      setEditState((s) => ({ ...s, category: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Price"
                    value={editState.price}
                    onChange={(e) =>
                      setEditState((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Quantity"
                    value={editState.quantity}
                    onChange={(e) =>
                      setEditState((s) => ({ ...s, quantity: e.target.value }))
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm cursor-pointer bg-gray-400 p-3"
                    onChange={(e) =>
                      setEditState((s) => ({
                        ...s,
                        image: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(product.id)}
                      disabled={saving}
                      className="flex-1 bg-black text-white py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 border py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fetch_data;
