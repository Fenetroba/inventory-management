"use client";

import { useState, ChangeEvent, FormEvent } from "react";

const Create_Product_Form = ({ open }: any) => {
     const [name, setName] = useState("");
     const [category, setCategory] = useState("");
     const [price, setPrice] = useState("");
     const [quantity, setQuantity] = useState("");
     const [image, setImage] = useState<File | null>(null);
     const [loading, setLoading] = useState(false);
     const [preview, setPreview] = useState<string | null>(null);

     const handleImageChange = (
          e: ChangeEvent<HTMLInputElement>
     ) => {
          if (e.target.files && e.target.files[0]) {
               const file = e.target.files[0];

               setImage(file);
               setPreview(URL.createObjectURL(file));
          }
     };



     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
               setLoading(true);

               const formData = new FormData();

               formData.append("name", name);
               formData.append("category", category);
               formData.append("price", price);
               formData.append("quantity", quantity);


               if (image) {
                    formData.append("image", image);
               }

               const response = await fetch("/api/inventory", {
                    method: "POST",
                    body: formData,
               });

               const data = await response.json();

               console.log(data);


               setName("");
               setCategory("");
               setPrice("");
               setQuantity("");
               setImage(null);


               alert("Product added successfully!");
          } catch (error) {
               console.error(error);
               alert("Something went wrong");
          } finally {
               setLoading(false);
          }
     };


     return (
          <div className={`transition-all duration-300 overflow-hidden ${open ? "w-[320px] opacity-100 max-sm:w-full" : "w-0 opacity-0"}`}>
               <div className="bg-[var(--topNav)] overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:hidden rounded-t-2xl    text-[var(--dark)] text-[14px] shadow-md">
                    <div className="h-10 w-full bg-[#526044] text-center p-3 text-[#e2f7cc]">CREATE PRODUCTS</div>

                    <form
                         onSubmit={handleSubmit}
                         className="space-y-4 p-6"
                    >

                         <div>
                              <label className="block mb-1 font-medium">
                                   Product Name
                              </label>

                              <input
                                   type="text"
                                   placeholder="Enter product name"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   className="w-full border  border-gray-200 rounded-lg p-3 outline-none "
                                   required
                              />
                         </div>



                         <div>
                              <label className="block mb-1 font-medium">
                                   Category
                              </label>

                              <input
                                   type="text"
                                   placeholder="Enter category"
                                   value={category}
                                   onChange={(e) => setCategory(e.target.value)}
                                   className="w-full border border-gray-200 rounded-lg p-3 outline-none "
                                   required
                              />
                         </div>


                         <div>
                              <label className="block mb-1 font-medium">
                                   Price
                              </label>

                              <input
                                   type="number"
                                   placeholder="Enter price"
                                   value={price}
                                   onChange={(e) => setPrice(e.target.value)}
                                   className="w-full border border-gray-200 rounded-lg p-3 outline-none "
                                   required
                              />
                         </div>


                         <div>
                              <label className="block mb-1 font-medium">
                                   Quantity
                              </label>

                              <input
                                   type="number"
                                   placeholder="Enter quantity"
                                   value={quantity}
                                   onChange={(e) => setQuantity(e.target.value)}
                                   className="w-full border border-gray-200 rounded-lg p-3 outline-none "
                                   required
                              />
                         </div>

                         <div className="pt-10 ">
                              <label className="block mb-1 font-medium">
                                   Product Image
                              </label>

                              <input
                                   type="file"
                                   accept="image/*"
                                   onChange={handleImageChange}
                                   className="w-full h-[70px] bg-[var(--lightgreen)] flex p-5 cursor-pointer hover:bg-[#c0e4a4c5]"
                                   required
                              />

                              {preview && (
                                   <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-2xl mt-4"
                                   />
                              )}
                         </div>



                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
                         >
                              {loading ? "Uploading..." : "Add Product"}
                         </button>
                    </form>
               </div>
          </div>
     );
}
export default Create_Product_Form;
