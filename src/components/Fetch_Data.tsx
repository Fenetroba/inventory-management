"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

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

const Fetch_data = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Could not load products. Please try again.");
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
      if (editState.image) formData.append("image", editState.image);

      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      const updated: Product = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update product", err);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
      setOpenActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#526044] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-300 text-sm">{error}</p>
        <button
          onClick={() => { setLoading(true); fetchProducts(); }}
          className="px-5 py-2 bg-[#526044] text-white rounded-lg text-sm hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 transition-all duration-300 h-screen sm:px-4 px-2 py-2 [&::-webkit-scrollbar]:hidden overflow-auto">


      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">
          Inventory
          <span className="ml-2 text-xs bg-[#526044] text-[#cdf4af] px-2 py-0.5 rounded-full">
            {products.length}
          </span>
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="bg-white/10 backdrop-blur text-white p-10 rounded-2xl text-center">
          <p className="text-sm">No products found</p>
        </div>
      ) : (
    
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[560px]">

          <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-[#3a4a2e] text-[#cdf4af] text-[11px] font-semibold uppercase">
            <div className="w-24 shrink-0">Image</div>
            <div className="flex-1 grid grid-cols-4 gap-2">
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Qty</span>
            </div>
            <div className="w-16 text-right shrink-0">Actions</div>
          </div>

          <div className="grid gap-2">
          {products.map((product) => (
            <div key={product.id} className=" overflow shadow-lg bg-white">

              <div className="flex items-stretch  ">

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-24 h-14 object-cover shrink-0 overflow-hidden"
                />

                <div className="flex-1 px-3 py-3 flex items-center gap-2 min-w-0">
                  <div className="grid grid-cols-4 gap-2 flex-1 min-w-0 items-center">
                   
                    <p className="font-semibold text-[#1d1d1f] text-sm leading-tight truncate">
                      {product.name}
                    </p>
             
                    <span className="inline-block text-[10px] font-medium bg-[#e7f5dd] text-[#526044] px-2 py-0.5 rounded-full w-fit">
                      {product.category}
                    </span>
              
                    <span className="text-sm font-bold text-[#1d1d1f]">
                      Birr {product.price}
                    </span>
            
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full text-white font-medium w-fit"
                      style={{ background: "linear-gradient(135deg, #adcd94, #7aab5a)" }}
                    >
                      {product.quantity}
                    </span>
                  </div>

                
                  <div className="relative shrink-0 w-16 flex justify-end">
                    <button
                      onClick={() =>
                        setOpenActionId(openActionId === product.id ? null : product.id)
                      }
                      aria-label={`Actions for ${product.name}`}
                      aria-expanded={openActionId === product.id}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] transition text-[#526044]"
                    >
                      <span className="text-lg leading-none mb-1">⋯</span>
                    </button>

                    {openActionId === product.id && (
                      <div className="absolute right-0 -top-6 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-auto w-32">
                        <button
                          onClick={() => handleEditOpen(product)}
                          className="flex items-center  gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f5faf0] transition"
                        >
                          <FaEdit className="text-[#526044] text-xs" />
                          Edit
                        </button>
                        <div className="h-px bg-gray-100" />
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <FaTrash className="text-xs" />
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

           
              {editingId === product.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Edit Product
                  </p>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#526044] transition text-black"
                    placeholder="Name"
                    value={editState.name}
                    onChange={(e) => setEditState((s) => ({ ...s, name: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#526044] transition text-black"
                    placeholder="Category"
                    value={editState.category}
                    onChange={(e) => setEditState((s) => ({ ...s, category: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#526044] transition text-black"
                      placeholder="Price"
                      value={editState.price}
                      onChange={(e) => setEditState((s) => ({ ...s, price: e.target.value }))}
                    />
                    <input
                      type="number"
                      className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#526044] transition text-black"
                      placeholder="Quantity"
                      value={editState.quantity}
                      onChange={(e) => setEditState((s) => ({ ...s, quantity: e.target.value }))}
                    />
                  </div>
                  <label className="flex items-center gap-2 w-full border border-dashed border-gray-300 rounded-lg p-2.5 text-sm text-gray-500 cursor-pointer hover:border-[#526044] transition">
                    <span>📎</span>
                    <span>{editState.image ? editState.image.name : "Replace image (optional)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setEditState((s) => ({ ...s, image: e.target.files?.[0] ?? null }))
                      }
                    />
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleEditSave(product.id)}
                      disabled={saving}
                      className="flex-1 bg-[#526044] text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fetch_data;
