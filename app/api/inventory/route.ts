import { db } from "@/src/db";
import { inventory } from "@/src/db/schema";
import cloudinary from "@/src/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.select().from(inventory);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const imageFile = formData.get("image") as File;

    if (!name || !category || isNaN(price) || isNaN(quantity) || !imageFile) {
      return NextResponse.json(
        { error: "All fields including image are required" },
        { status: 400 }
      );
    }

 
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "inventory" }, (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          })
          .end(buffer);
      }
    );

    const [product] = await db
      .insert(inventory)
      .values({
        name,
        category,
        price,
        quantity,
        imageUrl: uploadResult.secure_url,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
